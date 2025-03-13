"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { User } from "firebase/auth";
import {
  signInWithEmail,
  signInWithGoogle,
  registerWithEmailAndPassword,
  signOut,
  resetPassword,
  onAuthStateChange,
} from "./auth";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<User>;
  signInWithGoogleProvider: () => Promise<User>;
  register: (
    email: string,
    password: string,
    displayName: string
  ) => Promise<User>;
  logout: () => Promise<boolean>;
  forgotPassword: (email: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChange((user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    return signInWithEmail(email, password);
  };

  const signInWithGoogleProvider = async () => {
    return signInWithGoogle();
  };

  const register = async (
    email: string,
    password: string,
    displayName: string
  ) => {
    return registerWithEmailAndPassword(email, password, displayName);
  };

  const logout = async () => {
    return signOut();
  };

  const forgotPassword = async (email: string) => {
    return resetPassword(email);
  };

  const value = {
    user,
    loading,
    signIn,
    signInWithGoogleProvider,
    register,
    logout,
    forgotPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
