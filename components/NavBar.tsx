import Link from "next/link";
import Image from 'next/image';

export default function NavBar() {
    return (
        <nav className="">
            <div className="flex justify-around items-center h-15 bg-[linear-gradient(to_right,transparent,rgba(255,255,255,0.05),transparent)]  backdrop-blur-md">

            {/* logo block */}

            <div className="font-bold text-xl flex justify-evenly items-center font-poppins">
                <Image
                src="/hawiyat-logo.svg"
                width={50}
                height={50}
                alt="Hawiyat Logo"
                />                
                Hawiyat
            </div>

            {/* Center menu box */}
            <div className=" flex justify-around items-center gap-x-15  text-white">
                <a href="#">Products</a>
                <a href="#">Use Cases</a>
                <a href="#">Blog</a>
                <a href="#">About Us</a>
            </div>

            <Link href="#" className="bg-[#2BFFFF] py-2 px-4 rounded-[10] text-black font-semibold">
            Get Started
            </Link>

            </div>
            <div className="bottom-0 left-0 w-full h-[1px] bg-[linear-gradient(to_right,transparent,rgba(255,255,255,0.4),transparent)] pointer-events-none"></div>
        </nav>
    );
}   