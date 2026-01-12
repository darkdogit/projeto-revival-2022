<?php

namespace App\Http\Controllers;

use App\Models\Drugs;
use Illuminate\Http\Request;

class DrugsController extends Controller
{
    public function __construct(Drugs $drugs)
    {
        $this->drugsModel = $drugs;
        $this->user_id = @auth()->guard('api')->user()->id;
    }


    public function index(Request $request)
    {
        $drugs = $this->drugsModel->query();

        if ($request->q) {
            $drugs->where(function ($query) use ($request) {
                $query->where('name', 'like', "%{$request->q}%")
                ->orWhere('name_en', 'like', "%{$request->q}%");
            });
        }

        $drugs = $drugs->paginate(100);

        $data = collect(['status' => true]);
        $data = $data->merge($drugs);

        return response()->json($data);

    }

    public function store(Request $request)
    {
        request()->validate([
            'name' => 'required'
        ]);

        $drugs = $this->drugsModel->create($request->all());

        $response = ['status' => true, 'data' => $drugs];
        return $response;

    }

    public function show($id)
    {
        $drugs = $this->drugsModel->find($id);
        return ['status' => true, 'data' => $drugs];
    }



}
