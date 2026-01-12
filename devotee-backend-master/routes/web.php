<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return view('welcome');

});

Route::post('password/reset', 'ResetPasswordController@reset')->name('password.reset');


Route::group(['middleware' => 'guest'], function(){

    Route::get('login/github', 'AuthController@github');
    Route::get('login/github/redirect', 'AuthController@githubRedirect');

    Route::get('login/google', 'AuthController@google');
    Route::get('login/google/redirect', 'AuthController@googleRedirect');

    

});

