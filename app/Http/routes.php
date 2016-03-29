<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the controller to call when that URI is requested.
|
*/

$api = app('Dingo\Api\Routing\Router');


/* For authentication */
$api->version('v1', function($api) {

    $api->post('/authenticate', 'App\Http\Controllers\Api\V1\AuthenticateController@authenticate');

    $api->get('/restore-password/{email}', 'App\Http\Controllers\Api\V1\UserController@restorePassword');

    $api->get('/export-orders/{type}', 'App\Http\Controllers\Api\V1\ApiController@exportOrders');

    $api->get('/export-order/{type}/{orderId}', 'App\Http\Controllers\Api\V1\ApiController@exportOrder');

    $api->get('/export-products', 'App\Http\Controllers\Api\V1\ApiController@exportProducts');
});


/* Other api requests */
$api->version('v1', ['middleware' => 'jwt.auth'], function($api) {

    $api->get('/table/{table}/field/{field}/value/{value}/id/{id}', 'App\Http\Controllers\Api\V1\ApiController@checkUnique');


    // -------------------------------------------------------------------------
    // Users routes ------------------------------------------------------------
    // -------------------------------------------------------------------------

    $api->resource('/users', 'App\Http\Controllers\Api\V1\UserController');

    $api->get('/users/get-customers/location/{locationId}', 'App\Http\Controllers\Api\V1\UserController@getCustomers');

    $api->get('/get-authorized', 'App\Http\Controllers\Api\V1\UserController@getAuthorized');


    // -------------------------------------------------------------------------
    // Orders routes -----------------------------------------------------------
    // -------------------------------------------------------------------------

    $api->post('/orders/pack', 'App\Http\Controllers\Api\V1\OrderController@updatePack');

    $api->get('/orders/{orderId}/removed', 'App\Http\Controllers\Api\V1\OrderController@getRemoved');

    $api->get('/orders/{orderId}/admin', 'App\Http\Controllers\Api\V1\OrderController@getForAdmin');

    $api->resource('/orders', 'App\Http\Controllers\Api\V1\OrderController');


    // -------------------------------------------------------------------------
    // Product-order routes ----------------------------------------------------
    // -------------------------------------------------------------------------

    $api->get('/product/{productId}/order', 'App\Http\Controllers\Api\V1\ProductOrderController@getOrdersByProduct');

    $api->put('/product/order/{orderId}/draft/{draftId}', 'App\Http\Controllers\Api\V1\ProductOrderController@addProductsList');

    $api->put('/product/order/{order}/new-order/{newOrder}', 'App\Http\Controllers\Api\V1\ProductOrderController@updateProductOrder');

    $api->post('/product/order/multiple', 'App\Http\Controllers\Api\V1\ProductOrderController@addProductInLists');

    $api->post('/product/order/pack', 'App\Http\Controllers\Api\V1\ProductOrderController@addProducts');

    $api->post('/product/order/pack/update', 'App\Http\Controllers\Api\V1\ProductOrderController@updateProducts');

    $api->delete('/product/{productId}/order/{orderId}', 'App\Http\Controllers\Api\V1\ProductOrderController@removeProduct');

    $api->resource('/product/order', 'App\Http\Controllers\Api\V1\ProductOrderController');


    // -------------------------------------------------------------------------
    // Account routes ----------------------------------------------------------
    // -------------------------------------------------------------------------

    $api->get('/accounts/{accountId}/check', 'App\Http\Controllers\Api\V1\AccountController@checkIfUsed');

    $api->post('/accounts/update', 'App\Http\Controllers\Api\V1\AccountController@update');

    $api->resource('/accounts', 'App\Http\Controllers\Api\V1\AccountController');


    // -------------------------------------------------------------------------
    // Product routes ----------------------------------------------------------
    // -------------------------------------------------------------------------

    $api->get('/products/order/{order}', 'App\Http\Controllers\Api\V1\ProductController@getByOrder');

    $api->get('/products/custom', 'App\Http\Controllers\Api\V1\ProductController@getCustomProducts');

    $api->get('/products/custom-one/{productId}', 'App\Http\Controllers\Api\V1\ProductController@getOneCustomProduct');

    $api->get('/products/search/{substr}', 'App\Http\Controllers\Api\V1\ProductController@search');

    $api->post('/products/update', 'App\Http\Controllers\Api\V1\ProductController@update');

    $api->resource('/products', 'App\Http\Controllers\Api\V1\ProductController');


    // -------------------------------------------------------------------------
    // Category routes ---------------------------------------------------------
    // -------------------------------------------------------------------------

    $api->post('/categories/update', 'App\Http\Controllers\Api\V1\CategoryController@update');

    $api->resource('/categories', 'App\Http\Controllers\Api\V1\CategoryController');


    // -------------------------------------------------------------------------
    // Location routes ---------------------------------------------------------
    // -------------------------------------------------------------------------

    $api->resource('/locations', 'App\Http\Controllers\Api\V1\LocationController');

    $api->get('/locations/account/{accountId}', 'App\Http\Controllers\Api\V1\LocationController@getByAccount');


    // -------------------------------------------------------------------------
    // Manufacturer routes -----------------------------------------------------
    // -------------------------------------------------------------------------

    $api->resource('/manufacturers', 'App\Http\Controllers\Api\V1\ManufacturerController');


    // -------------------------------------------------------------------------
    // Pricing templates routes ------------------------------------------------
    // -------------------------------------------------------------------------

    $api->post('/custom-items', 'App\Http\Controllers\Api\V1\PricingTemplateController@saveCustomItems');
    
    $api->post('/pricing/update', 'App\Http\Controllers\Api\V1\PricingTemplateController@update');

    $api->get('/pricing/account/{account}', 'App\Http\Controllers\Api\V1\PricingTemplateController@getAllAdditions');

    $api->resource('/pricing', 'App\Http\Controllers\Api\V1\PricingTemplateController');

});