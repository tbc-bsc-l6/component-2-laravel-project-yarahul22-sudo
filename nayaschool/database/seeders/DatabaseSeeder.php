<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Module;
use App\Models\Enrolment;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Create admin
        $admin = User::create([
            'name' => 'Admin User',
            'email' => 'admin@school.com',
            'password' => Hash::make('password'),
            'role' => 'admin',
            'email_verified_at' => now(),
        ]);

        // Create teachers
        $teacher1 = User::create([
            'name' => 'John Teacher',
            'email' => 'teacher1@school.com',
            'password' => Hash::make('password'),
            'role' => 'teacher',
            'email_verified_at' => now(),
        ]);

        $teacher2 = User::create([
            'name' => 'Jane Teacher',
            'email' => 'teacher2@school.com',
            'password' => Hash::make('password'),
            'role' => 'teacher',
            'email_verified_at' => now(),
        ]);

        // Create students
        $students = [];
        for ($i = 1; $i <= 15; $i++) {
            $students[] = User::create([
                'name' => "Student $i",
                'email' => "student$i@school.com",
                'password' => Hash::make('password'),
                'role' => 'student',
                'email_verified_at' => now(),
            ]);
        }

        // Create modules
        $module1 = Module::create([
            'code' => 'CS101',
            'title' => 'Introduction to Programming',
            'description' => 'Learn the basics of programming with Python',
            'teacher_id' => $teacher1->id,
            'max_students' => 10,
            'is_available' => true,
        ]);

        $module2 = Module::create([
            'code' => 'CS201',
            'title' => 'Web Development',
            'description' => 'Build modern web applications',
            'teacher_id' => $teacher1->id,
            'max_students' => 10,
            'is_available' => true,
        ]);

        $module3 = Module::create([
            'code' => 'CS301',
            'title' => 'Database Systems',
            'description' => 'Learn database design and SQL',
            'teacher_id' => $teacher2->id,
            'max_students' => 10,
            'is_available' => true,
        ]);

        $module4 = Module::create([
            'code' => 'CS401',
            'title' => 'Advanced Algorithms',
            'description' => 'Master algorithm design and analysis',
            'teacher_id' => $teacher2->id,
            'max_students' => 10,
            'is_available' => true,
        ]);

        // Enrol some students
        foreach (array_slice($students, 0, 5) as $student) {
            Enrolment::create([
                'user_id' => $student->id,
                'module_id' => $module1->id,
                'enrolled_at' => now()->subDays(rand(10, 30)),
            ]);
        }

        foreach (array_slice($students, 0, 3) as $student) {
            Enrolment::create([
                'user_id' => $student->id,
                'module_id' => $module2->id,
                'enrolled_at' => now()->subDays(rand(10, 30)),
            ]);
        }

        foreach (array_slice($students, 5, 4) as $student) {
            Enrolment::create([
                'user_id' => $student->id,
                'module_id' => $module3->id,
                'enrolled_at' => now()->subDays(rand(10, 30)),
            ]);
        }

        // Add some completed enrolments with grades
        $completed = Enrolment::create([
            'user_id' => $students[10]->id,
            'module_id' => $module1->id,
            'enrolled_at' => now()->subDays(60),
            'completed_at' => now()->subDays(10),
            'result' => 'pass',
        ]);
    }
}
