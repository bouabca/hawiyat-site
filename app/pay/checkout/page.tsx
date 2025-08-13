"use client"
import Image from 'next/image';

import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { useCart } from '@/context/cart-context';
import { useEffect, useState } from 'react';
import { useSearchParams } from "next/navigation";


interface Payer {
    firstName: string;
    lastName: string;
    email: string;
}



export default function Page() {

    const { cartItems, totalPrice, totalItems, removeFromCart, clearCart } = useCart();
    const [approved, setApproved] = useState<boolean>(false);

    const [loading, setLoading] = useState(false);
    const [payer, setPayer] = useState<Payer>();
    const [error, setError] = useState<Error | null>(null);


    const searchParams = useSearchParams();
    const orderId = searchParams.get("token");


    useEffect(() => {
        let isMounted = true; // Prevents state updates after unmount

        const fetchData = async () => {

            try {

                if (orderId) {

                    const res = await fetch(`/api/payment/paypal/get-order/${orderId}`);

                    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
                    const json = await res.json();

                    // setting up the payer data.

                    setPayer({
                        firstName: json.firstName,
                        lastName: json.lastName,
                        email: json.email
                    });

                    // setting the approved badge.
                    json.status === "APPROVED" ? setApproved(true) : setApproved(false);
                }



            } catch (err) {
                if (isMounted) setError(err as Error);
            }
        };

        fetchData();

        return () => {
            isMounted = false; // cleanup flag
        };
    }, [orderId]); // empty deps = run once on mount


    async function handleClick() {
        setLoading(true);
        try {
            const res = await fetch('/api/payment/paypal/create-order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ cart: cartItems, total: totalPrice }),
            });

            const data = await res.json();

            if (!data.ok) throw new Error(data.error);

            window.location.href = data.approveLink;
        } catch  {
            setLoading(false);
        }
    }

    async function handleCapture() {
        setLoading(true);
        try {
            const res = await fetch('/api/payment/paypal/capture-order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ orderId }),
            });

            const data = await res.json();

            if (!data.ok) throw new Error(data.error);
            clearCart();
            window.location.href = "/pay/success";
        } catch {
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


                    {
                        totalItems !== 0 ?
                            (

                                <div className="p-3 w-3/4 bg-linear-to-bl from-[#2BFFFF]/10 via-[#2BFFFF]/2 to-[#2BFFFF]/6 rounded-3xl grid grid-cols-[3fr_2fr] px-5">

                                    <div className=" pr-10 overflow-y-auto max-w-xl bg--200">

                                        {/* Vps card */}

                                        {
                                            cartItems.map((item, index) => {

                                               
                                                return (
                                                    <div key={index} className="flex justify-between w-full gap-x-4
                                            bg-linear-to-b from-[#fff]/8 to-[#fff]/0
                                            border border-[#fff]/20 rounded-3xl px-4 mb-3
                                            ">

                                                        <div className="flex justify-around items-center h-20 grow">
                                                            <span className="text-md font-semibold">{item.offer.title}</span>
                                                            <span className="text-[#aaa] text-sm font-normal">vCPU: {item.offer.cpu}</span>
                                                            <span className="text-[#aaa] text-sm font-normal">RAM: {item.offer.ram}</span>
                                                            <span className="text-[#aaa] text-sm font-normal">Disk: {item.offer.storage}</span>

                                                        </div>


                                                        {/* The price & Qty */}

                                                        <div className="flex flex-col justify-evenly items-start">
                                                            <div className="flex justify-between w-full ">

                                                                <span className="text-[#656565] font-medium text-md">Qty: {item.quantity}</span>

                                                                {
                                                                    !approved &&

                                                                    <button className="cursor-pointer"
                                                                        onClick={() => removeFromCart(item.id)}>
                                                                        <Trash2 className="w-4 text-red-500" />
                                                                    </button>
                                                                }
                                                            </div>
                                                            <span className="font-semibold">Price: {item.quantity * item.selectedTier.price} {item.selectedTier.currency}</span>
                                                        </div>

                                                    </div>
                                                )
                                            })


                                        }


                                    </div>

                                    <div className="h-96 ml-9 flex justify-between items-center bg--300">
                                        {/* Holder container */}

                                        <div className="h-[85%] min-w-px bg-white/30 mr-8">

                                        </div>
                                        <div className='gap-y-3 w-full md:w-3/ h-full bg--600'>


                                            {
                                                error &&
                                                <div className='bg-red-600/30 font-medium rounded mb-4 text-red-400 p-1'>{error.message}</div>

                                            }

                                            <div className="flex items-center">
                                                <p className="text-[#999] text-sm  w-full">{orderId ? `Order #${orderId}` : "Order is"}</p>

                                                <span className={`font-semibold text-sm  ${approved ? "text-[#5DEA5D] ml-30" : "text-amber-500 ml-30"}`}>
                                                    {approved ? "Approved" : "Pending"}
                                                </span>
                                            </div>

                                            {orderId ? (

                                                <div className='pl-2 pt-4 flex flex-col '>
                                                    <span className="font-bold text-2xl">{payer?.firstName} {payer?.lastName}</span>
                                                    <span className="pl-2 text-[#ccc]">Email: {payer?.email}</span>
                                                </div>
                                            ) :
                                                (
                                                    <div className="mt-10">

                                                    </div>
                                                )
                                            }

                                            <div className="mt-5">

                                                <span className="text-2xl font-medium">Total: {totalPrice} </span>
                                            </div>

                                            <div className="mt-4 w-full">
                                                <Button

                                                    className="relative group overflow-hidden w-full py-4
                                                            hover:cursor-pointer text-foreground
                                                            border border-white/15 hover:bg-[rgba(255,255,255,0.08)]
                                                            bg-gradient-to-b from-[rgba(255,255,255,0.08)] to-[rgba(255,255,255,0.0)]
                                                            rounded-2xl   transition-all duration-200 font-medium"

                                                    onClick={approved ? handleCapture : handleClick}
                                                >
                                                    <div className="absolute w-[250%] h-16 bg-gradient-to-r from-white/75 to-white/15 rotate-45
                                                        left-[-150%] bottom-[-100%] opacity-0
                                                        transition-all duration-400 ease-in-out
                                                        group-hover:opacity-100 group-hover:left-0 group-hover:bottom-[100%] pointer-events-none z-0">
                                                    </div>

                                                    {
                                                        loading ? (
                                                            "Loading..."
                                                        ) :
                                                            (

                                                                <span className='flex gap-2'>
                                                                    <Image
                                                                        width={15}
                                                                        height={15}
                                                                        alt="paypal image"
                                                                        src="/paypal-pure.svg"
                                                                    />
                                                                    {
                                                                        approved ? "Confirm Payment" : "Pay with PayPal"
                                                                    } 
                                                                </span>
                                                            )
                                                    }
                                                </Button>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                            )
                            :
                            (
                                <div>
                                    The cart is empty
                                </div>
                            )
                    }
                    {/* Additional Mobile Spacing */}
                    <div className="h-8 sm:h-0"></div>
                </div>
            </div>
        </>
    );
}