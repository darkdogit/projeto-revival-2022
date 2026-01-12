<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class Like extends Model
{
    use HasFactory;

    protected $table = 'likes';
    protected $with = ['user','target'];
 

    protected $fillable = [
        'user_id',
        'target_user',
        'type',
        'active'
    ];

    protected $casts = [
        'created_at' => "datetime:Y-m-d H:i:s",
        'updated_at' => "datetime:Y-m-d H:i:s",
    ];

    public function getCreatedAtAttribute($value) { 
        return Carbon::createFromTimestamp(strtotime($value))->timezone('America/Sao_Paulo')->toDateTimeString(); 
    }
    public function getUpdatedAtAttribute($value) { 
        return Carbon::createFromTimestamp(strtotime($value))->timezone('America/Sao_Paulo')->toDateTimeString(); 
    }


    public function user(){

        return $this->belongsTo('App\Models\User');

    }

    public function target(){

        return $this->belongsTo('App\Models\User','target_user','id');

    }

    public function countLikedYou($user_id){

        return $this->where('target_user',$user_id)->count();

    }

    public function countYouLiked($user_id){

        return $this->where('user_id',$user_id)->count();

    }

 
}