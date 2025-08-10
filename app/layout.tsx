import type { Metadata } from "next";
import Script from "next/script";
import { Space_Grotesk } from 'next/font/google';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth"; // Adjust the path to your auth config
import './globals.css';
import { CartProvider } from '../context/cart-context';
import NavBar from '@/components/NavBar';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-space-grotesk',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://hawiyat.org'),
  title: {
    default: 'Hawiyat Deploy & Scale Your Apps',
    template: '%s | Hawiyat',
  },
  description: 'Hawiyat is an all-in-one platform for developers to deploy, manage, and scale applications globally with serverless functions, managed databases, CI/CD, and edge networking.',
  applicationName: 'Hawiyat Platform',
  keywords: [
    'vps algerie', 'vps dz', 'hebergement agl', 'Hawiyat', 'cloud deployment',
    'serverless', 'CI/CD', 'edge network', 'managed databases', 'DevOps',
    'web applications', 'global deployment', 'developer tools',
    'hebergement algerie', 'hebergement web algerie', 'hebergeur algerien',
    'serveur vps algerie', 'vps pas cher algerie', 'hebergement site web algerie',
    'serveur dedie algerie', 'vps algerie prix', 'cloud vps algerie',
    'hebergement professionnel algerie', 'hebergeur vps algerien',
    'machine virtuelle algerie', 'hebergement vps algerie', 'vps local algerie',
    'hebergement web local', 'vps illimité algerie', 'hebergement vps web',
    'heberger site en algerie'
  ],
  
  authors: [
    { name: 'Hawiyat Team', url: 'https://hawiyat.org' }
  ],
  creator: 'Hawiyat Team',
  publisher: 'Hawiyat',
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1
    }
  },
  openGraph: {
    title: 'Hawiyat Deploy & Scale Your Apps',
    description: 'All-in-one platform for deploying, managing, and scaling web applications with global edge infrastructure.',
    url: 'https://hawiyat.org',
    siteName: 'Hawiyat',
    images: [
      {
        url: 'https://hawiyat.org/hawiyat.png',
        width: 2000,
        height: 2000,
        alt: 'Hawiyat Platform',
      }
    ],
    locale: 'en_DZ',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hawiyat Deploy & Scale Your Apps',
    description: 'Your central hub for cloud deployments, serverless functions, and edge scaling.',
    images: ['https://hawiyat.org/hawiyat.png'],
    creator: '@hawiyat',
  },
  alternates: {
    canonical: 'https://hawiyat.org',
    languages: {
      'en-US': 'https://hawiyat.org',
      'fr-DZ': 'https://hawiyat.org/fr'
    }
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: '/logo.ico',
    shortcut: '/logo.svg',
    apple: '/logo.svg',
  },
  manifest: '/site.webmanifest',
  other: {
    'application/ld+json': JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "Hawiyat",
      "url": "https://hawiyat.org",
      "logo": "https://hawiyat.org/logo.svg",
      "sameAs": [
        "https://twitter.com/hawiyat",
        "https://github.com/Hawiyat-Corp"
      ],
      "contactPoint": [{
        "@type": "ContactPoint",
        "telephone": "+213-XX-XXX-XXXX",
        "contactType": "Customer Support",
        "areaServed": "DZ"
      }]
    })
  },
  viewport: 'width=device-width, initial-scale=1.0'
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  // Get the session on the server side
  const session = await getServerSession(authOptions);

  return (
    <html lang="en" className="scroll-smooth">
      <head>
        {/* Google tag (gtag.js) */}
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-L3YHRGB5E3"
          strategy="afterInteractive"
        />
        <Script id="gtag-init" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-L3YHRGB5E3');`}
        </Script>
      </head>
      <body className={`${spaceGrotesk.className} overflow-auto`}>
        <CartProvider>
          <NavBar session={session} /> {/* Pass session as prop */}
          {children}
        </CartProvider>
      </body>
    </html>
  );
}