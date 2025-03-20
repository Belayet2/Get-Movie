import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/movies", "/movies/*", "/about"], // Allow all movie pages
        disallow: [
          "/admin-login",
          "/admin-control-panel",
          "/admin-control-panel/*", // Properly block all admin routes
          "/admin-control-panel/add-new-movie",
          "/admin-control-panel/edit-movie/*",
          "/*.json$", // Blocks JSON API responses
        ],
      },
    ],
    sitemap: "https://getmoviefast.netlify.app/sitemap.xml",
  };
}
