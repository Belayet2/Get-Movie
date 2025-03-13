import EditMovieClient from "./EditMovieClient";
import { getAllMovieSlugs } from "@/app/services/movieService";

// This is needed for static export with dynamic routes
export async function generateStaticParams() {
  try {
    // Try to get all movie slugs from the database
    const slugs = await getAllMovieSlugs();

    // Make sure "the-wild-robot" is included
    if (!slugs.includes("the-wild-robot")) {
      slugs.push("the-wild-robot");
    }

    // Make sure "placeholder" is included
    if (!slugs.includes("placeholder")) {
      slugs.push("placeholder");
    }

    // Return the slugs in the format Next.js expects
    return slugs.map((slug) => ({ slug }));
  } catch (error) {
    console.error("Error generating static params:", error);
    // Fallback to at least include the required slugs
    return [{ slug: "placeholder" }, { slug: "the-wild-robot" }];
  }
}

export default function EditMoviePage({
  params,
}: {
  params: { slug: string };
}) {
  return <EditMovieClient params={params} />;
}
