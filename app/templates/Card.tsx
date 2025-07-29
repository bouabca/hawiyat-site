import Image from "next/image"
import Link from "next/link"
import { ExternalLink } from 'lucide-react'

interface TemplateCardProps {
  image: string
  title: string
  description: string
  author: string
  link: string
}

export default function TemplateCard({ image, title, description, author, link }: TemplateCardProps) {
  return (
    <div className="relative group bg-black border border-black-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-1">
      <Link href={link} className="absolute inset-0 z-10" prefetch={false}>
        <span className="sr-only">View {title}</span>
      </Link>
      <div className="relative w-full h-52 bg-black-800 flex items-center justify-center overflow-hidden">
        <Image
          src={image || "/placeholder.svg"}
          alt={`${title} preview`}
          width={400}
          height={300}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
          <ExternalLink className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
      </div>
      <div className="p-4 flex flex-col gap-2">
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        <p className="text-sm text-gray-400 line-clamp-2">{description}</p>
        <div className="flex items-center text-xs text-gray-500 mt-2">
          <Image
            src="/logo.svg?height=20&width=20"
            alt="Hawiyat logo"
            width={20}
            height={20}
            className="rounded-full mr-2"
          />
          <span>by {author}</span>
        </div>
      </div>
    </div>
  )
}