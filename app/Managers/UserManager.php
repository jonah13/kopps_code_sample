<?php

namespace App\Managers;

use DB;

use App\Models\Account;
use App\Models\User;
use App\Models\Location;
use App\Models\Order;

class UserManager
{

    /**
     * Gets user info
     *
     * @param {integer} $userId
     * @return User
     */
    public function getAuthorized($userId)
    {
        return User::with(['orders' => function ($query) {
            $query->where('status', '=', 'cart');
        }, 'location'])->find($userId);
    }

    /**
     * Creates a new user account
     *
     * @param {array} $userData
     * @return User
     */
    public function save($userData)
    {
        $user = new User();

        foreach ($userData as $key => $value) {
            $user->$key = $value;
        }

        $user->save();

        return $user;
    }

    /**
     * Updates an user account
     *
     * @param {array} $userData
     */
    public function update($userData)
    {
        $user = User::find($userData['id']);

        foreach ($userData as $key => $value) {
            $user->$key = $value;
        }

        $user->save();
    }

    /**
     * Changes user's password
     *
     * @param {string} $email
     * @param {string} $password
     * @return {boolean}
     */
    public function setPassword($email, $password)
    {
        $user = User::where('email', $email)->first();

        if (!$user) return false;

        $user->password = $password;

        return $user->save();
    }

    /**
     * Checks if user account is active
     *
     * @param {string} $username
     * @return {integer}
     */
    public function checkIfActive($username)
    {
        return DB::table('users as u')
            ->leftJoin('accounts as a', 'a.id', '=', 'u.account')
            ->where('u.username', $username)
            ->where('u.removed', 0)
            ->where(function($query) {
                $query->where('a.status', 'active')
                    ->orWhereIn('u.type', ['admin', 'superadmin']);
            })
            ->count();
    }

    /**
     * Gets list of users
     *
     * @param {integer} $perPage
     * @return {array}
     */
    public function get($userType, $perPage, $substr = '', $type = 'all', $accountId = null)
    {
        $query = DB::table('users AS u')
            ->leftJoin('accounts AS a', 'a.id', '=', 'u.account')
            ->leftJoin('locations AS l1', 'l1.id', '=', 'u.location_id')
            ->leftJoin('account_location AS al', 'al.account_id', '=', 'a.id')
            ->leftJoin('locations AS l2', 'l2.id', '=', 'al.location_id')
            ->where('u.removed', 0);

        if ($substr && $substr !== '') {
            $query->where(function($query) use ($substr) {
                $query->where('u.username', 'like', '%' . $substr . '%')
                    ->orWhere('u.first_name', 'like', '%' . $substr . '%');
            });
        }

        if ($type !== 'all')
            $query->where('u.type', $type);

        if ($accountId)
            $query->where('a.id', $accountId);

        if ($userType === 'superadmin')
            $query->where('u.type', '!=', 'superadmin');
        elseif ($userType === 'admin')
            $query->whereNotIn('u.type', ['superadmin', 'admin']);

        return $query->groupBy('u.id')
            ->selectRaw("
                u.*,
                a.name AS account,
                a.id AS account_id,
                l1.name AS location,
                GROUP_CONCAT(l2.name ORDER BY l2.name ASC SEPARATOR ', ') AS locations
                ")
            ->paginate($perPage);
    }

    /**
     * Gets list of all admins
     *
     * @return array
     */
    public function getAdmins()
    {
        return DB::table('users')
            ->whereIn('type', ['admin', 'superadmin'])
            ->get();
    }

    /**
     * Gets a list of users who has submitted order
     *
     * @param $accountId
     * @param $locationId
     * @return {array}
     */
    public function getCustomers($accountId, $locationId, $perPage = null)
    {
        $query = DB::table('users AS u')
            ->join('orders AS o', 'o.user', '=', 'u.id')
            ->where('u.account', $accountId);

        if ($locationId)
            $query->where('u.location_id', $locationId);

            return $query
                ->groupBy('u.id')
                ->selectRaw('u.id, u.first_name')
                ->get();
    }

    /**
     * Gets one user account
     */
    public function getOne($userId)
    {
        return User::find($userId);
    }

    /**
     * Removes user
     *
     * @param $userId
     */
    public function remove($userId)
    {
        User::where('id', $userId)->update(['removed' => 1]);
    }

}