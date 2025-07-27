import type { Metadata } from "next";
// import { Geist, Geist_Mono } from "next/font/google";
import { Space_Grotesk } from 'next/font/google';
// import { Poppins } from 'next/font/google';
import "./globals.css";
import NavBar from "@/components/NavBar";

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });


// const poppins = Poppins({
//   subsets: ['latin'],
//   weight: ['400', '500', '600', '700'], // choose what you need
//   variable: '--font-poppins', // optional: to use as CSS variable
// });

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: [ '300', '400', '500', '600', '700'],
  variable: '--font-space-grotesk', // Optional: Define a CSS variable
});

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

export const metadata: Metadata = {
  title: "Hawiyat",
  description: "All-in-One platform to deploy your applications on local cloud",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${spaceGrotesk.className} overflow-auto`}
      >
        <NavBar/>
        {children}
      </body>
    </html>
  );
}
