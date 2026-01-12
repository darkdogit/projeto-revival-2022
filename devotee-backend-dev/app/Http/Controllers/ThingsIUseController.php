<?php

namespace App\Http\Controllers;

use App\Models\ThingsIUse;
use Illuminate\Http\Request;

class ThingsIUseController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $things = ThingsIUse::query();

        if ($request->q) {
            $things->where(function ($query) use ($request) {
                $query->where('name', 'like', "%{$request->q}%");
                $query->orWhere('name_en', 'like', "%{$request->q}%");
            });
        }

        if($request->orderBy) {
            $things->orderBy($request->orderBy, $request->orderByDirection);
        }

        $things = $things->paginate(100);

        $data = collect(['status' => true]);
        $data = $data->merge($things);

        return response()->json($data);


    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        request()->validate([
            'name' => 'required',
            'name_en' => 'required'
        ]);

        $thing = ThingsIUse::create($request->all());
        return ['status' => true, 'data' => $thing];
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\ThingsIUse  $thingsIUse
     * @return \Illuminate\Http\Response
     */
    public function show(ThingsIUse $thingsIUse)
    {

    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\ThingsIUse  $thingsIUse
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, ThingsIUse $thingsIUse)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\ThingsIUse  $thingsIUse
     * @return \Illuminate\Http\Response
     */
    public function destroy(ThingsIUse $thingsIUse)
    {
        //
    }
}
