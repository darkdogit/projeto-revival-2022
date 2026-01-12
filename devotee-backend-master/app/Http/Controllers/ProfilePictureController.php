<?php

namespace App\Http\Controllers;

use App\Models\ProfilePicture;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ProfilePictureController extends Controller
{
    
    public function __construct(ProfilePicture $profilePicture)
    {
        $this->user_id = @auth()->guard('api')->user()->id;
        $this->profilePictureModel = $profilePicture;

    }

    public function index(Request $request)
    {
        request()->validate([
            'user_id' => 'required'
        ]);

        if($request->user_id){
            $user_id = $request->user_id;
        } else {
            if($this->user->type == 'user'){
                $user_id = $this->user_id;
            } else {
                $user_id = null;
            }
        }


        $data = ProfilePicture::latest();
        if($user_id){
            $data->where('user_id',$user_id);
        }
        $data = $data->get();

        return ['status' => true, 'data' => $data];

    }

  
    public function store(Request $request)
    {
        $data = request()->validate([
            'image' => 'required' 
        ]);

        $insert = [];

            for ($i=0; $i < count($request->file('image')); $i++) {


                if ($i === 0) { $main = true; }else { $main = false;}

                $insert[$i] =  ProfilePicture::create([
                    'user_id' => $this->user_id,
                    'main' => @$main,
                    'order' => $i,
                ]);

                if ($request->file('image')[$i]->isValid()) {

                    $ext = $request->file('image')[$i]->guessExtension();
                    if($ext=='jpeg' || $ext=='jpg') $ext = 'jpg';
        
                    $up = $this->upload( $request->file('image')[$i], $insert[$i]->id.'_'.rand(10,99999), $request->request_id, $ext);
        
                    $insert[$i]->path =  $up;
                    $insert[$i]->save();
        
                 }
        

            }



        return ['status' => true, 'data' => $insert];


    }

 
    public function insertRemoveImgs(Request $request)
    {
        $data = request()->validate([
            'image' => 'required' 
        ]);

        $this->profilePictureModel->removeAllImgs($this->user_id);

        $insert = [];

            for ($i=0; $i < count($request->file('image')); $i++) {


                if ($i === 0) { $main = true; }else { $main = false;}

                $insert[$i] =  ProfilePicture::create([
                    'user_id' => $this->user_id,
                    'main' => @$main,
                    'order' => $i,
                ]);

                if ($request->file('image')[$i]->isValid()) {

                    $ext = $request->file('image')[$i]->guessExtension();
                    if($ext=='jpeg' || $ext=='jpg') $ext = 'jpg';
        
                    $up = $this->upload( $request->file('image')[$i], $insert[$i]->id.'_'.rand(10,99999), $request->request_id, $ext);
        
                    $insert[$i]->path =  $up;
                    $insert[$i]->save();
        
                 }
        

            }



        return ['status' => true, 'data' => $insert];


    }

    public function updateImgByOrder(Request $request)
    {
        $data = request()->validate([
            'image' => 'required' ,
            'order' => 'required' ,
        ]);

        //$this->profilePictureModel->removeAllImgs($this->user_id);

        $insert = [];

            for ($i=0; $i < count($request->file('image')); $i++) {


                //if ($i === 0) { $main = true; }else { $main = false;}

                
                 $insert[$i] = ProfilePicture::updateOrCreate(
                    [
                        'user_id' => $this->user_id,
                        'order' => $request->order[$i],
                    ],
                    [
                        'user_id' => $this->user_id,
                        'order' => $request->order[$i],
                    ]
                );

                if ($request->file('image')[$i]->isValid()) {

                    $ext = $request->file('image')[$i]->guessExtension();
                    if($ext=='jpeg' || $ext=='jpg') $ext = 'jpg';
        
                    $up = $this->upload( $request->file('image')[$i], $insert[$i]->id.'_'.rand(10,99999), $request->request_id, $ext);
        
                    $insert[$i]->path =  $up;
                    $insert[$i]->save();
        
                 }
        

            }



        return ['status' => true, 'data' => $insert];


    }

    public function update($id,Request $request)
    {


        if ($request->main === true) {
            $profilePicture = $this->profilePictureModel->find($id);
            $this->profilePictureModel->removeMain($profilePicture->user_id);
        }

        return ['status'=>true,'data'=> ProfilePicture::where('id',$id)->update($request->all())];

    }

    public function destroy($id)
    {
        if (@!$this->user_id) {
            $response = ['status' => false, 'message' => 'Usuario invalido'];
            return $response;
        }


        $find = ProfilePicture::find($id);
        $comment = ProfilePicture::where('id',$id)->where('user_id', $this->user_id)->delete();
        if ($comment) {
            $del = Storage::disk('s3')->delete($find->path);
            $response = ['status' => true, 'data' => $comment,'del'=>$del];
            return $response;
        }else{
            $response = ['status' => false, 'message' => 'Falha ao deletar imagem'];
            return $response;
        }

        //profile_pictures/063d88177def841da230e2210c0f5dc1.jpg
        
    }

    public function upload($file, $name, $requestId, $ext){

        $filename = md5($name).".".$ext;
        $docFile =  'profile_pictures/'.$filename;
        $go = Storage::disk('s3')->put($docFile , file_get_contents($file),'public');

        if($go) {
            return $docFile;
        } else {
            return false;
        }

    }
}
