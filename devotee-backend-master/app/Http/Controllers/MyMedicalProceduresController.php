<?php

namespace App\Http\Controllers;

use App\Models\MyMedicalProcedures;
use Illuminate\Http\Request;

class MyMedicalProceduresController extends Controller
{
    public function __construct(MyMedicalProcedures $myMedicalProcedures)
    {
        @$this->user_id = @auth()->guard('api')->user()->id;
        $this->myMedicalProceduresModel = $myMedicalProcedures;
    }



    public function removeMedicalProcedures(Request $request)
    {
        if (@!$this->user_id) {
            $response = ['status' => false, 'message' => 'Usuário invalido'];
            return $response;
        }

        MyMedicalProcedures::where('user_id', $this->user_id)
            ->where('medical_procedures_id', $request->medical_procedures_id)
            ->delete();

        $response = ['status' => true];
        return $response;
    }
}
