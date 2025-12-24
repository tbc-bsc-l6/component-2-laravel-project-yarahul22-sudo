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
import { Plus, Users, BookOpen, GraduationCap, Settings2, Trash2, UserMinus, Archive, CheckCircle2, XCircle } from 'lucide-react';

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
    students?: Array<{
        id: number;
        name: string;
        email: string;
        pivot?: {
            id: number;
            enrolled_at: string;
            completed_at?: string | null;
            result?: string | null;
        };
    }>;
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

    const scrollToSection = (id: string) => {
        const el = document.getElementById(id);
        el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

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
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl bg-gradient-to-br from-slate-50 via-white to-slate-100 p-6 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900">
                {/* Welcome Banner */}
                <div className="rounded-lg border border-slate-200 bg-white/90 p-6 shadow-md backdrop-blur dark:border-slate-800 dark:bg-slate-900/70">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">Admin Dashboard</h1>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Welcome back, <span className="font-semibold text-foreground">{auth.user.name}</span>
                            </p>
                        </div>
                        <Badge variant="default" className="h-fit px-3 py-1">
                            <Settings2 className="mr-1 h-3 w-3" />
                            Administrator
                        </Badge>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                        <Button size="sm" className="gap-2" onClick={() => setCreateOpen(true)}>
                            <Plus className="h-4 w-4" /> New Module
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => scrollToSection('admin-teachers')}>
                            <GraduationCap className="mr-2 h-4 w-4" /> Teachers
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => scrollToSection('admin-students')}>
                            <Users className="mr-2 h-4 w-4" /> Students
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => scrollToSection('admin-modules')}>
                            <BookOpen className="mr-2 h-4 w-4" /> Modules
                        </Button>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="grid gap-4 md:grid-cols-3">
                    <Sheet open={createOpen} onOpenChange={setCreateOpen}>
                        <SheetTrigger asChild>
                            <Card className="group cursor-pointer overflow-hidden border-2 border-dashed border-emerald-200 bg-gradient-to-br from-emerald-50 to-white transition hover:border-emerald-400 hover:shadow-lg dark:border-emerald-900 dark:from-emerald-950 dark:to-slate-900">
                                <CardContent className="flex items-center gap-4 p-6">
                                    <div className="rounded-xl bg-emerald-500 p-3 shadow-lg transition group-hover:scale-110">
                                        <BookOpen className="h-6 w-6 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">Quick Action</p>
                                        <p className="text-lg font-bold">Create Module</p>
                                    </div>
                                </CardContent>
                            </Card>
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

                    <Sheet>
                        <SheetTrigger asChild>
                            <Card className="group cursor-pointer overflow-hidden border-2 border-dashed border-blue-200 bg-gradient-to-br from-blue-50 to-white transition hover:border-blue-400 hover:shadow-lg dark:border-blue-900 dark:from-blue-950 dark:to-slate-900">
                                <CardContent className="flex items-center gap-4 p-6">
                                    <div className="rounded-xl bg-blue-500 p-3 shadow-lg transition group-hover:scale-110">
                                        <GraduationCap className="h-6 w-6 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">Quick Action</p>
                                        <p className="text-lg font-bold">Add Teacher</p>
                                    </div>
                                </CardContent>
                            </Card>
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
                                <Button type="submit" className="w-full">Create Teacher</Button>
                            </form>
                        </SheetContent>
                    </Sheet>

                    <Card className="overflow-hidden border-2 border-slate-200 bg-gradient-to-br from-slate-50 to-white dark:border-slate-700 dark:from-slate-900 dark:to-slate-950">
                        <CardContent className="flex items-center gap-4 p-6">
                            <div className="rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 p-3 shadow-lg">
                                <Settings2 className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">System Stats</p>
                                <p className="text-lg font-bold">{teachers.length} Teachers • {students.length} Students</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid grid-cols-1 gap-6">
                    {/* Teachers Section */}
                    <section id="admin-teachers" className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="rounded-lg bg-primary/10 p-2">
                                    <Users className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-semibold">Teachers</h2>
                                    <p className="text-sm text-muted-foreground">Manage teaching staff</p>
                                </div>
                            </div>
                            <Sheet>
                                <SheetTrigger asChild>
                                    <Button size="sm" className="gap-2">
                                        <Plus className="h-4 w-4" />
                                        Add Teacher
                                    </Button>
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
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {teachers.length === 0 ? (
                                <div className="col-span-full rounded-lg border border-dashed border-slate-200 bg-slate-50/80 p-8 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900/50">
                                    <Users className="mx-auto h-12 w-12 text-muted-foreground/50" />
                                    <p className="mt-2 text-sm text-muted-foreground">No teachers yet. Add your first teacher to get started.</p>
                                </div>
                            ) : (
                                teachers.map((teacher) => (
                                    <Card key={teacher.id} className="overflow-hidden border border-slate-200 bg-white/90 shadow-md backdrop-blur transition hover:-translate-y-0.5 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900/70">
                                        <CardHeader className="border-b border-slate-200 bg-gradient-to-r from-white via-slate-50 to-slate-100 pb-3 dark:border-slate-800 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900">
                                            <div className="flex items-start gap-3">
                                                <div className="rounded-full bg-primary/10 p-2">
                                                    <GraduationCap className="h-5 w-5 text-primary" />
                                                </div>
                                                <div className="flex-1">
                                                    <CardTitle className="text-base">{teacher.name}</CardTitle>
                                                    <p className="mt-1 text-sm text-muted-foreground">{teacher.email}</p>
                                                </div>
                                            </div>
                                        </CardHeader>
                                        <CardFooter className="justify-between border-t bg-muted/30 pt-3">
                                            <Badge variant="secondary" className="gap-1">
                                                <BookOpen className="h-3 w-3" />
                                                {teacher.modules_count || 0} module(s)
                                            </Badge>
                                            <Button 
                                                size="sm" 
                                                variant="ghost"
                                                className="gap-1 text-destructive hover:bg-destructive/10 hover:text-destructive"
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
                                                <Trash2 className="h-3 w-3" />
                                                Remove
                                            </Button>
                                        </CardFooter>
                                    </Card>
                                ))
                            )}
                        </div>
                    </section>

                    {/* Students / Users Management Section */}
                    <section id="admin-students" className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="rounded-lg bg-blue-500/10 p-2">
                                    <Users className="h-5 w-5 text-blue-500" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-semibold">Students & Users</h2>
                                    <p className="text-sm text-muted-foreground">Manage student accounts and roles</p>
                                </div>
                            </div>
                        </div>
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {students.length === 0 ? (
                                <div className="col-span-full rounded-lg border border-dashed border-slate-200 bg-slate-50/80 p-8 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900/50">
                                    <Users className="mx-auto h-12 w-12 text-muted-foreground/50" />
                                    <p className="mt-2 text-sm text-muted-foreground">No students registered yet.</p>
                                </div>
                            ) : (
                                students.map((student) => (
                                    <Card key={student.id} className="overflow-hidden border border-slate-200 bg-white/90 shadow-md backdrop-blur transition hover:-translate-y-0.5 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900/70">
                                        <CardHeader className="border-b border-slate-200 bg-gradient-to-r from-white via-slate-50 to-slate-100 pb-3 dark:border-slate-800 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900">
                                            <div className="flex items-center justify-between">
                                                <CardTitle className="text-base">{student.name}</CardTitle>
                                                <Badge variant={student.role === 'student' ? 'default' : 'secondary'} className="text-xs">
                                                    {student.role === 'old_student' ? 'Old Student' : 'Student'}
                                                </Badge>
                                            </div>
                                            <p className="text-sm text-muted-foreground">{student.email}</p>
                                        </CardHeader>
                                        <CardFooter className="border-t border-slate-200 bg-slate-50/60 pt-3 dark:border-slate-800 dark:bg-slate-900/40">
                                            <Sheet>
                                                <SheetTrigger asChild>
                                                    <Button size="sm" variant="outline" className="w-full gap-2">
                                                        <Settings2 className="h-3 w-3" />
                                                        Change Role
                                                    </Button>
                                                </SheetTrigger>
                                                <SheetContent>
                                                    <SheetHeader>
                                                        <SheetTitle>Change Role for {student.name}</SheetTitle>
                                                        <SheetDescription>
                                                            Update user role status
                                                        </SheetDescription>
                                                    </SheetHeader>
                                                    <form
                                                        onSubmit={(e) => {
                                                            e.preventDefault();
                                                            const formData = new FormData(e.currentTarget);
                                                            const role = formData.get('role');
                                                            const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') ?? '';
                                                            fetch(`/admin/users/${student.id}/role`, {
                                                                method: 'PATCH',
                                                                headers: {
                                                                    'X-CSRF-TOKEN': token,
                                                                    'Accept': 'application/json',
                                                                    'Content-Type': 'application/json',
                                                                },
                                                                body: JSON.stringify({ role }),
                                                            })
                                                            .then(res => res.ok ? window.location.reload() : alert('Failed'))
                                                            .catch(() => alert('Error'));
                                                        }}
                                                        className="grid gap-3 p-4"
                                                    >
                                                        <div>
                                                            <label className="mb-1 block text-sm font-medium">Role</label>
                                                            <select 
                                                                name="role" 
                                                                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                                                defaultValue={student.role}
                                                            >
                                                                <option value="student">Student</option>
                                                                <option value="old_student">Old Student</option>
                                                                <option value="teacher">Teacher</option>
                                                                <option value="admin">Admin</option>
                                                            </select>
                                                        </div>
                                                        <Button type="submit">Update Role</Button>
                                                    </form>
                                                </SheetContent>
                                            </Sheet>
                                        </CardFooter>
                                    </Card>
                                ))
                            )}
                        </div>
                    </section>

                    <section id="admin-modules">
                        <div className="mb-4 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="rounded-lg bg-emerald-500/10 p-2">
                                    <BookOpen className="h-5 w-5 text-emerald-500" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-semibold">Modules</h2>
                                    <p className="text-sm text-muted-foreground">Create and manage course modules</p>
                                </div>
                            </div>
                            <Sheet open={createOpen} onOpenChange={setCreateOpen}>
                                <SheetTrigger asChild>
                                    <Button onClick={() => setCreateOpen(true)} className="gap-2">
                                        <Plus className="h-4 w-4" />
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

                    <section className="space-y-4">
                        <div className="grid gap-4">
                            {(() => {
                                const serverData = !Array.isArray(modules)
                                    ? modules.data ?? []
                                    : Array.isArray(modules)
                                    ? modules
                                    : [];
                                const toRender = serverData.length > 0 ? serverData : modulesState;
                                
                                if (toRender.length === 0) {
                                    return (
                                        <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50/80 p-12 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900/50">
                                            <BookOpen className="mx-auto h-16 w-16 text-muted-foreground/50" />
                                            <h3 className="mt-4 text-lg font-semibold">No modules yet</h3>
                                            <p className="mt-2 text-sm text-muted-foreground">
                                                Create your first module to get started
                                            </p>
                                        </div>
                                    );
                                }
                                
                                return toRender.map((m) => (
                                <Card
                                    key={m.id}
                                    className="relative overflow-hidden border border-slate-200 bg-white/90 shadow-md backdrop-blur transition hover:-translate-y-0.5 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900/70"
                                >
                                    <div
                                        className={`absolute top-0 left-0 h-full w-1 ${m.is_available ? 'bg-emerald-500' : 'bg-zinc-400'}`}
                                    />
                                    <CardHeader className="border-b border-slate-200 bg-gradient-to-r from-white via-slate-50 to-slate-100 dark:border-slate-800 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900">
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex items-start gap-3 flex-1">
                                                <div className={`rounded-lg p-2 ${m.is_available ? 'bg-emerald-500/10' : 'bg-zinc-400/10'}`}>
                                                    <BookOpen className={`h-5 w-5 ${m.is_available ? 'text-emerald-500' : 'text-zinc-500'}`} />
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2">
                                                        <Badge variant="outline" className="font-mono text-xs">
                                                            {m.code}
                                                        </Badge>
                                                        <CardTitle className="text-lg">{m.title}</CardTitle>
                                                    </div>
                                                    <p className="mt-1.5 text-sm text-muted-foreground">
                                                        {m.description || 'No description provided'}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                <Badge
                                                    variant={m.is_available ? 'default' : 'secondary'}
                                                    className="justify-center"
                                                >
                                                    {m.is_available ? (
                                                        <>
                                                            <CheckCircle2 className="mr-1 h-3 w-3" />
                                                            Available
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Archive className="mr-1 h-3 w-3" />
                                                            Archived
                                                        </>
                                                    )}
                                                </Badge>
                                                <Badge variant="outline" className="justify-center gap-1">
                                                    <Users className="h-3 w-3" />
                                                    {m.students_count || 0}/{m.max_students}
                                                </Badge>
                                                {(m.students_count || 0) >= m.max_students && (
                                                    <Badge variant="destructive" className="justify-center gap-1 text-xs">
                                                        Full
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="pt-4">
                                        {m.students && m.students.length > 0 && (
                                            <div className="space-y-3">
                                                <div className="flex items-center gap-2">
                                                    <Users className="h-4 w-4 text-muted-foreground" />
                                                    <p className="text-sm font-semibold">
                                                        Enrolled Students ({m.students.length}/{m.max_students})
                                                    </p>
                                                </div>
                                                <div className="space-y-2">
                                                    {m.students.map((student) => (
                                                        <div 
                                                            key={student.id}
                                                            className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50/80 px-3 py-2.5 shadow-sm transition hover:border-primary/30 hover:shadow dark:border-slate-800 dark:bg-slate-900/50"
                                                        >
                                                            <div className="flex items-center gap-2">
                                                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                                                                    <GraduationCap className="h-4 w-4 text-primary" />
                                                                </div>
                                                                <div>
                                                                    <p className="text-sm font-medium">{student.name}</p>
                                                                    <p className="text-xs text-muted-foreground">{student.email}</p>
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center gap-2">
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
                                                                <Button
                                                                    size="sm"
                                                                    variant="ghost"
                                                                    className="h-8 gap-1 text-destructive hover:bg-destructive/10 hover:text-destructive"
                                                                    onClick={async () => {
                                                                        if (!confirm(`Remove ${student.name} from ${m.code}?`)) return;
                                                                        
                                                                        if (!student.pivot?.id) {
                                                                            alert('Error: Missing enrolment ID');
                                                                            return;
                                                                        }
                                                                        
                                                                        const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') ?? '';
                                                                        try {
                                                                            const res = await fetch(`/admin/enrolments/${student.pivot.id}`, {
                                                                                method: 'DELETE',
                                                                                headers: { 'X-CSRF-TOKEN': token, Accept: 'application/json' },
                                                                            });
                                                                            
                                                                            if (res.ok) {
                                                                                window.location.reload();
                                                                            } else {
                                                                                const body = await res.json().catch(() => null);
                                                                                alert('Failed to remove student: ' + (body?.message ?? res.statusText));
                                                                            }
                                                                        } catch (e) { 
                                                                            alert('Error: ' + (e instanceof Error ? e.message : 'Unknown error')); 
                                                                        }
                                                                    }}
                                                                >
                                                                    <UserMinus className="h-3 w-3" />
                                                                    Remove
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                        {(!m.students || m.students.length === 0) && (
                                            <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50/80 p-6 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900/50">
                                                <Users className="mx-auto h-8 w-8 text-muted-foreground/50" />
                                                <p className="mt-2 text-sm text-muted-foreground">No students enrolled yet</p>
                                            </div>
                                        )}
                                    </CardContent>
                                    <CardFooter className="gap-2 border-t border-slate-200 bg-slate-50/60 pt-4 dark:border-slate-800 dark:bg-slate-900/40">
                                        <div className="flex flex-1 items-center gap-2">
                                            {m.teacher ? (
                                                <Badge variant="secondary" className="gap-1">
                                                    <GraduationCap className="h-3 w-3" />
                                                    {m.teacher.name}
                                                </Badge>
                                            ) : (
                                                <Badge variant="outline" className="gap-1 text-muted-foreground">
                                                    <GraduationCap className="h-3 w-3" />
                                                    No teacher assigned
                                                </Badge>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Sheet>
                                                <SheetTrigger asChild>
                                                    <Button size="sm" variant="outline" className="gap-1">
                                                        <Settings2 className="h-3 w-3" />
                                                        Assign
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
                                                className="gap-1"
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
                                                {m.is_available ? (
                                                    <>
                                                        <Archive className="h-3 w-3" />
                                                        Archive
                                                    </>
                                                ) : (
                                                    <>
                                                        <CheckCircle2 className="h-3 w-3" />
                                                        Activate
                                                    </>
                                                )}
                                            </Button>

                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                className="gap-1 text-destructive hover:bg-destructive/10 hover:text-destructive"
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
                                                    <Trash2 className="h-3 w-3" />
                                                    Delete
                                                </Button>
                                            </div>
                                    </CardFooter>
                                </Card>
                                ));
                            })()}
                            
                            {/* Pagination */}
                            {(() => {
                                try {
                                    const urlParams = new URLSearchParams(window.location.search);
                                    const urlPage = parseInt(urlParams.get('page') ?? '1', 10) || 1;

                                    const serverMeta = !Array.isArray(modules) ? modules.meta : undefined;
                                    const serverPages = serverMeta?.last_page ?? 1;
                                    const serverCurrent = serverMeta?.current_page ?? urlPage;

                                    if (serverPages <= 1) return null;

                                    const pages = Array.from({ length: Math.max(1, serverPages) }, (_, i) => i + 1);

                                    return (
                                        <div className="mt-6 flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white/90 p-4 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/70">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                disabled={serverCurrent <= 1}
                                                onClick={() => window.location.assign(`${dashboard().url}?page=${serverCurrent - 1}`)}
                                                className="gap-1"
                                            >
                                                Previous
                                            </Button>

                                            <div className="flex items-center gap-1">
                                                {pages.map((p) => {
                                                    const pageHref = `${dashboard().url}?page=${p}`;
                                                    return (
                                                        <Button
                                                            key={p}
                                                            variant={p === serverCurrent ? 'default' : 'outline'}
                                                            size="sm"
                                                            onClick={() => window.location.assign(pageHref)}
                                                            className={p === serverCurrent ? 'pointer-events-none' : ''}
                                                        >
                                                            {p}
                                                        </Button>
                                                    );
                                                })}
                                            </div>

                                            <Button
                                                variant="outline"
                                                size="sm"
                                                disabled={serverCurrent >= serverPages}
                                                onClick={() => window.location.assign(`${dashboard().url}?page=${serverCurrent + 1}`)}
                                                className="gap-1"
                                            >
                                                Next
                                            </Button>
                                        </div>
                                    );
                                } catch (err) {
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
