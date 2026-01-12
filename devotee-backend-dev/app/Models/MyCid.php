<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MyCid extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'cid_id'
    ];

    protected $with = ['cid'];


    public function cid(){
        return $this->hasOne('App\Models\CID', 'id', 'cid_id');
    }

    public function remove($user_id)
    {
        $this->where('user_id',$user_id)->delete();
    }


}
