"use client"

import { BitbucketIcon } from "@/components/icons/BitBucket";
import { ArrowRight, Github } from "lucide-react";
import { signIn, getSession } from "next-auth/react";
import Image from 'next/image';

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Page() {
    const [isLoading, setIsLoading] = useState<string | null>(null);
    const [hoveredUnavailable, setHoveredUnavailable] = useState<string | null>(null);
    const router = useRouter();

    const handleOAuthSignIn = async (provider: string) => {
        try {
            setIsLoading(provider);
            const result = await signIn(provider, {
                callbackUrl: "/dashboard", // Redirect after successful login
                redirect: false,
            });

            if (result?.error) {
                console.error("Sign in error:", result.error);
                // Handle error (you might want to show a toast or error message)
            } else if (result?.ok) {
                // Check if user is authenticated
                const session = await getSession();
                if (session) {
                    router.push("/dashboard");
                }
            }
        } catch (error) {
            console.error("Authentication error:", error);
        } finally {
            setIsLoading(null);
        }
    };

    const handleEmailSignIn = () => {
        // For now, just redirect to a generic email form
        // You can implement email/password auth later
        router.push("/auth/signin");
    };

    const handleUnavailableFeature = (feature: string) => {
        // You could replace this with a toast notification or modal
        alert(`${feature} is not available yet. Coming soon!`);
    };

    return (
        <>
            <div className="min-h-screen w-full flex justify-center items-center px-4 sm:px-6 lg:px-8 py-8">
                {/* Background Images - Responsive */}
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
                <div className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl z-10">

                    {/* Title - Responsive */}
                    <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-normal 
                        bg-gradient-to-b from-[rgba(255,255,255,1)] 
                        to-[rgba(153,153,153,1)] bg-clip-text text-transparent
                        mb-8 sm:mb-10 md:mb-12 text-center leading-tight">
                        Let&apos;s Start With Hawiyat
                    </h1>

                    {/* Git Provider Buttons */}
                    <div className="flex flex-col justify-around items-center gap-y-3 sm:gap-y-4 mb-6 sm:mb-8">

                        <button
                            type="button"
                            onClick={() => handleOAuthSignIn("github")}
                            disabled={isLoading === "github"}
                            className="w-full 
                                bg-gradient-to-b from-[#2BFFFF] 
                                to-[#1CA3A3]
                                text-black py-3 sm:py-4 px-4 font-medium rounded-[10px] 
                                hover:cursor-pointer hover:shadow-lg hover:shadow-[#2BFFFF]/25
                                active:scale-[0.98] transition-all duration-200
                                flex justify-center gap-x-3 items-center
                                text-sm sm:text-base
                                disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <div className="flex justify-center items-center gap-2">
                                {isLoading === "github" ? (
                                    <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                                ) : (
                                    <Github className="w-5 h-5 flex-shrink-0" />
                                )}
                                <span>Continue with GitHub</span>
                            </div>
                        </button>

                        <button
                            type="button"
                            onClick={() => handleOAuthSignIn("google")}
                            disabled={isLoading === "google"}
                            className="w-full 
                                bg-gradient-to-b from-[#2BB5FF] 
                                to-[#1C20A3]
                                text-white py-3 sm:py-4 px-4 font-medium rounded-[10px] 
                                hover:cursor-pointer hover:shadow-lg hover:shadow-[#2BB5FF]/25
                                active:scale-[0.98] transition-all duration-200
                                flex justify-center gap-x-3 items-center
                                text-sm sm:text-base
                                disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <div className="flex items-center gap-2">
                                {isLoading === "google" ? (
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                ) : (
                                    <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
                                        <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                        <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                        <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                        <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                                    </svg>
                                )}
                                <span>Continue with Google</span>
                            </div>
                        </button>

                        <button
                            type="button"
                            onClick={() => handleOAuthSignIn("bitbucket")}
                            disabled={isLoading === "bitbucket"}
                            className="w-full 
                                bg-gradient-to-b from-[#37B9FF] 
                                to-[#1C5BA3]
                                text-white py-3 sm:py-4 px-4 font-medium rounded-[10px] 
                                hover:cursor-pointer hover:shadow-lg hover:shadow-[#37B9FF]/25
                                active:scale-[0.98] transition-all duration-200
                                flex justify-center gap-x-3 items-center
                                text-sm sm:text-base
                                disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <div className="flex justify-center items-center gap-2">
                                {isLoading === "bitbucket" ? (
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                ) : (
                                    <BitbucketIcon className="w-5 h-5 flex-shrink-0" />
                                )}
                                <span>Continue with Bitbucket</span>
                            </div>
                        </button>
                    </div>

                    {/* Divider */}
                    <hr className="mb-6 sm:mb-8 border-[#333]" />

                    {/* Enterprise Auth Buttons */}
                    <div className="flex flex-col justify-around items-center gap-y-3 sm:gap-y-4 mb-6 sm:mb-8">

                        <div className="relative w-full">
                            <button
                                type="button"
                                onClick={() => handleUnavailableFeature("SAML SSO")}
                                onMouseEnter={() => setHoveredUnavailable("saml")}
                                onMouseLeave={() => setHoveredUnavailable(null)}
                                className="w-full 
                                    bg-[#0A0A0A] hover:bg-[#151515]
                                    text-[#ededed] py-3 sm:py-4 px-4
                                    font-medium rounded-[10px] cursor-not-allowed
                                    drop-shadow-2xl border border-[#1f1f1f] hover:border-[#555]
                                    transition-all duration-200
                                    text-sm sm:text-base lg:text-lg
                                    opacity-60 hover:opacity-80 relative"
                            >
                                Continue with SAML SSO
                            </button>
                            
                            {/* Tooltip for SAML */}
                            {hoveredUnavailable === "saml" && (
                                <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 
                                    bg-[#1a1a1a] border border-[#333] rounded-md px-3 py-2 
                                    text-sm text-[#ededed] whitespace-nowrap z-[9999]
                                    shadow-lg shadow-black/50">
                                    SAML SSO is not available yet
                                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 
                                        border-4 border-transparent border-t-[#1a1a1a]"></div>
                                </div>
                            )}
                        </div>

                        <div className="relative w-full">
                            <button
                                type="button"
                                onClick={() => handleUnavailableFeature("Passkey Authentication")}
                                onMouseEnter={() => setHoveredUnavailable("passkey")}
                                onMouseLeave={() => setHoveredUnavailable(null)}
                                className="w-full 
                                    bg-[#0A0A0A] hover:bg-[#151515]
                                    text-[#ededed] py-3 sm:py-4 px-4
                                    font-medium rounded-[10px] cursor-not-allowed
                                    drop-shadow-2xl border border-[#1f1f1f] hover:border-[#555]
                                    transition-all duration-200
                                    text-sm sm:text-base lg:text-lg
                                    opacity-60 hover:opacity-80 relative"
                            >
                                Login with Passkey
                            </button>
                            
                            {/* Tooltip for Passkey */}
                            {hoveredUnavailable === "passkey" && (
                                <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 
                                    bg-[#1a1a1a] border border-[#333] rounded-md px-3 py-2 
                                    text-sm text-[#ededed] whitespace-nowrap z-[9999]
                                    shadow-lg shadow-black/50">
                                    Passkey login is not available yet
                                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 
                                        border-4 border-transparent border-t-[#1a1a1a]"></div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Email Link */}
                    <div className="flex justify-center items-center">
                        <button
                            onClick={handleEmailSignIn}
                            className="inline-flex gap-x-2 text-white font-medium 
                                hover:text-[#2BFFFF] transition-colors duration-200
                                text-sm sm:text-base group bg-transparent border-none cursor-pointer"
                        >
                            <span>Continue with Email</span>
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                        </button>
                    </div>

                    {/* Additional Mobile Spacing */}
                    <div className="h-8 sm:h-0"></div>
                </div>
            </div>
        </>
    );
}