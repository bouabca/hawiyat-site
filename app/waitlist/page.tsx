import { SquareArrowOutUpRight } from "lucide-react";
import Image from 'next/image';

const light_height = 450;
const light_width = 400;

export default function Page() {
    return (
        <>
            <div className="min-h-screen overflow-hidden w-full flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8">
                {/* The three tilted lights - responsive sizing */}
                <div className="z-[-1] fixed top-0 w-full flex justify-evenly items-start">
                    <Image
                        src="/waitlist-lights/left-light.svg"
                        width={light_width}
                        height={light_height}
                        alt="The left light for the waitlist"
                        className="w-24 h-28 sm:w-32 sm:h-36 md:w-48 md:h-54 lg:w-80 lg:h-96 xl:w-96 xl:h-[450px]"
                    />

                    <Image
                        src="/waitlist-lights/center-light.svg"
                        width={light_width}
                        height={light_height}
                        alt="The center light for the waitlist"
                        className="w-24 h-28 sm:w-32 sm:h-36 md:w-48 md:h-54 lg:w-80 lg:h-96 xl:w-96 xl:h-[450px]"
                    />
                    
                    <Image
                        src="/waitlist-lights/right-light.svg"
                        width={light_width}
                        height={light_height}
                        alt="The right light for the waitlist"
                        className="w-24 h-28 sm:w-32 sm:h-36 md:w-48 md:h-54 lg:w-80 lg:h-96 xl:w-96 xl:h-[450px]"
                    />
                </div>

                {/* The grid mesh - responsive sizing */}
                <Image
                    className="fixed z-[0] top-0 w-full h-full object-cover"
                    src="/grid-mesh.svg"
                    width={2000}
                    height={2000}
                    alt="Grid mesh"
                />

                {/* Wait-list form - responsive layout */}
                <div className="flex flex-col z-[1] justify-around items-start gap-4 sm:gap-5 mb-6 sm:mb-10 w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-normal text-center sm:text-left w-full
                        bg-gradient-to-b from-[rgba(255,255,255,1)] 
                        to-[rgba(153,153,153,1)] bg-clip-text text-transparent">
                        Join Hawiyat Wait list
                    </h2>

                    <input
                        type="text"
                        placeholder="Your email address"
                        className="py-3 sm:py-4 px-4 sm:px-5 w-full rounded-[10px] text-sm sm:text-base
                            bg-[#151515]
                            border
                            border-[#414141]
                            focus:outline-none focus:ring-2 focus:ring-[#2BFFFF] focus:border-transparent
                            transition-all duration-200"
                    />

                    <button
                        type="submit"
                        className="w-full text-sm sm:text-base
                            bg-gradient-to-b from-[#2BFFFF] 
                            to-[#1CA3A3]
                            text-black py-3 sm:py-3 px-4 font-medium rounded-[10px] 
                            hover:cursor-pointer hover:shadow-lg hover:shadow-[#2BFFFF]/25
                            active:scale-[0.98] transition-all duration-200"
                    >
                        Join wait list
                    </button>
                </div>

                {/* Terms and Privacy - responsive text and spacing */}
                <div className="w-full flex flex-col justify-evenly items-center mb-16 sm:mb-20 md:mb-28 px-4">
                    <p className="text-gray-300 mb-6 sm:mb-8 md:mb-10 text-xs sm:text-sm md:text-base text-center max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg leading-relaxed">
                        By joining, you agree to our
                        <span className="text-white font-bold inline-flex items-center gap-x-1 ml-1 hover:text-[#2BFFFF] transition-colors cursor-pointer">
                            Terms of Service
                            <SquareArrowOutUpRight className="w-3 h-3 sm:w-4 sm:h-4" />
                        </span> 
                        and
                        <span className="text-white font-bold inline-flex items-center gap-x-1 ml-1 hover:text-[#2BFFFF] transition-colors cursor-pointer">
                            Privacy Policy
                            <SquareArrowOutUpRight className="w-3 h-3 sm:w-4 sm:h-4" />
                        </span>
                    </p>
                    <hr className="w-48 sm:w-64 md:w-80 lg:w-96 border-[#333]" />
                </div>
            </div>
        </>
    );
}