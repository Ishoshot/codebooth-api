<?php

namespace App\Http\Controllers;

use App\Models\User;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Laravel\Socialite\Facades\Socialite;

class AuthController extends Controller
{

    /**
     * Returns Auth Confirmation View.
     *
     */
    public function login()
    {
        return view('github.login');
    }


    /**
     * Redirect to Github for Authentication.
     *
     */
    public function redirect()
    {
        return Socialite::driver('github')->redirect();
    }

    /**
     * Handle Github's Callback
     *
     *  Return Sanctum $token
     */
    public function callback()
    {
        try {
            $payload = Socialite::driver('github')->user();

            if ($payload == null || $payload->user == null) {
                return response()->json([
                    'GitHub profile not fully set.. Please update your profile and try again.',
                ]);
            } else {
                $oldUser = User::where('email', $payload->user['email'])->first();
                if ($oldUser !== null) {
                    $oldUser->update([
                        'name' => $payload->user['name'],
                        'email' => $payload->user['email'],
                        'image' => $payload->user['avatar_url'],
                        'github_url' => $payload->user['html_url'],
                        'location' => $payload->user['location'],
                        'company' => $payload->user['company'],
                        'description' => $payload->user['bio'],
                    ]);
                } else {
                    User::firstOrCreate([
                        'github_id' => $payload->user['id'],
                        'name' => $payload->user['name'],
                        'email' => $payload->user['email'],
                        'password' => Hash::make($payload->user['email']),
                        'image' => $payload->user['avatar_url'],
                        'github_url' => $payload->user['html_url'],
                        'location' => $payload->user['location'],
                        'company' => $payload->user['company'],
                        'description' => $payload->user['bio'],
                    ]);
                }

                // Create a Token For the User
                if (Auth::attempt(['email' => $payload->user['email'], 'password' => $payload->user['email']])) {
                    $user = Auth::user();
                    $token = $user->createToken(env("APP_NAME") ?? "CodeBooth");
                    $clientCallback =  "http://localhost:54321/auth/" . $token->plainTextToken;
                    return redirect()->away($clientCallback);
                } else {
                    return response()->json(["error" => "User Not Authorised"], 401);
                }
            }
        } catch (Exception $exception) {
            Log::error(
                'Error Encountered while Authenticating User: ' .
                    $exception->getMessage()
            );
        }
    }


    public function logout()
    {
        Auth::user()->tokens()->delete();

        return response()->json(["Logged Out"], 200);
    }
}
