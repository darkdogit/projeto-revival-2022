<?php

namespace App\Http\Controllers;

use App\Models\Hospitals;
use Illuminate\Http\Request;

use Validator;


class HospitalsController extends Controller
{
   
    public function __construct(Hospitals $hospitals)
    {
        $this->hospitalsModel = $hospitals;
        $this->user_id = @auth()->guard('api')->user()->id;
    }


    public function index(Request $request)
    {
    
        $hospitals = $this->hospitalsModel->query();

        if ($request->country) {
            $hospitals->where('country', $request->country);
        }

        if ($request->q) {
            $hospitals->where(function ($query) use ($request) {
                $query->where('name', 'like', "%{$request->q}%");
            });
        }

        if (@$request->lat AND @$request->lng) {
            $hospitals->distance($request->lat, $request->lng);
            $hospitals->orderBy('distance','asc');
        }

        

        $hospitals = $hospitals->paginate(100);
        
        $data = collect(['status' => true]);
        $data = $data->merge($hospitals);

        return response()->json($data);
        
    }

    public function store(Request $request)
    {
        
        request()->validate([
            'name' => 'required',
            'lat' => 'required',
            'lng' => 'required',
            'country' => 'required',
            'codeiso2' => 'required',
            'codeiso3' => 'required',
        ]);

        $hospitals = $this->hospitalsModel->create($request->all());

        $response = ['status' => true, 'data' => $hospitals];
        return $response;
    }


    public function show(Hospitals $hospitals, $id)
    {
        $hospitals = $this->hospitalsModel->find($id);
        return ['status' => true, 'data' => $hospitals];
    }
 

    public function update(Request $request, $id)
    {
        $hospitals = $this->hospitalsModel->find($id);
        $hospitals->update($request->all());

        $response = ['status' => true, 'data' => $hospitals];
        return $response;

        
    }


    public function destroy(Hospitals $hospitals)
    {
        
    }
}
