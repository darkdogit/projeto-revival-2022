<?php

namespace App\Http\Controllers;

use App\Models\CID;
use App\Models\Drugs;
use App\Models\Filters;
use App\Models\Hospitals;
use App\Models\ThingsIUse;
use App\Models\MedicalProcedures;
use Illuminate\Http\Request;

class FiltersController extends Controller
{

    public function __construct(Filters $filters, MedicalProcedures $medicalProcedures, Hospitals $hospitals, Drugs $drugs, CID $CID, ThingsIUse $thingsIUse)
    {
        $this->filtersModel = $filters;

        $this->medicalProceduresModel = $medicalProcedures;
        $this->hospitalsModel = $hospitals;
        $this->thingsIUseModel = $thingsIUse;
        $this->drugsModel = $drugs;
        $this->CIDModel = $CID;

        $this->user_id = @auth()->guard('api')->user()->id;
    }

    public function index(Request $request)
    {
        $filters = $this->filtersModel->query();
        $filters->where('user_id', $this->user_id);

        if ($request->type) {
            $filters->where('type', $request->type);
        }

        $data = $filters->get();

        for ($i = 0; $i < count($data); $i++) {

            switch ($data[$i]->type) {
                case 'cid':
                    $data[$i]->cid = $this->CIDModel->find($data[$i]->filter_id);
                    break;
                case 'hospitals':
                    $data[$i]->hospitals = $this->hospitalsModel->find($data[$i]->filter_id);
                    break;
                case 'drugs':
                    $data[$i]->drugs = $this->drugsModel->find($data[$i]->filter_id);
                    break;
                case 'medical_procedures':
                    $data[$i]->medical_procedures = $this->medicalProceduresModel->find($data[$i]->filter_id);
                    break;
                case 'things_i_use':
                    $data[$i]->things_i_use = $this->thingsIUseModel->find($data[$i]->filter_id);
                    break;
            }

        }

        $response = ['status' => true, 'data' => $data];
        return $response;
    }

    public function store(Request $request)
    {



        if ($request->has('cid')) {

            $this->filtersModel
                ->where('user_id', $this->user_id)
                ->where('type', 'cid')
                ->delete();

            if ($request->cid) {

                for ($i = 0; $i < count(@$request->cid); $i++) {
                    $cid = array(
                        'user_id' => $this->user_id,
                        'type' => 'cid',
                        'filter_id' => $request->cid[$i],
                    );
                    $filter = $this->filtersModel->create($cid);
                }
            }

        }

        if ($request->has('medical_procedures')) {

            $this->filtersModel
                ->where('user_id', $this->user_id)
                ->where('type', 'medical_procedures')
                ->delete();

            if ($request->medical_procedures) {
                for ($i = 0; $i < count(@$request->medical_procedures); $i++) {
                    $medical_procedures = array(
                        'user_id' => $this->user_id,
                        'type' => 'medical_procedures',
                        'filter_id' => $request->medical_procedures[$i],
                    );
                    $filter = $this->filtersModel->create($medical_procedures);
                }
            }

        }

        if ($request->has('hospitals')) {

            $this->filtersModel
                ->where('user_id', $this->user_id)
                ->where('type', 'hospitals')
                ->delete();

            if ($request->hospitals) {
                for ($i = 0; $i < count(@$request->hospitals); $i++) {
                    $hospitals = array(
                        'user_id' => $this->user_id,
                        'type' => 'hospitals',
                        'filter_id' => $request->hospitals[$i],
                    );
                    $filter = $this->filtersModel->create($hospitals);
                }
            }

        }

        if ($request->has('drugs')) {

            $this->filtersModel
                ->where('user_id', $this->user_id)
                ->where('type', 'drugs')
                ->delete();

            if ($request->drugs) {
                for ($i = 0; $i < count(@$request->drugs); $i++) {
                    $drugs = array(
                        'user_id' => $this->user_id,
                        'type' => 'drugs',
                        'filter_id' => $request->drugs[$i],
                    );
                    $filter = $this->filtersModel->create($drugs);
                }
            }

        }
        if ($request->has('things_i_use')) {

            $id = $this->user_id;
            $this->filtersModel
                ->where('user_id', $this->user_id)
                ->where('type', 'things_i_use')
                ->delete();

            if ($request->things_i_use) {
                $items = array_map(function ($thing) use ($id) {
                    return [
                        'user_id' => $id,
                        'type' => 'things_i_use',
                        'filter_id' => $thing
                    ];
                }, $request->things_i_use);

                $this->filtersModel->insert($items);
            }


        }

        $response = ['status' => true];
        return $response;
    }

    public function destroy(Filters $filters)
    {

    }
}
