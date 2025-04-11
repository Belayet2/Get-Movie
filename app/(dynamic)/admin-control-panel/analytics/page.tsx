import AnalyticsClient from "./AnalyticsClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Analytics - Admin Control Panel - Getmovie",
  description: "View movie view statistics and analytics for your Getmovie database.",
  keywords: "analytics, movie views, statistics, admin panel, Getmovie",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AnalyticsPage() {
  return <AnalyticsClient />;
}
