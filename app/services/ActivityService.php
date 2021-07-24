<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Auth;

class ActivityService
{
    public function logActivity(array $data)
    {
        if (!$data) {
            throw new Exception("Log Parameters not Found", 1);
        }

        extract($data);

        $activity = Auth::user()->activities()->create([
            "title" => $title,
            "entity" => $entity,
            "action" => $action,
            "description" => $description,
            "read_at" => false
        ]);

        return $activity;
    }
}
