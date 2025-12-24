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
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetFooter,
    SheetTitle,
    SheetDescription,
    SheetTrigger,
} from '@/components/ui/sheet';
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
    students_count?: number;
};

type Teacher = {
    id: number;
    name: string;
    email: string;
    modules_count?: number;
};

type Student = {
    id: number;
    name: string;
    email: string;
    role: string;
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
    teachers?: Teacher[];
    students?: Student[];
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
    const { modules, auth, teachers = [], students = [] } = props;

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

    const { data, setData, reset, post, processing, errors } = useForm({
        code: '',
        title: '',
        description: '',
        max_students: 10,
    });
    const [createOpen, setCreateOpen] = useState(false);
    const [serverErrors, setServerErrors] = useState<Record<string, string[]>>({});

    const submit = (e?: React.FormEvent) => {
        e?.preventDefault();

        post('/admin/modules', {
            onSuccess: () => {
                setServerErrors({});
                setCreateOpen(false);
                // authoritative server pagination - go to page 1
                window.location.assign(`${dashboard().url}?page=1`);
            },
            onError: (errs: any) => {
                // Inertia populates `errors`, but also keep serverErrors for display
                setServerErrors(errs ?? {});
            },
        });
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
                    {/* Teachers Section */}
                    <section className="space-y-3">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold">Teachers</h2>
                            <Sheet>
                                <SheetTrigger asChild>
                                    <Button size="sm">Add Teacher</Button>
                                </SheetTrigger>
                                <SheetContent>
                                    <SheetHeader>
                                        <SheetTitle>Create Teacher Account</SheetTitle>
                                        <SheetDescription>
                                            Add a new teacher to the system
                                        </SheetDescription>
                                    </SheetHeader>
                                    <form 
                                        onSubmit={(e) => {
                                            e.preventDefault();
                                            const formData = new FormData(e.currentTarget);
                                            const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') ?? '';
                                            fetch('/admin/teachers', {
                                                method: 'POST',
                                                headers: {
                                                    'X-CSRF-TOKEN': token,
                                                    'Accept': 'application/json',
                                                    'Content-Type': 'application/json',
                                                },
                                                body: JSON.stringify({
                                                    name: formData.get('name'),
                                                    email: formData.get('email'),
                                                    password: formData.get('password'),
                                                }),
                                            })
                                            .then(res => res.ok ? window.location.reload() : res.json().then(body => alert(body.message || 'Failed')))
                                            .catch(() => alert('Error creating teacher'));
                                        }}
                                        className="grid gap-3 p-4"
                                    >
                                        <div>
                                            <label className="mb-1 block text-sm font-medium">Name</label>
                                            <Input name="name" required />
                                        </div>
                                        <div>
                                            <label className="mb-1 block text-sm font-medium">Email</label>
                                            <Input name="email" type="email" required />
                                        </div>
                                        <div>
                                            <label className="mb-1 block text-sm font-medium">Password</label>
                                            <Input name="password" type="password" required />
                                        </div>
                                        <Button type="submit">Create Teacher</Button>
                                    </form>
                                </SheetContent>
                            </Sheet>
                        </div>
                        <div className="grid gap-3 md:grid-cols-2">
                            {teachers.length === 0 ? (
                                <p className="text-sm text-muted-foreground">No teachers yet.</p>
                            ) : (
                                teachers.map((teacher) => (
                                    <Card key={teacher.id}>
                                        <CardHeader>
                                            <CardTitle className="text-base">{teacher.name}</CardTitle>
                                            <p className="text-sm text-muted-foreground">{teacher.email}</p>
                                        </CardHeader>
                                        <CardFooter className="justify-between">
                                            <Badge variant="secondary">
                                                {teacher.modules_count || 0} module(s)
                                            </Badge>
                                            <Button 
                                                size="sm" 
                                                variant="destructive"
                                                onClick={async () => {
                                                    if (!confirm(`Delete teacher ${teacher.name}?`)) return;
                                                    const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') ?? '';
                                                    try {
                                                        const res = await fetch(`/admin/teachers/${teacher.id}`, {
                                                            method: 'DELETE',
                                                            headers: { 'X-CSRF-TOKEN': token, Accept: 'application/json' },
                                                        });
                                                        if (res.ok) window.location.reload();
                                                        else alert('Failed to delete teacher');
                                                    } catch { alert('Error deleting teacher'); }
                                                }}
                                            >
                                                Remove
                                            </Button>
                                        </CardFooter>
                                    </Card>
                                ))
                            )}
                        </div>
                    </section>

                    <section>
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold">Create Module</h3>
                            <Sheet open={createOpen} onOpenChange={setCreateOpen}>
                                <SheetTrigger asChild>
                                    <Button onClick={() => setCreateOpen(true)}>
                                        New Module
                                    </Button>
                                </SheetTrigger>

                                <SheetContent side="right">
                                    <SheetHeader>
                                        <SheetTitle>Create Module</SheetTitle>
                                        <SheetDescription>
                                            Add a new course/module. Fields are
                                            validated server-side.
                                        </SheetDescription>
                                    </SheetHeader>

                                    <form onSubmit={submit} className="grid gap-3 p-4">
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
                                                type="button"
                                                onClick={() => setCreateOpen(false)}
                                            >
                                                Cancel
                                            </Button>
                                            <Button
                                                size="sm"
                                                type="submit"
                                                disabled={processing}
                                            >
                                                {processing ? 'Saving...' : 'Save module'}
                                            </Button>
                                        </div>
                                    </form>

                                    <SheetFooter />
                                </SheetContent>
                            </Sheet>
                        </div>
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
                                            <Sheet>
                                                <SheetTrigger asChild>
                                                    <Button size="sm" variant="outline">
                                                        Assign Teacher
                                                    </Button>
                                                </SheetTrigger>
                                                <SheetContent>
                                                    <SheetHeader>
                                                        <SheetTitle>Assign Teacher to {m.code}</SheetTitle>
                                                        <SheetDescription>
                                                            Select a teacher for this module
                                                        </SheetDescription>
                                                    </SheetHeader>
                                                    <form
                                                        onSubmit={(e) => {
                                                            e.preventDefault();
                                                            const formData = new FormData(e.currentTarget);
                                                            const teacherId = formData.get('teacher_id');
                                                            const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') ?? '';
                                                            fetch(`/admin/modules/${m.id}/teacher`, {
                                                                method: 'PATCH',
                                                                headers: {
                                                                    'X-CSRF-TOKEN': token,
                                                                    'Accept': 'application/json',
                                                                    'Content-Type': 'application/json',
                                                                },
                                                                body: JSON.stringify({ teacher_id: teacherId === '' ? null : Number(teacherId) }),
                                                            })
                                                            .then(res => res.ok ? window.location.reload() : alert('Failed'))
                                                            .catch(() => alert('Error'));
                                                        }}
                                                        className="grid gap-3 p-4"
                                                    >
                                                        <div>
                                                            <label className="mb-1 block text-sm font-medium">Teacher</label>
                                                            <select 
                                                                name="teacher_id" 
                                                                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                                                defaultValue={m.teacher?.id ?? ''}
                                                            >
                                                                <option value="">Unassigned</option>
                                                                {teachers.map(t => (
                                                                    <option key={t.id} value={t.id}>{t.name}</option>
                                                                ))}
                                                            </select>
                                                        </div>
                                                        <Button type="submit">Save</Button>
                                                    </form>
                                                </SheetContent>
                                            </Sheet>

                                            <Button
                                                size="sm"
                                                variant={m.is_available ? 'secondary' : 'default'}
                                                onClick={async () => {
                                                    const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') ?? '';
                                                    try {
                                                        const res = await fetch(`/admin/modules/${m.id}/toggle`, {
                                                            method: 'PATCH',
                                                            headers: { 'X-CSRF-TOKEN': token, Accept: 'application/json' },
                                                        });
                                                        if (res.ok) window.location.reload();
                                                        else alert('Failed to toggle');
                                                    } catch { alert('Error'); }
                                                }}
                                            >
                                                {m.is_available ? 'Archive' : 'Activate'}
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
