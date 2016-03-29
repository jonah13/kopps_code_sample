<?php

namespace App\models;

use Illuminate\Database\Eloquent\Model;

class Manufacturer extends Model {
    /**
     * The database table used by the model.
     *
     * @var string
     */
    protected $table = 'manufacturers';

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
        'name'
    ];
}
