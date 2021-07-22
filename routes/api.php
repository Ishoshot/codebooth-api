<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
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


/* --------------------------- Authentication Routes -------------------------- */
Route::prefix('auth')->group(function () {
    Route::get('/github', [AuthController::class, 'login']);
    Route::get('/github/redirect', [AuthController::class, 'redirect'])->name('redirect');
    Route::get('/github/callback', [AuthController::class, 'callback'])->name('callback');
});


/* --------------------------- Flair Routes -------------------------- */
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user/flairs', [FlairController::class, 'index']);
    Route::post('user/flair', [FlairController::class, 'store']);
    Route::delete('/user/flair/{flair}', [FlairController::class, 'destroy']);
});

/* --------------------------------- Profile -------------------------------- */
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/profile', [ProfileController::class, 'profile']);
});


/* --------------------------------- Activity -------------------------------- */
Route::middleware('auth:sanctum')->group(function () {
    Route::put('/user/activity/{activity}', [ActivityController::class, 'update']);
});
