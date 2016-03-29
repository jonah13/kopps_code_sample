<?php

namespace App\Http\Controllers\Api\V1;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class ProductOrderController extends Controller
{

    /**
     * Gets products by the order
     *
     * @param $orderId - order id
     * @param Request $request
     * @returns Products collection
     */
    public function show($orderId, Request $request)
    {
        $params = $request->all();
        $params['perPage'] = (!$request->has('perPage') || $request->has('allowPaginate')) ? null : $request->input('perPage');

        return response()->json(
            app()->make('ProductOrderManager')
                ->get(
                    $orderId,
                    app('Dingo\Api\Auth\Auth')->user()->account,
                    $params
            ));
    }

    /**
     * Gets list of products from the recently purchased orders
     *
     * @returns Products collection
     */
    public function index(Request $request)
    {
        return response()->json(
            app()->make('ProductOrderManager')
                ->getList(
                    app('Dingo\Api\Auth\Auth')->user()->id,
                    app('Dingo\Api\Auth\Auth')->user()->location_id,
                    app('Dingo\Api\Auth\Auth')->user()->account,
                    $request->input('column'),
                    $request->input('sort')
                )
        );
    }

    /**
     * Adds a new product into the order
     *
     * @param Request $request
     */
    public function store(Request $request)
    {
        app()->make('ProductOrderManager')
            ->addProduct(
                $request->input('product'),
                $request->input('order'),
                $request->input('quantity'),
                $request->input('price')
            );
    }

    /**
     * Removes all products from order
     *
     * @param {integer} $orderId - order id
     */
    public function destroy($orderId)
    {
        app()->make('ProductOrderManager')
            ->removeAllProducts($orderId);
    }

    /**
     * Changes quantity of products in the order
     *
     * @param {integer} $orderId - order id
     * @param Request $request
     * @return list
     */
    public function update($orderId, Request $request)
    {
        app()->make('ProductOrderManager')
            ->changeProductQuantity(
                $request->input('product'),
                $orderId,
                $request->input('quantity')
            );
    }

    /**
     * Changes a product order
     *
     * @param {integer} $orderId
     * @param {integer} $newOrderId
     */
    public function updateProductOrder($orderId, $newOrderId)
    {
        app()->make('ProductOrderManager')->updateProductOrder($orderId, $newOrderId);
    }

    /**
     * Removes product from the order
     *
     * @param {integer} $productId - product id
     * @param {integer} $orderId - order id
     */
    public function removeProduct($productId, $orderId)
    {
        app()->make('ProductOrderManager')->removeProduct($productId, $orderId);
    }

    /**
     * Adds products from the selected draft list
     *
     * @param {integer} $orderId - order id
     * @param {integer} $draftId - order id with draft status
     */
    public function addProductsList($orderId, $draftId)
    {
        return response()->json(
            app()->make('ProductOrderManager')
                ->addProductsList($orderId, $draftId)
        );
    }

    /**
     * Get list of orders by product
     *
     * @param {integer} $productId - product id
     * @return collection of orders
     */
    public function getOrdersByProduct($productId)
    {
        return response()->json(
            app()->make('ProductOrderManager')
                ->getOrdersByProduct(
                    $productId,
                    app('Dingo\Api\Auth\Auth')->user()->id
                )
        );
    }

    /**
     * Add/remove product into/from lists
     *
     * @param Request $request
     * @return colection of orders
     */
    public function addProductInLists(Request $request)
    {
        app()->make('ProductOrderManager')
            ->addProductInLists(
                $request->input('product'),
                app('Dingo\Api\Auth\Auth')->user()->id,
                $request->input('orders')
            );
    }

    /**
     * Add/remove a pack of products to the list
     *
     * @param Request $request
     */
    public function addProducts(Request $request)
    {
        app()->make('ProductOrderManager')
            ->addProducts(
                $request->input('order'),
                $request->input('products')
            );
    }

    public function updateProducts(Request $request)
    {
        app()->make('ProductOrderManager')
            ->updateProducts(
                $request->input('order'),
                $request->input('products')
            );
    }
}