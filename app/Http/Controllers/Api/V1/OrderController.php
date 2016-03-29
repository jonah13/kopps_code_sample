<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Mail;

class OrderController extends Controller
{
    /**
     * Update given order
     *
     * @param {integer} $orderId - order id
     * @param Request $request
     * @return Order
     */
    public function update($orderId, Request $request)
    {
        $order = app()->make('OrderManager')
            ->update(
                $orderId,
                $request->except(['page', 'perPage'])
            );
        if ($order->status === 'submited' && !in_array(app('Dingo\Api\Auth\Auth')->user()->type, ['admin', 'superadmin'])){
            $products = app()->make('ProductOrderManager')->get(
                $orderId,
                app('Dingo\Api\Auth\Auth')->user()->account,
                ['column' => 'id', 'sort' => 'asc', 'perPage' => null, 'customPrice' => true]
            );

            $orderToSave = app()->make('OrderManager')->getOne($orderId);

            $pdf = app()->make('ExportManager')->savePdf($orderToSave, $products);
            $this->sendEmail($order, env('EMAIL'), 'email', $pdf);
        } elseif ($order->status === 'processed') {
            $email = app()->make('UserManager')->getOne($order->user)->email;
            $this->sendEmail($order, $email, 'empty-email');
        }
    }

    /**
     * Update a pack of orders
     *
     * @param Request $request
     * @return Order
     */
    public function updatePack(Request $request)
    {
        app()->make('OrderManager')->updatePack($request->except(['page', 'perPage']));

        return response()->json(
            app()->make('OrderManager')->getListByUser([
                'status' => 'favorite',
                'column' => 'id',
                'sort' => 'asc'
            ], 100)
        );
    }

    /**
     * Creates a new order
     *
     * @return Order
     */
    public function store(Request $request)
    {
        $order = app()->make('OrderManager')->save(
            app('Dingo\Api\Auth\Auth')->user()->id,
            $request->except(['orderId'])
        );

        $orderId = ($request->has('orderId')) ? $request->input('orderId') : $order->id;

        if ($order->status === 'submited') {
            $products = app()->make('ProductOrderManager')->get(
                $orderId,
                app('Dingo\Api\Auth\Auth')->user()->account,
                ['column' => 'id', 'sort' => 'asc', 'perPage' => null, 'customPrice' => true]
            );

            $orderToSave = app()->make('OrderManager')->getOne($orderId);

            $pdf = app()->make('ExportManager')->savePdf($orderToSave, $products);
            $this->sendEmail($order, env('EMAIL'), 'email', $pdf);

        } elseif ($order->status === 'processed') {
            $email = app()->make('UserManager')->getOne($order->user)->email;
            $this->sendEmail($order, $email, 'empty-email');
        }

        return response()->json($order);
    }

    /**
     * Removes an order
     *
     * @param {integer} $orderId - order id
     */
    public function destroy($orderId)
    {
        app()->make('OrderManager')->remove($orderId);
    }


    /**
     * Get an order
     *
     * @param {integer} $orderId - order id
     * @return Order
     */
    public function show($orderId) {
        return response()->json(
            app()->make('OrderManager')
                ->getOne($orderId)
        );
    }

    /**
     * Gets a list of removed products in the order
     *
     * @param $orderId
     * @return \Illuminate\Http\JsonResponse
     */
    public function getRemoved($orderId)
    {
        return response()->json(
            app()->make('OrderManager')
                ->getRemoved(
                    $orderId,
                    app('Dingo\Api\Auth\Auth')->user()->account
                )
        );
    }

    public function getForAdmin($orderId)
    {
        $order = app()->make('OrderManager')->getOne($orderId);

        return response()->json([
            'order' => $order,
            'products' => app()->make('ProductOrderManager')->get(
                $orderId,
                $order->account_id,
                ['column' => 'id', 'sort' => 'asc', 'perPage' => null]
            )
        ]);
    }

    /**
     * Get all orders by account
     *
     * @return collection of orders
     */
    public function index(Request $request)
    {
        $limit = ($request->has('limit')) ? (int) $request->input('limit') : 100;
        $thirtyDaysAgo = date('Y-m-d H:i:s', time() - 2592000);
        $by = $request->has('by') ? $request->input('by') : 'default';
        $account = ($request->has('account')) ? $request->input('account') : app('Dingo\Api\Auth\Auth')->user()->account;

        switch ($by) :
            case 'user';
                $orders = app()->make('OrderManager')->getListByUser(
                    $request->all(),
                    $limit
                );
            break;
            case 'users';
                $orders = app()->make('OrderManager')->getListByAllUsers(
                    $limit,
                    $request->all()
                );
            break;
            case 'accounts';
                $orders = app()->make('OrderManager')->getListByAllAccounts($thirtyDaysAgo);
            break;
            case 'locationStatistic';
                $orders = app()->make('OrderManager')->getStatisticByLocation(
                    $account,
                    $request->input('column'),
                    $request->input('sort'),
                    $thirtyDaysAgo
                );
            break;
            default;
                if (in_array(app('Dingo\Api\Auth\Auth')->user()->type, ['customer', 'corporate_user'])) {
                    $location = app('Dingo\Api\Auth\Auth')->user()->location_id;
                } else {
                    $location = $request->input('location');
                }

                $orders = app()->make('OrderManager')->getList(
                    $request->all(),
                    $limit,
                    ($request->has('account')) ? $request->input('account') : app('Dingo\Api\Auth\Auth')->user()->account,
                    $location
                );
        endswitch;

        if ($request->has('withProducts')) {
            foreach ($orders as $key => $order) {
                $order->products = app()->make('ProductOrderManager')
                    ->get(
                        $order->id,
                        app('Dingo\Api\Auth\Auth')->user()->account,
                        ['column' => 'id', 'sort' => 'asc', 'only_id' => true]
                    );
            }
        }

        return response()->json($orders);
    }

    private function sendEmail($order, $to, $view, $pathToPdf = false)
    {
        Mail::send($view, ['order' => $order], function ($m) use ($to, $pathToPdf) {
            if ($pathToPdf)
                $m->attach($pathToPdf);
            $m->from('kopp@mail.com', 'Kopps');
            $m->to($to)->subject('KOPPS');
        });
    }

}