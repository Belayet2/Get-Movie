import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Thank You - Getmovie",
  description: "Thank you for your movie recommendation. Our team will review and add your suggested movie soon.",
  keywords: "thank you, movie recommendation, Getmovie, movie submission, recommendation received",
  openGraph: {
    title: "Thank You - Getmovie",
    description: "Thank you for your movie recommendation. Our team will review and add your suggested movie soon.",
    images: [
      {
        url: "https://getmoviefast.netlify.app/images/logo/movie-logo.png",
        width: 1200,
        height: 630,
        alt: "Getmovie Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Thank You - Getmovie",
    description: "Thank you for your movie recommendation. Our team will review and add your suggested movie soon.",
    images: ["https://getmoviefast.netlify.app/images/logo/movie-logo.png"],
  },
};

export default function ThankYouLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
