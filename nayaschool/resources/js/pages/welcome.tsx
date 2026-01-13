import { dashboard, login, register } from '@/routes';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

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
            <div className="flex flex-col min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 text-[#1b1b18] dark:bg-gradient-to-br dark:from-gray-900 dark:via-gray-800 dark:to-indigo-950">
            <div className="flex flex-col items-center justify-center flex-1 p-6 lg:p-8">
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
                <div className="flex w-full items-center justify-center opacity-100 transition-opacity duration-1000 lg:grow starting:opacity-0 animate-in fade-in slide-in-from-bottom-8">
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
                            {!auth.user && (
                                <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                                    <p className="text-center text-sm text-gray-600 dark:text-gray-400 mb-4">Or continue with</p>
                                    {GOOGLE_CLIENT_ID ? (
                                        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
                                            <div className="flex justify-center">
                                                <GoogleLogin
                                                    onSuccess={(credentialResponse) => {
                                                        console.log('Google login success:', credentialResponse);
                                                        // Get CSRF token from meta tag
                                                        const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';
                                                        // Send token to your backend
                                                        fetch('/api/auth/google', {
                                                            method: 'POST',
                                                            headers: {
                                                                'Content-Type': 'application/json',
                                                                'X-CSRF-TOKEN': csrfToken,
                                                            },
                                                            body: JSON.stringify({
                                                                token: credentialResponse.credential,
                                                            }),
                                                        })
                                                            .then(res => {
                                                                if (!res.ok) {
                                                                    throw new Error(`HTTP error! status: ${res.status}`);
                                                                }
                                                                return res.json();
                                                            })
                                                            .then(data => {
                                                                console.log('Authentication successful:', data);
                                                                // Reload page to ensure session is established
                                                                window.location.href = '/dashboard';
                                                            })
                                                            .catch(error => {
                                                                console.error('Authentication error:', error);
                                                                alert('Login failed. Please try again.');
                                                            });
                                                    }}
                                                    onError={() => {
                                                        console.log('Google login failed');
                                                        alert('Google login failed. Please try again.');
                                                    }}
                                                    theme="filled_blue"
                                                    size="large"
                                                />
                                            </div>
                                        </GoogleOAuthProvider>
                                    ) : (
                                        <div className="flex justify-center">
                                            <button
                                                onClick={() => {
                                                    alert('Google Sign-In is not configured yet.\n\nTo enable it:\n1. Add your Google Client ID to .env file\n2. Set VITE_GOOGLE_CLIENT_ID=your_client_id\n3. Restart the development server\n\nVisit Google Cloud Console to get your Client ID.');
                                                }}
                                                className="inline-flex items-center justify-center gap-3 rounded-xl bg-white/20 dark:bg-gray-700/50 px-6 py-3 text-sm font-medium text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 hover:bg-white/30 dark:hover:bg-gray-700/70 transition-all duration-300 hover:scale-105 cursor-pointer shadow-lg hover:shadow-xl"
                                            >
                                                <svg className="h-5 w-5" viewBox="0 0 24 24">
                                                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                                </svg>
                                                Sign in with Google
                                            </button>
                                        </div>
                                    )}
                                    <p className="text-center text-xs text-gray-500 dark:text-gray-500 mt-3">
                                        Google Sign-In not configured. Add VITE_GOOGLE_CLIENT_ID to .env to enable.
                                    </p>
                                </div>
                            )}
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
            </div>
            <footer className="w-full border-t border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm py-12">
                <div className="mx-auto max-w-4xl px-6 lg:px-8">
                    <div className="grid gap-8 sm:grid-cols-3 mb-8">
                        <div>
                            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">About</h3>
                            <ul className="space-y-2">
                                <li>
                                    <a href="#" className="text-sm text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">About Naya School</a>
                                </li>
                                <li>
                                    <a href="#" className="text-sm text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Blog</a>
                                </li>
                                <li>
                                    <a href="#" className="text-sm text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Careers</a>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Support</h3>
                            <ul className="space-y-2">
                                <li>
                                    <a href="#" className="text-sm text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Help Center</a>
                                </li>
                                <li>
                                    <a href="#" className="text-sm text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Contact Us</a>
                                </li>
                                <li>
                                    <a href="#" className="text-sm text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">FAQs</a>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Legal</h3>
                            <ul className="space-y-2">
                                <li>
                                    <a href="#" className="text-sm text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Privacy Policy</a>
                                </li>
                                <li>
                                    <a href="#" className="text-sm text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Terms of Service</a>
                                </li>
                                <li>
                                    <a href="#" className="text-sm text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Cookie Policy</a>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-gray-200 dark:border-gray-700 pt-8 flex flex-col sm:flex-row items-center justify-between">
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 sm:mb-0">
                            &copy; 2026 Naya School. All rights reserved.
                        </p>
                        <div className="flex gap-6">
                            <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M8.29 20v-7.21H5.5V9.25h2.79V7.02c0-2.74 1.68-4.24 4.13-4.24 1.17 0 2.18.09 2.47.13v2.86h-1.7c-1.33 0-1.59.63-1.59 1.56V9.25h3.19l-4.15 3.54v7.21H8.29z" />
                                </svg>
                            </a>
                            <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2s9 5 20 5a9.5 9.5 0 00-9-5.5c4.75 2.25 9-2 9-2z" />
                                </svg>
                            </a>
                            <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>
            </footer>
            </div>
        </>
    );
}
