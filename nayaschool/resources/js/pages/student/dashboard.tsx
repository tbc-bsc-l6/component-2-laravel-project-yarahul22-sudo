import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import type { BreadcrumbItem, SharedData } from '@/types';
import { Head, useForm, usePage } from '@inertiajs/react';

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
    const { props } = usePage<PageProps>();
    const {
        currentEnrolments,
        completedEnrolments,
        availableModules,
        canEnrolMore,
        auth,
    } = props;

    const { post } = useForm({});

    const enrol = (moduleId: number) => {
        // Use direct URL instead of global `route()` helper
        post(`/enrol/${moduleId}`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Student Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="mb-2 flex items-center justify-between text-sm text-muted-foreground">
                    <span>
                        Signed in as{' '}
                        <span className="font-semibold text-foreground">
                            {auth.user.name}
                        </span>{' '}
                        ({auth.user.role?.name ?? 'Student'})
                    </span>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                    <section className="rounded-xl border border-sidebar-border/70 bg-background p-4 shadow-sm dark:border-sidebar-border">
                        <h2 className="mb-3 text-lg font-semibold">
                            Current Modules
                        </h2>
                        <div className="space-y-2 text-sm">
                            {currentEnrolments.map((e) => (
                                <div
                                    key={e.id}
                                    className="rounded-md border px-3 py-2"
                                >
                                    <div className="font-medium">
                                        {e.module.code} — {e.module.title}
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                        Enrolled:{' '}
                                        {e.enrolled_at
                                            ? new Date(
                                                  e.enrolled_at,
                                              ).toLocaleDateString()
                                            : '—'}
                                    </div>
                                </div>
                            ))}
                            {currentEnrolments.length === 0 && (
                                <p className="text-sm text-muted-foreground">
                                    You are not currently enrolled on any
                                    modules.
                                </p>
                            )}
                        </div>
                    </section>

                    <section className="rounded-xl border border-sidebar-border/70 bg-background p-4 shadow-sm dark:border-sidebar-border">
                        <h2 className="mb-3 text-lg font-semibold">
                            Completed Modules
                        </h2>
                        <div className="space-y-2 text-sm">
                            {completedEnrolments.map((e) => (
                                <div
                                    key={e.id}
                                    className="rounded-md border px-3 py-2"
                                >
                                    <div className="font-medium">
                                        {e.module.code} — {e.module.title}
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                        Result:{' '}
                                        <span
                                            className={
                                                e.result === 'pass'
                                                    ? 'text-emerald-600'
                                                    : 'text-red-600'
                                            }
                                        >
                                            {e.result?.toUpperCase()}
                                        </span>{' '}
                                        on{' '}
                                        {e.completed_at
                                            ? new Date(
                                                  e.completed_at,
                                              ).toLocaleDateString()
                                            : '—'}
                                    </div>
                                </div>
                            ))}
                            {completedEnrolments.length === 0 && (
                                <p className="text-sm text-muted-foreground">
                                    No completed modules yet.
                                </p>
                            )}
                        </div>
                    </section>
                </div>

                <section className="rounded-xl border border-sidebar-border/70 bg-background p-4 shadow-sm dark:border-sidebar-border">
                    <div className="mb-3 flex items-center justify-between">
                        <h2 className="text-lg font-semibold">
                            Available Modules to Enrol
                        </h2>
                        {!canEnrolMore && (
                            <span className="text-xs font-medium text-red-600">
                                You have reached your limit of 4 current
                                modules.
                            </span>
                        )}
                    </div>
                    <div className="space-y-2 text-sm">
                        {availableModules.map((m) => (
                            <div
                                key={m.id}
                                className="flex items-center justify-between rounded-md border px-3 py-2"
                            >
                                <div>
                                    <div className="font-medium">
                                        {m.code} — {m.title}
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                        {m.students_count} enrolled student
                                        {m.students_count === 1 ? '' : 's'}
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    disabled={!canEnrolMore}
                                    onClick={() => enrol(m.id)}
                                    className="inline-flex items-center rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:opacity-90 disabled:opacity-50"
                                >
                                    Enrol
                                </button>
                            </div>
                        ))}
                        {availableModules.length === 0 && (
                            <p className="text-sm text-muted-foreground">
                                No additional modules available to enrol.
                            </p>
                        )}
                    </div>
                </section>
            </div>
        </AppLayout>
    );
}
