<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MyHospitals extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'hospital_id'
    ];

    protected $with = ['hospital'];


    public function hospital(){
        return $this->hasOne('App\Models\Hospitals', 'id', 'hospital_id');
    }

    public function remove($user_id)
    {
        $this->where('user_id',$user_id)->delete();
    }
}
