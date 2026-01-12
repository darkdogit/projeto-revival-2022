<?php
namespace App\Services;

use Illuminate\Http\Request;

use Exception;

// use App\Notification;

use App\User;



class NotificationService {

    public function __construct()
    {
    }

    public function new($user,$type,$title,$content,$data=null){

        $p = null;
        $n = null;


        if ($type === 'notification_like') {

            if (!$user->notification_like) {
                return false;
            }
        }


        if($user->notification_token){
           $p =  $this->postExpo($user->notification_token,$title,$content,$type, $data);
        }
        
        return ['notif_db'=>$n,'push_notif'=>$p];

    }



    public function postExpo($token,$title,$body, $type, $data=null){

        $curl = curl_init();
        $data = (array)$data;
        $data['sound'] = true;
        $data['type'] = $type;
        $payload = [
            'to' => $token, 
            'title' => $title, 
            "sound" => "default",
            "badge" => 1,
            'body' => $body, 
            'data' => $data,
        ];

        curl_setopt_array($curl, array(
        CURLOPT_URL => "https://exp.host/--/api/v2/push/send",
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_ENCODING => "",
        CURLOPT_MAXREDIRS => 10,
        CURLOPT_TIMEOUT => 30,
        CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
        CURLOPT_CUSTOMREQUEST => "POST",
        CURLOPT_POSTFIELDS => json_encode($payload),
        CURLOPT_HTTPHEADER => array(
            "content-type: application/json"
        ),
        ));

        $response = curl_exec($curl);
        $err = curl_error($curl);

        curl_close($curl);
        return json_decode($response);
    }
   
   
   
}