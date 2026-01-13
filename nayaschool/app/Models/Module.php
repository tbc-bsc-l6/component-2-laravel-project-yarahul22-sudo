<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Module extends Model
{
    use HasFactory;

    protected $fillable = [
        'code',
        'title',
        'description',
        'teacher_id',
        'max_students',
        'is_available',
    ];

    protected $casts = [
        'is_available' => 'boolean',
        'max_students' => 'integer',
    ];

    public function teacher()
    {
        return $this->belongsTo(User::class, 'teacher_id');
    }

    public function enrolments()
    {
        return $this->hasMany(Enrolment::class);
    }

    public function students()
    {
        return $this->belongsToMany(User::class, 'enrolments')
            ->withTimestamps()
            ->withPivot(['enrolled_at', 'completed_at', 'result']);
    }
}
