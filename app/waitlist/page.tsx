// app/waitlist/page.tsx
"use client"
import { SquareArrowOutUpRight } from "lucide-react";
import Image from 'next/image';
import { useState } from 'react';

const light_height = 450;
const light_width = 400;

export default function Page() {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);
    const [position, setPosition] = useState<number | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email.trim()) {
            setMessage('Please enter your email address');
            setIsError(true);
            return;
        }

        setIsLoading(true);
        setMessage('');
        setIsError(false);

        try {
            const response = await fetch('/api/waitlist', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: email.trim() }),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage(data.message);
                setPosition(data.position);
                setIsError(false);
                setEmail(''); // Clear the input on success
            } else {
                setMessage(data.error || 'Something went wrong');
                setIsError(true);
            }
        } catch {
            setMessage('Network error. Please try again.');
            setIsError(true);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <div className="min-h-screen overflow-hidden w-full flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8">
                {/* The three tilted lights - fixed desktop sizing */}
                <div className="fixed -top-[40px] w-full flex justify-center items-start pt-4 sm:pt-6 md:pt-8">
                    <div className="flex justify-evenly items-start w-[3000px]">
                        <Image
                            src="/waitlist-lights/left-light.svg"
                            width={light_width}
                            height={light_height}
                            alt="The left light for the waitlist"
                            className="w-32 h-40 xs:w-36 xs:h-44 sm:w-40 sm:h-48 md:w-48 md:h-56 lg:w-56 lg:h-64 xl:w-60 xl:h-72 2xl:w-64 2xl:h-80"
                        />

                        <Image
                            src="/waitlist-lights/center-light.svg"
                            width={light_width}
                            height={light_height}
                            alt="The center light for the waitlist"
                            className="w-32 h-40 xs:w-36 xs:h-44 sm:w-40 sm:h-48 md:w-48 md:h-56 lg:w-56 lg:h-64 xl:w-60 xl:h-72 2xl:w-64 2xl:h-80"
                        />

                        <Image
                            src="/waitlist-lights/right-light.svg"
                            width={light_width}
                            height={light_height}
                            alt="The right light for the waitlist"
                            className="w-32 h-40 xs:w-36 xs:h-44 sm:w-40 sm:h-48 md:w-48 md:h-56 lg:w-56 lg:h-64 xl:w-60 xl:h-72 2xl:w-64 2xl:h-80"
                        />
                    </div>
                </div>

                {/* The grid mesh - responsive sizing */}
                <Image
                    className="fixed z-[0] top-0 w-full h-full object-cover"
                    src="/grid-mesh.svg"
                    width={2000}
                    height={2000}
                    alt="Grid mesh"
                />

                {/* Wait-list form - better centering and spacing */}
                <div className="flex flex-col z-[1] justify-center items-center gap-6 sm:gap-7 md:gap-8 w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl mx-auto">
                    <h2 className="text-2xl xs:text-4xl sm:text-5xl md:text-5xl lg:text-6xl xl:text-6xl font-normal text-center w-full leading-tight
                        bg-gradient-to-b from-[rgba(255,255,255,1)] 
                        to-[rgba(153,153,153,1)] bg-clip-text text-transparent
                        px-2 sm:px-0">
                        Join Hawiyat Wait list
                    </h2>

                    <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto space-y-6">
                        <div className="space-y-4">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Your email address"
                                disabled={isLoading}
                                className="py-4 xs:py-5 sm:py-5 md:py-5 lg:py-5 xl:py-5 px-5 xs:px-6 sm:px-7 md:px-6 lg:px-6 xl:px-6 w-full rounded-[12px] sm:rounded-[14px] md:rounded-[12px] lg:rounded-[12px] xl:rounded-[12px]
                                    text-base xs:text-lg sm:text-xl md:text-lg lg:text-lg xl:text-lg
                                    bg-[#151515]
                                    border
                                    border-[#414141]
                                    focus:outline-none focus:ring-2 focus:ring-[#2BFFFF] focus:border-transparent
                                    transition-all duration-200
                                    placeholder:text-gray-500
                                    disabled:opacity-50 disabled:cursor-not-allowed"
                                required
                            />

                            {/* Message display */}
                            {message && (
                                <div className={`text-sm sm:text-base text-center px-4 py-2 rounded-lg ${isError
                                        ? 'text-red-400 bg-red-900/20 border border-red-800/30'
                                        : 'text-green-400 bg-green-900/20 border border-green-800/30'
                                    }`}>
                                    {message}
                                    {position && !isError && (
                                        <div className="mt-1 text-cyan-400">
                                            You are #{position} on the waitlist!
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full text-base xs:text-lg sm:text-xl md:text-lg lg:text-lg xl:text-lg
                                bg-gradient-to-b from-[#2BFFFF] 
                                to-[#1CA3A3]
                                text-black py-4 xs:py-5 sm:py-5 md:py-5 lg:py-5 xl:py-5 px-5 xs:px-6 sm:px-7 md:px-6 lg:px-6 xl:px-6 font-medium rounded-[12px] sm:rounded-[14px] md:rounded-[12px] lg:rounded-[12px] xl:rounded-[12px]
                                hover:cursor-pointer hover:shadow-lg hover:shadow-[#2BFFFF]/25
                                active:scale-[0.98] transition-all duration-200
                                font-semibold
                                disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none disabled:active:scale-100"
                        >
                            {isLoading ? 'Joining...' : 'Join wait list'}
                        </button>
                    </form>
                </div>

                {/* Footer Section - fixed positioning */}
                <div className="absolute bottom-0 left-0 right-0 px-5 sm:px-6 lg:px-8 pb-8 sm:pb-10 md:pb-12 w-full">
                    <div className="max-w-md sm:max-w-lg md:max-w-xl mx-auto">
                        {/* Legal Links */}
                        <div className="text-center mb-5 sm:mb-6">
                            <p className="text-sm sm:text-base md:text-lg text-gray-400 leading-relaxed mb-4 sm:mb-5 px-3 sm:px-0">
                                By joining, you agree to our{' '}
                                <button className="text-white hover:text-cyan-400 transition-colors underline underline-offset-2 inline-flex items-center gap-1">
                                    Terms of Service
                                    <SquareArrowOutUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                </button>
                                {' '}and{' '}
                                <button className="text-white hover:text-cyan-400 transition-colors underline underline-offset-2 inline-flex items-center gap-1">
                                    Privacy Policy
                                    <SquareArrowOutUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                </button>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
