"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AuthProvider } from "../firebase/AuthContext";

export default function DynamicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    // Check if we're in the browser environment
    if (typeof window !== "undefined") {
      const isLoggedIn = localStorage.getItem("adminLoggedIn") === "true";
      if (!isLoggedIn) {
        router.replace("/admin-login");
      }
    }
  }, [router]);

  return <AuthProvider>{children}</AuthProvider>;
}
