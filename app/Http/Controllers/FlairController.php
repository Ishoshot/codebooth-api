<?php

namespace App\Http\Controllers;

use App\Models\Flair;
use App\Services\ActivityService;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class FlairController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        try {
            $flairs = Auth::user()->flairs;
            return response()->json(['flairs' => $flairs], 200);
        } catch (Exception $exception) {
            Log::error('Fetch Flairs: Error Encountered: ' . $exception->getMessage());
        }
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        try {
            /* ----------- Validate Incoming Request ---------- */
            $validator = Validator::make($request->all(), [
                'name' => ['bail', 'required', 'unique:flairs,name,{$id},id,deleted_at,NULL', 'min:2'],
            ]);

            if ($validator->fails()) {
                return response()->json(['error' => $validator->errors()], 422);
            }

            $flairs = Auth::user()->flairs();

            if ($flairs->count() >= 5) {
                return response()->json(["flair" => null, "message" => "Maximum number of Flair reached"], 400);
            }

            $flair = $flairs->create([
                "name" => $request->name
            ]);

            $activity = (new ActivityService())->logActivity([
                "title" => "New Flair Created",
                "entity" => "Flair",
                "action" => "Create",
                "description" => "Flair: $flair->name was successfully created"
            ]);

            return response()->json(["flair" => $flair, "activity" => $activity], 201);
        } catch (Exception $exception) {
            Log::error('Create Flair: Error Encountered: ' . $exception->getMessage());
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Flair  $flair
     * @return \Illuminate\Http\Response
     */
    public function show(Flair $flair)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Flair  $flair
     * @return \Illuminate\Http\Response
     */
    public function edit(Flair $flair)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Flair  $flair
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Flair $flair)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Flair  $flair
     * @return \Illuminate\Http\Response
     */
    public function destroy(Flair $flair)
    {
        try {
            $flair->delete();

            $activity = (new ActivityService())->logActivity([
                "title" => "Flair Deleted",
                "entity" => "Flair",
                "action" => "Delete",
                "description" => "Flair: $flair->name was successfully deleted"

            ]);
        } catch (Exception $exception) {
            Log::error('Delete Flair: Error Encountered: ' . $exception->getMessage());
        } finally {
            return response()->json(["flair" => $flair, "activity" => $activity], 200);
        }
    }
}
