<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;


/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});

Route::middleware('auth:sanctum')->get('/profile', function (Request $request) {
    return response()->json($request->user());
});

/* --------------------------- Authentication Routes -------------------------- */
Route::prefix('auth')->group(function () {
    Route::get('/redirect', [AuthController::class, 'redirect']);
    Route::get('/callback', [AuthController::class, 'callback']);
});
