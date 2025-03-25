export interface Movie {
  id: number;
  title: string;
  posterPath: string;
  rating: number;
  year: string;
  genres: string[];
  director?: string;
  stars?: string[];
  runtime?: string;
  firestoreId?: string; // Firestore document ID
  slug?: string; // URL-friendly version of the title
  siteInfo?: SiteInfo[]; // Additional site information
  status?: 'live' | 'pending';
  pendingType?: 'admin' | 'user';
  key?: string; // New field for movie key
  lastClicked?: Date | null;
  points?: number;
  order?: number;
}

// Interface for site information
export interface SiteInfo {
  siteName: string;
  siteLink: string;
  tags: string[];
} 

export interface MovieAnalytics {
  id: string;
  points: number;
  lastClicked: Date;
  title?: string;
}