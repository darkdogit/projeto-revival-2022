<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::post('stripe/webhook', 'StripeController@webhook');
Route::get('subscriptionCron', 'SubscriptionInfoController@cronSubsUpdateGoogle');



Route::group(['middleware' => 'auth:api'], function(){


	Route::get('cards', 'UserController@cards');

	Route::apiResources([
		// 'users' => 'UserController',
		'addresses' => 'AddressController',
		'likes' => 'LikeController',
		'match/messages' => 'MatchMessageController',
		'matches' => 'MatchController',
		'user/pictures' => 'ProfilePictureController',
		'requests' => 'RequestController',
		'credit-cards' => 'CreditCardController',
		'hospitals' => 'HospitalsController',
		'cid' => 'CIDController',
		'medical-procedures' => 'MedicalProceduresController',
		'things-i-use' => 'ThingsIUseController',
		'drugs' => 'DrugsController',
		'reports' => 'ReportController',
		'filters' => 'FiltersController',
		'adverts' => 'AdvertsController',
		'subscription-info' => 'SubscriptionInfoController',

	]);
	 Route::delete('my-hospitals', 'MyHospitalsController@removeCid');

	 Route::delete('my-cid', 'MyCidController@removeCid');
	 Route::delete('my-medical-procedures', 'MyMedicalProceduresController@removeMedicalProcedures');

	 Route::delete('my-drugs', 'MyDrugsController@removeDrugs');
	//Route::put('hospitals/{id}', 'HospitalsController@update');


	 Route::post('user/pictures/update-all', 'ProfilePictureController@insertRemoveImgs');
	 Route::post('user/pictures/update-by-order', 'ProfilePictureController@updateImgByOrder');

	 Route::get('liked-me', 'LikeController@likedMe');



	 Route::post('plan/payment', 'UserController@payment');
	 Route::post('plan/payment-concluded', 'UserController@paymentConcluded');

	//  Route::post('plan/add-payment-method', 'UserController@addPaymentMethod');

	 Route::post('plan/cancel', 'UserController@cancelSubs');

	 Route::post('reset-dislikes', 'LikeController@resetDislikes');

	// Route::post('users/pay', 'UserController@payForPlan');
	// Route::get('users/plan', 'UserController@plan');
	// Route::put('users/payment-method', 'UserController@changePaymentMethod');
	// Route::get('users/payment-history', 'UserController@paymentHistory');


	


});

/*
|--------------------------------------------------------------------------
| password reset & account verify
|--------------------------------------------------------------------------
*/

Route::post('sugere', 'AppSettingController@sugere');
Route::post('users/suggestion', 'AppSettingController@sugere');


Route::post('password/email', 'PasswordResetController@forgot');
Route::post('password/reset', 'PasswordResetController@reset');

Route::get('migra-user', 'UserController@migraUser');
Route::get('migra-cid', 'UserController@migraCidUser');
Route::get('migra-drugs', 'UserController@migraDrugUser');
Route::get('migra-hos', 'UserController@migraHospUser');
Route::get('migra-medical-procedures', 'UserController@migraMedicalProceduresUser');
Route::get('migra-lat', 'UserController@migraLat');
Route::get('migra-match', 'UserController@migraMatch');
Route::get('getSexualOrientation', 'UserController@getSexualOrientation');





// Route::post('alterar-senha', 'ResetPasswordController@reset');

Route::get('email/resend', 'VerificationController@resend')->name('verification.resend');
Route::get('email/verify/{id}/{hash}', 'VerificationController@verify')->name('verification.verify');


Route::post('users/update/{id}', 'UserController@update');

Route::post('users/update-pass', 'UserController@updatePass');

Route::post('message/readMessages', 'MatchMessageController@readMessage');


Route::post('create-hash', 'QrCodeController@createHash');
Route::post('read-hash', 'QrCodeController@readHash');

Route::put('settings', 'AppSettingController@termosOfUsePut');
Route::get('settings/{id}', 'AppSettingController@termosOfUseGet');


Route::post('activities', 'ActivitiesController@store');
Route::get('activities', 'ActivitiesController@days');
Route::get('statistics', 'ActivitiesController@statistics');



Route::post('login', 'AuthController@login');
Route::post('logout/{id}', 'AuthController@logout');

Route::post('deleteAccount', 'UserController@deleteAccount');

// Route::post('payment-postback', 'PaymentController@postback');
// Route::get('payment-postback', 'PaymentController@postback');

Route::post('users/registeredEmail', 'UserController@registeredEmail');
Route::put('users-disability/{id}', 'DisabilityController@update');

//Route::post('login-google', 'AuthController@googleRedirect');


Route::apiResources([
	'users' => 'UserController',
	// 'plans' => 'PlanController',
	//'settings' => 'AppSettingController',


]);










