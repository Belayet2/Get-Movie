import EditMovieClient from "./EditMovieClient";
import { getAllMovieSlugs } from "@/app/services/movieService";

// This is needed for static export with dynamic routes
export async function generateStaticParams() {
  try {
    // Get all movie slugs from the database
    const slugs = await getAllMovieSlugs();

    // Add any additional required slugs that might not be in the database
    // Include common test values and placeholders
    const requiredSlugs = [
      "the-wild-robot",
      "placeholder",
      "dks",
      "test",
      "movie",
      "example-movie",
      "sample-movie",
    ];

    requiredSlugs.forEach((slug) => {
      if (!slugs.includes(slug)) {
        slugs.push(slug);
      }
    });

    // Return the slugs in the format Next.js expects
    return slugs.map((slug) => ({ slug }));
  } catch (error) {
    console.error("Error generating static params:", error);
    // Fallback to include the required slugs
    return [
      { slug: "placeholder" },
      { slug: "the-wild-robot" },
      { slug: "dks" },
      { slug: "test" },
      { slug: "movie" },
      { slug: "example-movie" },
      { slug: "sample-movie" },
    ];
  }
}

export default function EditMoviePage({
  params,
}: {
  params: { slug: string };
}) {
  return <EditMovieClient params={params} />;
}
