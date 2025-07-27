import { BitbucketIcon } from "@/components/icons/BitBucket";
import NavBar from "@/components/NavBar"
import { ArrowRight, Github, Gitlab } from "lucide-react";
import Image from 'next/image';
import Link from "next/link";


export default function page() {
    return (

        <>
            <NavBar />
            <div className="w-screen h-screen flex justify-around items-center">
                <Image
                    className="fixed     top-0 z-[-1] w-full h-full"
                    width={400}
                    height={400}
                    src="/curtains-bg.svg"
                    alt="Curtains Background effect"
                />
                <Image
                    className="fixed top-0 z-[-1] w-full h-full"
                    width={400}
                    height={400}
                    src="/grid-mesh.svg"
                    alt="Curtains Background effect"
                />




                {/* The buttons card */}
                <div className="">
                    <h1 className="text-3xl font-normal 
                    bg-gradient-to-b from-[rgba(255,255,255,1)] 
                    to-[rgba(153,153,153,1)] bg-clip-text text-transparent
                    mb-10">
                        Let's Start With Hawiyat
                    </h1>

                    {/* Buttons Block */}
                    <div className="flex flex-col justify-around items-center gap-y-4 mb-5">

                        <button
                            type="submit"
                            className="w-full 
                        bg-gradient-to-b from-[#2BFFFF] 
                        to-[#1CA3A3]
                        text-black p-3 font-medium rounded-[10] hover:cursor-pointer
                        flex justify-start pl-[20%] gap-x-3 text-center"
                        >
                            <Github />
                            Continue with Github
                        </button>

                        <button
                            type="submit"
                            className="w-full 
                        bg-gradient-to-b from-[#2BB5FF] 
                        to-[#1C20A3]
                        text-black p-3 font-medium rounded-[10] hover:cursor-pointer
                        flex justify-start pl-[20%] gap-x-3"
                        >
                            <Gitlab />
                            Continue with GitLab
                        </button>

                        <button
                            type="submit"
                            className="w-full 
                        bg-gradient-to-b from-[#37B9FF] 
                        to-[#1C5BA3]
                        text-black p-3 font-medium rounded-[10] hover:cursor-pointer
                        flex justify-start pl-[20%] gap-x-3"
                        >
                            <BitbucketIcon className="w-5"/>
                            Continue with BitBucket
                        </button>
                    </div>

                    <hr className="mb-5 border-[#333]" />

                    <div className="flex flex-col justify-around items-center gap-y-4 mb-4">
                        <button className="w-full 
                        bg-[#0A0A0A]
                        text-[#ededed] text-lg p-3 
                        font-medium rounded-[10] hover:cursor-pointer
                         drop-shadow-2xl border border-[#1f1f1f]">
                            Continue with SAML SSO
                        </button>
                        <button className="w-full 
                        bg-[#0A0A0A]
                        text-[#ededed] text-lg p-3 
                        font-medium rounded-[10] hover:cursor-pointer
                         drop-shadow-2xl border border-[#1f1f1f]">
                            Login with Passkey
                        </button>
                    </div>

                    <div className="flex justify-around items-center">

                        <Link href="#" className="inline-flex gap-x-1 text-white font-medium">
                            Continue with Email
                            <ArrowRight className="w-4"/>
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}