import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import type { BreadcrumbItem, SharedData } from '@/types';
import { Head, usePage } from '@inertiajs/react';

type Module = {
    id: number;
    code: string;
    title: string;
    students_count: number;
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

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Teacher Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="mb-2 flex items-center justify-between text-sm text-muted-foreground">
                    <span>
                        Signed in as{' '}
                        <span className="font-semibold text-foreground">
                            {auth.user.name}
                        </span>{' '}
                        ({auth.user.role?.name ?? 'Teacher'})
                    </span>
                </div>
                <section className="rounded-xl border border-sidebar-border/70 bg-background p-4 shadow-sm dark:border-sidebar-border">
                    <h2 className="mb-3 text-lg font-semibold">My Modules</h2>
                    <div className="space-y-2 text-sm">
                        {modules.map((m) => (
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
                            </div>
                        ))}
                        {modules.length === 0 && (
                            <p className="text-sm text-muted-foreground">
                                No modules assigned to you yet.
                            </p>
                        )}
                    </div>
                </section>
            </div>
        </AppLayout>
    );
}
