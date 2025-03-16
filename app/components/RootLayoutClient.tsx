"use client";

import { useState, useEffect } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { AuthProvider } from "../firebase/AuthContext";

export default function RootLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <>
        <Navbar />
        {children}
        <Footer />
      </>
    );
  }

  return (
    <AuthProvider>
      <Navbar />
      {children}
      <Footer />
    </AuthProvider>
  );
}
