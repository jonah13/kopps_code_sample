<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PricingTemplate extends Model {
    /**
     * @var Table name
     */
    protected $table = 'pricing_template';

    /**
     * @var Primary key of table
     */
    protected $primaryKey = 'id';

    /**
     * @var Flag for disabling defaults timestamps
     */
    public $timestamps = false;

    protected $fillable = [
        'id',
        'name'
    ];

    public function products() {
        return $this->belongsToMany('App\Models\Product', 'products_pricing_template');
    }

    public function accounts() {
        return $this->hasOne('App\Models\Account');
    }
}
