# Setting Up Dynamic Routes for New Movies on Netlify

This guide explains how to set up your Netlify deployment to handle dynamic routes for new movies added after deployment.

## The Problem

When using Next.js with `output: 'export'` (static site generation), all pages are generated at build time. When you add a new movie after deployment, Netlify doesn't automatically create a page for the new movie's URL (e.g., `/movies/new-movie-slug`).

## The Solution

We've implemented a solution that uses Netlify build hooks to trigger a rebuild of the site when a new movie is added. This ensures that new movie pages are generated and available on your site.

## Setup Instructions

### 1. Create a Netlify Build Hook

1. Go to your Netlify dashboard and select your site
2. Navigate to **Site settings** > **Build & deploy** > **Build hooks**
3. Click **Add build hook**
4. Name it something like "Movie Revalidation"
5. Select the branch you want to build (usually `main` or `master`)
6. Copy the generated URL (it will look like `https://api.netlify.com/build_hooks/your-build-hook-id`)

### 2. Update Environment Variables

Add the following environment variables to your Netlify site:

1. Go to **Site settings** > **Environment variables**
2. Add the following variables:
   - `NETLIFY_BUILD_HOOK`: The build hook URL you copied earlier
   - `REVALIDATION_TOKEN`: A secure random string (generate one at https://generate-secret.vercel.app/32)
   - `NEXT_PUBLIC_REVALIDATION_TOKEN`: The same value as `REVALIDATION_TOKEN`

### 3. Update Your Local Environment

Update your local `.env.local` file with the same variables for testing:

```
NEXT_PUBLIC_REVALIDATION_TOKEN=your-secret-token
REVALIDATION_TOKEN=your-secret-token
NETLIFY_BUILD_HOOK=https://api.netlify.com/build_hooks/your-build-hook-id
```

## How It Works

1. When a new movie is added through the admin interface, the `addMovie` function in `movieService.ts` triggers a revalidation request
2. The revalidation endpoint (`/api/revalidate`) validates the request and triggers the Netlify build hook
3. Netlify rebuilds the site, generating a static page for the new movie
4. The updated site is deployed with the new movie page

## Fallback Mechanism

We've also implemented a fallback mechanism using Netlify redirects:

1. The `netlify-build.js` script creates a `_fallback.html` file in the `movies` directory
2. The `netlify.toml` configuration includes a redirect rule that serves this fallback for any movie URL that doesn't have a static page
3. This ensures that even if a rebuild hasn't happened yet, users can still access new movie pages

## Testing

To test this functionality:

1. Deploy your site to Netlify
2. Add a new movie through the admin interface
3. Try accessing the new movie's URL (e.g., `/movies/new-movie-slug`)
4. The page should load correctly, either from the static file (if the rebuild has completed) or from the fallback

## Troubleshooting

If new movie pages aren't working:

1. Check the Netlify deployment logs to ensure the build hook is being triggered
2. Verify that the environment variables are set correctly
3. Check the browser console for any errors
4. Make sure the revalidation endpoint is working correctly

For any issues, contact the development team.
