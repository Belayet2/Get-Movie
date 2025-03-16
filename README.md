# Movie Finder App

A Next.js application for browsing and managing movies, with Firebase integration for data storage and authentication.

## Features

- Browse movies with detailed information
- Admin panel for managing movies (add, edit, delete)
- Responsive design for all devices
- Firebase authentication for admin access
- Static site generation for optimal performance

## Getting Started

### Prerequisites

- Node.js 14.x or higher
- npm or yarn
- Firebase account

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
# or
yarn install
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

### Development

Run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment

### Local Build

To build the project for production locally:

```bash
npm run build
# or
yarn build
```

### Netlify Deployment

'''bash
git add .
git commit -m "Error Fixed"
git push -u origin main
'''

This project is configured for deployment to Netlify:

1. Connect your GitHub repository to Netlify
2. Set the build command to: `npm run netlify-build`
3. Set the publish directory to: `out`
4. Add your Firebase environment variables in the Netlify dashboard

Alternatively, you can deploy manually:

```bash
npm run netlify-build
```

Then upload the `out` directory to Netlify.

## Project Structure

- `app/` - Next.js application code
  - `components/` - Reusable UI components
  - `firebase/` - Firebase configuration and utilities
  - `hooks/` - Custom React hooks
  - `services/` - API and data services
  - `types/` - TypeScript type definitions
  - `page.tsx` - Home page
  - `layout.tsx` - Root layout component
- `public/` - Static assets

## Technologies Used

- Next.js 14
- React 18
- Firebase (Authentication, Firestore, Storage)
- TypeScript
- Tailwind CSS

## License

This project is licensed under the MIT License.
