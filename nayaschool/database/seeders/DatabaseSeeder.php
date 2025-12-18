<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\UserRole;
use App\Models\Module;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Core roles
        $roles = collect([
            ['name' => 'Administrator', 'slug' => 'admin'],
            ['name' => 'Teacher', 'slug' => 'teacher'],
            ['name' => 'Student', 'slug' => 'student'],
            ['name' => 'Old Student', 'slug' => 'old-student'],
        ])->mapWithKeys(function (array $data) {
            $role = UserRole::firstOrCreate(
                ['slug' => $data['slug']],
                ['name' => $data['name']]
            );

            return [$data['slug'] => $role];
        });

        // Admin user
        $admin = User::firstOrCreate(
            ['email' => 'admin@example.com'],
            [
                'name' => 'Admin User',
                'password' => 'password',
                'email_verified_at' => now(),
                'user_role_id' => $roles['admin']->id,
            ]
        );

        // Example teacher and students
        $teacher = User::firstOrCreate(
            ['email' => 'teacher@example.com'],
            [
                'name' => 'Teacher One',
                'password' => 'password',
                'email_verified_at' => now(),
                'user_role_id' => $roles['teacher']->id,
            ]
        );

        $student = User::firstOrCreate(
            ['email' => 'student@example.com'],
            [
                'name' => 'Student One',
                'password' => 'password',
                'email_verified_at' => now(),
                'user_role_id' => $roles['student']->id,
            ]
        );

        // Example modules
        $modules = [
            ['code' => 'WEB101', 'title' => 'Web Development Basics'],
            ['code' => 'PHP201', 'title' => 'Intermediate PHP'],
            ['code' => 'LAR301', 'title' => 'Advanced Laravel'],
        ];

        foreach ($modules as $data) {
            Module::firstOrCreate(
                ['code' => $data['code']],
                [
                    'title' => $data['title'],
                    'description' => $data['title'] . ' module',
                    'teacher_id' => $teacher->id,
                ]
            );
        }
    }
}
