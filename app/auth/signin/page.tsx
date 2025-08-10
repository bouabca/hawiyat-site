// app/auth/email/signin/page.tsx
"use client"
import { ArrowLeft, Eye, EyeOff, SquareArrowOutUpRight } from "lucide-react";
import Image from 'next/image';
import Link from "next/link";
import { useState } from 'react';
import { useRouter, useSearchParams } from "next/navigation";
import { signIn, getSession } from "next-auth/react";

export default function Page() {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();
    
    // Get callback URL or default to dashboard
    const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';
    
    // Check for NextAuth error messages
    const error = searchParams.get('error');
    
    // Display error messages from URL params (like invalid credentials)
    useState(() => {
        if (error) {
            switch (error) {
                case 'CredentialsSignin':
                    setMessage('Invalid email or password');
                    setIsError(true);
                    break;
                case 'OAuthSignin':
                case 'OAuthCallback':
                case 'OAuthCreateAccount':
                case 'EmailCreateAccount':
                case 'Callback':
                    setMessage('There was a problem signing you in');
                    setIsError(true);
                    break;
                case 'OAuthAccountNotLinked':
                    setMessage('Account already exists with different provider');
                    setIsError(true);
                    break;
                case 'EmailSignin':
                    setMessage('Check your email for the sign in link');
                    setIsError(false);
                    break;
                case 'CredentialsSignup':
                    setMessage('Account creation failed');
                    setIsError(true);
                    break;
                case 'SessionRequired':
                    setMessage('Please sign in to access this page');
                    setIsError(true);
                    break;
                default:
                    setMessage('An error occurred during sign in');
                    setIsError(true);
            }
        }
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear messages when user starts typing
        if (message) {
            setMessage('');
            setIsError(false);
        }
    };

    const validateForm = () => {
        const { email, password } = formData;
        
        if (!email.trim()) {
            setMessage('Email address is required');
            setIsError(true);
            return false;
        }
        
        if (!password.trim()) {
            setMessage('Password is required');
            setIsError(true);
            return false;
        }

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setMessage('Please enter a valid email address');
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

        try {
            const result = await signIn('credentials', {
                email: formData.email,
                password: formData.password,
                redirect: false,
            });

            if (result?.error) {
                setMessage('Invalid email or password');
                setIsError(true);
            } else if (result?.ok) {
                setMessage('Login successful!');
                setIsError(false);
                
                // Get the updated session to ensure user is authenticated
                const session = await getSession();
                
                if (session) {
                    // Redirect to the callback URL or dashboard
                    router.push(callbackUrl);
                } else {
                    setMessage('Authentication failed. Please try again.');
                    setIsError(true);
                }
            }
        } catch (error) {
            console.error('Sign in error:', error);
            setMessage('Network error. Please try again.');
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
                        href="/auth"
                        className="absolute -top-16 left-0 inline-flex items-center gap-2 text-white hover:text-[#2BFFFF] transition-colors duration-200 text-sm sm:text-base group"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" />
                        Back to login options
                    </Link>

                    {/* Title */}
                    <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-normal 
                        bg-gradient-to-b from-[rgba(255,255,255,1)] 
                        to-[rgba(153,153,153,1)] bg-clip-text text-transparent
                        mb-2 text-center leading-tight">
                        Welcome Back
                    </h1>

                    <p className="text-gray-400 text-center mb-8 sm:mb-10 text-sm sm:text-base">
                        Sign in to your Hawiyat account
                    </p>

                    {/* Login Form */}
                    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                        
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
                            autoComplete="email"
                        />

                        {/* Password Field */}
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                placeholder="Password"
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
                                autoComplete="current-password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                disabled={isLoading}
                                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors disabled:opacity-50"
                                aria-label={showPassword ? "Hide password" : "Show password"}
                            >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>

                        {/* Forgot Password Link */}
                        <div className="text-right">
                            <Link
                                href="/auth/forgot-password"
                                className="text-gray-400 hover:text-[#2BFFFF] transition-colors duration-200 text-sm sm:text-base underline underline-offset-2"
                            >
                                Forgot password?
                            </Link>
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
                                text-black py-3 sm:py-4 px-4 font-medium rounded-[10px] 
                                hover:cursor-pointer hover:shadow-lg hover:shadow-[#2BFFFF]/25
                                active:scale-[0.98] transition-all duration-200
                                text-sm sm:text-base
                                disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none disabled:active:scale-100"
                        >
                            {isLoading ? (
                                <div className="flex justify-center items-center gap-2">
                                    <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                                    Signing in...
                                </div>
                            ) : (
                                'Sign In'
                            )}
                        </button>

                        {/* Sign Up Link */}
                        <div className="text-center">
                            <span className="text-gray-400 text-sm sm:text-base">
                                Dont have an account?{' '}
                                <Link
                                    href="/auth/signup"
                                    className="text-[#2BFFFF] hover:underline transition-colors duration-200"
                                >
                                    Sign up
                                </Link>
                            </span>
                        </div>
                    </form>

                    {/* Footer - Terms and Privacy */}
                    <div className="mt-8 sm:mt-10 text-center">
                        <p className="text-xs sm:text-sm text-gray-400 leading-relaxed px-4 sm:px-0">
                            By signing in, you agree to our{' '}
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

                    {/* Additional Mobile Spacing */}
                    <div className="h-8 sm:h-0"></div>
                </div>
            </div>
        </>
    );
}