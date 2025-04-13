"use client";

import { useState, useEffect } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import MovieAcceptedNotification from "./MovieAcceptedNotification";
import { AuthProvider } from "../firebase/AuthContext";
import { ThemeProvider } from "../context/ThemeContext";

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
      <ThemeProvider>
        <AuthProvider>
          <Navbar />
          {children}
          <Footer />
        </AuthProvider>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <AuthProvider>
        <Navbar />
        {children}
        <Footer />
        <MovieAcceptedNotification />
      </AuthProvider>
    </ThemeProvider>
  );
}
