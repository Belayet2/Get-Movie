# Manual Deployment Guide for Movie App to Netlify

This guide will walk you through the process of manually deploying your Next.js movie app to Netlify.

## Prerequisites

- A Netlify account (sign up at [netlify.com](https://netlify.com) if you don't have one)
- Your built project files (in the `out` directory)

## Step 1: Verify Firebase Configuration

Before deploying, verify that your Firebase configuration is correct:

```bash
npm run check-firebase
```

This will check that all required environment variables are set and display your Firebase project information.

## Step 2: Prepare Your Build

Run the build command:

```bash
npm run netlify-build
```

This creates an optimized production build in the `out` directory with all the necessary files for Netlify deployment.

### Option A: Deploy with Individual Files

You can upload the entire `out` directory to Netlify as described in Step 4.

### Option B: Deploy with Zip File (Recommended)

For easier uploading, you can create a zip file of your build:

```bash
npm run create-deploy-zip
```

This will create a `netlify-deploy.zip` file in your project root that contains all the necessary files for deployment.

## Step 3: Log in to Netlify

1. Go to [app.netlify.com](https://app.netlify.com/) and log in to your account
2. Navigate to the "Sites" section in the dashboard

## Step 4: Deploy Your Site Manually

### If using individual files:

1. Click on the "Add new site" dropdown button
2. Select "Deploy manually" from the dropdown menu
3. Drag and drop your entire `out` directory to the designated area, or click to browse and select the `out` folder
4. Wait for the upload to complete (this may take a few minutes depending on your internet connection)

### If using the zip file:

1. Click on the "Add new site" dropdown button
2. Select "Deploy manually" from the dropdown menu
3. Drag and drop the `netlify-deploy.zip` file to the designated area, or click to browse and select it
4. Wait for the upload and extraction to complete

## Step 5: Configure Environment Variables

After deployment, you need to set up your environment variables:

1. Go to your newly deployed site's dashboard
2. Navigate to "Site settings" > "Environment variables"
3. Add the following environment variables (these should match your `.env.local` file):

```
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyDYxn0qmfRlvuSHB9WFWgEKR1KlmurAbXc
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=getmovie-a8c64.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=getmovie-a8c64
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=getmovie-a8c64.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=1094920216836
NEXT_PUBLIC_FIREBASE_APP_ID=1:1094920216836:web:16f2a5d4524db19409f051
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-THX56LD78P
```

4. Click "Save" to apply the environment variables

## Step 6: Configure Firebase Security Rules

To ensure your app works correctly on Netlify, you need to update your Firebase Security Rules:

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Navigate to Firestore Database > Rules
4. Update your rules to allow access from your Netlify domain:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow public read access to movies
    match /movies/{movieId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Other rules...
  }
}
```

5. Similarly, update Storage rules if you're using Firebase Storage for images

## Step 7: Configure Site Settings

1. Go to "Site settings" > "Build & deploy" > "Continuous Deployment"
2. Under "Build settings", set:
   - Build command: `npm run netlify-build`
   - Publish directory: `out`

## Step 8: Verify Deployment

1. Visit your deployed site using the Netlify domain provided (e.g., `your-site-name.netlify.app`)
2. Test the following functionality:
   - Navigation between pages
   - Movie listing and details pages
   - Admin login and movie management (if applicable)
   - Adding new movies (the functionality that had issues before)

## Troubleshooting

If you encounter issues with your deployment, check the following:

1. **404 errors on page navigation**: Make sure your `_redirects` file is properly configured
2. **Missing environment variables**: Verify all environment variables are correctly set in Netlify
3. **Firebase connection issues**: Check Firebase console to ensure your project is properly configured to accept requests from your Netlify domain
4. **Adding movies doesn't work**: Verify Firebase permissions and rules

## Future Deployments

For future updates, you can either:

1. Repeat this manual deployment process with new builds
2. Set up continuous deployment by connecting your GitHub repository to Netlify

## Additional Resources

- [Netlify Documentation](https://docs.netlify.com/)
- [Next.js on Netlify](https://docs.netlify.com/integrations/frameworks/next-js/overview/)
- [Firebase Hosting with Netlify](https://firebase.google.com/docs/hosting/custom-domain)
