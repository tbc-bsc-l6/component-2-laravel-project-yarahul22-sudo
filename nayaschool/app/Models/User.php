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

    /**
     * Role relationship.
     */
    public function role()
    {
        return $this->belongsTo(UserRole::class, 'user_role_id');
    }

    /**
     * Modules this user is enrolled on (as a student).
     */
    public function enrolments()
    {
        return $this->hasMany(Enrolment::class);
    }

    public function enrolledModules()
    {
        return $this->belongsToMany(Module::class, 'enrolments')->withTimestamps();
    }

    /**
     * Modules this user teaches.
     */
    public function teachingModules()
    {
        return $this->hasMany(Module::class, 'teacher_id');
    }

    public function isAdmin(): bool
    {
        return $this->role?->slug === 'admin';
    }

    public function isTeacher(): bool
    {
        return $this->role?->slug === 'teacher';
    }

    public function isStudent(): bool
    {
        return $this->role?->slug === 'student';
    }

    public function isOldStudent(): bool
    {
        return $this->role?->slug === 'old-student';
    }
}
