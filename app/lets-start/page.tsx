import { BitbucketIcon } from "@/components/icons/BitBucket";
import { ArrowRight, Github, Gitlab } from "lucide-react";
import Image from 'next/image';
import Link from "next/link";

export default function Page() {
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
                            className="w-full 
                                bg-gradient-to-b from-[#2BFFFF] 
                                to-[#1CA3A3]
                                text-black py-3 sm:py-4 px-4 font-medium rounded-[10px] 
                                hover:cursor-pointer hover:shadow-lg hover:shadow-[#2BFFFF]/25
                                active:scale-[0.98] transition-all duration-200
                                flex justify-center gap-x-3 items-center
                                text-sm sm:text-base"
                        >
                            <p className="flex justify-evenly items-center gap-2">
                                <Github className="w-5 h-5 flex-shrink-0" />
                                <span>Continue with GitHub</span>

                            </p>
                        </button>

                        <button
                            type="button"
                            className="w-full 
                                bg-gradient-to-b from-[#2BB5FF] 
                                to-[#1C20A3]
                                text-white py-3 sm:py-4 px-4 font-medium rounded-[10px] 
                                hover:cursor-pointer hover:shadow-lg hover:shadow-[#2BB5FF]/25
                                active:scale-[0.98] transition-all duration-200
                                flex justify-center gap-x-3 items-center
                                text-sm sm:text-base"
                        >
                            <p className="flex  items-center gap-2">
                                <Gitlab className="w-5 h-5 flex-shrink-0" />
                                <span>Continue with GitHub</span>

                            </p>
                        </button>

                        <button
                            type="button"
                            className="w-full 
                                bg-gradient-to-b from-[#37B9FF] 
                                to-[#1C5BA3]
                                text-white py-3 sm:py-4 px-4 font-medium rounded-[10px] 
                                hover:cursor-pointer hover:shadow-lg hover:shadow-[#37B9FF]/25
                                active:scale-[0.98] transition-all duration-200
                                flex justify-center gap-x-3 items-center
                                text-sm sm:text-base"
                        >
                            <p className="flex justify-evenly items-center gap-2">
                                <BitbucketIcon className="w-5 h-5 flex-shrink-0" />
                                <span>Continue with GitHub</span>

                            </p>
                        </button>
                    </div>

                    {/* Divider */}
                    <hr className="mb-6 sm:mb-8 border-[#333]" />

                    {/* Enterprise Auth Buttons */}
                    <div className="flex flex-col justify-around items-center gap-y-3 sm:gap-y-4 mb-6 sm:mb-8">

                        <button
                            type="button"
                            className="w-full 
                                bg-[#0A0A0A] hover:bg-[#151515]
                                text-[#ededed] py-3 sm:py-4 px-4
                                font-medium rounded-[10px] hover:cursor-pointer
                                drop-shadow-2xl border border-[#1f1f1f] hover:border-[#333]
                                transition-all duration-200 active:scale-[0.98]
                                text-sm sm:text-base lg:text-lg"
                        >
                            Continue with SAML SSO
                        </button>

                        <button
                            type="button"
                            className="w-full 
                                bg-[#0A0A0A] hover:bg-[#151515]
                                text-[#ededed] py-3 sm:py-4 px-4
                                font-medium rounded-[10px] hover:cursor-pointer
                                drop-shadow-2xl border border-[#1f1f1f] hover:border-[#333]
                                transition-all duration-200 active:scale-[0.98]
                                text-sm sm:text-base lg:text-lg"
                        >
                            Login with Passkey
                        </button>
                    </div>

                    {/* Email Link */}
                    <div className="flex justify-center items-center">
                        <Link
                            href="#"
                            className="inline-flex gap-x-2 text-white font-medium 
                                hover:text-[#2BFFFF] transition-colors duration-200
                                text-sm sm:text-base group"
                        >
                            <span>Continue with Email</span>
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                        </Link>
                    </div>

                    {/* Additional Mobile Spacing */}
                    <div className="h-8 sm:h-0"></div>
                </div>
            </div>
        </>
    );
}