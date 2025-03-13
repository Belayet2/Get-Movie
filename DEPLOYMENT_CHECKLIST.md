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
