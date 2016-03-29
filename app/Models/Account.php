<?php

namespace App\models;

use Illuminate\Database\Eloquent\Model;

class Account extends Model {

    /**
     * The database table used by the model.
     *
     * @var string
     */
    protected $table = 'accounts';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'id',
        'name',
        'account_id',
        'allow_pricing_template',
        'status',
        'type'
    ];

    /**
     * The attributes that should be casted to native types.
     *
     * @var array
     */
    protected $casts = [
        'allow_pricing_template' => 'boolean',
    ];

    /**
     * @var Flag for disabling defaults timestamps
     */
    public $timestamps = false;

    public $hidden = ['pivot'];

    public function users() {
        return $this->hasMany('App\Models\User', 'account', 'id');
    }

    public function locations() {
        return $this->belongsToMany('App\Models\Location');
    }

}
