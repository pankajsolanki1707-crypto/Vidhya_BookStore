import type { Metadata, Viewport } from "next";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#213D8F",
};

export const metadata: Metadata = {
  title: "Vidhya Book Store & Stationery | Premium Bookstore Indore",
  description: "Vidhya Book Store & Stationery is Indore's premier bookstore located in Bhanwarkuan. Buy MPPSC, UPSC, SSC, Bank PO, Vyapam, NCERT textbooks, DAVV exam guides, and luxury stationery. Fast home delivery and custom ordering.",
  keywords: "Vidhya Book Store, Vidhya Stationary, Bhanwarkuan bookstore, Kautilya Academy books, MPPSC prep books, UPSC book store Indore, CBSE NCERT Indore, DAVV BBA MBA textbooks, buy books online Indore, premium stationery Indore",
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
    apple: "/icons/icon-192.png",
  },
  openGraph: {
    type: "website",
    title: "Vidhya Book Store & Stationery | Bhanwarkuan, Indore",
    description: "Indore's leading bookstore for competitive exams (MPPSC, UPSC, SSC, Banking) and premium stationery. Located right below Kautilya Academy, Bhanwarkuan.",
    siteName: "Vidhya Book Store",
    locale: "en_IN",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BookStore",
    "name": "Vidhya Book Store & Stationery",
    "image": "https://vidhyabookstore.com/images/storefront_entry.jpg",
    "@id": "https://vidhyabookstore.com/#organization",
    "url": "https://vidhyabookstore.com",
    "telephone": "+919752809717",
    "priceRange": "₹₹",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "B-6, Payal Plaza, Bhanwarkuan",
      "addressLocality": "Indore",
      "postalCode": "452001",
      "addressRegion": "Madhya Pradesh",
      "addressCountry": "IN"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 22.6923,
      "longitude": 75.8676
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday"
      ],
      "opens": "09:00",
      "closes": "21:30"
    }
  };

  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <CartProvider>
          {children}
        </CartProvider>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                navigator.serviceWorker.getRegistrations().then(function(registrations) {
                  for(let registration of registrations) {
                    registration.unregister().then(function(unregistered) {
                      if (unregistered) {
                        console.log('ServiceWorker successfully unregistered');
                        window.location.reload();
                      }
                    });
                  }
                });
              }
            `
          }}
        />
      </body>
    </html>
  );
}
