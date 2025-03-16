# Getmovie - Movie Search Engine

A fast, modern movie search engine built with Next.js, Firebase, and Tailwind CSS.

[![Netlify Status](https://api.netlify.com/api/v1/badges/your-netlify-badge-id/deploy-status)](https://app.netlify.com/sites/getmoviefast/deploys)

## Features

- Fast movie search with real-time recommendations
- Responsive design for all devices
- Dark mode support
- Optimized for performance
- SEO friendly

## Tech Stack

- Next.js 14
- Firebase (Firestore)
- Tailwind CSS
- TypeScript

## Deployment

### Prerequisites

- Node.js 18 or later
- npm 9 or later
- A Firebase project
- A Netlify account
- A GitHub account

### Local Development

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/getmovie.git
   cd getmovie
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env.local` file with your Firebase configuration:

   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-auth-domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-storage-bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
   NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
   NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your-measurement-id
   ```

4. Run the development server:

   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Deployment to Netlify via GitHub

1. Push your code to GitHub:

   ```bash
   git add .
   git commit -m "Initial commit"
   git push -u origin main
   ```

2. Connect your GitHub repository to Netlify:

   - Log in to Netlify
   - Click "New site from Git"
   - Select GitHub and authorize Netlify
   - Select your repository
   - Configure build settings:
     - Build command: `npm run build:optimized`
     - Publish directory: `out`
   - Add environment variables from your `.env.local` file
   - Click "Deploy site"

3. Set up continuous deployment:
   - Netlify will automatically deploy when you push to the main branch
   - You can also set up preview deployments for pull requests

### GitHub Actions Setup

This repository includes a GitHub Actions workflow that automatically deploys to Netlify when you push to the main branch.

To set it up:

1. Go to your GitHub repository settings
2. Navigate to "Secrets and variables" > "Actions"
3. Add the following secrets:
   - `NETLIFY_AUTH_TOKEN`: Your Netlify personal access token
   - `NETLIFY_SITE_ID`: Your Netlify site ID
   - All the Firebase environment variables listed above

## Performance Optimization

This project includes several optimizations:

- CSS purging to reduce bundle size
- Image optimization
- Code splitting and lazy loading
- Memoization of components
- Efficient caching strategies

## License

MIT
