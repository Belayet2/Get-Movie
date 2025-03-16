const fs = require('fs');
const path = require('path');

// Function to copy _redirects file to the out directory
function copyRedirectsFile() {
    console.log('Creating _redirects file for Netlify...');

    // Create _redirects file content with more comprehensive rules
    const redirectsContent = `
# Netlify redirects file
# Handle all routes with client-side routing
/*    /index.html   200

# Specific redirects for dynamic routes
/movies/*    /index.html   200
`;

    // Write to out directory
    fs.writeFileSync(path.join(__dirname, 'out', '_redirects'), redirectsContent.trim());
    console.log('Created _redirects file in out directory');
}

// Function to create a Netlify runtime config file
function createRuntimeConfig() {
    console.log('Creating runtime config for Netlify...');

    // Create a small JS file that will be included in the build
    // This helps with client-side navigation and dynamic content
    const runtimeConfig = `
// Netlify runtime configuration
window.NETLIFY_RUNTIME = {
  deployed_at: "${new Date().toISOString()}"
};
`;

    // Write to out directory
    fs.writeFileSync(path.join(__dirname, 'out', 'netlify-runtime.js'), runtimeConfig.trim());
    console.log('Created runtime config in out directory');

    // Update the index.html to include this script
    const indexPath = path.join(__dirname, 'out', 'index.html');
    if (fs.existsSync(indexPath)) {
        let indexContent = fs.readFileSync(indexPath, 'utf8');
        if (!indexContent.includes('netlify-runtime.js')) {
            indexContent = indexContent.replace(
                '</head>',
                '<script src="/netlify-runtime.js"></script></head>'
            );
            fs.writeFileSync(indexPath, indexContent);
            console.log('Updated index.html to include runtime config');
        }
    }
}

// Function to create a fallback page for dynamic routes
function createDynamicRouteFallbacks() {
    console.log('Creating fallback pages for dynamic routes...');

    // Create a movies/[slug] fallback directory
    const movieSlugDir = path.join(__dirname, 'out', 'movies');
    if (!fs.existsSync(movieSlugDir)) {
        fs.mkdirSync(movieSlugDir, { recursive: true });
    }

    // Copy the index.html to movies/index.html if it doesn't exist
    const moviesIndexPath = path.join(movieSlugDir, 'index.html');
    if (!fs.existsSync(moviesIndexPath)) {
        const mainIndexPath = path.join(__dirname, 'out', 'index.html');
        if (fs.existsSync(mainIndexPath)) {
            fs.copyFileSync(mainIndexPath, moviesIndexPath);
            console.log('Created movies/index.html fallback');
        }
    }

    // Create a special _fallback.html in the movies directory
    // This will be used by Netlify for any movie slug that doesn't have a static page
    const fallbackPath = path.join(movieSlugDir, '_fallback.html');
    const mainIndexPath = path.join(__dirname, 'out', 'index.html');

    if (fs.existsSync(mainIndexPath)) {
        fs.copyFileSync(mainIndexPath, fallbackPath);
        console.log('Created movies/_fallback.html for dynamic routes');
    }
}

// Function to ensure the about page is properly accessible
function ensureAboutPageRedirect() {
    console.log('Ensuring about page redirection...');

    // Create about.html in the out directory if it doesn't exist
    const aboutHtmlPath = path.join(__dirname, 'out', 'about.html');
    if (!fs.existsSync(aboutHtmlPath)) {
        const aboutHtmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Redirecting to About Page</title>
  <meta http-equiv="refresh" content="0; URL=/about/">
  <link rel="canonical" href="/about/">
</head>
<body>
  <p>Redirecting to <a href="/about/">About page</a>...</p>
</body>
</html>
        `;

        fs.writeFileSync(aboutHtmlPath, aboutHtmlContent.trim());
        console.log('Created about.html redirect file');
    }

    // Ensure _redirects file exists and has the about page redirect
    const redirectsPath = path.join(__dirname, 'out', '_redirects');
    let redirectsContent = '';

    if (fs.existsSync(redirectsPath)) {
        redirectsContent = fs.readFileSync(redirectsPath, 'utf8');
    }

    // Check if about redirect exists
    if (!redirectsContent.includes('/about')) {
        const newRedirectsContent = `# Netlify redirects file
/about    /about/    301!
/about.html    /about/    301!
${redirectsContent.includes('/*') ? '' : '/*    /index.html   200'}
${redirectsContent}`;

        fs.writeFileSync(redirectsPath, newRedirectsContent.trim());
        console.log('Updated _redirects file with about page redirect');
    }
}

// Main function
async function main() {
    try {
        // Run all post-build steps
        copyRedirectsFile();
        createRuntimeConfig();
        createDynamicRouteFallbacks();
        ensureAboutPageRedirect();

        console.log('Netlify build script completed successfully');
    } catch (error) {
        console.error('Error in Netlify build script:', error);
        process.exit(1);
    }
}

// Run the main function
main(); 