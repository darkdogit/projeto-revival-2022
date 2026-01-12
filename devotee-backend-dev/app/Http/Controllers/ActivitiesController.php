<?php

namespace App\Http\Controllers;

use App\Models\Activities;
use App\Models\UserMatch;
use App\Models\User;
use App\Models\Like;
use App\Models\Report;


use Illuminate\Http\Request;

use Carbon\Carbon;

class ActivitiesController extends Controller
{
    

    public function __construct(Activities $activities, User $user, UserMatch $match, Like $like, Report $report)
    {
        $this->activitiesModel = $activities;
        $this->matchModel = $match;
        $this->userModel = $user;
        $this->likeModel = $like;
        $this->reportModel = $report;
        $this->user_id = @auth()->guard('api')->user()->id;
    }

    public function index()
    {
        
    }


    public function statistics(Request $request)
    {
        //ab
        $startOfMonth = Carbon::now()->startOfMonth();

        $month_users = $this->userModel->where('created_at', '>', $startOfMonth)->count();
        $total_users = $this->userModel->count();
        $total_devotee_plus = $this->userModel->where('plan_type', 'premium')->count();


        $month_match = $this->matchModel->where('created_at', '>', $startOfMonth)->count();
        $total_match = $this->matchModel->count();

        $month_likes = $this->likeModel->where('created_at', '>', $startOfMonth)->count();
        $total_likes = $this->likeModel->count();

        $month_reports = $this->reportModel->where('created_at', '>', $startOfMonth)->count();
        $total_reports = $this->reportModel->count();



        $data = array(
            'total_users' => $total_users,
            'month_users' => $month_users,
            'total_matchs' => $total_match, 
            'month_matchs' => $month_match, 
            'total_likes' => $total_likes, 
            'month_likes' => $month_likes, 
            'total_reports' => $total_reports, 
            'month_reports' => $month_reports, 
            'total_devotee_plus' => $total_devotee_plus, 
        );

        $response = ['status' => true, 'data' => $data];
        return $response;

    }

    public function store(Request $request)
    {
        $data = array('user_id' => $this->user_id);
        $response = $this->activitiesModel->create($data);

        $response = ['status' => true, 'data' => $response];
        return $response;

    }

    public function days(Request $request)
    {

        $arrayName = [];



        for ($i=0; $i < 30; $i++) { 

            $startDate = Carbon::now()->subDays($i)->startOfDay();
            $endOfDay  = Carbon::now()->subDays($i)->endOfDay();
            $dateFormat  = Carbon::now()->subDays($i)->format('Y-m-d');

            $count = $this->activitiesModel
            ->distinct('user_id')
            ->whereBetween('created_at', [$startDate, $endOfDay])
            ->count('user_id');

            $data = array(
                'date' => $dateFormat, 
                'count' => $count, 
            );


            array_push($arrayName, $data);

        }


        

        $response = ['status' => true, 'data' => $arrayName];
        return $response;

    }

   
   
}
