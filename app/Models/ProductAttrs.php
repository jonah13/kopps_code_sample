<?php

namespace App\models;

use Illuminate\Database\Eloquent\Model;

class ProductAttrs extends Model
{
    /**
     * The database table used by the model.
     *
     * @var string
     */
    protected $table = 'product_attrs';

    /**
     * @var Flag for disabling defaults timestamps
     */
    public $timestamps = false;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'id',
        'product_id',
        'name',
        'value'
    ];
}
