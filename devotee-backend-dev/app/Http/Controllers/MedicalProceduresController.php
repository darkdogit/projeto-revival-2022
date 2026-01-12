<?php

namespace App\Http\Controllers;

use App\Models\MedicalProcedures;
use Illuminate\Http\Request;

class MedicalProceduresController extends Controller
{
    public function __construct(MedicalProcedures $medicalProcedures)
    {
        $this->medicalProceduresModel = $medicalProcedures;
        $this->user_id = @auth()->guard('api')->user()->id;
    }


    public function index(Request $request)
    {
        $medicalProcedures = $this->medicalProceduresModel->query();

        if ($request->q) {
            $medicalProcedures->where(function ($query) use ($request) {
                $query->where('name', 'like', "%{$request->q}%")
                ->orWhere('name_en', 'like', "%{$request->q}%");
            });
        }

        $medicalProcedures = $medicalProcedures->paginate(100);

        $data = collect(['status' => true]);
        $data = $data->merge($medicalProcedures);

        return response()->json($data);

    }

    public function store(Request $request)
    {
        request()->validate([
            'name' => 'required',
            'name_en' => 'required'
        ]);

        $medicalProcedures = $this->medicalProceduresModel->create($request->all());

        $response = ['status' => true, 'data' => $medicalProcedures];
        return $response;

    }

    public function show(MedicalProcedures $medicalProcedures, $id)
    {
        $medicalProcedures = $this->medicalProceduresModel->find($id);
        return ['status' => true, 'data' => $medicalProcedures];
    }

    public function update(Request $request, $id)
    {
        $cid = $this->CIDModel->find($id);
        $cid->update($request->all());

        $response = ['status' => true, 'data' => $cid];
        return $response;
    }
}
