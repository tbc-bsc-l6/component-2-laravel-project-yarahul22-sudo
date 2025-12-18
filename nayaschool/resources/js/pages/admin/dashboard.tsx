import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import type { SharedData } from '@/types';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';

type Module = {
    id: number;
    code: string;
    title: string;
    description?: string | null;
    is_available: boolean;
    max_students: number;
    teacher?: {
        id: number;
        name: string;
    } | null;
};

type PagedModules = {
    data: Module[];
    meta?: {
        current_page: number;
        last_page: number;
        per_page: number;
    };
    links?: Array<{ url: string | null; label: string; active: boolean }>;
};

type PageProps = SharedData & {
    modules: Module[] | PagedModules;
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
    {
        title: 'Admin',
        href: dashboard().url,
    },
];

export default function AdminDashboard() {
    const { props } = usePage<PageProps>();
    const { modules, auth } = props;

    const [modulesState, setModulesState] = useState<Module[]>(() =>
        Array.isArray(modules) ? modules : modules.data ?? [],
    );

    // Keep modulesState in sync when Inertia props change (paging/navigation)
    useEffect(() => {
        if (!Array.isArray(modules) && modules.data) {
            setModulesState(modules.data);
        } else if (Array.isArray(modules)) {
            setModulesState(modules);
        }
        // helpful debug output in browser console
        try {
            // eslint-disable-next-line no-console
            console.debug('AdminDashboard modules prop:', modules);
        } catch (e) {}
    }, [modules]);

    const { data, setData, reset, errors } = useForm({
        code: '',
        title: '',
        description: '',
        max_students: 10,
    });
    const [submitting, setSubmitting] = useState(false);
    const [serverErrors, setServerErrors] = useState<Record<string, string[]>>({});

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();

        const tempId = -Date.now();
        const optimistic = {
            id: tempId,
            code: data.code,
            title: data.title,
            description: data.description,
            is_available: true,
            max_students: data.max_students,
            teacher: null,
        } as Module;

        setModulesState((prev) => [...prev, optimistic]);
        setSubmitting(true);

        try {
            const token =
                document
                    .querySelector('meta[name="csrf-token"]')
                    ?.getAttribute('content') ?? '';

            const res = await fetch('/admin/modules', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': token,
                    Accept: 'application/json',
                },
                credentials: 'same-origin',
                body: JSON.stringify(data),
            });

            if (!res.ok) {
                // remove optimistic entry on failure
                setModulesState((prev) => prev.filter((m) => m.id !== tempId));

                if (res.status === 422) {
                    const body = await res.json().catch(() => null);
                    const errs = body?.errors ?? {};
                    setServerErrors(errs);
                    return;
                }

                // other errors
                return;
            }

            const created: Module = await res.json();

            // clear server errors and reload to page 1 so server pagination is authoritative
            setServerErrors({});
            window.location.assign(`${dashboard().url}?page=1`);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Admin Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="mb-2 flex items-center justify-between text-sm text-muted-foreground">
                    <span>
                        Signed in as{' '}
                        <span className="font-semibold text-foreground">
                            {auth.user.name}
                        </span>{' '}
                        ({auth.user.role?.name ?? 'Admin'})
                    </span>
                </div>
                <div className="grid grid-cols-1 gap-4">
                    <section>
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle>Create Module</CardTitle>
                                    </div>
                                    <div>
                                        <Badge variant="default">Admin</Badge>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={submit} className="grid gap-3">
                                    <div>
                                        <label className="mb-1 block text-sm font-medium">
                                            Code
                                        </label>
                                        <Input
                                            value={data.code}
                                            onChange={(e) =>
                                                setData('code', e.target.value)
                                            }
                                            required
                                        />
                                        {serverErrors.code ? (
                                            <p className="mt-1 text-xs text-destructive">
                                                {Array.isArray(serverErrors.code)
                                                    ? serverErrors.code.join(' ')
                                                    : serverErrors.code}
                                            </p>
                                        ) : errors.code && (
                                            <p className="mt-1 text-xs text-destructive">
                                                {Array.isArray(errors.code)
                                                    ? errors.code.join(' ')
                                                    : errors.code}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="mb-1 block text-sm font-medium">
                                            Title
                                        </label>
                                        <Input
                                            value={data.title}
                                            onChange={(e) =>
                                                setData('title', e.target.value)
                                            }
                                            required
                                        />
                                        {serverErrors.title ? (
                                            <p className="mt-1 text-xs text-destructive">
                                                {Array.isArray(serverErrors.title)
                                                    ? serverErrors.title.join(' ')
                                                    : serverErrors.title}
                                            </p>
                                        ) : errors.title && (
                                            <p className="mt-1 text-xs text-destructive">
                                                {Array.isArray(errors.title)
                                                    ? errors.title.join(' ')
                                                    : errors.title}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="mb-1 block text-sm font-medium">
                                            Description
                                        </label>
                                        <textarea
                                            className="w-full min-w-0 rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50"
                                            value={data.description}
                                            onChange={(e) =>
                                                setData(
                                                    'description',
                                                    e.target.value,
                                                )
                                            }
                                            rows={3}
                                        />
                                        {serverErrors.description ? (
                                            <p className="mt-1 text-xs text-destructive">
                                                {Array.isArray(serverErrors.description)
                                                    ? serverErrors.description.join(' ')
                                                    : serverErrors.description}
                                            </p>
                                        ) : errors.description && (
                                            <p className="mt-1 text-xs text-destructive">
                                                {Array.isArray(errors.description)
                                                    ? errors.description.join(' ')
                                                    : errors.description}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="mb-1 block text-sm font-medium">
                                            Max students (default 10)
                                        </label>
                                        <Input
                                            type="number"
                                            min={1}
                                            max={50}
                                            value={String(data.max_students)}
                                            onChange={(e) =>
                                                setData(
                                                    'max_students',
                                                    Number(e.target.value),
                                                )
                                            }
                                        />
                                        {serverErrors.max_students ? (
                                            <p className="mt-1 text-xs text-destructive">
                                                {Array.isArray(serverErrors.max_students)
                                                    ? serverErrors.max_students.join(' ')
                                                    : serverErrors.max_students}
                                            </p>
                                        ) : errors.max_students && (
                                            <p className="mt-1 text-xs text-destructive">
                                                {Array.isArray(errors.max_students)
                                                    ? errors.max_students.join(' ')
                                                    : errors.max_students}
                                            </p>
                                        )}
                                    </div>

                                    <div className="flex items-center justify-end gap-2">
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            disabled={submitting}
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            size="sm"
                                            type="submit"
                                            disabled={submitting}
                                        >
                                            {submitting
                                                ? 'Saving...'
                                                : 'Save module'}
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    </section>

                    <section className="space-y-3">
                        <h2 className="mb-3 text-lg font-semibold">Modules</h2>
                        <div className="grid gap-3 md:grid-cols-1">
                            {(() => {
                                const serverData = !Array.isArray(modules)
                                    ? modules.data ?? []
                                    : Array.isArray(modules)
                                    ? modules
                                    : [];
                                const toRender = serverData.length > 0 ? serverData : modulesState;
                                return toRender.map((m) => (
                                <Card
                                    key={m.id}
                                    className="relative overflow-hidden"
                                >
                                    <div
                                        className={`absolute top-0 left-0 h-full w-2 ${m.is_available ? 'bg-emerald-400' : 'bg-zinc-400'} opacity-90`}
                                    />
                                    <CardHeader>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="text-sm font-semibold">
                                                    {m.code}
                                                </div>
                                                <CardTitle className="text-base">
                                                    {m.title}
                                                </CardTitle>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Badge
                                                    variant={
                                                        m.is_available
                                                            ? 'default'
                                                            : 'secondary'
                                                    }
                                                >
                                                    {m.is_available
                                                        ? 'Available'
                                                        : 'Archived'}
                                                </Badge>
                                                <Badge variant="outline">
                                                    Max {m.max_students}
                                                </Badge>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-sm text-muted-foreground">
                                            {m.description}
                                        </div>
                                    </CardContent>
                                    <CardFooter className="justify-between">
                                        <div className="flex items-center gap-2">
                                            {m.teacher ? (
                                                <Badge variant="secondary">
                                                    Teacher: {m.teacher.name}
                                                </Badge>
                                            ) : (
                                                <Badge variant="outline">
                                                    Unassigned
                                                </Badge>
                                            )}
                                        </div>
                                            <div className="flex items-center gap-2">
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    onClick={async () => {
                                                        const id = m.id;
                                                        const teacherId = window.prompt('Enter teacher id to assign (empty to unassign):');
                                                        if (teacherId === null) return; // cancelled

                                                        const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') ?? '';
                                                        try {
                                                            const res = await fetch(`/admin/modules/${id}/teacher`, {
                                                                method: 'PATCH',
                                                                headers: {
                                                                    'Content-Type': 'application/json',
                                                                    'X-CSRF-TOKEN': token,
                                                                    Accept: 'application/json',
                                                                },
                                                                credentials: 'same-origin',
                                                                body: JSON.stringify({ teacher_id: teacherId === '' ? null : Number(teacherId) }),
                                                            });

                                                            if (!res.ok) {
                                                                const body = await res.json().catch(() => null);
                                                                alert('Failed to assign teacher: ' + (body?.message ?? res.statusText));
                                                                return;
                                                            }

                                                            // refresh to reflect assignment
                                                            window.location.reload();
                                                        } catch (err) {
                                                            // eslint-disable-next-line no-console
                                                            console.error('assign teacher error', err);
                                                            alert('Error assigning teacher');
                                                        }
                                                    }}
                                                >
                                                    Assign Teacher
                                                </Button>

                                                <Button
                                                    size="sm"
                                                    variant="destructive"
                                                    onClick={async () => {
                                                        if (!window.confirm('Delete this module? This action cannot be undone.')) return;
                                                        const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') ?? '';
                                                        try {
                                                            const res = await fetch(`/admin/modules/${m.id}`, {
                                                                method: 'DELETE',
                                                                headers: {
                                                                    'X-CSRF-TOKEN': token,
                                                                    Accept: 'application/json',
                                                                },
                                                                credentials: 'same-origin',
                                                            });

                                                            if (!res.ok) {
                                                                const body = await res.json().catch(() => null);
                                                                alert('Failed to delete module: ' + (body?.message ?? res.statusText));
                                                                return;
                                                            }

                                                            // reload to update list
                                                            window.location.reload();
                                                        } catch (err) {
                                                            // eslint-disable-next-line no-console
                                                            console.error('delete module error', err);
                                                            alert('Error deleting module');
                                                        }
                                                    }}
                                                >
                                                    Delete
                                                </Button>
                                            </div>
                                    </CardFooter>
                                </Card>
                                ));
                            })()}
                            {(() => {
                                const serverData = !Array.isArray(modules)
                                    ? modules.data ?? []
                                    : Array.isArray(modules)
                                    ? modules
                                    : [];
                                const toRender = serverData.length > 0 ? serverData : modulesState;
                                if (toRender.length === 0) {
                                    return (
                                        <p className="text-sm text-muted-foreground">No modules yet.</p>
                                    );
                                }
                                return null;
                            })()}
                            {/* Pagination */}
                            {/* Pagination: show if server says multiple pages OR client has more than 5 local modules */}
                            {(() => {
                                try {
                                    const urlParams = new URLSearchParams(window.location.search);
                                    const urlPage = parseInt(urlParams.get('page') ?? '1', 10) || 1;

                                    // server-provided pagination meta when available
                                    const serverMeta = !Array.isArray(modules) ? modules.meta : undefined;
                                    // derive server pages: use last_page from server meta
                                    const serverPages = serverMeta?.last_page ?? 1;
                                    const serverCurrent = serverMeta?.current_page ?? urlPage;

                                    // fallback: compute pages from client state if server didn't provide meta
                                    const clientCount = modulesState.length;
                                    const perPage = serverMeta?.per_page ?? 3; // server uses 3
                                    const clientPages = Math.max(1, Math.ceil(clientCount / perPage));

                                    const totalPages = Math.max(serverPages, clientPages, urlPage);

                                    // defensive logging
                                    // eslint-disable-next-line no-console
                                    console.debug('pager:', { serverMeta, serverPages, serverCurrent, clientCount, clientPages, totalPages });

                                    const debugMode = new URLSearchParams(window.location.search).get('debug') === '1';

                                    const debugBlock = debugMode ? (
                                        <div className="mt-2 rounded border bg-muted p-2 text-xs text-muted-foreground">
                                            <div>serverMeta: {JSON.stringify(serverMeta ?? null)}</div>
                                            <div>serverCurrent: {serverCurrent}</div>
                                            <div>serverPages: {serverPages}</div>
                                            <div>clientCount: {clientCount}</div>
                                            <div>clientPages: {clientPages}</div>
                                            <div>totalPages: {totalPages}</div>
                                        </div>
                                    ) : null;

                                    // Render a fixed numeric range from 1..serverPages so numbers stay constant
                                    const pages = Array.from({ length: Math.max(1, serverPages) }, (_, i) => i + 1);

                                    return (
                                        <>
                                            <div className="mt-3 flex items-center gap-2">
                                                {serverCurrent > 1 ? (
                                                    <a
                                                        href={`${dashboard().url}?page=${serverCurrent - 1}`}
                                                        onClick={(e) => { e.preventDefault(); window.location.assign(`${dashboard().url}?page=${serverCurrent - 1}`); }}
                                                        className="rounded border bg-background px-3 py-1"
                                                    >
                                                        Previous
                                                    </a>
                                                ) : (
                                                    <span className="rounded border px-3 py-1 opacity-50">Previous</span>
                                                )}

                                                <div className="flex items-center gap-1">
                                                    {pages.map((p) => {
                                                        const pageHref = `${dashboard().url}?page=${p}`;
                                                        return (
                                                            <a
                                                                key={p}
                                                                href={pageHref}
                                                                onClick={(e) => { e.preventDefault(); window.location.assign(pageHref); }}
                                                                className={`rounded px-2 py-1 ${p === serverCurrent ? 'bg-primary text-primary-foreground' : 'border bg-surface text-foreground'}`}
                                                            >
                                                                {p}
                                                            </a>
                                                        );
                                                    })}
                                                </div>

                                                {serverCurrent < pages.length ? (
                                                    <a
                                                        href={`${dashboard().url}?page=${serverCurrent + 1}`}
                                                        onClick={(e) => { e.preventDefault(); window.location.assign(`${dashboard().url}?page=${serverCurrent + 1}`); }}
                                                        className="rounded border bg-background px-3 py-1"
                                                    >
                                                        Next
                                                    </a>
                                                ) : (
                                                    <span className="rounded border px-3 py-1 opacity-50">Next</span>
                                                )}
                                            </div>
                                            {debugBlock}
                                        </>
                                    );
                                } catch (err) {
                                    // eslint-disable-next-line no-console
                                    console.error('Pagination render error:', err);
                                    return null;
                                }
                            })()}
                        </div>
                    </section>
                </div>
            </div>
        </AppLayout>
    );
}
