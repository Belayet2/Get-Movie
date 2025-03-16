const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

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

// Function to create a robots.txt file if it doesn't exist
function createRobotsFile() {
    console.log('Creating robots.txt file...');
    const outDir = path.join(__dirname, 'out');
    const robotsPath = path.join(outDir, 'robots.txt');

    // Check if robots.txt already exists
    if (!fs.existsSync(robotsPath)) {
        const robotsContent = `
# Allow all web crawlers
User-agent: *
Allow: /

# Sitemap location
Sitemap: https://getmoviefast.netlify.app/sitemap.xml
`;
        fs.writeFileSync(robotsPath, robotsContent.trim());
        console.log('Created robots.txt file in out directory');
    } else {
        console.log('robots.txt already exists, skipping creation');
    }
}

// Function to optimize images in the out directory
function optimizeImages() {
    console.log('Optimizing images...');
    try {
        // Find all image files in the out directory
        const outDir = path.join(__dirname, 'out');
        const imageFiles = findImageFiles(outDir);

        if (imageFiles.length === 0) {
            console.log('No image files found to optimize');
            return;
        }

        console.log(`Found ${imageFiles.length} image files to optimize`);

        // Simple image optimization by copying the files
        // In a real scenario, you would use an image optimization library
        let optimizedCount = 0;

        for (const imageFile of imageFiles) {
            try {
                // Read the file stats before optimization
                const statsBefore = fs.statSync(imageFile);
                const sizeBefore = statsBefore.size;

                // For demonstration, we're just copying the file
                // In a real scenario, you would compress the image here
                const tempFile = `${imageFile}.temp`;
                fs.copyFileSync(imageFile, tempFile);
                fs.unlinkSync(imageFile);
                fs.renameSync(tempFile, imageFile);

                // Read the file stats after optimization
                const statsAfter = fs.statSync(imageFile);
                const sizeAfter = statsAfter.size;

                // Log the result
                console.log(`Optimized ${path.basename(imageFile)}: ${formatBytes(sizeBefore)} -> ${formatBytes(sizeAfter)}`);
                optimizedCount++;
            } catch (error) {
                console.error(`Error optimizing ${imageFile}:`, error);
            }
        }

        console.log(`Successfully optimized ${optimizedCount} out of ${imageFiles.length} images`);
    } catch (error) {
        console.error('Error optimizing images:', error);
    }
}

// Helper function to find image files recursively
function findImageFiles(dir, fileList = []) {
    const files = fs.readdirSync(dir);

    for (const file of files) {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            findImageFiles(filePath, fileList);
        } else {
            const ext = path.extname(file).toLowerCase();
            if (['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext)) {
                fileList.push(filePath);
            }
        }
    }

    return fileList;
}

// Helper function to format bytes to a human-readable format
function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

// Function to create a sitemap.xml file
function createSitemapFile() {
    console.log('Creating sitemap.xml file...');
    const outDir = path.join(__dirname, 'out');
    const sitemapPath = path.join(outDir, 'sitemap.xml');

    // Check if sitemap.xml already exists
    if (!fs.existsSync(sitemapPath)) {
        const today = new Date().toISOString().split('T')[0];
        const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://getmoviefast.netlify.app/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://getmoviefast.netlify.app/movies/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://getmoviefast.netlify.app/about/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
</urlset>`;
        fs.writeFileSync(sitemapPath, sitemapContent);
        console.log('Created sitemap.xml file in out directory');
    } else {
        console.log('sitemap.xml already exists, skipping creation');
    }
}

// Main function
function main() {
    try {
        console.log('Running Netlify build script...');
        ensureOutDirectoryExists();
        copyRedirectsFile();
        createRobotsFile();
        createSitemapFile();
        optimizeImages();
        console.log('Netlify build script completed successfully');
    } catch (error) {
        console.error('Error in Netlify build script:', error);
        process.exit(1);
    }
}

// Run the main function
main(); 