import { Button } from "./ui/button";
import { Card, CardContent, CardTitle } from "./ui/card";
import { CircleCheck } from "lucide-react";



export default function OfferCard() {
    return (
        <Card className=" max-w-xs p-5 rounded-3xl
                bg-gradient-to-tr from-[rgba(43,255,255,0.1)] via-[rgba(43,255,255,0.02)] to-[rgba(43,255,255,0.06)]">
            <CardTitle className="flex flex-col gap-y-5">

                <div className="flex justify-between items-center mt-2">

                    <div>
                        <p className="font-semibold text-xl">Basic</p>
                        <p className="text-sm font-normal">Best for personal use.</p>
                    </div>

                    <div className="text-3xl">
                        Free
                    </div>
                </div>

                <Button className="w-full py-2 hover:cursor-pointer text-foreground border border-white/15 hover:bg-[rgba(255,255,255,0.08)] bg-gradient-to-b from-[rgba(255,255,255,0.08)] to-[rgba(255,255,255,0)] rounded-[10_10_10_10/12_12_12_12]">
                    Get Started
                </Button>

            </CardTitle>

            <hr className="border-[rgba(255,255,255,0.5)]"/>
                
            <CardContent className="p-0">
                <h1 className="text-white text-lg font-semibold mb-2">What you will get</h1>
                <ul className="list-none text-md">
                    <li className="inline-flex gap-x-2"><CircleCheck className="w-4"/>1 CPU 2 Core 2 GHz</li>
                    <li className="inline-flex gap-x-2"><CircleCheck className="w-4"/>1 CPU 2 Core 2 GHz</li>
                    <li className="inline-flex gap-x-2"><CircleCheck className="w-4"/>1 CPU 2 Core 2 GHz</li>
                    <li className="inline-flex gap-x-2"><CircleCheck className="w-4"/>1 CPU 2 Core 2 GHz</li>
                    <li className="inline-flex gap-x-2"><CircleCheck className="w-4"/>1 CPU 2 Core 2 GHz</li>   
                </ul>
            </CardContent>



        </Card>
    );
}