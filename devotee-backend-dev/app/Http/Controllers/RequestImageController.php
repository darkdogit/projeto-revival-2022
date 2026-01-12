<?php

namespace App\Http\Controllers;

use App\Models\RequestImage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class RequestImageController extends Controller
{
    public function index(Request $request)
    {
        request()->validate([
            'request_id' => 'required'
        ]);
        $data = RequestImage::where('request_id',$request->request_id)->latest()->get();

        return ['status' => true, 'data' => $data];

    }

  
    public function store(Request $request)
    {
        $data = request()->validate([
            'request_id' => 'required',
            'file' => 'required' 
        ]);

        $insert = [];


            for ($i=0; $i < count($request->file('file')); $i++) { 
                $insert[$i] =  RequestImage::create([
                    'request_id' => $request->request_id,
                ]);

                if ($request->file('file')[$i]->isValid()) {

                    $ext = $request->file('file')[$i]->guessExtension();
                    if($ext=='jpeg' || $ext=='jpg') $ext = 'jpg';
        
                    $up = $this->upload( $request->file('file')[$i], $insert[$i]->id.'_'.rand(10,99999), $request->request_id, $ext);
        
                    $insert[$i]->path =  $up;
                    $insert[$i]->save();
        
                 }
        

            }




      


        return ['status' => true, 'data' => $insert];


    }

 
    public function show(RequestImage $requestImage)
    {
        //
    }

    public function update($id,Request $request)
    {
        return ['status'=>true,'data'=> RequestImage::where('id',$id)->update($request->all())];

    }

    public function destroy($id)
    {
        $find = RequestImage::find($id);

        $del = Storage::disk('s3')->delete($find->path);
        $comment = RequestImage::where('id',$id)->delete();
        $response = ['status' => true, 'data' => $comment,'del'=>$del];
        return $response;
    }

    public function upload($file, $name, $requestId, $ext){

        $filename = md5($name).".".$ext;
        $docFile =  'requests/'.$requestId.'/images/'.$filename;
        $go = Storage::disk('s3')->put($docFile , file_get_contents($file),'public');

        if($go) {
            return $docFile;
        } else {
            return false;
        }

    }
}
