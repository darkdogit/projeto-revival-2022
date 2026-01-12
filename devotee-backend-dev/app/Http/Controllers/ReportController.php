<?php

namespace App\Http\Controllers;

use App\Models\Report;
use App\Models\UserMatch;
use App\Models\Like;
use Illuminate\Http\Request;

class ReportController extends Controller
{

    public function __construct(Report $report, UserMatch $match, Like $like)
    {
        $this->reportModel = $report;
        $this->matchModel = $match;
        $this->likeModel = $like;
        $this->user_id = @auth()->guard('api')->user()->id;
    }

    public function index(Request $request)
    {
        $reports = $this->reportModel->query();
        $reports->orderBy('id', 'desc');

        $reports->with('user');
        $reports->with('denounced_user');

        if ($request->user_id) {
            $reports->where('user_id', $request->user_id);
        }

         if ($request->denounced_user_id) {
            $reports->where('denounced_user_id', $request->denounced_user_id);
        }

        if ($request->q) {
            $reports->where(function ($query) use ($request) {
                $query->where('description', 'like', "%{$request->q}%");
            });

            $reports->orWhereHas('user', function($query) use ($request) {
                        $query->where('users.name', 'like', "%{$request->q}%");
                });
        }


        $reports = $reports->paginate(100);
        
        $data = collect(['status' => true]);
        $data = $data->merge($reports);

        return response()->json($data);
    }

    public function store(Request $request)
    {

        request()->validate([
            'denounced_user_id' => 'required',
            'description' => 'required',
            'type' => 'required',
        ]);

        $matchExist = $this->matchModel->matchExist($request->denounced_user_id, $this->user_id);

        if ($matchExist) {
            $this->matchModel->removeMatch($request->denounced_user_id, $this->user_id);
        }

        $dislike = $this->likeModel->firstOrNew([
            'user_id' => $this->user_id,
            'target_user' => $request->denounced_user_id,
            'type' => 'dislike',
        ]);
        $dislike->save();
    
        $request->merge(['user_id' => $this->user_id]);
        $report = $this->reportModel->create($request->all());

        $response = ['status' => true, 'data' => $report];
        return $response;
        
    }

    public function show(Report $report)
    {
        
    }

    public function update($id)
    {
        
    }

}
