import NavBar from "@/components/NavBar";
import { SquareArrowOutUpRight } from "lucide-react";
import Image from 'next/image';

const light_height = 450;
const light_width = 400;
export default function Page() {
    return (
        <>
            <NavBar />
            <div className="h-screen w-screen flex flex-col justify-center items-center">
                {/* The three tilted lights */}
                <div className="z-[-1] absolute top-0 w-full flex justify-evenly items-start">

                    <Image
                        src="/waitlist-lights/left-light.svg"
                        width={light_width}
                        height={light_height}
                        alt="The left light for the waitlist"

                    />

                    <Image
                        src="/waitlist-lights/center-light.svg"
                        width={light_width}
                        height={light_height}
                        alt="The center light for the waitlist"

                    />
                    <Image
                        src="/waitlist-lights/right-light.svg"
                        width={light_width}
                        height={light_height}
                        alt="The right light for the waitlist"

                    />
                </div>
                {/* The grid mesh */}
                <Image
                    className="absolute z-[0] top-0"
                    src="/waitlist-grid-mesh.svg"
                    width={2000}
                    height={2000}
                    alt="Grid mesh"
                />


                {/* Wait-list form */}
                <div className="flex flex-col z-[1] justify-around items-start gap-5 mb-10">

                    <h2 className="text-4xl font-normal 
                    bg-gradient-to-b from-[rgba(255,255,255,1)] 
                    to-[rgba(153,153,153,1)] bg-clip-text text-transparent">
                        Join Hawiyat Wait list
                    </h2>

                    <input
                        type="text"
                        placeholder="Your email address"
                        className="py-4 px-5 w-full rounded-[10]
                        bg-[#151515]
                        border
                        border-[#414141]
                        "

                    />

                    <button
                        type="submit"
                        className="w-full 
                    bg-gradient-to-b from-[#2BFFFF] 
                    to-[#1CA3A3]
                    text-black p-3 font-medium rounded-[10] hover:cursor-pointer"
                    >
                        Join wait list
                    </button>
                </div>

                <div className="w-full flex flex-col justify-evenly items-center mb-28">
                    <p className=" text-gray-300 mb-10">
                        By joining, you agree to our
                        <span className="text-white font-bold inline-flex items-center gap-x-1 ml-1">
                            Terms of Service
                            <SquareArrowOutUpRight className="w-4 h-4" />
                        </span> 
                        and
                        <span className="text-white font-bold inline-flex items-center gap-x-1 ml-1">
                            Privacy Policy
                            <SquareArrowOutUpRight className="w-4 h-4" />
                        </span>
                    </p>
                    <hr className="w-96 border-[#333]" />
                </div>
            </div>
        </>
    );
}