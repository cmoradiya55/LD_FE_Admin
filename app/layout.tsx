import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from '@/components/ui/toaster';
import { FlagsProvider } from '@/components/FlagsProvider';

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter'
});

export const metadata: Metadata = {
  title: {
    default: 'AdminPro - Modern Admin Dashboard',
    template: '%s | AdminPro'
  },
  description: 'A modern, responsive admin dashboard built with Next.js and Tailwind CSS',
  keywords: ['admin', 'dashboard', 'nextjs', 'react', 'typescript'],
  authors: [{ name: 'AdminPro Team' }],
  creator: 'AdminPro',
  metadataBase: new URL('https://adminpro.example.com'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://adminpro.example.com',
    title: 'AdminPro - Modern Admin Dashboard',
    description: 'A modern, responsive admin dashboard built with Next.js and Tailwind CSS',
    siteName: 'AdminPro',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AdminPro - Modern Admin Dashboard',
    description: 'A modern, responsive admin dashboard built with Next.js and Tailwind CSS',
    creator: '@adminpro',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className={`${inter.className} antialiased`}>
        <FlagsProvider>
          <div id="root">
            {children}
          </div>
        </FlagsProvider>
        <Toaster />
      </body>
    </html>
  );
}
