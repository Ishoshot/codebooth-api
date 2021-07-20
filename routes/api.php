<?php

namespace App\Http\Controllers;

use App\Models\User;
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
    $user = User::all()->first();
    return response()->json($user->tokens()->first());
});

/* --------------------------- Authentication Routes -------------------------- */
Route::prefix('auth')->group(function () {
    Route::get('/github', [AuthController::class, 'login']);
    Route::get('/github/redirect', [AuthController::class, 'redirect'])->name('redirect');
    Route::get('/github/callback', [AuthController::class, 'callback'])->name('callback');
});
