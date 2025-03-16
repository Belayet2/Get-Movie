# Netlify Deployment Checklist

Use this checklist to ensure your movie app is ready for deployment to Netlify.

## Pre-Deployment Checks

- [ ] All environment variables are set in `.env.local`
- [ ] Firebase configuration is verified (`npm run check-firebase`)
- [ ] All code changes are committed and saved
- [ ] Application has been tested locally (`npm run dev`)
- [ ] No console errors or warnings in the browser

## Build Process

- [ ] Run the Netlify build command (`npm run netlify-build`)
- [ ] Verify the build completed successfully
- [ ] Check the `out` directory for expected files
- [ ] Create deployment zip file (`npm run create-deploy-zip`)

## Netlify Configuration

- [ ] Netlify account is set up and accessible
- [ ] Site name is decided (optional, Netlify will generate one if not specified)
- [ ] Environment variables are ready to be added to Netlify

## Firebase Configuration

- [ ] Firebase project is properly set up
- [ ] Security rules are configured to allow access from Netlify domain
- [ ] Authentication is properly configured (if using admin features)
- [ ] Storage rules are set up (if using Firebase Storage)

## Post-Deployment Checks

- [ ] Site is accessible via Netlify URL
- [ ] All pages load correctly
- [ ] Navigation works as expected
- [ ] Movie listing and details pages work
- [ ] Admin login functions correctly
- [ ] Adding new movies works without errors
- [ ] Images and assets load properly
- [ ] No console errors in the browser

## Performance and Optimization

- [ ] Site loads quickly (check Lighthouse score)
- [ ] Images are optimized
- [ ] CSS and JS are minified
- [ ] Caching is properly configured

## Security

- [ ] No sensitive information is exposed in client-side code
- [ ] Firebase rules restrict access appropriately
- [ ] Admin routes are properly protected

## Documentation

- [ ] Deployment process is documented
- [ ] Environment variables are documented
- [ ] Any known issues or limitations are documented

## Backup

- [ ] Local backup of the codebase is created
- [ ] Environment variables are backed up securely

## Before Deploying to Netlify

1. **Test the build locally**

   ```
   npm run test-build
   ```

   Ensure all checks pass, especially for the about page.

2. **Check the \_redirects file**
   Make sure the \_redirects file in the out directory contains:

   ```
   /about    /about/    301!
   /about.html    /about/    301!
   /*    /index.html   200
   ```

3. **Verify the about page works**
   - The `/about/` directory should exist in the out directory
   - The `/about.html` file should exist in the out directory
   - All links to the about page should include the trailing slash (`/about/`)

## Netlify Deployment Settings

1. **Build command**

   ```
   npm run build && node netlify-build.js
   ```

2. **Publish directory**

   ```
   out
   ```

3. **Environment variables**
   Ensure all required environment variables are set in the Netlify dashboard.

4. **Deploy Hooks**
   Configure deploy hooks if needed for automatic deployments.

## After Deployment

1. **Test the about page**

   - Visit your site and navigate to the about page from the navigation menu
   - Try accessing `/about` directly (it should redirect to `/about/`)
   - Try accessing `/about/` directly (it should load correctly)

2. **Test the admin login**

   - Try logging in to the admin panel
   - Verify you can access the admin control panel after login

3. **Check for 404 errors**
   - Review the Netlify deployment logs for any 404 errors
   - Fix any broken links or missing resources

## Troubleshooting

If the about page is still not accessible:

1. **Check Netlify redirects**

   - Go to the Netlify dashboard > Site settings > Domain management > Custom domains
   - Verify that the redirects are properly configured

2. **Force clear cache**

   - Try accessing the site in an incognito window
   - Add a cache-busting parameter to the URL: `/about/?v=1`

3. **Check Netlify Functions**

   - If using Netlify Functions, ensure they're properly configured

4. **Review build logs**
   - Check the Netlify build logs for any errors or warnings
   - Ensure the netlify-build.js script ran successfully
