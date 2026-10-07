import type { Metadata, Viewport } from "next";
import { Barlow_Condensed, Inter } from "next/font/google";
import Script from "next/script";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { SITE } from "@/lib/site";
import "./globals.css";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"], display: "swap" });
const barlow = Barlow_Condensed({
  variable: "--font-barlow",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: "Summit Line Academy | Offensive Line Training in Kansas City",
    template: "%s | Summit Line Academy",
  },
  description: SITE.description,
  keywords: [
    "offensive line training",
    "offensive line training Kansas City",
    "Kansas City offensive line training",
    "football training Kansas City",
    "youth offensive line training",
    "high school offensive line training",
    "OL training",
    "football camps Kansas City",
    "offensive line coach Kansas City",
  ],
  openGraph: {
    type: "website",
    siteName: SITE.name,
    title: "Summit Line Academy | Offensive Line Training in Kansas City",
    description: SITE.description,
    locale: "en_US",
  },
  twitter: { card: "summary_large_image" },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  width: "device-width",
  initialScale: 1,
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SportsActivityLocation",
  name: SITE.name,
  description: SITE.description,
  url: SITE.url,
  email: SITE.email,
  telephone: SITE.phone,
  address: { "@type": "PostalAddress", addressLocality: SITE.location.city, addressRegion: SITE.location.region, addressCountry: "US" },
  areaServed: "Kansas City metropolitan area",
  sport: "American football",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} ${barlow.variable}`}>
      <body className="flex min-h-screen flex-col">
        <noscript>
          <style>{`.reveal{opacity:1!important;transform:none!important}`}</style>
        </noscript>
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-white focus:px-4 focus:py-2 focus:text-black">
          Skip to content
        </a>
        <Header />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        {SITE.gaId && (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${SITE.gaId}`} strategy="afterInteractive" />
            <Script id="ga-init" strategy="afterInteractive">
              {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${SITE.gaId}');`}
            </Script>
          </>
        )}
      </body>
    </html>
  );
}
