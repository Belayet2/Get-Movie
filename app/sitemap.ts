import { NextResponse } from "next/server";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { initializeApp } from "firebase/app";

// ✅ Firebase Config
const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export async function GET() {
  try {
    const moviesCollection = collection(db, "movies");
    const moviesSnapshot = await getDocs(moviesCollection);

    const movies = moviesSnapshot.docs.map((doc) => {
      const movieData = doc.data();
      const lastModified = movieData.updatedAt ? movieData.updatedAt.toDate().toISOString() : new Date().toISOString();
      return `<url>
        <loc>https://getmoviefast.netlify.app/movies/${doc.id}</loc>
        <lastmod>${lastModified}</lastmod>
      </url>`;
    });

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
      ${movies.join("\n")}
    </urlset>`;

    return new NextResponse(sitemap, {
      headers: {
        "Content-Type": "application/xml",
      },
    });
  } catch (error) {
    console.error("Error generating sitemap:", error);
    return new NextResponse("<error>Failed to generate sitemap</error>", {
      status: 500,
      headers: { "Content-Type": "application/xml" },
    });
  }
}
