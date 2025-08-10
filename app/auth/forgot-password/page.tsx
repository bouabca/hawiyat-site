// app/auth/forgot-password/page.tsx
"use client"
import { ArrowLeft, Mail, SquareArrowOutUpRight } from "lucide-react";
import Image from 'next/image';
import Link from "next/link";
import { useState } from 'react';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!email.trim()) {
            setMessage('Email address is required');
            setIsError(true);
            return;
        }

        if (!validateEmail(email)) {
            setMessage('Please enter a valid email address');
            setIsError(true);
            return;
        }

        setIsLoading(true);
        setMessage('');
        setIsError(false);

        try {
            const response = await fetch('/api/auth/forgot-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: email.toLowerCase().trim() }),
            });

            const data = await response.json();

            if (response.ok) {
                setIsSubmitted(true);
                setMessage(data.message || 'Password reset link sent to your email');
                setIsError(false);
            } else {
                setMessage(data.error || 'Something went wrong');
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

    const handleResend = async () => {
        setIsLoading(true);
        setMessage('');
        setIsError(false);

        try {
            const response = await fetch('/api/auth/forgot-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: email.toLowerCase().trim() }),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage('Password reset link sent again to your email');
                setIsError(false);
            } else {
                setMessage(data.error || 'Failed to resend email');
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

                    {!isSubmitted ? (
                        <>
                            {/* Title */}
                            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-normal 
                                bg-gradient-to-b from-[rgba(255,255,255,1)] 
                                to-[rgba(153,153,153,1)] bg-clip-text text-transparent
                                mb-2 text-center leading-tight">
                                Forgot Password?
                            </h1>

                            <p className="text-gray-400 text-center mb-8 sm:mb-10 text-sm sm:text-base">
                                Enter your email and we will send you a secure reset link
                            </p>

                            {/* Forgot Password Form */}
                            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                                
                                {/* Email Field */}
                                <div className="relative">
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Enter your email address"
                                        disabled={isLoading}
                                        className="py-4 px-4 pl-12 w-full rounded-[10px]
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
                                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
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
                                            Sending reset link...
                                        </div>
                                    ) : (
                                        'Send Reset Link'
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
                        </>
                    ) : (
                        <>
                            {/* Success State */}
                            <div className="text-center">
                                {/* Email Icon */}
                                <div className="w-16 h-16 bg-gradient-to-b from-[#2BFFFF] to-[#1CA3A3] rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Mail className="w-8 h-8 text-black" />
                                </div>

                                {/* Title */}
                                <h1 className="text-2xl sm:text-3xl md:text-4xl font-normal 
                                    bg-gradient-to-b from-[rgba(255,255,255,1)] 
                                    to-[rgba(153,153,153,1)] bg-clip-text text-transparent
                                    mb-4 leading-tight">
                                    Check Your Email
                                </h1>

                                <p className="text-gray-400 mb-6 text-sm sm:text-base leading-relaxed">
                                    We ve sent a secure reset link to<br />
                                    <span className="text-white font-medium">{email}</span>
                                </p>

                                {/* Message display for success state */}
                                {message && (
                                    <div className={`text-sm sm:text-base text-center px-4 py-3 rounded-lg mb-6 ${
                                        isError 
                                            ? 'text-red-400 bg-red-900/20 border border-red-800/30' 
                                            : 'text-green-400 bg-green-900/20 border border-green-800/30'
                                    }`}>
                                        {message}
                                    </div>
                                )}

                                {/* Instructions */}
                                <div className="bg-[#151515] border border-[#414141] rounded-lg p-4 sm:p-6 mb-6 text-left">
                                    <h3 className="text-white font-medium mb-3 text-sm sm:text-base">Next steps:</h3>
                                    <ol className="text-gray-400 text-xs sm:text-sm space-y-2">
                                        <li className="flex items-start gap-2">
                                            <span className="text-[#2BFFFF] font-medium min-w-[20px]">1.</span>
                                            Check your email inbox (and spam folder)
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-[#2BFFFF] font-medium min-w-[20px]">2.</span>
                                            Click the secure reset link in the email
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-[#2BFFFF] font-medium min-w-[20px]">3.</span>
                                            Create your new password
                                        </li>
                                    </ol>
                                </div>

                                {/* Security Note */}
                                <div className="bg-blue-900/20 border border-blue-800/30 rounded-lg p-4 mb-6">
                                    <p className="text-blue-300 text-xs sm:text-sm">
                                        🔒 The reset link will expire in 1 hour for security
                                    </p>
                                </div>

                                {/* Action Buttons */}
                                <div className="space-y-3">
                                    {/* Resend Button */}
                                    <button
                                        onClick={handleResend}
                                        disabled={isLoading}
                                        className="w-full 
                                            bg-transparent border border-[#414141]
                                            text-white py-4 px-4 font-medium rounded-[10px] 
                                            hover:border-[#2BFFFF] hover:text-[#2BFFFF]
                                            active:scale-[0.98] transition-all duration-200
                                            text-base
                                            min-h-[52px] sm:min-h-[56px]
                                            disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-[#414141] disabled:hover:text-white disabled:active:scale-100"
                                    >
                                        {isLoading ? (
                                            <div className="flex justify-center items-center gap-2">
                                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                Resending...
                                            </div>
                                        ) : (
                                            'Resend Reset Link'
                                        )}
                                    </button>

                                    {/* Back to Sign In */}
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
                                        Back to Sign In
                                    </Link>
                                </div>
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