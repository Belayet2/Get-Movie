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

// Main function
function main() {
    console.log('Running post-build steps for Netlify deployment...');

    // Create out directory if it doesn't exist
    if (!fs.existsSync(path.join(__dirname, 'out'))) {
        fs.mkdirSync(path.join(__dirname, 'out'), { recursive: true });
    }

    // Run post-build steps
    copyRedirectsFile();
    createRuntimeConfig();
    createDynamicRouteFallbacks();

    console.log('Post-build steps completed successfully');
}

// Run the main function
main(); 