<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MyThings extends Model
{
    use HasFactory;

    // public $timestamps = false;

    protected $with = ['thing'];

    public function thing()
    {
        return $this->hasOne('App\Models\ThingsIUse', 'id', 'things_i_use_id');
    }

    public function remove($user_id)
    {
        $this->where('user_id',$user_id)->delete();
    }
}
