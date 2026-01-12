<?php

namespace App\Http\Controllers;

use App\Models\MatchMessage;
use App\Models\Match;

use Illuminate\Http\Request;
use App\Events\NewMessageEvent;

use App\Services\NotificationService;

use App\Models\User;
use App\Models\UserMatch;
use Illuminate\Support\Facades\Storage;

use Validator;



class MatchMessageController extends Controller
{
    public function __construct(NotificationService $notif)
    {
        $this->user_id = @auth()->guard('api')->user()->id;
        $this->user = @auth()->guard('api')->user();
        $this->push = $notif;

    }
    public function index(Request $request)
    {

        request()->validate([
            'match_id' => 'required'
        ]);
        $data = MatchMessage::where('match_id',$request->match_id)->latest()->paginate(50);

        //set as read other person's messages

        MatchMessage::where('user_id','!=',$this->user_id)->where('match_id',$request->match_id)->update(['read'=>true]);

        return $data;

    }


    public function readMessage(Request $request)
    {

        if (@!$this->user_id) {
            $response = ['status' => false, 'message' => 'Usuário invalido'];
            return $response;
        }

        request()->validate([
            'match_id' => 'required'
        ]);

        //MatchMessage::where('user_id','!=', '7636')->where('match_id',$request->match_id)->update(['read'=>true]);

        
        MatchMessage::where('user_id','!=',$this->user_id)->where('match_id',$request->match_id)->update(['read'=>true]);

        $response = ['status' => true];
        return $response;

    }

  
    public function store(Request $request)
    {
        $data = request()->validate([
            'match_id'          => 'required',
            'type'              => 'nullable' ,
            'content'           => 'nullable',
            'audio_duration'    => 'nullable',

        ]);

        $req = UserMatchatch::find($request->match_id);
        $user = User::find($this->user_id == $req->user_a ? $req->user_b : $req->user_a);
        


        $data['user_id'] = $this->user_id;
        $data['recipient_id'] = $user->id;

        $msg =  MatchMessage::create($data);
        $msg->load('user');
        
        
        
    
    
        if (@$request->file('file')) {
            $content = '📷';
        }else{
            $content = $request->content;
        }

        $this->push->new($user,'notification_message','Você possui uma nova mensagem!', $content);


        if (@$request->file('file')) {
            
            if (@$request->file('file')->isValid()) {

                $ext = $request->file('file')->guessExtension();

                if($ext=='jpeg' || $ext=='jpg') $ext = 'jpg';

                $up = $this->upload( $request->file('file'), $msg->id.'_'.rand(10,99999), $request->request_id, $ext,$request->type);

                //var_dump($up);die();

                $msg->path =  $up;
                $msg->save();

            }
        }

        $event = event(new NewMessageEvent($msg));
        


        

        return ['status' => true, 'data' => $msg];

    }

 
    public function show(MatchMessage $MatchMessage)
    {
        //
    }

    public function update($id,Request $request)
    {
        return ['status'=>true,'data'=> MatchMessage::where('id',$id)->update($request->all())];

    }

    public function destroy($id)
    {
        return ['status'=>true,'data'=> MatchMessage::where('id',$id)->delete()];

    }

    public function upload($file, $name, $requestId, $ext){

        $filename = md5($name).".".$ext;
        $docFile =  'img-messages/'.$filename;
        $go = Storage::disk('s3')->put($docFile , file_get_contents($file),'public');

        if($go) {
            return $docFile;
        } else {
            return false;
        }

    }
}
