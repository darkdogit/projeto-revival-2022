<?php

namespace App\Http\Controllers;

use App\Models\AppSetting;
use App\Models\User;
use App\Services\MailService;


use Illuminate\Http\Request;

class AppSettingController extends Controller
{
    
    public function __construct(AppSetting $appSetting, User $user, MailService $mailService)
    {
        $this->AppSetting = $appSetting;
        $this->user = $user;
        $this->mailService = $mailService;
        $this->user_id = @auth()->guard('api')->user()->id;
    }

    public function termosOfUseGet(Request $request, $key)
    {

       $AppSetting = AppSetting::where('key',$key)->first();
       return ['status'=>true,'data'=>$AppSetting];
    }

    public function sugere(Request $request)
    {

        $arrayBody = array(
            'type' => $request->type,
            'text' => $request->text
        );

       $body = view('sugere', $arrayBody)->render();
       $sendMail = $this->mailService->sendMail('Nova sugestão', $body, 'mkt@devotee.com.br', 'Ricardo');

       $response = ['status' => true, 'message' => 'sugestão enviada'];
       return $response;
    }


    public function termosOfUsePut(Request $request)
    {   


        if (@!$this->user_id) {
            $response = ['status' => false, 'message' => 'Usuario invalido'];
        }


        $user = $this->user->find($this->user_id);
        if ($user->type != 'admin') {
            $response = ['status' => false, 'message' => 'Usuario invalido'];
            return $response;
        }

      
        $AppSetting = AppSetting::where('key',$request->key)->update($request->all());
        return ['status'=>true];
    }

}
