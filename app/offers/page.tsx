import { InputWithIcon } from "@/components/InputWithSearch";
import OfferCard from "@/components/OfferCard";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";


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

export default function page() {
    return (
        <>
            <div className="grid grid-cols-[1fr_2fr] pt-10">
                
                <aside className="flex flex-col justify-start items-end pr-10">

                    {/* Filter box */}
                    <div className="max-w-1/2 flex flex-col gap-4">
                        <div className="mb-2">
                            <p className="font-bold text-xl mb-2">Filter Vps</p>
                            <InputWithIcon />
                        </div>
                        <hr />
                        <Select>
                            <SelectTrigger className="w-full bg-transparent border-none focus:ring-1 focus:ring-[#1c1c1c]">
                                <SelectValue placeholder="Select Use Case" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Use Cases</SelectLabel>
                                    <SelectItem value="comp">Computation</SelectItem>
                                    <SelectItem value="backup">Backing up</SelectItem>
                                    <SelectItem value="proxy">Proxing</SelectItem>
                                    <SelectItem value="tun">VPN Tunnling</SelectItem>
                                </SelectGroup>

                            </SelectContent>
                        </Select>

                        <div className="flex flex-col justfiy-around items-center gap-y-4">

                            {
                                locations.map((item, i) => {
                                    return (
                                        <div key={i} className="w-full flex pl-5 gap-4 bg-[#111] rounded-lg py-2 ">
                                            <input type="checkbox" className="hover:cursor-pointer"name={item.code} />
                                            <label htmlFor="de">{item.name}</label>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                </aside>
                <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 overflow-y-auto gap-4 px-5">

                    <OfferCard />
                    <OfferCard />
                    <OfferCard />
                    <OfferCard />
                    <OfferCard />
                    <OfferCard />



                </main>
            </div>
        </>
    );
}