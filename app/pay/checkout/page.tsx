"use client"
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/cart-context';
import { useState } from 'react';

export default function Page() {
    const { totalPrice, totalItems } = useCart();
    const [loading, setLoading] = useState(false);

    async function handlePayment() {
        setLoading(true);
        try {
            const res = await fetch('/api/order/payment/chargily', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.message || 'Payment failed');

            // Redirect to Chargily checkout
            window.location.href = data.checkoutUrl;
        } catch (error) {
            console.error('Payment error:', error);
            setLoading(false);
        }
    }

    return (
        <>
            <div className="min-h-screen w-screen flex justify-center items-center px-4 sm:px-6 lg:px-8 py-8">
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
                <div className="min-w-full flex flex-col items-center max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl z-10">

                    {/* Title - Responsive */}
                    <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-normal 
                        bg-gradient-to-b from-[rgba(255,255,255,1)] 
                        to-[rgba(153,153,153,1)] bg-clip-text text-transparent
                        mb-8 sm:mb-10 md:mb-12 text-center leading-tight">
                        Checkout
                    </h1>

                    {totalItems !== 0 ? (
                        <div className="p-6 w-3/4 bg-linear-to-bl from-[#2BFFFF]/10 via-[#2BFFFF]/2 to-[#2BFFFF]/6 rounded-3xl text-center">
                            <div className="mb-6">
                                <span className="text-2xl font-medium">Total: {totalPrice} DZD</span>
                            </div>
                            
                            <Button
                                className="relative group overflow-hidden w-full py-4
                                        hover:cursor-pointer text-foreground
                                        border border-white/15 hover:bg-[rgba(255,255,255,0.08)]
                                        bg-gradient-to-b from-[rgba(255,255,255,0.08)] to-[rgba(255,255,255,0.0)]
                                        rounded-2xl transition-all duration-200 font-medium"
                                onClick={handlePayment}
                                disabled={loading}
                            >
                                <div className="absolute w-[250%] h-16 bg-gradient-to-r from-white/75 to-white/15 rotate-45
                                    left-[-150%] bottom-[-100%] opacity-0
                                    transition-all duration-400 ease-in-out
                                    group-hover:opacity-100 group-hover:left-0 group-hover:bottom-[100%] pointer-events-none z-0">
                                </div>

                                {loading ? (
                                    "Processing..."
                                ) : (
                                    <span className='flex gap-2 items-center justify-center'>
                                        Pay with Chargily
                                    </span>
                                )}
                            </Button>
                        </div>
                    ) : (
                        <div className="text-center text-lg">
                            The cart is empty
                        </div>
                    )}
                    
                    {/* Additional Mobile Spacing */}
                    <div className="h-8 sm:h-0"></div>
                </div>
            </div>
        </>
    );
}