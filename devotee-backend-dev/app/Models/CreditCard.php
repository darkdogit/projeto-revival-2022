<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CreditCard extends Model
{
    use HasFactory;

    protected $fillable = [
        'card_id' , 'brand', 'holder_name', 'first_digits','last_digits','country', 'fingerprint', 'valid', 'expiration_date', 'main', 'user_id','street', 'street_number', 'state', 'city', 'neighborhood', 'zip_code'
    ];

    protected $casts = [
        'main'=>'boolean',
        'created_at' => "datetime:Y-m-d H:i:s",
        'updated_at' => "datetime:Y-m-d H:i:s",
    ];

    protected $hidden = [ 'id'];


}
