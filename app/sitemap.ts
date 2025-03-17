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
  // ✅ Fetch movie slugs from Firebase
  const moviesCollection = collection(db, "movies");
  const moviesSnapshot = await getDocs(moviesCollection);
  const movies = moviesSnapshot.docs.map((doc) => doc.id); // Assuming ID is the slug

  return [
    { url: "https://getmoviefast.netlify.app/", lastModified: new Date() },
    { url: "https://getmoviefast.netlify.app/about", lastModified: new Date() },
    { url: "https://getmoviefast.netlify.app/movies", lastModified: new Date() },
    ...movies.map((slug) => ({
      url: `https://getmoviefast.netlify.app/movies/${slug}`,
      lastModified: new Date(),
    })),
  ];
}
