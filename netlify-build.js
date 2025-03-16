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

// Function to ensure the out directory exists
function ensureOutDirectoryExists() {
    const outDir = path.join(__dirname, 'out');
    if (!fs.existsSync(outDir)) {
        fs.mkdirSync(outDir, { recursive: true });
    }
}

// Main function
function main() {
    try {
        console.log('Running Netlify build script...');
        ensureOutDirectoryExists();
        copyRedirectsFile();
        console.log('Netlify build script completed successfully');
    } catch (error) {
        console.error('Error in Netlify build script:', error);
        process.exit(1);
    }
}

// Run the main function
main(); 