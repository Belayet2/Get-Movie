# Movie Finder App

A Next.js application for browsing and managing movies, with Firebase integration for data storage and authentication.

## Features

- Browse movies with detailed information
- Admin panel for managing movies (add, edit, delete)
- Responsive design for all devices
- Firebase authentication for admin access
- Static site generation for optimal performance

## Build Options

This project includes several build options to accommodate different needs:

### Standard Build

```bash
npm run build
```

This runs the standard Next.js build process.

### Optimized Build

```bash
npm run build:optimized
```

This runs a comprehensive optimization pipeline:

1. Next.js build
2. Advanced image optimization (WebP and AVIF formats)
3. Responsive image generation
4. Critical CSS extraction
5. JavaScript delivery optimization
6. Resource hints optimization
7. HTML minification
8. Asset compression (Brotli and Gzip)

### Safe Build

```bash
npm run build:safe
```

Similar to the optimized build, but continues even if individual optimization steps fail.

### Super Build

```bash
npm run build:super
```

The most robust build option that:

1. Checks and installs missing dependencies
2. Runs the Next.js build
3. Performs all optimizations with detailed logging
4. Continues on non-critical errors

### Netlify Optimized Build

```bash
npm run netlify-build:optimized
```

A specialized build for Netlify deployment that:

1. Checks dependencies
2. Runs the Next.js build
3. Executes the Netlify-specific build script
4. Performs essential optimizations

## Performance Optimizations

This project includes numerous performance optimizations:

- **Image Optimization**: WebP and AVIF formats with responsive sizing
- **CSS Optimization**: Critical CSS extraction and inlining
- **JavaScript Optimization**: Module/nomodule pattern, deferred loading
- **Resource Hints**: Preconnect, dns-prefetch, and preload directives
- **Compression**: Brotli and Gzip compression for static assets
- **Caching Strategy**: Optimized cache headers in Netlify configuration
- **Offline Support**: Service worker for offline capabilities

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

### Netlify with GitHub Integration (Recommended)

This project is configured for automatic deployment to Netlify via GitHub:

1. Push your code to GitHub
2. Connect your GitHub repository to Netlify
3. Netlify will automatically build and deploy your site

For detailed instructions, see [NETLIFY_GITHUB_DEPLOY_GUIDE.md](./NETLIFY_GITHUB_DEPLOY_GUIDE.md).

### Netlify Manual Deployment

Alternatively, you can manually deploy to Netlify:

1. Build the project:

```bash
npm run netlify-build:optimized
```

2. Create a deployment zip file:

```bash
npm run create-deploy-zip
```

3. Upload to Netlify:
   - Log in to your Netlify account
   - Go to "Sites" and click "Add new site" > "Deploy manually"
   - Upload the `netlify-deploy.zip` file

For detailed manual deployment instructions, see [NETLIFY_DEPLOY_GUIDE.md](./NETLIFY_DEPLOY_GUIDE.md).

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
- `out/` - Production build output (generated)

## Technologies Used

- Next.js 14
- React 18
- Firebase (Authentication, Firestore, Storage)
- TypeScript
- Tailwind CSS

## License

This project is licensed under the MIT License.

## Dependency Management

```bash
npm run install-deps
```

Checks for and installs missing dependencies required for the build process.
