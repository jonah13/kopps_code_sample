<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class ManufacturerController extends Controller 
{

    /**
     * Gets manufacturers list
     */
    public function index(Request $request) 
    {
        $perPage = (!$request->has('perPage') || $request->has('allowPaginate')) ? null : $request->input('perPage');

        return response()->json(
            app()->make('ManufacturerManager')->get(
                $perPage,
                $request->input('column'),
                $request->input('sort'),
                $request->input('substr')
            )
        );
    }

    /**
     * Creates a new manufacturer
     */
    public function store(Request $request) {
        return response()->json(
            app()->make('ManufacturerManager')->save($request->input('name'))
        );
    }

    /**
     * Updates the given manufacturer
     */
    public function update(Request $request) 
    {
        app()->make('ManufacturerManager')->update(
            $request->input('id'),
            $request->input('name')
        );
    }

    /**
     * Removes the given manufacturer
     */
    public function destroy($manufacturer) 
    {
        app()->make('ManufacturerManager')->remove($manufacturer);
    }

}