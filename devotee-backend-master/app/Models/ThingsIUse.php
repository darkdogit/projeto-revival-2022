<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ThingsIUse extends Model
{
    use HasFactory;

    protected $table = 'things_i_use';

    protected $fillable = [
        "name",
        "name_en"
    ];
}
