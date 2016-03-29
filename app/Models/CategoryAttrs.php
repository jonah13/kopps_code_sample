<?php

namespace App\models;

use Illuminate\Database\Eloquent\Model;

class CategoryAttrs extends Model
{
    /**
     * The database table used by the model.
     *
     * @var string
     */
    protected $table = 'category_attrs';

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
        'type',
        'category_id',
        'select_values'
    ];

    public function setSelectValuesAttribute($value)
    {
        $this->attributes['select_values'] = implode(',', $value);
    }
}
