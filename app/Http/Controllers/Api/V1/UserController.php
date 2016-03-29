<?php

namespace App\Http\Controllers\Api\V1;

use Mail;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class UserController extends Controller
{

    /**
     * Gets an authorized user account
     *
     * @return response {object}
     */
    public function getAuthorized()
    {
        return response()->json(
            app()->make('UserManager')->getAuthorized(
                app('Dingo\Api\Auth\Auth')->user()->id
            )
        );
    }

    /**
     * Generates and sets a random password and send it via email to user
     *
     * @param {array} $email
     */
    public function restorePassword($email)
    {
        $password = app()->make('HelperManager')->generateRandomString();

        if (app()->make('UserManager')->setPassword($email, $password)) {
            Mail::raw('Your new password is ' . $password, function ($m) use ($email) {
                $m->to($email, 'usr')->subject('Kopps, password recovery!');
            });

            return response()->json(['msg' => 'Password was changed, please check your email.']);
        } else {
            return response()->json(['msg' => 'Can\'t change password, maybe you input non exist email.'], 500);
        }
    }

    /**
     * Gets a list of users who has submitted order
     *
     * @param $locationId
     * @return {array}
     */
    public function getCustomers($locationId, Request $request)
    {
        $locationId = ($locationId !== 'NaN') ? $locationId : null;

        return response()->json(
            app()->make('UserManager')->getCustomers(
                app('Dingo\Api\Auth\Auth')->user()->account,
                $locationId,
                $request->input('perPage')
            )
        );
    }

    /**
     * Gets users list
     *
     * @return response {object}
     */
    public function index(Request $request)
    {
        return response()->json(
            app()->make('UserManager')->get(
                app('Dingo\Api\Auth\Auth')->user()->type,
                $request->input('perPage'),
                $request->input('substr'),
                $request->input('type'),
                $request->input('accountId')
            )
        );
    }

    /**
     * Creates a new user account
     *
     * @return response {object}
     */
    public function store(Request $request)
    {
        $user = app()->make('UserManager')->save($request->all());

        // each customer should have a default favorite order and shopping cart
        if (in_array($user->type, ['customer', 'corporate_user'])) {
            app()->make('OrderManager')->save($user->id, ['status' => 'favorite', 'name' => 'Default list']);
            app()->make('OrderManager')->save($user->id, ['status' => 'cart']);
        }
    }

    /**
     * Updates an exist account
     */
    public function update(Request $request)
    {
        app()->make('UserManager')->update($request->all());
    }

    /**
     * Gets one user account
     */
    public function show($userId)
    {
        return response()->json(
            app()->make('UserManager')->getOne($userId)
        );
    }

    /**
     * Removes user account
     */
    public function destroy($userId)
    {
        app()->make('UserManager')->remove($userId);
    }
}