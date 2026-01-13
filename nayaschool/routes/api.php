<?php

use App\Http\Controllers\Auth\GoogleAuthController;
use Illuminate\Support\Facades\Route;

Route::middleware('web')->post('/auth/google', [GoogleAuthController::class, 'handleGoogleAuth']);
