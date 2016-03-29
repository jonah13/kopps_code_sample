<?php

namespace App\Managers;

use App\Models\Account;

class AccountManager
{

    /**
     * Gets collection of accounts
     *
     * @param $params
     * @return \Illuminate\Contracts\Pagination\LengthAwarePaginator
     */
    public function get($substr, $perPage)
    {
        $query = Account::with(['users' => function ($query) {
                $query->where('removed', 0);
            }, 'locations'])
            ->where('removed', 0);

        // filter by searched string
        if ($substr)
            $query->where(function($query) use ($substr) {
                $query->where('name', 'like', '%' . $substr . '%')
                    ->orWhere('account_id', 'like', '%' . $substr . '%');
            });

        return ($perPage) ? $query->paginate($perPage) : $query->get();
    }

    /**
     * Saves a given account
     *
     * @param $accountParams
     * @return Account
     */
    public function save($accountParams)
    {
        $account = new Account();
        // fill account model
        foreach ($accountParams as $key => $val) {
            $account->$key = $val;
        }

        $account->save();

        return $account;
    }

    /**
     * Get one account instance
     *
     * @param {integer} $accountId
     * @return Account
     */
    public function getOne($accountId)
    {
        return Account::with(['users' => function ($query) {
            $query->where('removed', 0);
        }, 'locations'])
            ->find($accountId);
    }

    public function update($accountParams)
    {
        $account = Account::find($accountParams['id']);

        // fill account model
        foreach ($accountParams as $key => $val) {
            $account->$key = $val;
        }

        $account->save();

        return $account;
    }

    public function remove($location)
    {
        Account::where('id', $location)->update(['removed' => 1]);
    }

}