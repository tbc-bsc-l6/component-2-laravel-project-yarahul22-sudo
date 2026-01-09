<?php

namespace App\Http\Controllers;

use App\Models\Enrolment;
use App\Models\Module;
use App\Models\User;
use Illuminate\Http\Request;

class AnalyticsController extends Controller
{
    public function adminDashboard()
    {
        $totalModules = Module::count();
        $totalStudents = User::whereIn('role', ['student', 'old_student'])->count();
        $totalTeachers = User::where('role', 'teacher')->count();
        $totalEnrolments = Enrolment::count();

        // Module statistics
        $moduleStats = Module::with('students')
            ->get()
            ->map(function ($module) {
                $enrolments = $module->enrolments();
                $completed = $enrolments->whereNotNull('completed_at')->count();
                $active = $enrolments->whereNull('completed_at')->count();
                $passed = $enrolments->where('result', 'pass')->whereNotNull('completed_at')->count();
                $failed = $enrolments->where('result', 'fail')->whereNotNull('completed_at')->count();
                
                return [
                    'id' => $module->id,
                    'title' => $module->title,
                    'teacher' => $module->teacher?->name ?? 'Unassigned',
                    'active_students' => $active,
                    'completed' => $completed,
                    'passed' => $passed,
                    'failed' => $failed,
                    'pass_rate' => $completed > 0 ? round(($passed / $completed) * 100, 2) : 0,
                ];
            });

        // Teacher performance
        $teacherStats = User::where('role', 'teacher')
            ->with('teachingModules')
            ->get()
            ->map(function ($teacher) {
                $totalEnrolments = Enrolment::whereIn('module_id', $teacher->teachingModules->pluck('id'))->count();
                $completed = Enrolment::whereIn('module_id', $teacher->teachingModules->pluck('id'))
                    ->whereNotNull('completed_at')
                    ->count();
                $passed = Enrolment::whereIn('module_id', $teacher->teachingModules->pluck('id'))
                    ->where('result', 'pass')
                    ->count();
                
                return [
                    'id' => $teacher->id,
                    'name' => $teacher->name,
                    'modules_count' => $teacher->teachingModules->count(),
                    'total_enrollments' => $totalEnrolments,
                    'completed_enrollments' => $completed,
                    'pass_rate' => $totalEnrolments > 0 ? round(($passed / $totalEnrolments) * 100, 2) : 0,
                ];
            });

        // Enrollment trends (last 7 days grouped by date)
        $enrollmentTrends = Enrolment::where('enrolled_at', '>=', now()->subDays(7))
            ->selectRaw('DATE(enrolled_at) as date, COUNT(*) as count')
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->map(fn($item) => [
                'date' => $item->date,
                'enrollments' => $item->count,
            ]);

        // Grade distribution
        $gradeDistribution = [
            'passed' => Enrolment::where('result', 'pass')->count(),
            'failed' => Enrolment::where('result', 'fail')->count(),
            'pending' => Enrolment::whereNull('result')->count(),
        ];

        return response()->json([
            'summary' => [
                'total_modules' => $totalModules,
                'total_students' => $totalStudents,
                'total_teachers' => $totalTeachers,
                'total_enrollments' => $totalEnrolments,
            ],
            'module_stats' => $moduleStats,
            'teacher_stats' => $teacherStats,
            'enrollment_trends' => $enrollmentTrends,
            'grade_distribution' => $gradeDistribution,
        ]);
    }

