import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import type { BreadcrumbItem, SharedData } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import {
    BookOpen,
    CheckCircle2,
    Clock3,
    Users,
    XCircle,
} from 'lucide-react';

type Student = {
    id: number;
    name: string;
    email: string;
    pivot?: {
        id: number;
        enrolled_at?: string | null;
        completed_at?: string | null;
        result?: 'pass' | 'fail' | null;
    };
};

type Module = {
    id: number;
    code: string;
    title: string;
    students_count: number;
    students?: Student[];
};

type PageProps = SharedData & {
    modules: Module[];
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
    {
        title: 'Teacher',
    },
];

export default function TeacherDashboard() {
    const { props } = usePage<PageProps>();
    const { modules, auth } = props;

    const scrollToSection = (id: string) => {
        const el = document.getElementById(id);
        el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    const markResult = async (enrolmentId: number, result: 'pass' | 'fail') => {
        try {
            const token = document
                .querySelector('meta[name="csrf-token"]')
                ?.getAttribute('content');

            if (!token) {
                alert('Missing CSRF token. Please refresh the page and try again.');
                return;
            }

            const url = `/enrolments/${enrolmentId}/result`;

            const res = await fetch(url, {
                method: 'PATCH',
                headers: {
                    'X-CSRF-TOKEN': token,
                    'X-Requested-With': 'XMLHttpRequest',
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                credentials: 'same-origin',
                body: JSON.stringify({ result }),
            });

            const responseData = await res.json().catch(() => null);

            if (!res.ok) {
                const message = responseData?.message || `HTTP ${res.status}: Failed to update result`;
                alert(message);
                return;
            }

            // Success - reload to see updated data
            window.location.reload();
        } catch (error) {
            console.error('Error marking result:', error);
            alert('An error occurred while marking the result. Please try again.');
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Teacher Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl bg-gradient-to-br from-slate-50 via-white to-slate-100 p-6 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900">
                <div className="rounded-xl border-2 border-blue-200/50 bg-white/95 backdrop-blur-sm p-6 shadow-2xl shadow-blue-500/10 dark:border-blue-800/50 dark:bg-slate-900/95 dark:shadow-blue-500/20 hover:shadow-blue-500/20 transition-all duration-500 animate-in fade-in slide-in-from-top-4 duration-700">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-muted-foreground">Welcome back</p>
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-indigo-400">{auth.user.name}</h1>
                            <p className="text-sm font-medium text-muted-foreground mt-1">Teacher Dashboard</p>
                        </div>
                        <Badge variant="secondary" className="gap-1.5 px-4 py-2 bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-950 dark:to-indigo-950 border-blue-300 dark:border-blue-800">
                            <BookOpen className="h-4 w-4" />
                            Assigned modules: {modules.length}
                        </Badge>
                    </div>
                    <div className="mt-5 flex flex-wrap gap-2">
                        <Button size="sm" className="gap-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300" onClick={() => scrollToSection('teacher-modules')}>
                            <Users className="h-4 w-4" /> Grade now
                        </Button>
                        <Button size="sm" variant="outline" className="hover:bg-blue-50 hover:border-blue-300 dark:hover:bg-blue-950 transition-all duration-300" onClick={() => window.location.reload()}>
                            <Clock3 className="mr-2 h-4 w-4" /> Refresh
                        </Button>
                    </div>
                </div>

                {/* Quick Stats */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <Card className="overflow-hidden border-2 border-blue-300/50 bg-gradient-to-br from-blue-50 via-white to-blue-50/50 shadow-xl shadow-blue-500/10 dark:border-blue-800/50 dark:from-blue-950/50 dark:to-slate-900 dark:shadow-blue-500/20 hover:shadow-2xl hover:shadow-blue-500/20 hover:scale-[1.02] transition-all duration-500 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <CardContent className="p-5">
                            <div className="flex items-center gap-3">
                                <div className="rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 p-3 shadow-lg">
                                    <BookOpen className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-indigo-400">{modules.length}</p>
                                    <p className="text-sm font-medium text-muted-foreground">Assigned Modules</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="overflow-hidden border-2 border-emerald-300/50 bg-gradient-to-br from-emerald-50 via-white to-emerald-50/50 shadow-xl shadow-emerald-500/10 dark:border-emerald-800/50 dark:from-emerald-950/50 dark:to-slate-900 dark:shadow-emerald-500/20 hover:shadow-2xl hover:shadow-emerald-500/20 hover:scale-[1.02] transition-all duration-500 animate-in fade-in slide-in-from-bottom-4 duration-700 animation-delay-2000">
                        <CardContent className="p-5">
                            <div className="flex items-center gap-3">
                                <div className="rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 p-3 shadow-lg">
                                    <Users className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <p className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent dark:from-emerald-400 dark:to-teal-400">
                                        {modules.reduce((sum, m) => sum + (m.students?.length || 0), 0)}
                                    </p>
                                    <p className="text-sm font-medium text-muted-foreground">Total Students</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="overflow-hidden border-2 border-purple-300/50 bg-gradient-to-br from-purple-50 via-white to-purple-50/50 shadow-xl shadow-purple-500/10 dark:border-purple-800/50 dark:from-purple-950/50 dark:to-slate-900 dark:shadow-purple-500/20 hover:shadow-2xl hover:shadow-purple-500/20 hover:scale-[1.02] transition-all duration-500 animate-in fade-in slide-in-from-bottom-4 duration-900 animation-delay-4000">
                        <CardContent className="p-5">
                            <div className="flex items-center gap-3">
                                <div className="rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 p-3 shadow-lg">
                                    <CheckCircle2 className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <p className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent dark:from-purple-400 dark:to-pink-400">
                                        {modules.reduce((sum, m) => sum + (m.students?.filter(s => s.pivot?.result).length || 0), 0)}
                                    </p>
                                    <p className="text-sm font-medium text-muted-foreground">Graded</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div id="teacher-modules" className="grid grid-cols-1 gap-4">
                    <section className="space-y-4">
                        <div className="flex items-center gap-2">
                            <div className="rounded-lg bg-primary/10 p-2">
                                <Users className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold">My Modules</h2>
                                <p className="text-sm text-muted-foreground">
                                    Review students and record pass/fail results
                                </p>
                            </div>
                        </div>

                        {modules.length === 0 && (
                            <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50/80 p-10 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900/50">
                                <BookOpen className="mx-auto h-10 w-10 text-muted-foreground/60" />
                                <p className="mt-2 text-sm text-muted-foreground">
                                    No modules assigned to you yet.
                                </p>
                            </div>
                        )}

                        <div className="grid gap-4 md:grid-cols-2">
                            {modules.map((m) => (
                                <Card key={m.id} className="overflow-hidden border border-slate-200 bg-white/90 shadow-md backdrop-blur transition hover:-translate-y-0.5 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900/70">
                                    <CardHeader className="border-b border-slate-200 bg-gradient-to-r from-white via-slate-50 to-slate-100 dark:border-slate-800 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900">
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="flex items-center gap-3">
                                                <div className="rounded-lg bg-primary/10 p-2">
                                                    <BookOpen className="h-5 w-5 text-primary" />
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <Badge variant="outline" className="font-mono text-xs">
                                                            {m.code}
                                                        </Badge>
                                                        <CardTitle className="text-lg">{m.title}</CardTitle>
                                                    </div>
                                                    <p className="mt-1 text-xs text-muted-foreground">
                                                        {m.students_count} enrolled student{m.students_count === 1 ? '' : 's'}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-3 pt-4">
                                        {m.students && m.students.length > 0 ? (
                                            m.students.map((student) => (
                                                <div
                                                    key={student.id}
                                                    className="flex items-start justify-between rounded-lg border border-slate-200 bg-slate-50/80 px-3 py-3 shadow-sm hover:border-primary/30 hover:shadow dark:border-slate-800 dark:bg-slate-900/50"
                                                >
                                                    <div>
                                                        <p className="text-sm font-semibold">{student.name}</p>
                                                        <p className="text-xs text-muted-foreground">{student.email}</p>
                                                        <div className="mt-2 flex flex-wrap gap-2 text-xs text-muted-foreground">
                                                            <div className="flex items-center gap-1">
                                                                <Clock3 className="h-3 w-3" />
                                                                Enrolled: {student.pivot?.enrolled_at ? new Date(student.pivot.enrolled_at).toLocaleDateString() : '—'}
                                                            </div>
                                                            <div className="flex items-center gap-1">
                                                                <CheckCircle2 className="h-3 w-3" />
                                                                Completed: {student.pivot?.completed_at ? new Date(student.pivot.completed_at).toLocaleDateString() : 'Not set'}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-col items-end gap-2">
                                                        {student.pivot?.result && (
                                                            <Badge
                                                                variant={student.pivot.result === 'pass' ? 'default' : 'destructive'}
                                                                className="gap-1 text-xs"
                                                            >
                                                                {student.pivot.result === 'pass' ? (
                                                                    <CheckCircle2 className="h-3 w-3" />
                                                                ) : (
                                                                    <XCircle className="h-3 w-3" />
                                                                )}
                                                                {student.pivot.result.toUpperCase()}
                                                            </Badge>
                                                        )}
                                                        <div className="flex items-center gap-2">
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                className="h-8 gap-1"
                                                                onClick={() => student.pivot?.id && markResult(student.pivot.id, 'pass')}
                                                            >
                                                                <CheckCircle2 className="h-3 w-3" />
                                                                Pass
                                                            </Button>
                                                            <Button
                                                                size="sm"
                                                                variant="ghost"
                                                                className="h-8 gap-1 text-destructive hover:bg-destructive/10 hover:text-destructive"
                                                                onClick={() => student.pivot?.id && markResult(student.pivot.id, 'fail')}
                                                            >
                                                                <XCircle className="h-3 w-3" />
                                                                Fail
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50/80 p-6 text-center text-sm text-muted-foreground dark:border-slate-800 dark:bg-slate-900/50">
                                                No students enrolled yet.
                                            </div>
                                        )}
                                    </CardContent>
                                    <CardFooter className="border-t border-slate-200 bg-slate-50/60 py-3 dark:border-slate-800 dark:bg-slate-900/40">
                                        <p className="text-xs text-muted-foreground">
                                            Mark pass/fail to timestamp completion for each student.
                                        </p>
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                    </section>
                </div>
            </div>
        </AppLayout>
    );
}
