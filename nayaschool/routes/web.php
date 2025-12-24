<?php

use App\Models\Enrolment;
use App\Models\Module;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        $user = auth()->user();

        if ($user?->isAdmin()) {
            // Paginate admin modules list for UI (3 per page so pagination shows after 3+ modules)
            $modules = Module::with(['teacher', 'students' => function($query) {
                $query->select('users.id', 'users.name', 'users.email')
                    ->withPivot('id', 'enrolled_at', 'completed_at', 'result');
            }])
            ->withCount(['students' => function($query) {
                // Only count active students (not completed) for capacity display
                $query->whereNull('enrolments.completed_at');
            }])
            ->orderBy('id', 'desc')
            ->paginate(3);

            // Build explicit structure so frontend always receives data + meta + links
            $modulesArr = [
                'data' => $modules->items(),
                'meta' => [
                    'current_page' => $modules->currentPage(),
                    'last_page' => $modules->lastPage(),
                    'per_page' => $modules->perPage(),
                    'total' => $modules->total(),
                ],
                'links' => $modules->toArray()['links'] ?? [],
            ];

            // Get all teachers and students for admin dashboard
            $teachers = \App\Models\User::where('role', 'teacher')
                ->withCount('teachingModules')
                ->orderBy('name')
                ->get();

            $students = \App\Models\User::whereIn('role', ['student', 'old_student'])
                ->orderBy('name')
                ->get();

            return Inertia::render('admin/dashboard', [
                'modules' => $modulesArr,
                'teachers' => $teachers,
                'students' => $students,
            ]);
        }

        if ($user?->isTeacher()) {
            $modules = $user->teachingModules()
                ->with([
                    'students' => function ($query) {
                        $query->select('users.id', 'users.name', 'users.email')
                            ->withPivot('id', 'enrolled_at', 'completed_at', 'result');
                    },
                ])
                ->withCount('students')
                ->orderByDesc('id')
                ->get();

            return Inertia::render('teacher/dashboard', [
                'modules' => $modules,
            ]);
        }

        if ($user?->isStudent() || $user?->isOldStudent()) {
            $currentEnrolments = Enrolment::with('module')
                ->where('user_id', $user->id)
                ->whereNull('completed_at')
                ->get();

            $completedEnrolments = Enrolment::with('module')
                ->where('user_id', $user->id)
                ->whereNotNull('completed_at')
                ->orderByDesc('completed_at')
                ->get();

            $availableModules = [];
            if ($user->isStudent()) {
                // Get all module IDs the user has ever enrolled in (current or completed)
                $allEnrolledIds = Enrolment::where('user_id', $user->id)
                    ->pluck('module_id');
                
                // Get available modules, excluding those already enrolled/completed
                $availableModules = Module::where('is_available', true)
                    ->whereNotIn('id', $allEnrolledIds)
                    ->withCount(['students' => function($query) {
                        // Only count active students (not completed)
                        $query->whereNull('enrolments.completed_at');
                    }])
                    ->get()
                    ->filter(function($module) {
                        // Only show modules that aren't full
                        return $module->students_count < $module->max_students;
                    });
            }

            return Inertia::render('student/dashboard', [
                'currentEnrolments' => $currentEnrolments,
                'completedEnrolments' => $completedEnrolments,
                'availableModules' => $availableModules,
                'canEnrolMore' => $user->isStudent()
                    && $currentEnrolments->count() < 4,
                'isOldStudent' => $user->isOldStudent(),
            ]);
        }

        return Inertia::render('dashboard');
    })->name('dashboard');

    // Admin-only actions
    Route::middleware('role:admin')->prefix('admin')->name('admin.')->group(function () {
        // Teacher management
        Route::post('/teachers', function (\Illuminate\Http\Request $request) {
            $data = $request->validate([
                'name' => ['required', 'string', 'max:255'],
                'email' => ['required', 'email', 'unique:users,email'],
                'password' => ['required', 'string', 'min:8'],
            ]);

            \App\Models\User::create([
                'name' => $data['name'],
                'email' => $data['email'],
                'password' => \Illuminate\Support\Facades\Hash::make($data['password']),
                'role' => 'teacher',
                'email_verified_at' => now(),
            ]);

            return back();
        })->name('teachers.store');

        Route::delete('/teachers/{user}', function (\App\Models\User $user) {
            if ($user->role !== 'teacher') {
                abort(403, 'Can only delete teacher accounts');
            }
            
            // Unassign from modules first
            Module::where('teacher_id', $user->id)->update(['teacher_id' => null]);
            
            $user->delete();
            return back();
        })->name('teachers.destroy');

        // Student management
        Route::patch('/users/{user}/role', function (\Illuminate\Http\Request $request, \App\Models\User $user) {
            $data = $request->validate([
                'role' => ['required', 'in:admin,teacher,student,old_student'],
            ]);

            $user->update(['role' => $data['role']]);
            return back();
        })->name('users.change-role');

        Route::delete('/enrolments/{enrolment}', function (Enrolment $enrolment) {
            try {
                $enrolment->delete();
                
                if (request()->wantsJson()) {
                    return response()->json(['success' => true]);
                }
                return back();
            } catch (\Exception $e) {
                if (request()->wantsJson()) {
                    return response()->json(['message' => 'Failed to delete enrolment: ' . $e->getMessage()], 500);
                }
                return back()->withErrors(['error' => 'Failed to delete enrolment']);
            }
        })->name('enrolments.destroy');

        // Module management
        Route::post('/modules', function (\Illuminate\Http\Request $request) {
            $data = $request->validate([
                'code' => ['required', 'string', 'unique:modules,code'],
                'title' => ['required', 'string'],
                'description' => ['nullable', 'string'],
                'max_students' => ['nullable', 'integer', 'min:1', 'max:50'],
            ]);

            $module = Module::create([
                ...$data,
                'max_students' => $data['max_students'] ?? 10,
            ]);

            if ($request->wantsJson()) {
                return response()->json($module->load('teacher'));
            }

            return back();
        })->name('modules.store');

        Route::patch('/modules/{module}/toggle', function (Module $module) {
            $module->update([
                'is_available' => ! $module->is_available,
            ]);

            return back();
        })->name('modules.toggle');

        Route::patch('/modules/{module}/teacher', function (\Illuminate\Http\Request $request, Module $module) {
            $data = $request->validate([
                'teacher_id' => ['nullable', 'exists:users,id'],
            ]);

            $module->update([
                'teacher_id' => $data['teacher_id'] ?? null,
            ]);

            return back();
        })->name('modules.assign-teacher');

        Route::delete('/modules/{module}', function (Module $module, \Illuminate\Http\Request $request) {
            // allow deletion for admins; return JSON when requested
            $module->delete();

            if ($request->wantsJson()) {
                return response()->json(['deleted' => true]);
            }

            return back();
        })->name('modules.destroy');
    });

    // Student enrolment routes
    Route::middleware('role:student')->group(function () {
        Route::post('/enrol/{module}', function (Module $module) {
            $user = auth()->user();

            // Respect module capacity and availability
            // Only count students who haven't completed the module (completed_at is NULL)
            $activeStudentsCount = $module->students()
                ->whereNull('enrolments.completed_at')
                ->count();
            
            if (! $module->is_available || $activeStudentsCount >= $module->max_students) {
                abort(422, 'Module is full or unavailable.');
            }

            // Max 4 current modules
            $currentCount = Enrolment::where('user_id', $user->id)
                ->whereNull('completed_at')
                ->count();

            if ($currentCount >= 4) {
                abort(422, 'You have reached the maximum of 4 current modules.');
            }

            Enrolment::firstOrCreate(
                [
                    'user_id' => $user->id,
                    'module_id' => $module->id,
                ],
                [
                    'enrolled_at' => now(),
                ]
            );

            return back();
        })->name('modules.enrol');
    });

    // Teacher grading routes
    Route::middleware('role:teacher')->group(function () {
        Route::patch('/enrolments/{enrolment}/result', function (\Illuminate\Http\Request $request, Enrolment $enrolment) {
            $user = auth()->user();

            // Ensure teacher owns the module
            if ($enrolment->module->teacher_id !== $user->id) {
                abort(403);
            }

            $data = $request->validate([
                'result' => ['required', 'in:pass,fail'],
            ]);

            $enrolment->update([
                'result' => $data['result'],
                'completed_at' => now(),
            ]);

            return back();
        })->name('enrolments.result');
    });
});

require __DIR__.'/settings.php';
