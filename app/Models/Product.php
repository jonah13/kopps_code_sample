<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{

    /**
     * @var Table name
     */
    protected $table = 'products';

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
        'name',
        'description',
        'bkt_key',
        'img',
        'manf',
        'manf_id',
        'category',
        'uom',
        'only_one',
        'quantity',
        'amt',
        'default_price'
    ];

    /**
     * Get the uom record associated with the product.
     */
    public function uoms()
    {
        return $this->hasOne('App\Models\UOM', 'id', 'uom');
    }

    /**
     * Get the category record associated with the product.
     */
    public function categories()
    {
        return $this->hasOne('App\Models\Category', 'id', 'category');
    }

    /**
     * Get the manufacturer record associated with the product.
     */
    public function manufacturers()
    {
        return $this->hasOne('App\Models\Manufacturer', 'id', 'manf');
    }

    /**
     * Set the only_one field.
     *
     * @param  string  $value
     * @return string
     */
    public function setOnlyOneAttribute($value)
    {
        $this->attributes['only_one'] = ($value == 'true');
    }

    public function attributes()
    {
        return $this->hasMany('App\Models\ProductAttrs');
    }

}

