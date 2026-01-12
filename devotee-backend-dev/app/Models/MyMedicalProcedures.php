<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MyMedicalProcedures extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'medical_procedures_id'
    ];

    protected $with = ['medical_procedures'];


    public function medical_procedures(){
        return $this->hasOne('App\Models\MedicalProcedures', 'id', 'medical_procedures_id');
    }

    public function remove($user_id)
    {
        $this->where('user_id',$user_id)->delete();
    }
}
