import AdminControlPanelClient from "./AdminControlPanelClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Control Panel - Getmovie",
  description: "Administrative dashboard for managing Getmovie content, movies, and site settings.",
  keywords: "admin panel, movie management, content administration, Getmovie admin, dashboard",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminControlPanelPage() {
  return <AdminControlPanelClient />;
}
