<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CID extends Model
{
    use HasFactory;

    protected $fillable = [
        'code',
        'description',
        'description_en'
    ];

    protected $table = 'cid';

    public $timestamps = false;

}
