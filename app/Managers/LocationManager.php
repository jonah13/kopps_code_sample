<?php

namespace App\Managers;

use DB;

use App\Models\Location;

class LocationManager 
{
    /**
     * Gets locations list
     *
     * @param {integer} $perPage
     * @param {string} $column
     * @param {string} $sort
     * @return {array with pagination data}
     */
    public function get($perPage, $column, $sort, $substr = '')
    {
        $query = DB::table('locations as l')
            ->leftJoin('account_location as al', 'al.location_id', '=', 'l.id')
            ->leftJoin('accounts as a', function($join) {
                $join->on('a.id', '=' ,'al.account_id')->where('a.removed', '=', 0);
            })
            ->where('l.removed', 0);

        // filter by searched string
        if ($substr)
            $query->where('l.name', 'like', '%' . $substr . '%');

        $query->orderBy($column, $sort)
            ->groupBy('l.id')
            ->selectRaw('
                l.*,
                a.id as account_id,
                a.name as account_name
            ');

        return ($perPage) ? $query->paginate($perPage) : $query->get();
    }

    /**
     * Get one location
     *
     * @param $locationId
     * @return Location
     */
    public function getOne($locationId)
    {
        return Location::find($locationId);
    }

    /**
     * Gets locations list by the given account id
     *
     * @param {integer} $accountId - account id
     * @param {integer/null} $perPage
     * @param {string} $column
     * @param {string} $sort
     * @return {array/array with pagination data}
     */
    public function getByAccount($accountId, $perPage, $column, $sort)
    {
        $query = DB::table('locations as l')
            ->join('account_location as al', 'al.location_id', '=', 'l.id')
            ->where('al.account_id', $accountId)
            ->where('removed', 0)
            ->orderBy($column, $sort)
            ->select('l.*');

        return ($perPage) ? $query->paginate($perPage) : $query->get();
    }

    /**
     * Updates the given location
     *
     * @param {integer} $locationId - location id
     */
    public function update($locationData)
    {
        $location = Location::find($locationData['id']);

        foreach ($locationData as $key => $value) {
            $location->$key = $value;
        }

        $location->save();

        return $location;
    }

    /**
     * Saves given params as a new location
     *
     * @param {array} $locationData
     * @return Location
     */
    public function save($locationData)
    {
        $location = new Location();

        foreach ($locationData as $key => $value) {
            $location->$key = $value;
        }

        $location->save();

        return $location;
    }

    /**
     * Removes all relations with given account
     *
     * @param $accountId
     */
    public function removeByAccount($accountId)
    {
        DB::table('account_location')
            ->where('account_id', $accountId)
            ->delete();
    }

    /**
     * Removes the given location
     *
     * @param {integer} $locationId - location id
     */
    public function remove($locationId)
    {
        Location::where('id', $locationId)->update(['removed' => 1]);
    }

}