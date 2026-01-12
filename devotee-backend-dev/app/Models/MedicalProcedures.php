<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MedicalProcedures extends Model
{
    use HasFactory;

    protected $fillable = [
        "name",
        "name_en"
    ];


    public $timestamps = false;

}
