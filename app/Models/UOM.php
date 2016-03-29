<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UOM extends Model
{
    /**
     * The database table used by the model.
     *
     * @var string
     */
    protected $table = 'uoms';

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
        'uom_name',
        'uom_abbr'
    ];
}
