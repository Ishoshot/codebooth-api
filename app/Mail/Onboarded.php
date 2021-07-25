<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class Onboarded extends Mailable
{
    use Queueable, SerializesModels;

    protected $user;
    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct($user)
    {
        $this->user = $user;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        $name = $this->user->name;
        $user_isVerified = $this->user->is_verified;
        return $this
            ->subject('Welcome to CodeBooth! 🎉')
            ->with([
                'name' => $name,
                'user_isVerified' => $user_isVerified,
            ])->markdown('emails.onboard.onboarded');
    }
}
