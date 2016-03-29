<?php

namespace App\models;

use Illuminate\Database\Eloquent\Model;

class Location extends Model
{
    /**
     * The database table used by the model.
     *
     * @var string
     */
    protected $table = 'locations';

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
        'name',
        'address_1',
        'address_2',
        'city',
        'state',
        'zip'
    ];

    public $hidden = ['pivot'];

    /**
     * The locations that belong to the users.
     */
    public function users() {
        return $this->belongsToMany('App\Models\User');
    }

    /**
     * The locations that belong to the users.
     */
    public function accounts() {
        return $this->belongsToMany('App\Models\Account');
    }
}
