import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import type { BreadcrumbItem, SharedData } from '@/types';
import { Head, useForm, usePage } from '@inertiajs/react';
import {
    AlertTriangle,
    BarChart2,
    BookOpen,
    CheckCircle2,
    Clock3,
    Plus,
    XCircle,
} from 'lucide-react';

type Module = {
    id: number;
    code: string;
    title: string;
    students_count?: number;
};

type Enrolment = {
    id: number;
    module_id: number;
    enrolled_at: string | null;
    completed_at: string | null;
    result: 'pass' | 'fail' | null;
    module: Module;
};

type PageProps = SharedData & {
    currentEnrolments: Enrolment[];
    completedEnrolments: Enrolment[];
    availableModules: Module[];
    canEnrolMore: boolean;
    isOldStudent: boolean;
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
    {
        title: 'Student',
    },
];

export default function StudentDashboard() {
    try {
        const { props } = usePage<PageProps>();
        const {
            currentEnrolments = [],
            completedEnrolments = [],
            availableModules = [],
            canEnrolMore = false,
            isOldStudent = false,
            auth,
        } = props || {};

        if (!auth?.user) {
            return <div className="p-8">Loading...</div>;
        }

        const { post } = useForm({});

    const scrollToSection = (id: string) => {
        const el = document.getElementById(id);
        el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    const enrol = (moduleId: number) => {
        // Use direct URL instead of global `route()` helper
        post(`/enrol/${moduleId}`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Student Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl bg-gradient-to-br from-slate-50 via-white to-slate-100 p-6 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900">
                {/* Hero / Summary */}
                <div className="rounded-xl border border-slate-200 bg-white/90 p-5 shadow-md backdrop-blur dark:border-slate-800 dark:bg-slate-900/70">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div>
                            <p className="text-sm text-muted-foreground">Welcome back</p>
                            <h1 className="text-2xl font-semibold">{auth.user.name}</h1>
                            <p className="text-sm text-muted-foreground">{isOldStudent ? 'Old Student (View Only)' : 'Student dashboard'}</p>
                        </div>
                        <div className="flex flex-wrap gap-2 text-xs font-medium">
                            <Badge variant="secondary" className="gap-1">
                                <BookOpen className="h-3 w-3" />
                                Current: {currentEnrolments.length}
                            </Badge>
                            <Badge variant="outline" className="gap-1">
                                <CheckCircle2 className="h-3 w-3" />
                                Completed: {completedEnrolments.length}
                            </Badge>
                            <Badge variant="outline" className="gap-1">
                                <Plus className="h-3 w-3" />
                                Available: {availableModules.length}
                            </Badge>
                            {!canEnrolMore && (
                                <Badge variant="destructive" className="gap-1">
                                    <AlertTriangle className="h-3 w-3" />
                                    Limit reached (4)
                                </Badge>
                            )}
                        </div>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                        {!isOldStudent && (
                            <Button size="sm" className="gap-2" onClick={() => scrollToSection('student-available')}>
                                <Plus className="h-4 w-4" /> Enrol now
                            </Button>
                        )}
                        {!isOldStudent && (
                            <Button size="sm" variant="outline" onClick={() => scrollToSection('student-current')}>
                                <BookOpen className="mr-2 h-4 w-4" /> Current modules
                            </Button>
                        )}
                        <Button size="sm" variant="outline" onClick={() => scrollToSection('student-completed')}>
                            <CheckCircle2 className="mr-2 h-4 w-4" /> Completed history
                        </Button>
                    </div>
                </div>

                {/* Quick Stats */}
                {!isOldStudent && (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <Card className="overflow-hidden border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-white shadow-md dark:border-blue-900 dark:from-blue-950 dark:to-slate-900">
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="rounded-lg bg-blue-500 p-2.5 shadow-lg">
                                    <BookOpen className="h-5 w-5 text-white" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold">{currentEnrolments.length}</p>
                                    <p className="text-xs text-muted-foreground">Current Modules</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="overflow-hidden border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 to-white shadow-md dark:border-emerald-900 dark:from-emerald-950 dark:to-slate-900">
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="rounded-lg bg-emerald-500 p-2.5 shadow-lg">
                                    <CheckCircle2 className="h-5 w-5 text-white" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold">{completedEnrolments.length}</p>
                                    <p className="text-xs text-muted-foreground">Completed</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="overflow-hidden border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-white shadow-md dark:border-purple-900 dark:from-purple-950 dark:to-slate-900">
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="rounded-lg bg-purple-500 p-2.5 shadow-lg">
                                    <Plus className="h-5 w-5 text-white" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold">{availableModules.length}</p>
                                    <p className="text-xs text-muted-foreground">Available</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className={`overflow-hidden border-2 shadow-md ${
                        canEnrolMore 
                            ? 'border-green-200 bg-gradient-to-br from-green-50 to-white dark:border-green-900 dark:from-green-950 dark:to-slate-900' 
                            : 'border-amber-200 bg-gradient-to-br from-amber-50 to-white dark:border-amber-900 dark:from-amber-950 dark:to-slate-900'
                    }`}>
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                                <div className={`rounded-lg p-2.5 shadow-lg ${
                                    canEnrolMore ? 'bg-green-500' : 'bg-amber-500'
                                }`}>
                                    <BarChart2 className="h-5 w-5 text-white" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold">{4 - currentEnrolments.length}</p>
                                    <p className="text-xs text-muted-foreground">Slots Left</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
                )}

                <div className="grid gap-4 lg:grid-cols-2">
                    {/* Current modules - only show for active students */}
                    {!isOldStudent && (
                    <section id="student-current" className="space-y-3 rounded-xl border border-slate-200 bg-white/90 p-4 shadow-md backdrop-blur dark:border-slate-800 dark:bg-slate-900/70">
                        <div className="flex items-center gap-2">
                            <div className="rounded-lg bg-primary/10 p-2">
                                <BookOpen className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <h2 className="text-lg font-semibold">Current Modules</h2>
                                <p className="text-sm text-muted-foreground">Max 4 concurrent enrolments</p>
                            </div>
                        </div>
                        <div className="space-y-3">
                            {currentEnrolments.map((e) => (
                                <div key={e.id} className="rounded-lg border border-slate-200 bg-slate-50/80 px-3 py-3 shadow-sm hover:border-primary/30 hover:shadow dark:border-slate-800 dark:bg-slate-900/50">
                                    <div className="flex items-center justify-between gap-2">
                                        <div>
                                            <p className="text-sm font-semibold">{e.module.code} — {e.module.title}</p>
                                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                                                <Clock3 className="h-3 w-3" />
            Enrolled {e.enrolled_at ? new Date(e.enrolled_at).toLocaleDateString() : '—'}
                                            </p>
                                        </div>
                                        <Badge variant="secondary" className="bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-100">In progress</Badge>
                                    </div>
                                </div>
                            ))}
                            {currentEnrolments.length === 0 && (
                                <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50/80 p-6 text-center text-sm text-muted-foreground dark:border-slate-800 dark:bg-slate-900/50">
                                    You are not enrolled in any modules yet.
                                </div>
                            )}
                        </div>
                    </section>
                    )}

                    {/* Completed modules */}
                    <section id="student-completed" className={`space-y-3 rounded-xl border border-slate-200 bg-white/90 p-4 shadow-md backdrop-blur dark:border-slate-800 dark:bg-slate-900/70 ${isOldStudent ? 'lg:col-span-2' : ''}`}>
                        <div className="flex items-center gap-2">
                            <div className="rounded-lg bg-emerald-500/10 p-2">
                                <BarChart2 className="h-5 w-5 text-emerald-600" />
                            </div>
                            <div>
                                <h2 className="text-lg font-semibold">Completed Modules</h2>
                                <p className="text-sm text-muted-foreground">Pass/Fail history with dates</p>
                            </div>
                        </div>
                        <div className="space-y-3">
                            {completedEnrolments.map((e) => (
                                <div key={e.id} className="rounded-lg border border-slate-200 bg-slate-50/80 px-3 py-3 shadow-sm hover:border-primary/30 hover:shadow dark:border-slate-800 dark:bg-slate-900/50">
                                    <div className="flex items-start justify-between gap-2">
                                        <div>
                                            <p className="text-sm font-semibold">{e.module.code} — {e.module.title}</p>
                                            <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                                                <Clock3 className="h-3 w-3" />
                                                Completed {e.completed_at ? new Date(e.completed_at).toLocaleDateString() : '—'}
                                            </div>
                                        </div>
                                        <Badge
                                            variant={e.result === 'pass' ? 'default' : 'destructive'}
                                            className="gap-1"
                                        >
                                            {e.result === 'pass' ? (
                                                <CheckCircle2 className="h-3 w-3" />
                                            ) : (
                                                <XCircle className="h-3 w-3" />
                                            )}
                                            {e.result?.toUpperCase()}
                                        </Badge>
                                    </div>
                                </div>
                            ))}
                            {completedEnrolments.length === 0 && (
                                <div className="rounded-lg border border-dashed bg-muted/30 p-6 text-center text-sm text-muted-foreground">
                                    No completed modules yet.
                                </div>
                            )}
                        </div>
                    </section>
                </div>

                {/* Available modules - only show for active students */}
                {!isOldStudent && (
                <section id="student-available" className="space-y-3 rounded-xl border bg-card p-4 shadow-sm">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                            <div className="rounded-lg bg-blue-500/10 p-2">
                                <Plus className="h-5 w-5 text-blue-500" />
                            </div>
                            <div>
                                <h2 className="text-lg font-semibold">Available Modules</h2>
                                <p className="text-sm text-muted-foreground">Enrol until you reach 4 active modules</p>
                            </div>
                        </div>
                        {!canEnrolMore && (
                            <Badge variant="destructive" className="gap-1">
                                <AlertTriangle className="h-3 w-3" />
                                Limit reached
                            </Badge>
                        )}
                    </div>

                    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                        {availableModules.map((m) => (
                            <div key={m.id} className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-white/90 p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900/70">
                                <div className="flex items-start justify-between gap-2">
                                    <div className="flex-1">
                                        <p className="text-sm font-semibold">{m.code} — {m.title}</p>
                                        <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                                            <span>{m.students_count ?? 0}/10 enrolled</span>
                                            {(m.students_count ?? 0) >= 8 && (
                                                <Badge variant="outline" className="gap-1 text-xs">
                                                    <AlertTriangle className="h-3 w-3" />
                                                    Almost full
                                                </Badge>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <Button
                                    size="sm"
                                    className="w-full gap-2"
                                    onClick={() => enrol(m.id)}
                                    disabled={!canEnrolMore}
                                >
                                    <Plus className="h-4 w-4" />
                                    Enrol
                                </Button>
                            </div>
                        ))}
                        {availableModules.length === 0 && (
                            <div className="col-span-full rounded-lg border border-dashed border-slate-200 bg-slate-50/80 p-6 text-center text-sm text-muted-foreground dark:border-slate-800 dark:bg-slate-900/50">
                                No additional modules available to enrol.
                            </div>
                        )}
                    </div>
                </section>
                )}
            </div>
        </AppLayout>
        );
    } catch (error) {
        console.error('Student Dashboard Error:', error);
        return (
            <div className="flex min-h-screen items-center justify-center p-8">
                <div className="rounded-lg border border-red-300 bg-red-50 p-6 text-red-800">
                    <h2 className="mb-2 text-lg font-semibold">Dashboard Error</h2>
                    <p className="text-sm">{String(error)}</p>
                </div>
            </div>
        );
    }
}
