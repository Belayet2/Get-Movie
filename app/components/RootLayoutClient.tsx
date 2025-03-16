"use client";

import { useState, useEffect, memo } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { AuthProvider } from "../firebase/AuthContext";

// Memoize the component to prevent unnecessary re-renders
const RootLayoutClient = memo(function RootLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);

  // Use a more efficient mounting approach
  useEffect(() => {
    // Use requestIdleCallback for non-critical initialization
    const idleCallback =
      window.requestIdleCallback || ((cb) => setTimeout(cb, 1));
    const id = idleCallback(() => setMounted(true));

    return () => {
      if (window.cancelIdleCallback) {
        window.cancelIdleCallback(id);
      } else {
        clearTimeout(id);
      }
    };
  }, []);

  // Render the same content regardless of mounted state to avoid layout shifts
  return (
    <AuthProvider>
      <Navbar />
      {children}
      <Footer />
    </AuthProvider>
  );
});

// Add display name for debugging
RootLayoutClient.displayName = "RootLayoutClient";

export default RootLayoutClient;
