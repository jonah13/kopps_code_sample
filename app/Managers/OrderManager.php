<?php

namespace App\Managers;

use DB;

use App\Models\Order;

class OrderManager
{

    /**
     * Update a given order
     *
     * @param {integer} $orderId - order id
     * @param {array} $orderData
     */
    public function update($orderId, $orderData)
    {
        $order = Order::find($orderId);

        foreach ($orderData as $key => $value) {
            $order->$key = $value;
        }

        $order->save();

        return $order;
    }

    /**
     * Update a pack of orders
     *
     * @param {array} $data
     */
    public function updatePack($data)
    {
        foreach ($data AS $order) {
            Order::where('id', $order['id'])
                ->update(['removed' => $order['removed'], 'name' => $order['name']]);
        }
    }


    /**
     * Gets a list of removed products in the order
     *
     * @param $orderId
     * @param $accountId
     * @return array
     */
    public function getRemoved($orderId, $accountId)
    {
        $removed = DB::table('products AS p')
            ->join('product_order AS po', 'po.product_id', '=', 'p.id')
            ->where('po.order_id', $orderId)
            ->where('p.removed', 1)
            ->select('p.name');

        return DB::table('product_order AS po')
            ->leftJoin('products AS p', 'po.product_id', '=', 'p.id')
            ->leftJoin('custom_items AS ci', function($join) use ($accountId) {
                $join->on('ci.product_id', '=', 'po.product_id')
                    ->where('ci.account_id', '=', $accountId);
            })
            ->where('ci.hidden', 1)
            ->where('po.order_id', $orderId)
            ->select('p.name')
            ->union($removed)
            ->groupBy('p.name')
            ->lists('p.name');
    }

    /**
     * Create a new order
     *
     * @param {integer} $userId - user id
     * @param {array} $orderData - order data
     * @return Order
     */
    public function save($userId, $orderData)
    {
        $order = new Order();

        $order->po = (isset($orderData['po'])) ? $orderData['po'] : null;
        $order->notes = (isset($orderData['notes'])) ? $orderData['notes'] : null;
        $order->name = (isset($orderData['name'])) ? $orderData['name'] : null;
        $order->user = $userId;
        $order->status = $orderData['status'];
        $order->save();

        return $order;
    }

    /**
     * Removes an order
     *
     * @param {integer} $orderId - order id
     */
    public function remove($orderId)
    {
        Order::where('id', $orderId)->update(['removed' => true]);
    }

