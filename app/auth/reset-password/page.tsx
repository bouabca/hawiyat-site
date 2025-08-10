// app/auth/reset-password/page.tsx
"use client"
import { ArrowLeft, Eye, EyeOff, Lock, CheckCircle, SquareArrowOutUpRight } from "lucide-react";
import Image from 'next/image';
import Link from "next/link";
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

function ResetPasswordForm() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [token, setToken] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isValidating, setIsValidating] = useState(true);
    const [isValidToken, setIsValidToken] = useState(false);

    useEffect(() => {
        const tokenParam = searchParams.get('token');
        const emailParam = searchParams.get('email');
        
        if (tokenParam && emailParam) {
            setToken(tokenParam);
            setEmail(decodeURIComponent(emailParam));
            validateToken(tokenParam, emailParam);
        } else {
            setMessage('Invalid or missing reset link. Please request a new password reset.');
            setIsError(true);
            setIsValidating(false);
        }
    }, [searchParams]);

    const validateToken = async (tokenParam: string, emailParam: string) => {
        try {
            const response = await fetch('/api/auth/validate-reset-token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    token: tokenParam, 
                    email: decodeURIComponent(emailParam) 
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setIsValidToken(true);
                setMessage('');
                setIsError(false);
            } else {
                setMessage(data.error || 'Invalid or expired reset link');
                setIsError(true);
                setIsValidToken(false);
            }
        } catch (error) {
            console.error('Token validation error:', error);
            setMessage('Unable to validate reset link. Please try again.');
            setIsError(true);
            setIsValidToken(false);
        } finally {
            setIsValidating(false);
        }
    };

    const validatePassword = (password: string) => {
        if (password.length < 8) {
            return 'Password must be at least 8 characters long';
        }
        if (!/(?=.*[a-z])/.test(password)) {
            return 'Password must contain at least one lowercase letter';
        }
        if (!/(?=.*[A-Z])/.test(password)) {
            return 'Password must contain at least one uppercase letter';
        }
        if (!/(?=.*\d)/.test(password)) {
            return 'Password must contain at least one number';
        }
        return null;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!password || !confirmPassword) {
            setMessage('Please fill in all fields');
            setIsError(true);
            return;
        }

        const passwordError = validatePassword(password);
        if (passwordError) {
            setMessage(passwordError);
            setIsError(true);
            return;
        }

        if (password !== confirmPassword) {
            setMessage('Passwords do not match');
            setIsError(true);
            return;
        }

        setIsLoading(true);
        setMessage('');
        setIsError(false);

        try {
            const response = await fetch('/api/auth/reset-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    token, 
                    email,
                    password 
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setIsSuccess(true);
                setMessage('Password reset successfully');
                setIsError(false);
                
                // Redirect to sign in after 3 seconds
                setTimeout(() => {
                    router.push('/auth/signin');
                }, 3000);
            } else {
                setMessage(data.error || 'Failed to reset password');
                setIsError(true);
            }
        } catch (error) {
            console.error('Network error:', error);
            setMessage('Network error. Please check your connection and try again.');
            setIsError(true);
        } finally {
            setIsLoading(false);
        }
    };

    if (isValidating) {
        return (
            <div className="min-h-screen w-full flex justify-center items-center px-4 sm:px-6 lg:px-8 py-8">
                <Image
                    className="fixed top-0 z-[-1] w-full h-full object-cover"
                    width={1920}
                    height={1080}
                    src="/curtains-bg.svg"
                    alt="Curtains Background effect"
                    priority
                />
                <Image
                    className="fixed top-0 z-[-1] w-full h-full object-cover"
                    width={1920}
                    height={1080}
                    src="/grid-mesh.svg"
                    alt="Grid mesh background"
                />
                
                <div className="text-center">
                    <div className="w-8 h-8 border-2 border-[#2BFFFF] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-gray-400">Validating reset link...</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="min-h-screen w-full flex justify-center items-center px-4 sm:px-6 lg:px-8 py-8">
                {/* Background Images */}
                <Image
                    className="fixed top-0 z-[-1] w-full h-full object-cover"
                    width={1920}
                    height={1080}
                    src="/curtains-bg.svg"
                    alt="Curtains Background effect"
                    priority
                />
                <Image
                    className="fixed top-0 z-[-1] w-full h-full object-cover"
                    width={1920}
                    height={1080}
                    src="/grid-mesh.svg"
                    alt="Grid mesh background"
                />

                {/* Main Card Container */}
                <div className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl z-10 relative">
                    
                    {/* Back Button */}
                    <Link
                        href="/auth/signin"
                        className="absolute -top-16 left-0 inline-flex items-center gap-2 text-white hover:text-[#2BFFFF] transition-colors duration-200 text-sm sm:text-base group"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" />
                        Back to sign in
                    </Link>

                    {!isSuccess ? (
                        <>
                            {/* Title */}
                            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-normal 
                                bg-gradient-to-b from-[rgba(255,255,255,1)] 
                                to-[rgba(153,153,153,1)] bg-clip-text text-transparent
                                mb-2 text-center leading-tight">
                                Reset Password
                            </h1>

                            <p className="text-gray-400 text-center mb-8 sm:mb-10 text-sm sm:text-base">
                                {email ? `Create a new password for ${email}` : 'Create your new secure password'}
                            </p>

                            {/* Reset Password Form */}
                            {isValidToken ? (
                                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                                    
                                    {/* New Password Field */}
                                    <div className="relative">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="Enter new password"
                                            disabled={isLoading}
                                            className="py-4 px-4 pl-12 pr-12 w-full rounded-[10px]
                                                text-base
                                                bg-[#151515]
                                                border border-[#414141]
                                                focus:outline-none focus:ring-2 focus:ring-[#2BFFFF] focus:border-transparent
                                                transition-all duration-200
                                                placeholder:text-gray-500
                                                disabled:opacity-50 disabled:cursor-not-allowed
                                                min-h-[52px] sm:min-h-[56px]"
                                            required
                                        />
                                        <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-200"
                                            disabled={isLoading}
                                        >
                                            {showPassword ? (
                                                <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" />
                                            ) : (
                                                <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                                            )}
                                        </button>
                                    </div>

                                    {/* Confirm Password Field */}
                                    <div className="relative">
                                        <input
                                            type={showConfirmPassword ? "text" : "password"}
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            placeholder="Confirm new password"
                                            disabled={isLoading}
                                            className="py-4 px-4 pl-12 pr-12 w-full rounded-[10px]
                                                text-base
                                                bg-[#151515]
                                                border border-[#414141]
                                                focus:outline-none focus:ring-2 focus:ring-[#2BFFFF] focus:border-transparent
                                                transition-all duration-200
                                                placeholder:text-gray-500
                                                disabled:opacity-50 disabled:cursor-not-allowed
                                                min-h-[52px] sm:min-h-[56px]"
                                            required
                                        />
                                        <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-200"
                                            disabled={isLoading}
                                        >
                                            {showConfirmPassword ? (
                                                <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" />
                                            ) : (
                                                <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                                            )}
                                        </button>
                                    </div>

                                    {/* Password Requirements */}
                                    <div className="bg-[#151515] border border-[#414141] rounded-lg p-4 text-left">
                                        <h3 className="text-white font-medium mb-3 text-sm">Password requirements:</h3>
                                        <ul className="text-gray-400 text-xs space-y-1">
                                            <li className={`flex items-center gap-2 ${password.length >= 8 ? 'text-green-400' : ''}`}>
                                                <div className={`w-2 h-2 rounded-full ${password.length >= 8 ? 'bg-green-400' : 'bg-gray-600'}`} />
                                                At least 8 characters
                                            </li>
                                            <li className={`flex items-center gap-2 ${/(?=.*[a-z])/.test(password) ? 'text-green-400' : ''}`}>
                                                <div className={`w-2 h-2 rounded-full ${/(?=.*[a-z])/.test(password) ? 'bg-green-400' : 'bg-gray-600'}`} />
                                                One lowercase letter
                                            </li>
                                            <li className={`flex items-center gap-2 ${/(?=.*[A-Z])/.test(password) ? 'text-green-400' : ''}`}>
                                                <div className={`w-2 h-2 rounded-full ${/(?=.*[A-Z])/.test(password) ? 'bg-green-400' : 'bg-gray-600'}`} />
                                                One uppercase letter
                                            </li>
                                            <li className={`flex items-center gap-2 ${/(?=.*\d)/.test(password) ? 'text-green-400' : ''}`}>
                                                <div className={`w-2 h-2 rounded-full ${/(?=.*\d)/.test(password) ? 'bg-green-400' : 'bg-gray-600'}`} />
                                                One number
                                            </li>
                                        </ul>
                                    </div>

                                    {/* Message display */}
                                    {message && (
                                        <div className={`text-sm sm:text-base text-center px-4 py-3 rounded-lg ${
                                            isError 
                                                ? 'text-red-400 bg-red-900/20 border border-red-800/30' 
                                                : 'text-green-400 bg-green-900/20 border border-green-800/30'
                                        }`}>
                                            {message}
                                        </div>
                                    )}

                                    {/* Submit Button */}
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full 
                                            bg-gradient-to-b from-[#2BFFFF] 
                                            to-[#1CA3A3]
                                            text-black py-4 px-4 font-medium rounded-[10px] 
                                            hover:cursor-pointer hover:shadow-lg hover:shadow-[#2BFFFF]/25
                                            active:scale-[0.98] transition-all duration-200
                                            text-base
                                            min-h-[52px] sm:min-h-[56px]
                                            disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none disabled:active:scale-100"
                                    >
                                        {isLoading ? (
                                            <div className="flex justify-center items-center gap-2">
                                                <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                                                Resetting password...
                                            </div>
                                        ) : (
                                            'Reset Password'
                                        )}
                                    </button>

                                    {/* Sign in Link */}
                                    <div className="text-center">
                                        <span className="text-gray-400 text-sm sm:text-base">
                                            Remember your password?{' '}
                                            <Link
                                                href="/auth/signin"
                                                className="text-[#2BFFFF] hover:underline transition-colors duration-200"
                                            >
                                                Sign in
                                            </Link>
                                        </span>
                                    </div>
                                </form>
                            ) : (
                                /* Invalid Token State */
                                <div className="text-center">
                                    <div className="w-16 h-16 bg-red-900/20 border border-red-800/30 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <Lock className="w-8 h-8 text-red-400" />
                                    </div>

                                    {/* Message display for invalid token */}
                                    {message && (
                                        <div className="text-sm sm:text-base text-center px-4 py-3 rounded-lg mb-6 text-red-400 bg-red-900/20 border border-red-800/30">
                                            {message}
                                        </div>
                                    )}

                                    <Link
                                        href="/auth/forgot-password"
                                        className="w-full 
                                            bg-gradient-to-b from-[#2BFFFF] 
                                            to-[#1CA3A3]
                                            text-black py-4 px-4 font-medium rounded-[10px] 
                                            hover:cursor-pointer hover:shadow-lg hover:shadow-[#2BFFFF]/25
                                            active:scale-[0.98] transition-all duration-200
                                            text-base
                                            min-h-[52px] sm:min-h-[56px]
                                            block text-center flex items-center justify-center"
                                    >
                                        Request New Reset Link
                                    </Link>
                                </div>
                            )}
                        </>
                    ) : (
                        <>
                            {/* Success State */}
                            <div className="text-center">
                                {/* Success Icon */}
                                <div className="w-16 h-16 bg-gradient-to-b from-[#2BFFFF] to-[#1CA3A3] rounded-full flex items-center justify-center mx-auto mb-6">
                                    <CheckCircle className="w-8 h-8 text-black" />
                                </div>

                                {/* Title */}
                                <h1 className="text-2xl sm:text-3xl md:text-4xl font-normal 
                                    bg-gradient-to-b from-[rgba(255,255,255,1)] 
                                    to-[rgba(153,153,153,1)] bg-clip-text text-transparent
                                    mb-4 leading-tight">
                                    Password Reset Successfully!
                                </h1>

                                <p className="text-gray-400 mb-6 text-sm sm:text-base leading-relaxed">
                                    Your password has been reset successfully.<br />
                                    You can now sign in with your new password.
                                </p>

                                {/* Success message */}
                                {message && (
                                    <div className="text-sm sm:text-base text-center px-4 py-3 rounded-lg mb-6 text-green-400 bg-green-900/20 border border-green-800/30">
                                        {message}
                                    </div>
                                )}

                                {/* Auto redirect notice */}
                                <div className="bg-blue-900/20 border border-blue-800/30 rounded-lg p-4 mb-6">
                                    <p className="text-blue-300 text-xs sm:text-sm">
                                        🔄 Redirecting to sign in page in 3 seconds...
                                    </p>
                                </div>

                                {/* Sign In Button */}
                                <Link
                                    href="/auth/signin"
                                    className="w-full 
                                        bg-gradient-to-b from-[#2BFFFF] 
                                        to-[#1CA3A3]
                                        text-black py-4 px-4 font-medium rounded-[10px] 
                                        hover:cursor-pointer hover:shadow-lg hover:shadow-[#2BFFFF]/25
                                        active:scale-[0.98] transition-all duration-200
                                        text-base
                                        min-h-[52px] sm:min-h-[56px]
                                        block text-center flex items-center justify-center"
                                >
                                    Continue to Sign In
                                </Link>
                            </div>
                        </>
                    )}

                    {/* Footer - Help */}
                    <div className="mt-6 sm:mt-8 text-center">
                        <p className="text-xs sm:text-sm text-gray-400 leading-relaxed px-4 sm:px-0">
                            Need help?{' '}
                            <button className="text-white hover:text-[#2BFFFF] transition-colors underline underline-offset-2 inline-flex items-center gap-1">
                                Contact Support
                                <SquareArrowOutUpRight className="w-3 h-3" />
                            </button>
                        </p>
                    </div>

                    {/* Additional Mobile Spacing */}
                    <div className="h-8 sm:h-0"></div>
                </div>
            </div>
        </>
    );
}

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen w-full flex justify-center items-center">
                <div className="w-8 h-8 border-2 border-[#2BFFFF] border-t-transparent rounded-full animate-spin" />
            </div>
        }>
            <ResetPasswordForm />
        </Suspense>
    );
}