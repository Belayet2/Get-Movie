# Netlify Deployment Guide with GitHub Integration

This guide explains how to deploy the Movie Finder App to Netlify using GitHub integration.

## Prerequisites

1. A GitHub account
2. A Netlify account
3. Your project code pushed to a GitHub repository

## Setting Up GitHub Repository

1. Create a new repository on GitHub or use an existing one
2. Push your code to the repository:

```bash
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/your-repo-name.git
git push -u origin main
```

## Setting Up Netlify Integration

### Option 1: Netlify UI (Recommended for First-Time Setup)

1. Log in to your Netlify account
2. Click "New site from Git"
3. Select GitHub as your Git provider
4. Authorize Netlify to access your GitHub account
5. Select your repository
6. Configure build settings:
   - Build command: `npm run netlify-build:optimized`
   - Publish directory: `out`
7. Click "Show advanced" and add your environment variables:
   - Add all your Firebase configuration variables (NEXT*PUBLIC_FIREBASE*\*)
8. Click "Deploy site"

### Option 2: Using GitHub Actions (For CI/CD)

1. In your GitHub repository, go to Settings > Secrets and variables > Actions
2. Add the following secrets:
   - `NETLIFY_AUTH_TOKEN`: Your Netlify personal access token
   - `NETLIFY_SITE_ID`: Your Netlify site ID
   - All your Firebase configuration variables (NEXT*PUBLIC_FIREBASE*\*)
3. Push your code with the GitHub Actions workflow file:

```bash
git add .github/workflows/netlify.yml
git commit -m "Add GitHub Actions workflow"
git push
```

4. GitHub Actions will automatically deploy your site to Netlify on each push to the main branch

## Verifying Your Deployment

1. After deployment, Netlify will provide a URL for your site (e.g., `your-site-name.netlify.app`)
2. Visit the URL to verify that your site is working correctly
3. Check the Netlify deployment logs for any issues

## Setting Up a Custom Domain (Optional)

1. In your Netlify site dashboard, go to "Domain settings"
2. Click "Add custom domain"
3. Enter your domain name and follow the instructions to configure DNS settings

## Troubleshooting

### Build Failures

If your build fails, check the following:

1. Netlify build logs for specific error messages
2. Ensure all required environment variables are set
3. Verify that your build command is correct
4. Check if your dependencies are properly installed

### Missing Assets

If assets are missing:

1. Ensure your `netlify.toml` file is correctly configured
2. Verify that the `out` directory contains all necessary files
3. Check if your build process is correctly generating all assets

### Performance Issues

If you encounter performance issues:

1. Run Lighthouse tests to identify specific problems
2. Verify that all optimization scripts are running correctly
3. Check if Brotli and Gzip compression are properly configured
4. Ensure that caching headers are correctly set

## Continuous Deployment

With GitHub integration set up, any push to your main branch will trigger a new deployment. To preview changes before deploying to production:

1. Create a pull request in GitHub
2. Netlify will automatically create a preview deployment
3. Review the preview deployment before merging the pull request

## Monitoring

1. Use Netlify Analytics to monitor your site's performance and traffic
2. Set up Netlify notifications to be alerted of deployment successes and failures
3. Regularly check your site's performance using tools like Lighthouse
