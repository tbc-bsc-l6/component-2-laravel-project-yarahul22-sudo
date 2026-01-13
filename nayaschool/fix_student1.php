<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use App\Models\User;

$student = User::where('email', 'student1@school.com')->first();
if ($student) {
    $old_role = $student->role;
    $student->update(['role' => 'student']);
    echo "✓ Student 1 role changed from '$old_role' to 'student'\n";
} else {
    echo "✗ Student 1 not found\n";
}
