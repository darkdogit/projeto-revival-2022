<?php

namespace App\Http\Controllers;

use App\Models\Adverts;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;


class AdvertsController extends Controller
{   

    public function __construct(Adverts $adverts)
    {
        $this->advertsModel = $adverts;
        $this->user_id = @auth()->guard('api')->user()->id;
    }
    
    public function index(Request $request)
    {
        $adverts = $this->advertsModel->query();

        if ($request->active) {
            $adverts->where('active', $request->active);
        }

        $adverts->orderBy('id','desc');

        $adverts = $adverts->paginate(100);
        
        $data = collect(['status' => true]);
        $data = $data->merge($adverts);

        return response()->json($data);
        
    }

    public function store(Request $request)
    {
        
        request()->validate([
            'title' => 'required',
            'image' => 'required',
            'link' => 'required'
        ]);

        
        $adverts = $this->advertsModel->create($request->all());


        if ($request->file('image')->isValid()) {

            $ext = $request->file('image')->guessExtension();
            if($ext=='jpeg' || $ext=='jpg') $ext = 'jpg';

            $up = $this->upload($request->file('image'), $adverts->id.'_'.rand(10,99999),$ext);

            $adverts->image = $up;
            $adverts->save();

        }

        
        



        $response = ['status' => true, 'data' => $adverts];
        return $response;
    }


    public function show(Adverts $adverts)
    {
        
    }

     public function update(Request $request, $id)
    {
        $ad = $this->advertsModel->find($id);
        $ad->update($request->all());

        $response = ['status' => true, 'data' => $ad];
        return $response;
    }

    public function destroy(Adverts $adverts)
    {
        
    }

    public function upload($file, $name, $ext)
    {

        $filename = md5($name).".".$ext;
        $docFile =  'adverts/'.$filename;
        $go = Storage::disk('s3')->put($docFile , file_get_contents($file),'public');

        if($go) {
            return $docFile;
        } else {
            return false;
        }

    }
}
