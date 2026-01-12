<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MyDrugs extends Model
{
    use HasFactory;
    
    protected $fillable = [
        'user_id',
        'drug_id'
    ];

    protected $with = ['drug'];


    public function drug(){
        return $this->hasOne('App\Models\Drugs', 'id', 'drug_id');
    }

    public function remove($user_id)
    {
        $this->where('user_id',$user_id)->delete();
    }
}
