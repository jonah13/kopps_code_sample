<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Dingo\Api\Http\Request;

class PricingTemplateController extends Controller 
{

    public function store(Request $request) 
    {
        return response()->json(
            app()->make('PricingTemplateManager')->create(
                $request->input('template'),
                $request->input('products')
            )
        );
    }

    public function getAllAdditions($account) {
        return response()->json(
            app()->make('PricingTemplateManager')->getAllAdditions($account)
        );
    }

    public function show($pricingTemplateId)
    {
        return response()->json(
            app()->make('PricingTemplateManager')->getOne($pricingTemplateId)
        );
    }

    public function index(Request $request) 
    {
        $perPage = $request->has('perPage') ? $request->input('perPage') : null;

        return response()->json(
            app()->make('PricingTemplateManager')->get(
                $perPage,
                $request->input('column'),
                $request->input('sort')
            )
        );
    }

    public function update(Request $request) 
    {
        app()->make('PricingTemplateManager')->update(
            $request->input('template'),
            $request->input('products')
        );
    }

    public function destroy($pricingTemplateId) 
    {
        app()->make('PricingTemplateManager')->remove($pricingTemplateId);
    }

    /**
     * Saves custom items by the given account
     *
     * @param Request $request
     */
    public function saveCustomItems(Request $request) 
    {
            app()->make('PricingTemplateManager')->saveCustomItems(
                $request->input('account'),
                $request->input('products')
            );
    }
}