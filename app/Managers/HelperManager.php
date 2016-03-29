<?php

namespace App\Managers;

use DB;

class HelperManager
{
    public function checkUnique($table, $field, $value, $id)
    {

        if ($id === 'NaN')
            $result = DB::table($table)
                ->where($field, $value)
                ->where('removed', 0)
                ->get();
        else
            $result = DB::table($table)
                ->where($field, $value)
                ->where('id', '!=', $id)
                ->where('removed', 0)
                ->get();

        return ['exist' => !!$result];
    }

    public function generateRandomString($length = 8, $chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789' )
    {
        return substr(str_shuffle( $chars ), 0, $length);
    }

    /**
     * Prepares data before exporting
     *
     * @param $type
     * @param {array} $orders
     * @param $locationId
     * @return {toPdf/toExcel}
     */
    public function exportOrders($type, $orders, $location, $user, $from, $to)
    {
        /* Converts objects to arrays */
        $orders = array_map(function($object) use ($location) {
            $order = (array) $object;
            unset($order['status'], $order['updated_at']);

            if (is_object($location))
                unset($order['location_name'], $order['notes']);


            return $order;
        }, $orders);

        if (is_object($location))
            $headers = ['Order ID', 'PO number', 'Order date', 'Number of Items', 'Total Price ($)', 'Ordered By'];
        else
            $headers = ['Order ID', 'PO number', 'Order date', 'Number of Items', 'Total Price ($)', 'Location (Facility)', 'Ordered By'];

        array_unshift($orders, $headers);

        $params = $this->getParamsArray($location, $user, $from, $to);

        $method = 'to' . ucfirst($type);

        return  app()->make('ExportManager')->$method($orders, $params);
    }

    public function exportOrder($type, $order, $products)
    {
        $params = [];
        $params['Account Name'] = $order->account_name;
        $params['Facility Name'] = ($order->location_name1) ? $order->location_name1 : $order->location_name2;
        $params['PO#'] = $order->po;
        $params['Submitted by'] = ($order->submitted_by) ? $order->submitted_by : $order->user_name;
        $params['Order Date'] = $order->updated_at;
        $params['Order ID'] = '000000' . $order->id;
        $params['Notes'] = ($order->notes) ? $order->notes : '-';

        /* Converts objects to arrays */
        $products = array_map(function($object) {
            return [
                $object->manf_id,
                $object->name,
                $object->manf_name,
                $object->price,
                $object->quantity,
                $object->price * $object->quantity
            ];
        }, $products);

        $totalPrice = array_reduce($products, function($total, $product) {
            return $total += $product[4] * $product[5];
        });

        $totalAmount = array_reduce($products, function($total, $product) {
            return $total += $product[4];
        });

        array_push($products,['', '', '', 'Subtotal', $totalAmount, $totalPrice]);

        $headers = ['Mnf ID', 'Product Name', 'Manufacturer Name', 'Unit price ($)', 'Quantity', 'Total cost'];
        array_unshift($products, $headers);

        $method = 'to' . ucfirst($type);

        return  app()->make('ExportManager')->$method($products, $params);
    }

    private function getParamsArray($location, $user, $from, $to)
    {
        $params = [];

        if ($from)
            $params['From'] = $from;

        if ($to)
            $params['To'] = $to;

        if (is_object($user))
            $params['User'] = $user->first_name;

        if ( is_object($location))
            $params['Location'] = $location->name;

        return $params;
    }
}