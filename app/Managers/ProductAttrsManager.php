<?php

namespace App\Managers;

use DB;

use App\Models\ProductAttrs;

class ProductAttrsManager
{
    /**
     * Saves a new attribute
     *
     * @param {array} $attribute
     * @param {integer} $productId
     */
    public function save($attribute, $value, $productId)
    {
        $productAttr = new ProductAttrs();

        $productAttr->product_id = $productId;
        $productAttr->name = $attribute;
        $productAttr->value = $value;

        $productAttr->save();
    }

    /**
     * Removes all attributes by the given product
     *
     * @param {integer} $productId
     */
    public function removeByProduct($productId)
    {
        DB::table('product_attrs')
            ->where('product_id', $productId)
            ->delete();
    }

    /**
     * Removes attributes if they were removed from category
     *
     * @param {integer} $categoryId
     * @param {array} $attrs
     */
    public function removeByCategory($categoryId, $attrs)
    {
        DB::table('product_attrs')
            ->join('products', 'products.id', '=', 'product_attrs.product_id')
            ->where('products.category', $categoryId)
            ->whereNotIn('product_attrs.name', $attrs)
            ->delete();
    }

    /**
     * Removes attributes if values were removed from category
     *
     * @param {integer} $categoryId
     * @param {array} $attrs
     */
    public function removeByAttribute($categoryId, $attrs, $name)
    {
        DB::table('product_attrs')
            ->join('products', 'products.id', '=', 'product_attrs.product_id')
            ->where('products.category', $categoryId)
            ->where('product_attrs.name', $name)
            ->whereNotIn('product_attrs.value', $attrs)
            ->delete();
    }

    /**
     * Gets list of attributes related to product
     *
     * @param {integer} $productId
     */
    public function get($productId)
    {
        return ProductAttrs::where('product_id', $productId)->get();
    }
}