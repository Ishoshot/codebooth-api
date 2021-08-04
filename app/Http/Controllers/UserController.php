<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Notifications\UserFollowed;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $users = Cache::rememberForever('users', function () {
            return User::where('id', '!=', Auth::user()->id)->inRandomOrder()->get();
        });
        return response()->json(['users' => $users]);
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
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  User  $user
     * @return \Illuminate\Http\Response
     */
    public function show(User $user)
    {
        $user = User::with(['flairs'])->withCount(['followers', 'follows'])->where('id', '=', $user->id)->first();
        $user['isFollowingUser'] = Auth::user()->isFollowing($user->id);
        return response()->json(["user" => $user], 200);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request)
    {
        $value = $request->value;
        $type = $request->type;

        switch ($type) {
            case 'notify_follow':
                Auth::user()->update([
                    "notify_follow" => $value,
                ]);
                break;

            default:
                # code...
                break;
        }

        return response()->json(["data" => $request->all()], 200);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }

    public function follow(User $user)
    {
        try {
            $follower = auth()->user();
            if ($follower->id == $user->id) {
                return response()->json(["message" => "You can't follow yourself"], 400);
            }
            if (!$follower->isFollowing($user->id)) {
                $follower->follow($user->id);

                // sending a notification
                if ($user->notify_follow == true) {
                    $user->notify(new UserFollowed($follower));
                }

                return response()->json(["message" => "You are now friends with {$user->name}"], 200);
            }
            return response()->json(["message" => "You are already following {$user->name}"], 400);
        } catch (Exception $exception) {
            Log::error(
                'Error Encountered while Following User: ' .
                    $exception->getMessage()
            );
        }
    }

    public function unfollow(User $user)
    {
        try {
            $follower = auth()->user();
            if ($follower->isFollowing($user->id)) {
                $follower->unfollow($user->id);
                return response()->json(["message" => "You are no longer friends with {$user->name}"], 200);
            }
            return response()->json(["message" => "You are not following {$user->name}"], 400);
        } catch (Exception $exception) {
            Log::error(
                'Error Encountered while Unfollowing User: ' .
                    $exception->getMessage()
            );
        }
    }
}
