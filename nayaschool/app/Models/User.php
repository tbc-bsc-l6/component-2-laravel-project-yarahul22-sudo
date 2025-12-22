<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Fortify\TwoFactorAuthenticatable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, TwoFactorAuthenticatable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'two_factor_secret',
        'two_factor_recovery_codes',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'two_factor_confirmed_at' => 'datetime',
        ];
    }

    // Role methods
    public function isAdmin(): bool
    {
        return $this->role_id === 1 || $this->role === 'admin';
    }

    public function isTeacher(): bool
    {
        return $this->role_id === 2 || $this->role === 'teacher';
    }

    public function isStudent(): bool
    {
        return $this->role_id === 3 || $this->role === 'student';
    }

    public function isOldStudent(): bool
    {
        return $this->role_id === 4 || $this->role === 'old_student';
    }

    // Relationships
    public function teachingModules()
    {
        return $this->hasMany(Module::class, 'teacher_id');
    }

    public function enrolments()
    {
        return $this->hasMany(Enrolment::class);
    }

    public function modules()
    {
        return $this->belongsToMany(Module::class, 'enrolments')
            ->withTimestamps()
            ->withPivot(['enrolled_at', 'completed_at', 'result']);
    }
}
