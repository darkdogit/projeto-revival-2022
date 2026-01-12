<?php




namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class MatchMessage extends Model
{
    use HasFactory;

    protected $fillable = [
            'match_id',
            'user_id',
            'content',
            'read', 
            'type',
            'path',
            'recipient_id',
            'audio_duration'
        ];
    protected $with = [ 'user'];
    protected $casts = [
        'read' => 'boolean',
        'created_at' => "datetime:Y-m-d H:i:s",
        'updated_at' => "datetime:Y-m-d H:i:s",
    ];

 
    public function getCreatedAtAttribute($value) { 
        return Carbon::createFromTimestamp(strtotime($value))->timezone('America/Sao_Paulo')->toDateTimeString(); 
    }
    public function getUpdatedAtAttribute($value) { 
        return Carbon::createFromTimestamp(strtotime($value))->timezone('America/Sao_Paulo')->toDateTimeString(); 
    }

    public function user(){

        return $this->hasOne('App\Models\User','id','user_id');

    }

     public function user_b(){

        return $this->hasOne('App\Models\User','id','user_b');

    }

    
}
