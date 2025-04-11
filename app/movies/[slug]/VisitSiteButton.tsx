"use client";

import React from "react";
import { incrementMovieViewCount } from "../../services/movieService";

export default function VisitSiteButton({
  siteLink,
  slug,
}: {
  siteLink: string;
  slug: string;
}) {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();

    const finalUrl = siteLink.startsWith("http")
      ? siteLink
      : `https://${siteLink}`;

    // 🚀 Redirect immediately
    window.open(finalUrl, "_blank", "noopener,noreferrer");

    // 🧠 Increment in background
    incrementMovieViewCount(slug)
      .then(() => {
      })
      .catch((err) => {
        console.error("View count increment failed", err);
      });
  };

  return (
    <a
      href="#"
      onClick={handleClick}
      className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline font-medium"
    >
      Visit Site
      <svg
        className="w-4 h-4 ml-1"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
        />
      </svg>
    </a>
  );
}