    /**
     * Get one order
     *
     * @param {integer} $orderId - order id
     * @return Order
     */
    public function getOne($orderId)
    {
        return DB::table('orders AS o')
            ->join('users AS u1', 'u1.id', '=', 'o.user')
            ->join('accounts AS a', 'a.id', '=', 'u1.account')
            ->leftJoin('users AS u2', 'u2.id', '=', 'o.submitted_by')
            ->leftJoin('locations AS l1', 'l1.id', '=', 'u1.location_id')
            ->leftJoin('account_location AS al', 'al.account_id', '=', 'a.id')
            ->leftJoin('locations AS l2', 'al.location_id', '=', 'l2.id')
            ->where('o.id', $orderId)
            ->selectRaw('
                o.*,
                u2.first_name AS submitted_by,
                u1.first_name AS user_name,
                a.name AS account_name,
                a.id AS account_id,
                l1.name AS location_name1,
                l2.name AS location_name2
            ')
            ->first();
    }

    /**
     * Gets list of the orders
     *
     * @param {array} $params
     * @return {array} collection of the orders
     */
    public function getList($params, $limit, $accountId, $locationId)
    {
        $query = DB::table('orders AS o')
            ->leftJoin('product_order AS po', 'po.order_id', '=', 'o.id')
            ->leftJoin('products AS p', 'p.id', '=', 'po.product_id')
            ->leftJoin('users AS u', 'o.user', '=', 'u.id')
            ->leftJoin('accounts AS a', 'a.id', '=', 'u.account')
            ->leftJoin('locations AS l', 'l.id', '=', 'u.location_id')
            ->where('a.id', $accountId)
            ->where('o.removed', 0)
            ->orderBy($params['column'], $params['sort']);

        if (isset($params['convertFrom']))
            $query->where('o.created_at', '>=', $params['convertFrom']);

        if (isset($params['convertTo']))
            $query->where('o.created_at', '<=', $params['convertTo']);

        if (isset($params['user']))
            $query->where('u.id', $params['user']);

        if ((isset($params['by']) && $params['by'] === 'location') || (isset($params['location']) && $params['location']))
            $query->where('u.location_id', $locationId);

        if (isset($params['status'])) {
            if (strpos($params['status'], ',')) // if string contains more than one status
                $query->whereIn('o.status', explode(',', $params['status']));
            else
                $query->where('o.status', $params['status']);
        }

        $query
            ->groupBy('o.id')
            ->selectRaw('
                o.id,
                o.po,
                o.notes,
                o.created_at,
                o.updated_at,
                SUM(po.quantity) AS total_amount,
                SUM(po.quantity * po.price) AS sum_price,
                l.name AS location_name,
                u.first_name,
                o.status
            ')
            ->take($limit);

        return (isset($params['perPage'])) ? $query->paginate($params['perPage']) : $query->get();
    }

    /**
     * Gets list of all orders by while users
     *
     * @param $limit
     * @param $perPage
     * @return mixed
     */
    public function getListByAllUsers($limit, $params)
    {
        $query = DB::table('orders AS o')
            ->join('product_order AS po', 'po.order_id', '=', 'o.id')
            ->leftJoin('users AS u', 'o.user', '=', 'u.id')
            ->leftJoin('accounts AS a', 'a.id', '=', 'u.account')
            ->leftJoin('locations AS l', 'l.id', '=', 'u.location_id');

        if ($params['status'])
            $query->whereIn('o.status', explode(',', $params['status']));

        if (isset($params['orderId']))
            $query->where('o.id', $params['orderId']);

        if (isset($params['accountId']))
            $query->where('a.id', $params['accountId']);

        if (isset($params['locationId']))
            $query->where('l.id', $params['locationId']);

        $query->groupBy('o.id')
            ->orderBy('o.id', 'desc')
            ->limit($limit)
            ->selectRaw('
                o.id,
                o.po,
                o.notes,
                o.status,
                u.username,
                SUM(po.quantity) AS total_amount,
                l.name AS location_name,
                CASE
                    WHEN o.submitted_by IS NULL THEN u.first_name
                    ELSE (SELECT first_name FROM users WHERE id = o.submitted_by)
                END as submitted_by,
                SUM(
                    po.price *
                    CASE
                        WHEN po.quantity IS NULL THEN 1
                        WHEN po.quantity = 0 THEN 1
                        ELSE po.quantity
                    END
                ) AS sum_price
            ');

        return (isset($params['perPage'])) ? $query->paginate($params['perPage']) : $query->get();
    }

    /**
     * Gets statistic of all orders by while accounts
     *
     * @param $thirtyDaysAgo
     * @return mixed
     */
    public function getListByAllAccounts($thirtyDaysAgo)
    {
        return DB::select("
            SELECT
                name,
                id AS account_id,
                COUNT(id) AS total_amount,
                SUM(sum_price) AS sum_price
            FROM (
                SELECT
                    a.id,
                    a.name,
                    SUM(
                        CASE
                            WHEN ci.custom_price IS NOT NULL AND ci.hidden_custom_price = 0 THEN ci.custom_price
                            ELSE p.default_price
                        END *
                        CASE
                            WHEN po.quantity IS NULL THEN 1
                            WHEN po.quantity = 0 THEN 1
                            ELSE po.quantity
                        END
                    ) AS sum_price
                FROM orders AS o
                INNER JOIN product_order AS po ON po.order_id = o.id
                INNER JOIN products AS p ON p.id = po.product_id
                INNER JOIN users AS u ON u.id = o.user
                INNER JOIN accounts AS a ON a.id = u.account
                LEFT JOIN custom_items AS ci ON ci.account_id = a.id AND ci.product_id = p.id
                WHERE o.status = 'submited'
                AND o.created_at >= :date
                GROUP BY o.id
            ) AS tbl1
            GROUP BY id
        ", ['date' => $thirtyDaysAgo]);
    }

    /**
     * Gets list of the orders by user
     *
     * @param {array} $params
     * @return {array} collection of the orders
     */
    public function getListByUser($params, $limit) {
        $query = DB::table('orders AS o')
            ->leftJoin('product_order AS po', 'po.order_id', '=', 'o.id')
            ->leftJoin('products AS p', 'p.id', '=', 'po.product_id')
            ->leftJoin('users AS u', 'o.user', '=', 'u.id')
            ->leftJoin('accounts AS a', 'a.id', '=', 'u.account')
            ->leftJoin('locations AS l', 'l.id', '=', 'u.location_id')
            ->where('u.id', app('Dingo\Api\Auth\Auth')->user()->id)
            ->where('o.removed', 0)
            ->orderBy($params['column'], $params['sort']);

        if (isset($params['status']))
            $query->whereIn('o.status', explode(',', $params['status']));

        return $query->groupBy('o.id')
            ->selectRaw('
                o.*,
                COUNT(p.id) AS total_amount,
                SUM(po.quantity) AS total_amount,
                COUNT(p.id) as total_products,
                SUM(po.price * po.quantity) AS sum_price,
                l.name AS location_name,
                u.first_name,
                o.updated_at,
                o.created_at
            ')
            ->take($limit)
            ->get();
    }

    /**
     * Get all purchase statistic by location
     *
     * @param $accountId
     * @param $column
     * @param $sort
     *
     * return {array}
     */
    public function getStatisticByLocation($accountId, $column, $sort, $thirtyDayAgo)
    {
        return DB::table('orders AS o')
            ->leftJoin('product_order AS po', 'po.order_id', '=', 'o.id')
            ->leftJoin('products AS p', 'p.id', '=', 'po.product_id')
            ->join('users AS u', 'u.id', '=', 'o.user')
            ->join('accounts AS a', 'a.id', '=', 'u.account')
            ->join('locations AS l', 'u.location_id', '=', 'l.id')
            ->where('o.status', 'submited')
            ->where('o.created_at', '>=', $thirtyDayAgo)
            ->where('a.id', $accountId)
            ->orderBy($column, $sort)
            ->groupBy('l.id')
            ->havingRaw('total_amount is not null')
            ->selectRaw('
                l.id,
                l.name,
                SUM(po.quantity) AS total_amount,
                SUM(po.price * po.quantity) AS sum_price
            ')
            ->get();
    }
}