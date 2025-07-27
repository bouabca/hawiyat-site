import { Search } from "lucide-react";

export function InputWithIcon() {
  return (
    <div className="relative w-full max-w-sm rounded-2xl bg-[rgba(255,255,255,0.02)]">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
      <input
        type="text"
        placeholder="Search..."
        className="pl-10 pr-4 py-2 border rounded-2xl transition-all focus:outline-none focus:ring-1 focus:ring-[rgba(43,255,255,0.2)] w-full"
      />
    </div>
  );
    }