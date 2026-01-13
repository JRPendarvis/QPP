import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import Footer from "@/components/Footer";
import CookieConsent from "@/components/CookieConsent";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export const metadata: Metadata = {
  title: "QuiltPlannerPro - AI-Powered Quilt Design & Pattern Generator",
  description: "Create stunning custom quilt patterns with AI. Upload your fabrics and instantly generate personalized quilt designs matched to your skill level. Perfect for quilters, quilt designers, and fabric enthusiasts.",
  keywords: [
    "quilt design",
    "quilt designer",
    "quilt patterns",
    "quilting",
    "quilt pattern generator",
    "AI quilt design",
    "custom quilt patterns",
    "fabric design",
    "quilting patterns",
    "quilt maker",
    "quilt planning",
    "quilt planner",
    "digital quilting",
    "quilt design software",
    "quilting tool",
    "pattern design",
  ],
  authors: [{ name: "QuiltPlannerPro" }],
  openGraph: {
    title: "QuiltPlannerPro - AI-Powered Quilt Design & Pattern Generator",
    description: "Create stunning custom quilt patterns with AI. Upload your fabrics and get personalized quilt designs instantly.",
    type: "website",
    siteName: "QuiltPlannerPro",
  },
  twitter: {
    card: "summary_large_image",
    title: "QuiltPlannerPro - AI-Powered Quilt Design",
    description: "Create stunning custom quilt patterns with AI. Upload your fabrics and get personalized designs instantly.",
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
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="p:domain_verify" content="8ab6c3ed54672f505c78a26d88a2d136" />
        
        {/* Structured Data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'SoftwareApplication',
              name: 'QuiltPlannerPro',
              applicationCategory: 'DesignApplication',
              description: 'AI-powered quilt pattern generator that creates custom quilt designs from your fabric photos',
              operatingSystem: 'Web',
              offers: {
                '@type': 'Offer',
                price: '0',
                priceCurrency: 'USD',
              },
              aggregateRating: {
                '@type': 'AggregateRating',
                ratingValue: '4.8',
                ratingCount: '127',
              },
            }),
          }}
        />
        
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-NHMK7M6NTZ"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-NHMK7M6NTZ');
          `}
        </Script>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <AuthProvider>
          {children}
          <Footer />
          <CookieConsent />
        </AuthProvider>
      </body>
    </html>
  );
}