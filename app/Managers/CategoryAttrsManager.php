<?php

namespace App\Managers;

use DB;

use App\Models\CategoryAttrs;

class CategoryAttrsManager
{
    /**
     * Saves a new attribute
     *
     * @param {array} $attribute
     * @param {integer} $categoryId
     */
    public function save($attribute, $categoryId)
    {
        $categoryAttr = new CategoryAttrs();
        $categoryAttr->type = $attribute['type'];
        $categoryAttr->name = $attribute['name'];
        $categoryAttr->category_id = $categoryId;

        if ($attribute['type'] === 'select')
            $categoryAttr->select_values = $attribute['selectValues'];

        $categoryAttr->save();
    }

    /**
     * Removes all attributes by the given category
     *
     * @param {integer} $productId
     */
    public function removeByCategory($categoryId)
    {
        DB::table('category_attrs')
            ->where('category_id', $categoryId)
            ->delete();
    }
}