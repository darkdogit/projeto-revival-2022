<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Redirect;
use App\Models\OauthAccessToken;
use App\Models\User;
use App\Models\UsersOld;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\View;
use Illuminate\Support\Str;
use Socialite;

class AuthController extends Controller
{

    public function __construct()
    {

    }

    public function login(Request $request)
    {   
        if($request->type === 'google'){

        $find = User::where('email', $request->email)->first();

   

        if (!@$find) {

            return response()->json([
                'status' => false,
                'message' => 'Usuario nāo cadastrado'
            ], 
            307);
        }
    

         if (!$find->active) {
            $response = ['status' => false, 'message' => 'Usuario Inativo'];
            return $response;
        }

                $verify = $this->googleVerifyToken($request->token);

                if(!isset($verify->email)){
                    return ['status'=> false, 'message' => 'Ocorreu algum erro com a validação do Google.'];
                }
                if($verify->email != $request->email){
                  return ['status'=> false, 'message' => 'Email de login diferente do email do Google.'];
                }

                $access_token = $find->createToken('authToken')->accessToken;
                $user = $find;

                $response = ['status' => true, 'data' => $user, 'access_token' => $access_token];
                return $response;


        }

        if ($request->type === 'apple') {

            $find = User::where('email', $request->email)->first();

   

       if (!@$find) {

            return response()->json([
                'status' => false,
                'message' => 'Usuario nāo cadastrado'
            ], 
            307);
        }

            if (!$find->active) {
                $response = ['status' => false, 'message' => 'Usuario Inativo'];
                return $response;
            }
            //$verify = $this->appleVerifyToken($request->token);

            // if(!isset($verify->email)){
            //     return ['status'=> false, 'message' => 'Ocorreu algum erro com a validação do Google.'];
            // }
            // if($verify->email != $request->email){
            //   return ['status'=> false, 'message' => 'Email de login diferente do email do Google.'];
            // }

            $access_token = $find->createToken('authToken')->accessToken;
            $user = $find;

            $response = ['status' => true, 'data' => $user, 'access_token' => $access_token];
            return $response;

        } else {

            if (@$user->legacy_user) {

                $user = User::where('email', $request->email)->firstOrFail();

                $oldUser = UsersOld::where('email', $request->email)->firstOrFail();
                $check = password_verify($request->password, $oldUser->password);

                //var_dump($check);die();

                if ($check) {

                    $user->password = bcrypt($request->password);
                    $user->legacy_user = false;
                    $user->save();

                    $loginData = array(
                        'password' => $request->password,
                        'email' => $user->email,
                    );

                    //var_dump($loginData);die();

                    if (!auth()->attempt($loginData)) {
                        $response = ['status' => false, 'message' => 'Credenciais inválidas'];
                        return $response;
                    }

                    $access_token = auth()->user()->createToken('authToken')->accessToken;
                    $response = ['status' => true, 'data' => auth()->user(), 'access_token' => $access_token];
                    return $response;

                } else {
                    $response = ['status' => false, 'message' => 'Credenciais inválidas'];
                    return $response;
                }

            } else {

                $loginData = request()->validate([
                    'password' => 'required',
                    'email' => 'required|email',
                ]);

                if (!auth()->attempt($loginData)) {
                    $response = ['status' => false, 'message' => 'Credenciais inválidas'];
                    return $response;
                }
                if (!auth()->user()->active) {
                    $response = ['status' => false, 'message' => 'Usuário desativado'];
                    return $response;
                }

                $access_token = auth()->user()->createToken('authToken')->accessToken;
                $response = ['status' => true, 'data' => auth()->user(), 'access_token' => $access_token];
                return $response;
            }
        }

    }

    private function googleVerifyToken($token)
    {

        $curl = curl_init();

        curl_setopt_array($curl, array(
            CURLOPT_URL => "https://oauth2.googleapis.com/tokeninfo?id_token=" . $token,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_ENCODING => "",
            CURLOPT_MAXREDIRS => 10,
            CURLOPT_TIMEOUT => 30,
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
            CURLOPT_CUSTOMREQUEST => "GET",
            CURLOPT_POSTFIELDS => "",
            CURLOPT_HTTPHEADER => array(
                "accept: application/json",
                "content-type: application/json",
            ),
        ));

        $response = curl_exec($curl);
        $err = curl_error($curl);

        curl_close($curl);

        return json_decode($response);
    }

    //private function appleVerifyToken($clientId, $client_authorization_code, $client_secret){

    // //1. build POST data
    // $post_data = [
    //   'client_id' => $clientId,
    //   'grant_type' => 'authorization_code',
    //   'code' => $client_authorization_code,
    //   'client_secret' => $client_secret
    // ];

    // //2. create and send request
    // $ch = curl_init("https://appleid.apple.com/auth/token");
    // curl_setopt($ch, CURLOPT_HTTP_VERSION, CURL_HTTP_VERSION_2_0);
    // curl_setopt($ch, CURLOPT_HTTPHEADER, [
    //    'Accept: application/x-www-form-urlencoded',
    //    'User-Agent: curl',  //Apple requires a user agent header at the token endpoint
    // ]);
    // curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    // curl_setopt($ch, CURLOPT_POST, 1);
    // curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($post_data));
    // $curl_response = curl_exec($ch);
    // curl_close($ch);

    // //3. extract JSON from Apple token response
    // $data = json_decode($curl_response, true);
    // $refresh_token = $data['refresh_token'];

    // var_dump($refresh_token);die();
    //}

    public function logout(Request $request, $id)
    {
        User::where('id', $id)->update(['notification_token' => '']);
        OauthAccessToken::where('user_id', $id)->delete();
        return ['status' => true, 'message' => 'Usuário deslogado'];
    }

    public function github()
    {
        //dd('dsaddd');
        return Socialite::driver('github')->redirect();

    }

    public function githubRedirect()
    {
        $user = Socialite::driver('github')->user();
        dd($user);
    }

    public function google()
    {
        //return redirect('devotee://google-login?');
        //die('dad');die();
        //header("Location: google.com.br");
        $data = array(
            'status' => true,
        );

        // $a = json_encode($data);
        //var_dump('aa');die();

        // return View::make('login', [
        //     'data' => json_encode($data)
        // ]);
        // return redirect('devotee://google-login?data='.$a);
        return Socialite::driver('google')->redirect();

    }

    public function googleRedirect()
    {
        
        $user = Socialite::driver('google')->user();
        //dd($user);

        $find = User::firstOrCreate(
            [
                'email' => $user->email,
            ],
            [
                'email' => $user->email,
                'active' => true,
                'password' => bcrypt(Str::random(40)),
            ]
        );

        if (!$find->active) {
            $response = ['status' => false, 'message' => 'Usuario Inativo'];
            return $response;
        }

        $access_token = $find->createToken('authToken')->accessToken;
        $user = $find;

        $userData = array(
            'status' => true,
            'data' => $user,
            'access_token' => $access_token,
        );
        return $userData;
        
        // $userDataEncode = json_encode($userData);
        // return View::make('login', [
        //     'userData' => $userDataEncode,
        // ]);
    }

}
