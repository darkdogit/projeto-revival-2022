<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Disability extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'cid',
        'medical_procedures',
        'medicament',
        'hospital',
        'user_id',
    ];
}
