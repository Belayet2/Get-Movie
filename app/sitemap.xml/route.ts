import { getFirestore, collection, getDocs } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { NextResponse } from "next/server";

// Firebase Config
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Sitemap Generator
export async function GET() {
  try {
    // Fetch movies from Firestore
    const moviesCollection = collection(db, "movies");
    const moviesSnapshot = await getDocs(moviesCollection);

    // Map movies to sitemap entries
    const movies = moviesSnapshot.docs.map((doc) => {
      const movieData = doc.data();
      return {
        loc: `https://getmoviefast.netlify.app/movies/${doc.id}`,
        lastmod: movieData.updatedAt?.toDate().toISOString() || new Date().toISOString(),
      };
    });

    // Generate the sitemap XML
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://getmoviefast.netlify.app/</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
  </url>
  <url>
    <loc>https://getmoviefast.netlify.app/about</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
  </url>
  <url>
    <loc>https://getmoviefast.netlify.app/movies</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
  </url>
  ${movies
    .map(
      (movie) => `
  <url>
    <loc>${movie.loc}</loc>
    <lastmod>${movie.lastmod}</lastmod>
  </url>`
    )
    .join("")}
</urlset>`;

    // Return the sitemap with the correct Content-Type header
    return new NextResponse(sitemap, {
      headers: {
        "Content-Type": "application/xml",
      },
    });
  } catch (error) {
    console.error("Error generating sitemap:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}