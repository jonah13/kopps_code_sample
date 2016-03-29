<?php

namespace App\Managers;

use DB;

use App\Models\Manufacturer;

class ManufacturerManager
{

    public function get($perPage, $column, $sort, $substr)
    {
        $query = DB::table('manufacturers AS m')
            ->leftJoin('products AS p', function($join) {
                $join->on('p.manf', '=', 'm.id')->where('p.removed', '=', 0);
            })
            ->where('m.removed', 0);

        if ($substr)
            $query->where('m.name', 'like', '%' . $substr . '%');

            $query->selectRaw('
                m.id,
                m.name,
                COUNT(p.id) AS products
            ')
            ->groupBy('m.id');

        if ($column)
            $query->orderBy($column, $sort);

        return ($perPage) ? $query->paginate($perPage) : $query->get();
    }

    public function save($name)
    {
        $manufacturer = new Manufacturer();
        $manufacturer->name = $name;
        $manufacturer->save();

        return $manufacturer;
    }

    public function update($manufacturerId, $name) 
    {
        $manufacturer = Manufacturer::find($manufacturerId);
        $manufacturer->name = $name;
        $manufacturer->save();
    }

    public function remove($manufacturerId) 
    {
        Manufacturer::where('id', $manufacturerId)->update(['removed' => 1]);
    }
}