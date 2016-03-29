<?php

namespace App\Http\Controllers\Api\V1;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class ProductController extends Controller
{

    private $fieldsForSaving = [
        'id',
        'name',
        'description',
        'manf',
        'manf_id',
        'mckesson_id',
        'category',
        'uom',
        'only_one',
        'available_quantity',
        'amt',
        'default_price'
    ];

    private $fieldsForStatusUpdating = [
        'id',
        'removed'
    ];

    /**
     * Gets products for customers and corp admins
     */
    public function getCustomProducts(Request $request)
    {
        return response()->json(
            app()->make('ProductManager')->getCustomProducts($request->all())
        );
    }

    /**
     * Gets one product for customers and corp admins
     */
    public function getOneCustomProduct($productId)
    {
        $products = app()->make('ProductManager')->getOneCustomProduct($productId);

        $products[0]->attrs = app()->make('ProductAttrsManager')->get($productId);

        return response()->json($products);
    }

    /**
     * Gets product list
     */
    public function index(Request $request)
    {
        return response()->json(
            app()->make('ProductManager')->get($request->all())
        );
    }

    /**
     * Gets one product
     *
     * @param $productId
     * @return \Illuminate\Http\JsonResponse
     */
    public function show($productId)
    {
        return response()->json(
            app()->make('ProductManager')->getOne($productId)
        );
    }

    /**
     * Removes one product
     *
     * @param $product
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy($product) {
        return response()->json(
            app()->make('ProductManager')->remove($product)
        );
    }

    public function search($substr) {
        return response()->json(
            app()->make('ProductManager')->search(
                $substr,
                app('Dingo\Api\Auth\Auth')->user()->account
            )
        );
    }

    /**
     * Stores a new product
     *
     * @param Request $request
     */
    public function store(Request $request)
    {
        $product = app()->make('ProductManager')->save(
            $request->only($this->fieldsForSaving),
            $request->file('img'),
            $request->file('imgPath')
        );
        $category = app()->make('CategoryManager')->getOne($product->category);

        foreach ($category->attributes as $attribute) {
            app()->make('ProductAttrsManager')->save(
                $attribute->name,
                $request->input(str_replace(' ', '_', $attribute->name)),
                $product->id
            );
        }
    }

    /**
     * Update an exist product
     *
     * @param Request $request
     */
    public function update(Request $request)
    {
        // marks product as 'not removed'
        if (!$request->has('name')) {
            app()->make('ProductManager')->update($request->only($this->fieldsForStatusUpdating), null);
            return;
        }

        $product = app()->make('ProductManager')->update(
            $request->only($this->fieldsForSaving),
            $request->file('img'),
            $request->file('imgPath')
        );

        app()->make('ProductAttrsManager')->removeByProduct($product->id);

        $category = app()->make('CategoryManager')->getOne($product->category);

        foreach ($category->attributes as $attribute) {
            app()->make('ProductAttrsManager')->save(
                $attribute->name,
                $request->input(str_replace(' ', '_', $attribute->name)),
                $product->id
            );
        }
    }
}