import { MetadataRoute } from "next";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { initializeApp } from "firebase/app";

// ✅ Firebase Config (Use your actual credentials)
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

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    // ✅ Fetch movie slugs and their lastModified from Firebase
    const moviesCollection = collection(db, "movies");
    const moviesSnapshot = await getDocs(moviesCollection);
    
    const movies = await Promise.all(moviesSnapshot.docs.map(async (doc) => {
      const movieData = doc.data();
      return { slug: doc.id, lastModified: movieData.updatedAt.toDate() }; // Assuming `updatedAt` is a Firestore Timestamp
    }));

    return [
      { url: "https://getmoviefast.netlify.app/", lastModified: new Date() },
      { url: "https://getmoviefast.netlify.app/about", lastModified: new Date() },
      { url: "https://getmoviefast.netlify.app/movies", lastModified: new Date() },
      ...movies.map((movie) => ({
        url: `https://getmoviefast.netlify.app/movies/${movie.slug}`,
        lastModified: movie.lastModified,
      })),
    ];
  } catch (error) {
    console.error("Error generating sitemap:", error);
    return [];
  }
}
