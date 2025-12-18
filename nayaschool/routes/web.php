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
            $modules = Module::with('teacher')->orderBy('id', 'desc')->paginate(3);

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

            return Inertia::render('admin/dashboard', [
                'modules' => $modulesArr,
            ]);
        }

        if ($user?->isTeacher()) {
            $modules = $user->teachingModules()->withCount('students')->get();

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
                $enrolledModuleIds = $currentEnrolments->pluck('module_id');
                $availableModules = Module::where('is_available', true)
                    ->whereNotIn('id', $enrolledModuleIds)
                    ->withCount('students')
                    ->get();
            }

            return Inertia::render('student/dashboard', [
                'currentEnrolments' => $currentEnrolments,
                'completedEnrolments' => $completedEnrolments,
                'availableModules' => $availableModules,
                'canEnrolMore' => $user->isStudent()
                    && $currentEnrolments->count() < 4,
            ]);
        }

        return Inertia::render('dashboard');
    })->name('dashboard');

    // Admin-only actions
    Route::middleware('role:admin')->prefix('admin')->name('admin.')->group(function () {
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
            if (! $module->is_available || $module->students()->count() >= $module->max_students) {
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
