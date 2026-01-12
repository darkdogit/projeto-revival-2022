<?php
namespace App\Services;

use Illuminate\Http\Request;
use Exception;

class MailService{


    public function __construct()
    {
        $this->api_key  = env('SENDGRID_KEY');
        $this->app_name  = env('APP_NAME');
        $this->from  = env('SENDGRID_FROM');

    }

    public function sendMail($subject,$body, $toMail, $toName = NULL)
    {
    	$objMail = [
            "personalizations" => [
            	[
                "to" => [
                	[
                    "email" => $toMail,
                    "name" 	=> $toName,
                ]
            	]
                ,
                "subject" => $subject
            	]
        ],
            "content" =>[
                [
                    "type"=> "text/html",
                    "value"=> $body
                ]
            ],
            "from" => [
                "email" 	=> $this->from,
                "name" 		=> $this->app_name
            ],
            "reply_to" => [
                "email" 	=> $this->from,
                "name" 		=> $this->app_name
            ]
        ];


        $curl = curl_init();

        curl_setopt_array($curl, array(
        CURLOPT_URL => "https://api.sendgrid.com/v3/mail/send",
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_ENCODING => "",
        CURLOPT_MAXREDIRS => 10,
        CURLOPT_TIMEOUT => 30,
        CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
        CURLOPT_CUSTOMREQUEST => "POST",
        CURLOPT_CUSTOMREQUEST => "POST",
        CURLOPT_POSTFIELDS => json_encode($objMail),
        CURLOPT_COOKIE => "sendgrid_frontend=ab4c18d6cb8aaf1c84961def24641a32%3Ae22ff389b6f8d9613c8477ba4668dc2789f66588",
        CURLOPT_HTTPHEADER => array(
            "authorization: Bearer ".$this->api_key,
            "content-type: application/json"
        ),
        ));

        $response = curl_exec($curl);
        $err = curl_error($curl);

        curl_close($curl);

        return json_decode($response);
    }

   

	
   
}