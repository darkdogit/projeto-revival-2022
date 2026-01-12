<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

use Malhal\Geographical\Geographical;


class Hospitals extends Model
{

    const LATITUDE  = 'lat';
    const LONGITUDE = 'lng';
    protected static $kilometers = true;
    use Geographical;


    use HasFactory;

     protected $fillable = [
        'name',
        'lat',
        'lng',
        'country',
        'codeiso2',
        'codeiso3'
    ];

    public $timestamps = false;
    

}
