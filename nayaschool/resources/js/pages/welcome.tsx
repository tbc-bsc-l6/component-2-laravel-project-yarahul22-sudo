import { dashboard, login, register } from '@/routes';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';

export default function Welcome({
    canRegister = true,
}: {
    canRegister?: boolean;
}) {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="Welcome">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link
                    href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600"
                    rel="stylesheet"
                />
            </Head>
            <div className="flex min-h-screen flex-col items-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-6 text-[#1b1b18] lg:justify-center lg:p-8 dark:bg-gradient-to-br dark:from-gray-900 dark:via-gray-800 dark:to-indigo-950">
                <header className="mb-6 w-full max-w-[335px] text-sm not-has-[nav]:hidden lg:max-w-4xl animate-in fade-in slide-in-from-top-4 duration-700">
                    <nav className="flex items-center justify-end gap-4">
                        {auth.user ? (
                            <Link
                                href={dashboard()}
                                className="inline-block rounded-sm border border-[#19140035] px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={login()}
                                    className="inline-block rounded-sm border border-transparent px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#19140035] dark:text-[#EDEDEC] dark:hover:border-[#3E3E3A]"
                                >
                                    Log in
                                </Link>
                                {canRegister && (
                                    <Link
                                        href={register()}
                                        className="inline-block rounded-sm border border-[#19140035] px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
                                    >
                                        Register
                                    </Link>
                                )}
                            </>
                        )}
                    </nav>
                </header>
                <div className="flex w-full items-center justify-center opacity-100 transition-opacity duration-750 lg:grow starting:opacity-0 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                    <main className="flex w-full max-w-[335px] flex-col-reverse gap-0 lg:max-w-5xl lg:flex-row lg:gap-1">
                        <div className="flex-1 rounded-br-lg rounded-bl-lg bg-white/90 backdrop-blur-sm p-6 pb-12 text-[13px] leading-[20px] shadow-2xl shadow-indigo-500/10 border border-indigo-100/50 lg:rounded-tl-lg lg:rounded-br-none lg:p-20 dark:bg-gray-900/90 dark:text-[#EDEDEC] dark:shadow-2xl dark:shadow-purple-900/30 dark:border-indigo-900/50 hover:shadow-indigo-500/20 transition-all duration-500">
                            <h1 className="mb-2 text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent dark:from-indigo-400 dark:to-purple-400 lg:text-4xl">
                                Welcome to Naya School
                            </h1>
                            <p className="mb-6 text-[#706f6c] dark:text-[#A1A09A] text-sm lg:text-base">
                                Your comprehensive learning management system for modern education.
                                <br />
                                Get started with the features below.
                            </p>
                            <ul className="mb-6 flex flex-col gap-4 lg:mb-8">
                                <li className="group relative flex items-center gap-4 rounded-xl border border-indigo-200 bg-gradient-to-r from-blue-50 to-indigo-50 p-5 dark:border-indigo-800/50 dark:from-blue-950/30 dark:to-indigo-950/30 hover:shadow-lg hover:shadow-blue-500/20 hover:scale-[1.02] transition-all duration-300 cursor-pointer">
                                    <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/50 group-hover:scale-110 transition-transform duration-300">
                                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                        </svg>
                                    </span>
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-base text-gray-900 dark:text-white mb-1">Browse Modules</h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">Enroll in up to 4 modules at a time</p>
                                    </div>
                                </li>
                                <li className="group relative flex items-center gap-4 rounded-xl border border-green-200 bg-gradient-to-r from-green-50 to-emerald-50 p-5 dark:border-green-800/50 dark:from-green-950/30 dark:to-emerald-950/30 hover:shadow-lg hover:shadow-green-500/20 hover:scale-[1.02] transition-all duration-300 cursor-pointer">
                                    <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/50 group-hover:scale-110 transition-transform duration-300">
                                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </span>
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-base text-gray-900 dark:text-white mb-1">Track Progress</h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">View completion history with pass/fail status</p>
                                    </div>
                                </li>
                                <li className="group relative flex items-center gap-4 rounded-xl border border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50 p-5 dark:border-purple-800/50 dark:from-purple-950/30 dark:to-pink-950/30 hover:shadow-lg hover:shadow-purple-500/20 hover:scale-[1.02] transition-all duration-300 cursor-pointer">
                                    <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 text-white shadow-lg shadow-purple-500/50 group-hover:scale-110 transition-transform duration-300">
                                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                        </svg>
                                    </span>
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-base text-gray-900 dark:text-white mb-1">Connect with Teachers</h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">Learn from qualified instructors</p>
                                    </div>
                                </li>
                            </ul>
                            <div className="flex flex-col sm:flex-row gap-3">
                                {!auth.user ? (
                                    <>
                                        <Link
                                            href={register()}
                                            className="group relative inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/50 hover:shadow-xl hover:shadow-indigo-500/60 hover:scale-105 transition-all duration-300 dark:from-indigo-500 dark:to-purple-500 overflow-hidden"
                                        >
                                            <span className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                                            <span className="relative flex items-center gap-2">
                                                Get Started
                                                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                                </svg>
                                            </span>
                                        </Link>
                                        <Link
                                            href={login()}
                                            className="inline-flex items-center justify-center rounded-xl border-2 border-indigo-600 px-8 py-3.5 text-sm font-semibold text-indigo-600 hover:bg-indigo-50 dark:border-indigo-400 dark:text-indigo-400 dark:hover:bg-indigo-950/30 transition-all duration-300 hover:scale-105"
                                        >
                                            Sign In
                                        </Link>
                                    </>
                                ) : (
                                    <Link
                                        href={dashboard()}
                                        className="group relative inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/50 hover:shadow-xl hover:shadow-indigo-500/60 hover:scale-105 transition-all duration-300 dark:from-indigo-500 dark:to-purple-500"
                                    >
                                        <span className="relative flex items-center gap-2">
                                            Go to Dashboard
                                            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                            </svg>
                                        </span>
                                    </Link>
                                )}
                            </div>
                        </div>
                        <div className="relative -mb-px aspect-[335/376] w-full shrink-0 overflow-hidden rounded-t-lg bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 lg:mb-0 lg:-ml-px lg:aspect-auto lg:w-[480px] lg:rounded-t-none lg:rounded-r-lg dark:from-indigo-950 dark:via-purple-950 dark:to-gray-900 shadow-2xl shadow-indigo-500/20 border border-indigo-200/50 dark:border-indigo-800/50">
                            <div className="flex h-full items-center justify-center p-8 lg:p-12">
                                <div className="space-y-8 animate-in zoom-in duration-1000">
                                    <div className="flex justify-center">
                                        <div className="rounded-full bg-white/90 p-10 shadow-2xl shadow-indigo-500/30 dark:bg-gray-800/90 dark:shadow-purple-500/30 hover:scale-110 transition-transform duration-500 backdrop-blur-sm border-4 border-white/50 dark:border-gray-700/50">
                                            <svg className="h-36 w-36 text-indigo-600 dark:text-indigo-400 lg:h-40 lg:w-40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 14l9-5-9-5-9 5 9 5z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
                                            </svg>
                                        </div>
                                    </div>
                                    <div className="space-y-4 text-center">
                                        <div className="flex justify-center gap-4 lg:gap-5">
                                            <div className="group rounded-xl bg-white/90 p-5 shadow-lg shadow-green-500/20 dark:bg-gray-800/90 dark:shadow-green-500/20 hover:scale-110 hover:shadow-xl hover:shadow-green-500/40 transition-all duration-300 backdrop-blur-sm border border-white/50 dark:border-gray-700/50">
                                                <svg className="h-9 w-9 text-green-600 dark:text-green-400 group-hover:scale-110 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            </div>
                                            <div className="rounded-lg bg-white/60 p-4 shadow-lg dark:bg-gray-700/60">
                                                <svg className="h-9 w-9 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                                </svg>
                                            </div>
                                            <div className="rounded-lg bg-white/60 p-4 shadow-lg dark:bg-gray-700/60">
                                                <svg className="h-9 w-9 text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="absolute inset-0 rounded-t-lg shadow-[inset_0px_0px_0px_1px_rgba(26,26,0,0.16)] lg:rounded-t-none lg:rounded-r-lg dark:shadow-[inset_0px_0px_0px_1px_#fffaed2d]" />
                        </div>
                    </main>
                </div>
                <div className="hidden h-14.5 lg:block"></div>
            </div>
        </>
    );
}
