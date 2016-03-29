<?php

namespace App\Managers;

use DB;

use App\Models\Order;
use App\Models\Product;

class ProductOrderManager 
{

    /**
     * Gets list of products by given order id
     *
     * @param {integer} $orderId - order id
     * @param {integer} $accountId - account id
     * @param {array} $params
     * @return {array} collection
     */
    public function get($orderId, $accountId, $params = null)
    {
        $query = DB::table('product_order as po')
            ->leftJoin('orders as o', 'po.order_id', '=', 'o.id')
            ->leftJoin('products as p', 'po.product_id', '=', 'p.id')
            ->join('uoms as uo', 'uo.id', '=', 'p.uom')
            ->join('categories as c', 'c.id', '=', 'p.category')
            ->join('manufacturers as m', 'm.id', '=', 'p.manf')
            ->leftJoin('users as u', 'o.user', '=', 'u.id')
            ->leftJoin('accounts as a', 'a.id', '=', 'u.account')
            ->leftJoin('custom_items AS ci', function($join) use ($accountId) {
                $join->on('ci.product_id', '=', 'p.id')
                    ->where('ci.account_id', '=', $accountId);
            })
            ->where('po.order_id', $orderId)
            ->where('a.id', $accountId)
            ->orderBy($params['column'], $params['sort']);

        if (isset($params['customPrice'])) {
            $query->selectRaw('
                p.*,
                po.quantity,
                uo.uom_abbr,
                uo.uom_name,
                c.name AS category_name,
                m.name AS manf_name,
                CASE
                    WHEN ci.custom_price IS NOT NULL AND ci.hidden_custom_price = 0 THEN ci.custom_price
                    ELSE p.default_price
                END AS price
            ');
        } elseif (isset($params['only_id'])) {
           return $query->select('p.id')
               ->lists('p.id');
        } else {
            $query->selectRaw('p.*, po.quantity, uo.uom_abbr, uo.uom_name, c.name AS category_name, m.name AS manf_name, po.price');
        }

        return (isset($params['perPage'])) ? $query->paginate($params['perPage']) : $query->get();
    }

    public function getList($userId, $locationId, $accountId, $column, $sort)
    {
        return DB::table('product_order as po')
            ->leftJoin('orders as o', 'po.order_id', '=', 'o.id')
            ->leftJoin('products as p', 'po.product_id', '=', 'p.id')
            ->join('uoms as uo', 'uo.id', '=', 'p.uom')
            ->join('categories as c', 'c.id', '=', 'p.category')
            ->join('manufacturers as m', 'm.id', '=', 'p.manf')
            ->leftJoin('users as u', 'o.user', '=', 'u.id')
            ->leftJoin('accounts as a', 'a.id', '=', 'u.account')
            ->leftJoin('custom_items AS ci', function($join) use ($accountId) {
                $join->on('ci.product_id', '=', 'p.id')
                    ->where('ci.account_id', '=', $accountId);
            })
            ->where('u.location_id', $locationId)
            ->where('u.id', $userId)
            ->where('o.status', 'submited')
            ->selectRaw('
                p.*,
                uo.uom_abbr,
                uo.uom_name,
                c.name as category_name,
                m.name as manf_name,
                CASE
                    WHEN ci.custom_price IS NOT NULL AND ci.hidden_custom_price = 0 THEN ci.custom_price
                    ELSE p.default_price
                END AS price
            ')
            ->orderBy($column, $sort)
            ->groupBy('p.id')
            ->paginate(5);
    }

    /**
     * Add/remove a pack of products to the list
     *
     * @param {integer} $orderId - order id
     * @param {array} $products
     */
    public function addProducts($orderId, $products)
    {
        DB::table('product_order')
            ->where('order_id', $orderId)
            ->delete();

        $order = Order::find($orderId);

        foreach($products as $product) {
            $order->products()->save(Product::find($product['id']), ['price' => $product['price'], 'quantity' => $product['quantity']]);
        }
    }

    /**
     * Changes a product order
     *
     * @param {integer} $orderId
     * @param {integer} $newOrderId
     */
    public function updateProductOrder($orderId, $newOrderId)
    {
        DB::table('product_order as po')
            ->where('po.order_id', $orderId)
            ->update(['order_id' => $newOrderId]);
    }

    /**
     * Get list of orders by product
     *
     * @param {integer} $productId - product id
     * @return array
     */
    public function getOrdersByProduct($productId, $userId)
    {
        return DB::table('product_order AS po')
            ->leftJoin('orders AS o', 'po.order_id', '=', 'o.id')
            ->where('po.product_id', $productId)
            ->where('o.status', 'favorite')
            ->where('o.user', $userId)
            ->lists('po.order_id');
    }

    /**
     * Adds new products into the order
     *
     * @param {integer} $productId - product id
     * @param {integer} $orderId - order id
     * @param {integer} $quantity - quantity
     * @param {float} $price - product price
     * @return products list
     */
    public function addProduct($productId, $orderId, $quantity, $price)
    {
        $order = Order::find($orderId);
        $additionalProperties = ['quantity' => $quantity, 'price' => $price];

        $order->products()->save(Product::find($productId), $additionalProperties);
    }

    /**
     * Changes product quantity in the order
     *
     * @param {integer} $productId - product id
     * @param {integer} $orderId - order id
     * @param {integer} $quantity - quantity
     */
    public function changeProductQuantity($productId, $orderId, $quantity) {
        DB::table('product_order')
            ->where('product_id', $productId)
            ->where('order_id', $orderId)
            ->update(['quantity' => $quantity]);
    }

    /**
     * Removes product from the order
     *
     *
     * @param {integer} $productId - product id
     * @param {integer} $orderId - order id
     */
    public function removeProduct($productId, $orderId) {
        DB::table('product_order')
            ->where('product_id', $productId)
            ->where('order_id', $orderId)
            ->delete();
    }

    /**
     * Removes all products from the shopping cart
     *
     * @param {integer} $orderId - order id
     */
    public function removeAllProducts($orderId) {
        DB::table('product_order')
            ->where('order_id', $orderId)
            ->delete();
    }

    /**
     * Add/remove product into/from lists
     *
     * @param {integer} $productId - product id
     * @param {integer} $userId - user id
     * @param {integer} $orders
     */
    public function addProductInLists($productId, $userId, $orders)
    {
        DB::delete("
          DELETE
          FROM product_order
          WHERE order_id IN (
              SELECT id FROM orders WHERE status='favorite' AND user = ?
          ) AND product_id = ?
        ", [$userId, $productId]);

        foreach ($orders as $order) {
            DB::table('product_order')
                ->insert([
                    'order_id'   => $order,
                    'product_id' => $productId
                ]);
        }
    }

    /**
     * Adds products from the selected draft list
     *
     * @param {integer} $orderId - order id
     * @param {integer} $draftId - order id with draft status
     */
    public function addProductsList($orderId, $draftId)
    {
        $products = DB::select('
            SELECT
              product_id,
              SUM(quantity) AS quantity,
              price
            FROM product_order
            WHERE order_id IN (?, ?)
            GROUP BY product_id
        ', [$orderId, $draftId]);

        return $this->updateProducts($orderId, $products);
    }

    /**
     * Updates order in the loop
     *
     * @param $orderId
     * @param $products
     */
    public function updateProducts($orderId, $products)
    {
        // clear order
        DB::table('product_order')
            ->where('order_id', $orderId)
            ->delete();

        foreach ($products as $product) {
            $product = (array) $product;
            DB::table('product_order')->insert(array_merge($product, ['order_id' => $orderId]));
        }
    }

}

