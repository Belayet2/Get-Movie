import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import RootLayoutClient from "./components/RootLayoutClient";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Getmovie - Get your favorite movies faster",
  description:
    "Getmovie is a movie search engine that allows you to find your favorite movies faster.",
  icons: {
    icon: "/images/logo/movie-logo.png",
    shortcut: "/images/logo/movie-logo.png",
    apple: "/images/logo/movie-logo.png",
    other: {
      rel: "icon",
      url: "/images/logo/movie-logo.png",
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <RootLayoutClient>{children}</RootLayoutClient>
      </body>
    </html>
  );
}
