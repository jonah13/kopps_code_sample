<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class AccountController extends Controller
{

    /**
     * Get list of all accounts
     */
    public function index(Request $request)
    {
        $perPage = (!$request->has('perPage') || $request->has('allowPaginate')) ? null : $request->input('perPage');

        return response()->json(
            app()->make('AccountManager')->get(
                $request->input('substr'),
                $perPage
            )
        );
    }

    /**
     * Get one account
     */
    public function show($account)
    {
        return response()->json(
            app()->make('AccountManager')->getOne($account)
        );
    }

    /**
     * Checks if account has at least one user
     */
    public function checkIfUsed($id)
    {
        return response()->json(
            app()->make('AccountManager')->checkIfUsed($id)
        );
    }

    /**
     * Creates a new account and locations
     */
    public function store(Request $request)
    {
        $account = app()->make('AccountManager')->save($request->input('account'));

        // save pricing template if user select it
        if ($account->pricing_template_id)
            app()->make('PricingTemplateManager')->copyPricingTemplate($account->pricing_template_id, $account->id);

        // attaches all locations to the created account
        foreach ($request->input('locations') as $locationData) {
            $location = app()->make('LocationManager')->save($locationData);
            $account->locations()->save($location);
        }
    }

    /**
     * Updates an account
     */
    public function update(Request $request)
    {
        $account = app()->make('AccountManager')->update($request->input('account'));

        app()->make('LocationManager')->removeByAccount($account->id);

        foreach ($request->input('locations') as $locationData) {

            if (array_key_exists('id', $locationData)) { // if the given location is already exist
                $location = app()->make('LocationManager')->update($locationData);
            } else { // if we need to create a new location
                $location = app()->make('LocationManager')->save($locationData);
            }

            $account->locations()->save($location);
        }
    }

    /**
     * Removes a given account
     */
    public function destroy($accountId)
    {
        return response()->json(
            app()->make('AccountManager')->remove($accountId)
        );
    }

}