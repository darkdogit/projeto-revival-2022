<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SubscriptionInfo extends Model
{
    use HasFactory;

    protected $fillable = [
        'productId','purchaseToken','transactionReceipt','user_id'
    ];

    public function user(){
        return $this->belongsTo('App\Models\User');
    }
    
}
