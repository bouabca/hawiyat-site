// app/auth/email/signup/page.tsx
"use client"
import { ArrowLeft, Eye, EyeOff, SquareArrowOutUpRight, Mail, RefreshCw } from "lucide-react";
import Image from 'next/image';
import Link from "next/link";
import { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";

export default function Page() {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        firstName: '',
        lastName: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [showVerificationScreen, setShowVerificationScreen] = useState(false);
    const [isResending, setIsResending] = useState(false);
    const [resendTimer, setResendTimer] = useState(0);
    const [canResend, setCanResend] = useState(true);
    const router = useRouter();

    // Timer effect for resend cooldown
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (resendTimer > 0) {
            interval = setInterval(() => {
                setResendTimer((prev) => {
                    if (prev <= 1) {
                        setCanResend(true);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [resendTimer]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        
        // Clear error messages when user starts typing
        if (message && isError) {
            setMessage('');
            setIsError(false);
        }
    };

    const validateForm = () => {
        const { email, password, confirmPassword, firstName, lastName } = formData;
        
        if (!firstName.trim() || !lastName.trim()) {
            setMessage('First and last name are required');
            setIsError(true);
            return false;
        }

        if (!email.trim()) {
            setMessage('Email address is required');
            setIsError(true);
            return false;
        }

        // Enhanced email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setMessage('Please enter a valid email address');
            setIsError(true);
            return false;
        }
        
        if (!password.trim()) {
            setMessage('Password is required');
            setIsError(true);
            return false;
        }

        if (password.length < 8) {
            setMessage('Password must be at least 8 characters long');
            setIsError(true);
            return false;
        }

        if (password !== confirmPassword) {
            setMessage('Passwords do not match');
            setIsError(true);
            return false;
        }

        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        setIsLoading(true);
        setMessage('');
        setIsError(false);
        setIsSuccess(false);

        try {
            const response = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                // Check if email verification is required
                if (data.requiresVerification) {
                    setShowVerificationScreen(true);
                    setMessage('');
                    setIsError(false);
                    // Start initial cooldown timer
                    setResendTimer(60); // 60 seconds initial cooldown
                    setCanResend(false);
                } else {
                    // Fallback for old behavior (shouldn't happen with new flow)
                    setMessage('Account created successfully! Redirecting to sign in...');
                    setIsError(false);
                    setIsSuccess(true);
                    setTimeout(() => {
                        router.push('/auth/signin?message=Account created successfully. Please sign in.');
                    }, 2000);
                }
            } else {
                setMessage(data.error || 'Something went wrong');
                setIsError(true);
                setIsSuccess(false);
            }
        } catch (error) {
            console.error('Signup error:', error);
            setMessage('Network error. Please check your connection and try again.');
            setIsError(true);
            setIsSuccess(false);
        } finally {
            setIsLoading(false);
        }
    };

    const handleResendVerification = async () => {
        if (!canResend || isResending) return;

        setIsResending(true);
        setMessage('');
        setIsError(false);
        setCanResend(false);

        try {
            const response = await fetch('/api/auth/verify-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: formData.email.toLowerCase() }),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage('Verification email sent! Check your inbox and spam folder.');
                setIsError(false);
                // Start cooldown timer after successful resend
                setResendTimer(120); // 2 minutes cooldown after resend
            } else {
                setMessage(data.error || 'Failed to resend verification email');
                setIsError(true);
                setCanResend(true); // Allow retry on error
            }
        } catch (error) {
            console.error('Resend verification error:', error);
            setMessage('Network error. Please try again.');
            setIsError(true);
            setCanResend(true); // Allow retry on network error
        } finally {
            setIsResending(false);
        }
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    // Email Verification Screen
    if (showVerificationScreen) {
        return (
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

                <div className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl z-10 relative">
                    {/* Back Button */}
                    <button
                        onClick={() => setShowVerificationScreen(false)}
                        className="absolute -top-16 left-0 inline-flex items-center gap-2 text-white hover:text-[#2BFFFF] transition-colors duration-200 text-sm sm:text-base group"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" />
                        Back to signup
                    </button>

                    <div className="text-center py-8">
                        {/* Mail Icon */}
                        <div className="w-20 h-20 mx-auto mb-6 bg-[#2BFFFF]/20 rounded-full flex items-center justify-center">
                            <Mail className="w-10 h-10 text-[#2BFFFF]" />
                        </div>

                        {/* Title */}
                        <h1 className="text-2xl sm:text-3xl md:text-4xl font-normal 
                            bg-gradient-to-b from-[rgba(255,255,255,1)] 
                            to-[rgba(153,153,153,1)] bg-clip-text text-transparent
                            mb-4 leading-tight">
                            Check Your Email
                        </h1>

                        <p className="text-gray-400 mb-2 text-sm sm:text-base">
                            We ve sent a verification link to:
                        </p>
                        
                        <p className="text-white font-medium mb-8 text-sm sm:text-base break-all px-4">
                            {formData.email}
                        </p>

                        <div className="space-y-4 text-left">
                            <div className="bg-[#151515] border border-[#414141] rounded-lg p-4 text-sm text-gray-300">
                                <h3 className="text-white font-medium mb-2">Next Steps:</h3>
                                <ol className="space-y-2 list-decimal list-inside">
                                    <li>Check your email inbox (and spam folder)</li>
                                    <li>Click the verification link in the email</li>
                                    <li>Return here to sign in to your account</li>
                                </ol>
                            </div>

                            {/* Message display */}
                            {message && (
                                <div className={`text-sm sm:text-base text-center px-4 py-3 rounded-lg transition-all duration-200 ${
                                    isError 
                                        ? 'text-red-400 bg-red-900/20 border border-red-800/30' 
                                        : 'text-green-400 bg-green-900/20 border border-green-800/30'
                                }`}>
                                    {message}
                                </div>
                            )}

                            {/* Resend Email Button */}
                            <button
                                onClick={handleResendVerification}
                                disabled={!canResend || isResending}
                                className="w-full py-3 sm:py-4 px-4 font-medium rounded-[10px] 
                                    bg-[#151515] border border-[#414141]
                                    text-white hover:border-[#2BFFFF] hover:text-[#2BFFFF]
                                    transition-all duration-200 text-sm sm:text-base
                                    disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-[#414141] disabled:hover:text-white
                                    flex items-center justify-center gap-2"
                            >
                                {isResending ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        Sending...
                                    </>
                                ) : !canResend ? (
                                    <>
                                        <RefreshCw className="w-4 h-4" />
                                        Resend in {formatTime(resendTimer)}
                                    </>
                                ) : (
                                    <>
                                        <RefreshCw className="w-4 h-4" />
                                        Resend Verification Email
                                    </>
                                )}
                            </button>

                            {/* Timer Info */}
                            {!canResend && !isResending && resendTimer > 0 && (
                                <div className="text-center text-sm text-gray-400">
                                    Please wait {formatTime(resendTimer)} before requesting another email
                                </div>
                            )}

                            {/* Sign In Link */}
                            <div className="text-center pt-4">
                                <Link
                                    href="/auth/signin"
                                    className="text-[#2BFFFF] hover:underline transition-colors duration-200 text-sm sm:text-base"
                                >
                                    Already verified? Sign in →
                                </Link>
                            </div>
                        </div>
                    </div>
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

                    {/* Title */}
                    <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-normal 
                        bg-gradient-to-b from-[rgba(255,255,255,1)] 
                        to-[rgba(153,153,153,1)] bg-clip-text text-transparent
                        mb-2 text-center leading-tight">
                        Create Account
                    </h1>

                    <p className="text-gray-400 text-center mb-8 sm:mb-10 text-sm sm:text-base">
                        Join Hawiyat with your email
                    </p>

                    {/* Success State */}
                    {isSuccess ? (
                        <div className="text-center py-8">
                            <div className="w-16 h-16 mx-auto mb-4 bg-green-500/20 rounded-full flex items-center justify-center">
                                <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <p className="text-green-400 text-lg font-medium mb-2">Account Created!</p>
                            <p className="text-gray-400 text-sm">Redirecting you to sign in...</p>
                        </div>
                    ) : (
                        /* Signup Form */
                        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                            
                            {/* Name Fields */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <input
                                    type="text"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleInputChange}
                                    placeholder="First name"
                                    disabled={isLoading}
                                    className="py-3 sm:py-4 px-4 sm:px-5 w-full rounded-[10px]
                                        text-sm sm:text-base
                                        bg-[#151515]
                                        border border-[#414141]
                                        focus:outline-none focus:ring-2 focus:ring-[#2BFFFF] focus:border-transparent
                                        transition-all duration-200
                                        placeholder:text-gray-500
                                        disabled:opacity-50 disabled:cursor-not-allowed"
                                    required
                                />
                                <input
                                    type="text"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleInputChange}
                                    placeholder="Last name"
                                    disabled={isLoading}
                                    className="py-3 sm:py-4 px-4 sm:px-5 w-full rounded-[10px]
                                        text-sm sm:text-base
                                        bg-[#151515]
                                        border border-[#414141]
                                        focus:outline-none focus:ring-2 focus:ring-[#2BFFFF] focus:border-transparent
                                        transition-all duration-200
                                        placeholder:text-gray-500
                                        disabled:opacity-50 disabled:cursor-not-allowed"
                                    required
                                />
                            </div>

                            {/* Email Field */}
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                placeholder="Email address"
                                disabled={isLoading}
                                className="py-3 sm:py-4 px-4 sm:px-5 w-full rounded-[10px]
                                    text-sm sm:text-base
                                    bg-[#151515]
                                    border border-[#414141]
                                    focus:outline-none focus:ring-2 focus:ring-[#2BFFFF] focus:border-transparent
                                    transition-all duration-200
                                    placeholder:text-gray-500
                                    disabled:opacity-50 disabled:cursor-not-allowed"
                                required
                            />

                            {/* Password Field */}
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    placeholder="Password (min. 8 characters)"
                                    disabled={isLoading}
                                    className="py-3 sm:py-4 px-4 sm:px-5 pr-12 w-full rounded-[10px]
                                        text-sm sm:text-base
                                        bg-[#151515]
                                        border border-[#414141]
                                        focus:outline-none focus:ring-2 focus:ring-[#2BFFFF] focus:border-transparent
                                        transition-all duration-200
                                        placeholder:text-gray-500
                                        disabled:opacity-50 disabled:cursor-not-allowed"
                                    required
                                    minLength={8}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>

                            {/* Confirm Password Field */}
                            <div className="relative">
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleInputChange}
                                    placeholder="Confirm password"
                                    disabled={isLoading}
                                    className="py-3 sm:py-4 px-4 sm:px-5 pr-12 w-full rounded-[10px]
                                        text-sm sm:text-base
                                        bg-[#151515]
                                        border border-[#414141]
                                        focus:outline-none focus:ring-2 focus:ring-[#2BFFFF] focus:border-transparent
                                        transition-all duration-200
                                        placeholder:text-gray-500
                                        disabled:opacity-50 disabled:cursor-not-allowed"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                                >
                                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>

                            {/* Password Strength Indicator */}
                            <div className="text-xs sm:text-sm text-gray-400">
                                Password must contain at least 8 characters
                            </div>

                            {/* Message display */}
                            {message && (
                                <div className={`text-sm sm:text-base text-center px-4 py-3 rounded-lg transition-all duration-200 ${
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
                                    text-black py-3 sm:py-4 px-4 font-medium rounded-[10px] 
                                    hover:cursor-pointer hover:shadow-lg hover:shadow-[#2BFFFF]/25
                                    active:scale-[0.98] transition-all duration-200
                                    text-sm sm:text-base
                                    disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none disabled:active:scale-100"
                            >
                                {isLoading ? (
                                    <div className="flex justify-center items-center gap-2">
                                        <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                                        Creating account...
                                    </div>
                                ) : (
                                    'Create Account'
                                )}
                            </button>

                            {/* Login Link */}
                            <div className="text-center">
                                <span className="text-gray-400 text-sm sm:text-base">
                                    Already have an account?{' '}
                                    <Link
                                        href="/auth/signin"
                                        className="text-[#2BFFFF] hover:underline transition-colors duration-200"
                                    >
                                        Sign in
                                    </Link>
                                </span>
                            </div>
                        </form>
                    )}

                    {/* Footer - Terms and Privacy */}
                    {!isSuccess && (
                        <div className="mt-6 sm:mt-8 text-center">
                            <p className="text-xs sm:text-sm text-gray-400 leading-relaxed px-4 sm:px-0">
                                By creating an account, you agree to our{' '}
                                <button className="text-white hover:text-[#2BFFFF] transition-colors underline underline-offset-2 inline-flex items-center gap-1">
                                    Terms of Service
                                    <SquareArrowOutUpRight className="w-3 h-3" />
                                </button>
                                {' '}and{' '}
                                <button className="text-white hover:text-[#2BFFFF] transition-colors underline underline-offset-2 inline-flex items-center gap-1">
                                    Privacy Policy
                                    <SquareArrowOutUpRight className="w-3 h-3" />
                                </button>
                            </p>
                        </div>
                    )}

                    {/* Additional Mobile Spacing */}
                    <div className="h-8 sm:h-0"></div>
                </div>
            </div>
        </>
    );
}