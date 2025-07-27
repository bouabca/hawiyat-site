"use client"
import { InputWithIcon } from "@/components/InputWithSearch";
import OfferCard from "@/components/OfferCard";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { Filter, X } from "lucide-react";

const locations = [
    {
        name: "Algeria",
        code: "dz"
    },
    {
        name: "Germany",
        code: "de"
    },
    {
        name: "France",
        code: "fr"
    },
    {
        name: "Saudi Arabia",
        code: "sa"
    }
]

export default function Page() {
    const [showFilters, setShowFilters] = useState(false);

    return (
        <>
            <div className="min-h-screen">
                {/* Mobile filter toggle button */}
                <div className="lg:hidden fixed top-18 left-4 z-50">
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="bg-[#111] border border-[#333] rounded-lg p-3 flex items-center gap-2 text-sm font-medium hover:bg-[#1c1c1c] transition-colors"
                    >
                        <Filter className="w-4 h-4" />
                        Filters
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] xl:grid-cols-[350px_1fr] pt-16 lg:pt-10">
                    
                    {/* Mobile/Tablet Filter Overlay */}
                    {showFilters && (
                        <div className="lg:hidden fixed inset-0 bg-black/50 z-40" onClick={() => setShowFilters(false)} />
                    )}

                    {/* Sidebar - Responsive */}
                    <aside className={`
                        fixed lg:static top-0 left-0 h-full lg:h-auto w-80 lg:w-full 
                        bg-background lg:bg-transparent border-r lg:border-r-0 border-[#333]
                        transform transition-transform duration-300 ease-in-out z-50 lg:z-auto
                        ${showFilters ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                        flex flex-col justify-start items-start lg:items-end p-6 lg:pr-10 lg:pl-6
                        overflow-y-auto
                    `}>
                        
                        {/* Mobile close button */}
                        <button
                            onClick={() => setShowFilters(false)}
                            className="lg:hidden absolute top-4 right-4 p-2 hover:bg-[#1c1c1c] rounded-lg transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        {/* Filter box */}
                        <div className="w-full lg:max-w-sm flex flex-col gap-4 mt-8 lg:mt-0">
                            <div className="mb-2">
                                <p className="font-bold text-lg sm:text-xl mb-3">Filter VPS</p>
                                <div className="w-full">
                                    <InputWithIcon />
                                </div>
                            </div>
                            
                            <hr className="border-[#333]" />
                            
                            <Select>
                                <SelectTrigger className="w-full bg-transparent border border-[#333] focus:ring-1 focus:ring-[#1c1c1c] h-11">
                                    <SelectValue placeholder="Select Use Case" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Use Cases</SelectLabel>
                                        <SelectItem value="comp">Computation</SelectItem>
                                        <SelectItem value="backup">Backing up</SelectItem>
                                        <SelectItem value="proxy">Proxying</SelectItem>
                                        <SelectItem value="tun">VPN Tunneling</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>

                            <div className="flex flex-col justify-around items-center gap-y-3">
                                <p className="text-sm font-medium text-gray-400 self-start mb-1">Locations</p>
                                {locations.map((item, i) => {
                                    return (
                                        <div key={i} className="w-full flex items-center pl-4 gap-3 bg-[#111] hover:bg-[#1a1a1a] rounded-lg py-3 transition-colors cursor-pointer">
                                            <input 
                                                type="checkbox" 
                                                className="hover:cursor-pointer accent-blue-500 w-4 h-4" 
                                                name={item.code} 
                                                id={item.code}
                                            />
                                            <label 
                                                htmlFor={item.code} 
                                                className="cursor-pointer text-sm flex-1 select-none"
                                            >
                                                {item.name}
                                            </label>
                                        </div>
                                    )
                                })}
                            </div>

                            {/* Mobile apply button */}
                            <button
                                onClick={() => setShowFilters(false)}
                                className="lg:hidden w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-colors mt-6"
                            >
                                Apply Filters
                            </button>
                        </div>
                    </aside>

                    {/* Main content */}
                    <main className="px-4 sm:px-6 lg:px-8 pb-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-6">
                            <OfferCard />
                            <OfferCard />
                            <OfferCard />
                            <OfferCard />
                            <OfferCard />
                            <OfferCard />
                            <OfferCard />
                            <OfferCard />
                        </div>
                    </main>
                </div>
            </div>
        </>
    );
}