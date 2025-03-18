import { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import RootLayoutClient from "./components/RootLayoutClient";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Getmovie",
  description:
    "Getmovie is a movie search engine that allows you to search where your favorite movie is streaming.",
  applicationName: "Getmovie",
  icons: {
    icon: "/images/logo/movie-logo.png",
    shortcut: "/images/logo/movie-logo.png",
    apple: "/images/logo/movie-logo.png",
    other: {
      rel: "icon",
      url: "/images/logo/movie-logo.png",
    },
  },
  openGraph: {
    title: "Getmovie - Find Your Favorite Movies Faster",
    description:
      "A fast and user-friendly movie listing website with search recommendations.",
    url: "https://getmoviefast.netlify.app/",
    siteName: "Getmovie",
    images: [
      {
        url: "https://getmoviefast.netlify.app/images/logo/movie-logo.png",
        width: 1200,
        height: 630,
        alt: "Getmovie Logo",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Getmovie",
    description:
      "Find, Watch, and Enjoy the Best Movies with Get Movie!",
    images: [
      "https://getmoviefast.netlify.app/images/logo/movie-logo.png",
    ],
  },
};

export default function RootLayout({ children, }: { children: React.ReactNode;}) {
  return (
    <html lang="en">
      <head>
        {/* Google Search Console Verification Meta Tag */}
        <meta name="google-site-verification" content="8AQVBky567b4DPaI3mtffaJiXnr9iPZ3q9TxdCnEtfg" />
        {/* JSON-LD Structured Data for Google Rich Snippets */}
        <Script
          id="structured-data"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "Getmovie",
              "url": "https://getmoviefast.netlify.app/",
              "description":
                "A fast and user-friendly movie listing website with search recommendations.",
              "logo": "https://getmoviefast.netlify.app/images/logo/movie-logo.png",
              "publisher": {
                "@type": "Organization",
                "name": "Getmovie",
              },
            }),
          }}
        />
      </head>
      <body className={`${inter.className} antialiased`}>
         <RootLayoutClient>{children}</RootLayoutClient>
       </body>
    </html>
  );
}