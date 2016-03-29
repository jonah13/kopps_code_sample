<?php

namespace App\models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model {

    /**
     * The database table used by the model.
     *
     * @var string
     */
    protected $table = 'orders';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'id',
        'user',
        'name',
        'status',
        'po'
    ];

    public function products() {
        return $this->belongsToMany('App\Models\Product', 'product_order')->withPivot('quantity');
    }

}
