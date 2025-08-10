// app/auth/verification-success/page.tsx
"use client"
import { CheckCircle, ArrowRight } from "lucide-react";
import Image from 'next/image';
import Link from "next/link";
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function VerificationSuccessContent() {
    const searchParams = useSearchParams();
    const verified = searchParams.get('verified');

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
                <div className="text-center py-8">
                    {/* Success Icon */}
                    <div className="w-20 h-20 mx-auto mb-6 bg-green-500/20 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-10 h-10 text-green-400" />
                    </div>

                    {/* Title */}
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-normal 
                        bg-gradient-to-b from-[rgba(255,255,255,1)] 
                        to-[rgba(153,153,153,1)] bg-clip-text text-transparent
                        mb-4 leading-tight">
                        Email Verified!
                    </h1>

                    <p className="text-gray-400 mb-8 text-sm sm:text-base">
                        Your email address has been successfully verified.<br />
                        You can now sign in to your account.
                    </p>

                    <div className="space-y-4">
                        {/* Success Message */}
                        <div className="bg-green-900/20 border border-green-800/30 rounded-lg p-4 text-green-400 text-sm sm:text-base">
                            ✅ Account verification complete!<br />
                            Welcome to Hawiyat VPS Service.
                        </div>

                        {/* Sign In Button */}
                        <Link
                            href="/auth/signin?verified=true"
                            className="w-full inline-flex items-center justify-center gap-2
                                bg-gradient-to-b from-[#2BFFFF] 
                                to-[#1CA3A3]
                                text-black py-3 sm:py-4 px-4 font-medium rounded-[10px] 
                                hover:cursor-pointer hover:shadow-lg hover:shadow-[#2BFFFF]/25
                                active:scale-[0.98] transition-all duration-200
                                text-sm sm:text-base"
                        >
                            Sign In to Your Account
                            <ArrowRight className="w-4 h-4" />
                        </Link>

                        {/* Additional Info */}
                        <div className="bg-[#151515] border border-[#414141] rounded-lg p-4 text-left">
                            <h3 className="text-white font-medium mb-2 text-sm sm:text-base">What is Next?</h3>
                            <ul className="space-y-1 text-xs sm:text-sm text-gray-300 list-disc list-inside">
                                <li>Sign in with your email and password</li>
                                <li>Browse our VPS hosting plans</li>
                                <li>Configure and deploy your servers</li>
                                <li>Manage your account and billing</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function VerificationSuccessPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen w-full flex justify-center items-center">
                <div className="w-8 h-8 border-2 border-[#2BFFFF] border-t-transparent rounded-full animate-spin"></div>
            </div>
        }>
            <VerificationSuccessContent />
        </Suspense>
    );
}