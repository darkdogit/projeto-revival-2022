<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class Activities extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id'
    ];

    protected $dates = [
        'created_at',
        'updated_at'
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

}
