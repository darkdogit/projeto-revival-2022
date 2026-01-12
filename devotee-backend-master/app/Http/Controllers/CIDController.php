<?php

namespace App\Http\Controllers;

use App\Models\CID;
use Illuminate\Http\Request;

class CIDController extends Controller
{
    
    public function __construct(CID $CID)
    {
        $this->CIDModel = $CID;
        $this->user_id = @auth()->guard('api')->user()->id;
    }


    public function index(Request $request)
    {
        $cid = $this->CIDModel->query();

        if ($request->q) {
            $cid->where(function ($query) use ($request) {
                $query->where('code', 'like', "%{$request->q}%")
                ->orWhere('description', 'like', "%{$request->q}%")
                ->orWhere('description_en', 'like', "%{$request->q}%");
            });
        }
        
        $cid = $cid->paginate(100);
        
        $data = collect(['status' => true]);
        $data = $data->merge($cid);

        return response()->json($data);
        
    }

    public function store(Request $request)
    {
        request()->validate([
            'code' => 'required',
            'description' => 'required',
            'description_en' => 'required'
        ]);

        $cid = $this->CIDModel->create($request->all());

        $response = ['status' => true, 'data' => $cid];
        return $response;
        
    }

    public function show($id)
    {
        $cid = $this->CIDModel->find($id);
        return ['status' => true, 'data' => $cid];
    }

    public function update(Request $request, $id)
    {
        $cid = $this->CIDModel->find($id);
        $cid->update($request->all());

        $response = ['status' => true, 'data' => $cid];
        return $response;
    }
}