    public function teacherDashboard(Request $request)
    {
        $teacher = $request->user();
        
        if ($teacher->role !== 'teacher') {
            abort(403);
        }

        $modules = $teacher->teachingModules;
        $moduleIds = $modules->pluck('id');

        // Module statistics
        $moduleStats = $modules->map(function ($module) {
            $enrolments = $module->enrolments();
            $total = $enrolments->count();
            $active = $enrolments->whereNull('completed_at')->count();
            $completed = $enrolments->whereNotNull('completed_at')->count();
            $passed = $enrolments->where('result', 'pass')->whereNotNull('completed_at')->count();
            $failed = $enrolments->where('result', 'fail')->whereNotNull('completed_at')->count();
            
            return [
                'id' => $module->id,
                'title' => $module->title,
                'code' => $module->code,
                'total_students' => $total,
                'active_students' => $active,
                'completed' => $completed,
                'passed' => $passed,
                'failed' => $failed,
                'pass_rate' => $completed > 0 ? round(($passed / $completed) * 100, 2) : 0,
            ];
        });

        // Overall statistics
        $totalEnrolments = Enrolment::whereIn('module_id', $moduleIds)->count();
        $completed = Enrolment::whereIn('module_id', $moduleIds)->whereNotNull('completed_at')->count();
        $passed = Enrolment::whereIn('module_id', $moduleIds)->where('result', 'pass')->count();

        // Student performance data
        $studentPerformance = Enrolment::whereIn('module_id', $moduleIds)
            ->with('user')
            ->get()
            ->groupBy('user_id')
            ->map(function ($enrolments) {
                $user = $enrolments->first()->user;
                $completed = $enrolments->whereNotNull('completed_at')->count();
                $passed = $enrolments->where('result', 'pass')->count();
                
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'enrolled_modules' => $enrolments->count(),
                    'completed' => $completed,
                    'passed' => $passed,
                    'pass_rate' => $completed > 0 ? round(($passed / $completed) * 100, 2) : 0,
                ];
            })
            ->values();

        // Grade distribution
        $gradeDistribution = [
            'passed' => Enrolment::whereIn('module_id', $moduleIds)->where('result', 'pass')->count(),
            'failed' => Enrolment::whereIn('module_id', $moduleIds)->where('result', 'fail')->count(),
            'pending' => Enrolment::whereIn('module_id', $moduleIds)->whereNull('result')->count(),
        ];

        return response()->json([
            'summary' => [
                'total_modules' => $modules->count(),
                'total_enrollments' => $totalEnrolments,
                'completed_enrollments' => $completed,
                'overall_pass_rate' => $totalEnrolments > 0 ? round(($passed / $totalEnrolments) * 100, 2) : 0,
            ],
            'module_stats' => $moduleStats,
            'student_performance' => $studentPerformance,
            'grade_distribution' => $gradeDistribution,
        ]);
    }

    public function studentDashboard(Request $request)
    {
        $student = $request->user();

        $enrolments = $student->enrolments()->with('module')->get();
        $completed = $enrolments->whereNotNull('completed_at');
        $active = $enrolments->whereNull('completed_at');

        // Module performance
        $modulePerformance = $enrolments->map(function ($enrolment) {
            return [
                'id' => $enrolment->module->id,
                'title' => $enrolment->module->title,
                'code' => $enrolment->module->code,
                'status' => $enrolment->completed_at ? 'completed' : 'active',
                'enrolled_at' => $enrolment->enrolled_at->format('Y-m-d'),
                'result' => $enrolment->result ?? 'pending',
                'completed_at' => $enrolment->completed_at?->format('Y-m-d'),
            ];
        });

        // Grade summary
        $grades = $enrolments->whereNotNull('result');
        $passed = $grades->where('result', 'pass')->count();
        $failed = $grades->where('result', 'fail')->count();

        return response()->json([
            'summary' => [
                'total_enrolled' => $enrolments->count(),
                'active_modules' => $active->count(),
                'completed_modules' => $completed->count(),
                'passed' => $passed,
                'failed' => $failed,
                'pass_rate' => $grades->count() > 0 ? round(($passed / $grades->count()) * 100, 2) : 0,
            ],
            'modules' => $modulePerformance,
            'grade_distribution' => [
                'passed' => $passed,
                'failed' => $failed,
                'pending' => $enrolments->whereNull('result')->count(),
            ],
        ]);
    }
}
