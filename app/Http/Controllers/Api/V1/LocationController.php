<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class LocationController extends Controller {

    /**
     * Gets list of all locations
     */
    public function index(Request $request)
    {
        $perPage = (!$request->has('perPage') || $request->has('allowPaginate')) ? null : $request->input('perPage');

        return response()->json(
            app()->make('LocationManager')->get(
                $perPage,
                $request->input('column'),
                $request->input('sort'),
                $request->input('substr')
            )
        );
    }

    /**
     * Gets list of locations which related to an account
     */
    public function getByAccount($accountId, Request $request)
    {
        $perPage = (!$request->has('perPage') || $request->has('allowPaginate')) ? null : $request->input('perPage');
        
        return response()->json(
            app()->make('LocationManager')->getByAccount(
                $accountId,
                $perPage,
                $request->input('column'),
                $request->input('sort')
            )
        );
    }

    /**
     * Creates a new location
     */
    public function store(Request $request)
    {
        return response()->json(
            app()->make('LocationManager')->add($request->all())
        );
    }

    /**
     * Updates location
     */
    public function update(Request $request)
    {
        app()->make('LocationManager')->update($request->except('perPage', 'page', '$$hashKey'));
    }

    /**
     * Removes location
     *
     * @param {integer} $locationId - location id
     */
    public function destroy($locationId)
    {
        app()->make('LocationManager')->remove($locationId);
    }
}