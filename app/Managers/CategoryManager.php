<?php

namespace App\Managers;

use DB;

use App\Models\Category;

class CategoryManager
{

    /**
     * Gets a list of categories
     *
     * @param null $perPage
     * @return mixed
     */
    public function get($perPage, $column, $sort, $substr)
    {
        $query = DB::table('categories AS c')
            ->leftJoin('products AS p', function($join) {
                $join->on('p.category', '=', 'c.id')->where('p.removed', '=', 0);
            })
            ->where('c.removed', 0);

        if ($substr)
            $query->where('c.name', 'like', '%' . $substr . '%');

        $query->selectRaw('
                c.id,
                c.name,
                COUNT(p.id) AS products
                ')
            ->orderBy($column, $sort)
            ->groupBy('c.id');

        return ($perPage) ? $query->paginate($perPage) : $query->get();
    }

    /**
     * Creates a new category
     *
     * @param {string} $name
     * @return Category
     */
    public function save($name)
    {
        $category = new Category();

        $category->name = $name;

        $category->save();

        return $category;
    }

    /**
     * Updates an exist category
     *
     * @param {integer} $id
     * @param {string} $name
     * @return Category
     */
    public function update($id, $name)
    {
        $category = Category::find($id);

        $category->name = $name;

        $category->save();

        return $category;
    }

    public function getOne($categoryId)
    {
        return Category::with('attributes')->find($categoryId);
    }

    public function remove($categoryId)
    {
        Category::where('id', $categoryId)
            ->update(['removed' => 1]);
    }
}
