'use client';

import Link from "next/link";
import Image from 'next/image';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

export default function NavBar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    return (
        <nav className="absolute top-0 left-0 w-full z-50">
            <div className="flex justify-between lg:justify-around items-center h-16 sm:h-18 lg:h-20 
                bg-white/5 backdrop-blur-lg border-b border-white/10
                px-4 sm:px-6 lg:px-8">

                {/* Logo block - Responsive */}
                <Link 
                    href="/" 
                    className="font-bold text-lg sm:text-xl lg:text-2xl flex items-center gap-2 sm:gap-3 font-poppins z-50 relative"
                    onClick={closeMenu}
                >
                    <Image
                        src="/hawiyat-logo.svg"
                        width={40}
                        height={40}
                        alt="Hawiyat Logo"
                        className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12"
                    />                
                    <span className="text-white">Hawiyat</span>
                </Link>

                {/* Desktop menu - Hidden on mobile */}
                <div className="hidden lg:flex justify-around items-center gap-x-8 xl:gap-x-12 text-white">
                    <Link 
                        href="#" 
                        className="hover:text-[#2BFFFF] transition-colors duration-200 font-medium"
                    >
                        Products
                    </Link>
                    <Link 
                        href="#" 
                        className="hover:text-[#2BFFFF] transition-colors duration-200 font-medium"
                    >
                        Use Cases
                    </Link>
                    <Link 
                        href="#" 
                        className="hover:text-[#2BFFFF] transition-colors duration-200 font-medium"
                    >
                        Blog
                    </Link>
                    <Link 
                        href="#" 
                        className="hover:text-[#2BFFFF] transition-colors duration-200 font-medium"
                    >
                        About Us
                    </Link>
                </div>

                {/* Desktop CTA Button */}
                <Link 
                    href="#" 
                    className="hidden lg:block bg-[#2BFFFF] hover:bg-[#1CDDDD] 
                        py-2 px-4 xl:py-3 xl:px-6 rounded-[10px] text-black font-semibold 
                        transition-all duration-200 hover:shadow-lg hover:shadow-[#2BFFFF]/25
                        active:scale-95 text-sm xl:text-base"
                >
                    Get Started
                </Link>

                {/* Mobile hamburger button */}
                <button
                    onClick={toggleMenu}
                    className="lg:hidden z-50 relative p-2 text-white hover:text-[#2BFFFF] transition-colors"
                    aria-label="Toggle menu"
                >
                    {isMenuOpen ? (
                        <X className="w-6 h-6" />
                    ) : (
                        <Menu className="w-6 h-6" />
                    )}
                </button>
            </div>

            {/* Mobile menu overlay */}
            {isMenuOpen && (
                <div 
                    className="lg:hidden fixed inset-0 bg-black/50 z-30"
                    onClick={closeMenu}
                />
            )}

            {/* Mobile menu */}
            <div className={`
                lg:hidden fixed top-0 right-0 h-full w-80 max-w-[85vw]
                bg-black/20 backdrop-blur-xl border-l border-white/20
                transform transition-transform duration-300 ease-in-out z-40
                ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}
            `}>
                <div className="flex flex-col pt-24 pb-8 px-6">
                    
                    {/* Mobile navigation links */}
                    <div className="flex flex-col space-y-6 mb-8">
                        <Link 
                            href="#" 
                            className="text-white hover:text-[#2BFFFF] transition-colors duration-200 
                                font-medium text-lg py-2 border-b border-white/10"
                            onClick={closeMenu}
                        >
                            Products
                        </Link>
                        <Link 
                            href="#" 
                            className="text-white hover:text-[#2BFFFF] transition-colors duration-200 
                                font-medium text-lg py-2 border-b border-white/10"
                            onClick={closeMenu}
                        >
                            Use Cases
                        </Link>
                        <Link 
                            href="#" 
                            className="text-white hover:text-[#2BFFFF] transition-colors duration-200 
                                font-medium text-lg py-2 border-b border-white/10"
                            onClick={closeMenu}
                        >
                            Blog
                        </Link>
                        <Link 
                            href="#" 
                            className="text-white hover:text-[#2BFFFF] transition-colors duration-200 
                                font-medium text-lg py-2 border-b border-white/10"
                            onClick={closeMenu}
                        >
                            About Us
                        </Link>
                    </div>

                    {/* Mobile CTA button */}
                    <Link 
                        href="#" 
                        className="bg-[#2BFFFF] hover:bg-[#1CDDDD] 
                            py-3 px-6 rounded-[10px] text-black font-semibold 
                            text-center transition-all duration-200 
                            hover:shadow-lg hover:shadow-[#2BFFFF]/25
                            active:scale-95"
                        onClick={closeMenu}
                    >
                        Get Started
                    </Link>

                    {/* Mobile menu footer */}
                    <div className="mt-8 pt-6 border-t border-white/10">
                        <p className="text-gray-400 text-sm text-center">
                            © 2025 Hawiyat. All rights reserved.
                        </p>
                    </div>
                </div>
            </div>
        </nav>
    );
}