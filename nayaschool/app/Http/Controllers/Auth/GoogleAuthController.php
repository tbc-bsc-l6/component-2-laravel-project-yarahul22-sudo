<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

class GoogleAuthController extends Controller
{
    public function handleGoogleAuth(Request $request)
    {
        try {
            $token = $request->input('token');
            
            if (!$token) {
                return response()->json(['error' => 'No token provided'], 400);
            }

            // Decode JWT token - split by dots
            $parts = explode('.', $token);
            if (count($parts) !== 3) {
                return response()->json(['error' => 'Invalid token format'], 400);
            }

            // Decode payload (base64url decode)
            $payloadJson = base64_decode(strtr($parts[1], '-_', '+/'));
            $payload = json_decode($payloadJson, true);
            
            if (!$payload || !isset($payload['email'])) {
                return response()->json(['error' => 'Invalid token payload'], 400);
            }

            // Extract user info
            $email = $payload['email'];
            $name = $payload['name'] ?? 'User';

            // Find or create user
            $user = User::where('email', $email)->first();

            if (!$user) {
                $user = User::create([
                    'name' => $name,
                    'email' => $email,
                    'password' => bcrypt(Str::random(32)),
                    'email_verified_at' => now(),
                ]);
            }

            // Log the user in
            Auth::login($user, true);

            // Regenerate session
            $request->session()->regenerate();

            return response()->json([
                'success' => true,
                'message' => 'Logged in successfully',
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                ],
            ]);
        } catch (\Exception $e) {
            \Log::error('Google Auth Error: ' . $e->getMessage() . ' ' . $e->getTraceAsString());
            return response()->json([
                'error' => 'Authentication failed',
                'message' => $e->getMessage(),
            ], 500);
        }
    }
}

