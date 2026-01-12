<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProfilePicture extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'main',
        'path',
        'order'
    ];

    public function removeMain($user_id)
    {
        $this->where('user_id', $user_id)
          ->update(['main' => false]);
    }

    public function removeAllImgs($user_id)
    {
        $this->where('user_id',$user_id)->delete();
    }

}
