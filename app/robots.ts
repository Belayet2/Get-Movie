import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/movies", "/about", "/movies/"],
        disallow: [
          "/admin-login",
          "/admin-control-panel",
          "/admin-control-panel/",
          "/admin-control-panel/add-new-movie",
          "/admin-control-panel/edit-movie/",
          "/*?*",
          "/*.json$",
        ],
      },
    ],
    sitemap: "https://getmoviefast.netlify.app/sitemap.xml",
  };
}
