<?php

namespace App\Http\Controllers\Api\V1;

use App\models\Category;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class CategoryController extends Controller
{

    /**
     * Gets list of all categories
     */
    public function index(Request $request)
    {
        return response()->json(
            app()->make('CategoryManager')->get(
                $perPage = (!$request->has('perPage') || $request->has('allowPaginate')) ? null : $request->input('perPage'),
                ($request->has('column')) ? $request->input('column') : 'id',
                ($request->has('sort')) ? $request->input('sort') : 'asc',
                $request->input('substr')
            )
        );
    }

    /**
     * Gets one category by the given id
     *
     * @param {integer} $categoryId
     * @return Category
     */
    public function show($categoryId)
    {
        return response()->json(
            app()->make('CategoryManager')->getOne($categoryId)
        );
    }

    /**
     * Creates a new category
     *
     * @param Request $request
     */
    public function store(Request $request)
    {
        $category = app()->make('CategoryManager')->save($request->input('name'));

        foreach ($request->input('attributes') as $attribute) {
            app()->make('CategoryAttrsManager')->save($attribute, $category->id);
        }
    }

    /**
     * Updates an exist category
     *
     * @param Request $request
     */
    public function update(Request $request)
    {
        $category = app()->make('CategoryManager')->update(
            $request->input('id'),
            $request->input('name')
        );

        $attrsNames = [];

        foreach ($request->input('attributes') as $attr) {
            array_push($attrsNames, $attr['name']);

            if (isset($attr['selectValues']))
                app()->make('ProductAttrsManager')->removeByAttribute($category->id, $attr['selectValues'], $attr['name']);
        }

        app()->make('CategoryAttrsManager')->removeByCategory($category->id);
        app()->make('ProductAttrsManager')->removeByCategory($category->id, $attrsNames);

        foreach ($request->input('attributes') as $attribute) {
            app()->make('CategoryAttrsManager')->save($attribute, $category->id);
        }
    }

    /**
     * Removes an exist category
     *
     * @param $categoryId
     */
    public function destroy($categoryId)
    {
        app()->make('CategoryManager')->remove($categoryId);
    }
}