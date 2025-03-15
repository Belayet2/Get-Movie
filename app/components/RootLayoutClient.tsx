"use client";

import { useState, useEffect } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { AuthProvider } from "../firebase/AuthContext";
import dynamic from "next/dynamic";

// Dynamically import the Navigation component
const Navigation = dynamic(() => import("../../src/components/Navigation"), {
  loading: () => (
    <div className="h-16 bg-white dark:bg-gray-800 shadow-md"></div>
  ),
  ssr: true,
});

// Only load PerformanceMonitor in production
const PerformanceMonitor =
  process.env.NODE_ENV === "production"
    ? dynamic(() => import("../../src/components/PerformanceMonitor"))
    : () => null;

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
        <Navigation />
        <div className="min-h-screen">{children}</div>
        <Footer />
        <PerformanceMonitor />
      </>
    );
  }

  return (
    <AuthProvider>
      <Navigation />
      <div className="min-h-screen">{children}</div>
      <Footer />
      <PerformanceMonitor />
    </AuthProvider>
  );
}
