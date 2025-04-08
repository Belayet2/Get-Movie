import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Login - Getmovie",
  description: "Secure login portal for Getmovie administrators. Access the admin control panel to manage movies and site content.",
  keywords: "admin login, Getmovie admin, movie management, content administration, secure login",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
