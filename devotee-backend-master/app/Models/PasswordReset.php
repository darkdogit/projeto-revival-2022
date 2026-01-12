<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PasswordReset extends Model
{  
    const UPDATED_AT = null;

    protected $fillable = [
        'email', 'token'
    ];

    public $primaryKey = 'email';

}