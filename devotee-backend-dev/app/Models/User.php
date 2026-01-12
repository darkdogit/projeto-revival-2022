<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Passport\HasApiTokens;

use App\Notifications\PasswordResetNotification;

use Malhal\Geographical\Geographical;


class User extends Authenticatable
{

    use SoftDeletes;
    const LATITUDE  = 'lat';
    const LONGITUDE = 'lng';
    protected static $kilometers = true;
    use Geographical;


    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    //Users model
    protected $fillable = [
        'name',
        'email',
        'password',
        'cpf',
        'phone',
        'type',
        'birthdate',
        'sexual_orientation',
        'target_gender',
        'plan_id',
        'gender',
        'age_min',
        'age_max',
        'max_distance',
        'account_type',
        'show_as_gender',
        'automatic_location',
        'notification_token',
        'lng',
        'lat',
        'disability_description',
        'occupation',
        'about',
        'address_description',
        'tiic',
        'show_me',
        'prejudice',
        'things_i_use',
        'illicit_drugs',
        'show_age',
        'show_distance',
        'relationship_type',
        'plan_type',
        'target_account_type',
        'notification_match',
        'notification_message',
        'notification_like',
        'os',
        'model',
        'osVersion',
        'stripe_id',
        'subscriptions_id',
        'reason_cancel_plan',
        'reason_cancel_account',
        'legacy_user',
        'old_id',
        'active',
        'country',
        'show_the_special'

    ];


    protected $casts = [
        'created_at' => "datetime:Y-m-d H:i:s",
        'updated_at' => "datetime:Y-m-d H:i:s",
        'email_verified_at' => 'datetime',
        'distance' => 'float',
        'tiic' => 'boolean',
        'show_me' => 'boolean',
        'prejudice' => 'boolean',
        'automatic_location' => 'boolean',
        'show_age' => 'boolean',
        'show_distance' => 'boolean',
        'notification_message' => 'boolean',
        'notification_match' => 'boolean',
        'notification_like' => 'boolean',
        'show_the_special' => 'boolean',
    ];

    //protected $primaryKey = 'id'; // or null
    //public $incrementing = false;




    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $with = ['profile_picture'];





    public function sendPasswordResetNotification($token)
    {
        $this->notify(new PasswordResetNotification($token));
    }

    public function address(){
        return $this->hasOne('App\Models\Address');
    }

    public function profile_picture(){
        return $this->hasMany('App\Models\ProfilePicture')->orderBy('order');
    }

    public function my_cids(){
        return $this->hasMany('App\Models\MyCid');
    }

    public function my_hospitals(){
        return $this->hasMany('App\Models\MyHospitals');
    }

    public function my_things() {
        return $this->hasMany('App\Models\MyThings');
    }

    public function my_drugs(){
        return $this->hasMany('App\Models\MyDrugs');
    }

    public function medical_procedures(){
        return $this->hasMany('App\Models\MyMedicalProcedures');
    }

    public function plan(){
        return $this->hasOne('App\Models\Plan','id','plan_id');
    }

    public function subscription_infos(){
        return $this->hasOne('App\Models\SubscriptionInfo');
    }

    public function registeredEmail($email)
    {
        if ($this->where('email', $email)->exists()) {
            return true;
        }else{
            return false;
        }

    }

    public function newId($old_id)
    {
       return $this->select('id')->where('old_id', $old_id)->first();
    }


}
