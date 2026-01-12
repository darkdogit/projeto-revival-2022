<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class UserMatch extends Model
{
    use HasFactory;

    protected $table = 'matches';
    protected $with = ['user_a','user_b','latest_message'];
 

    protected $fillable = [
        'user_a',
        'user_b',
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


    public function user_a(){

        return $this->belongsTo('App\Models\User','user_a','id');

    }

    public function user_b(){

        return $this->belongsTo('App\Models\User','user_b','id');

    }


    public function matchExist($user_a, $user_b){


        $exist = $this->where('user_a', $user_a)->where('user_b', $user_b)->exists();

        if (!$exist) {
            $exist_b = $this->where('user_b', $user_a)->where('user_a', $user_b)->exists();

            if (!$exist_b) {
                return false;
            }else{
                return true;
            }

        }else{
            return true;
        }
    


    }

    public function removeMatch($user_a, $user_b)
    {
        $this->where('user_a', $user_a)->where('user_b', $user_b)->delete();
        $this->where('user_a', $user_b)->where('user_b', $user_a)->delete();
       
    }

    public function latest_message(){
        return $this->hasOne('App\Models\MatchMessage','match_id','id')->latest();

    }

    public function countMatches($user_id){

        $a = $this->where('user_a',$user_id)->count();
        $b = $this->where('user_b',$user_id)->count();
        return ($a+$b);

    }

 
}