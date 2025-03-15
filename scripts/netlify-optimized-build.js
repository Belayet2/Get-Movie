const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Function to run a command and handle errors
function runCommand(command, errorMessage) {
    try {
        console.log(`Running: ${command}`);
        execSync(command, { stdio: 'inherit' });
        return true;
    } catch (error) {
        console.error(`Error: ${errorMessage}`);
        console.error(`Details: ${error.message}`);
        return false;
    }
}

// Main build process
async function main() {
    // Step 0: Check and install dependencies
    console.log("\nStep 0/5: Checking and installing dependencies");
    runCommand('node scripts/install-dependencies.js', 'Failed to check dependencies, but continuing build process...');

    // Step 1: Run Next.js build
    console.log("\nStep 1/5: Building Next.js application");
    if (!runCommand('next build', 'Failed to build Next.js application.')) {
        process.exit(1);
    }

    // Step 2: Run the original netlify-build.js script
    console.log("\nStep 2/5: Running Netlify build script");
    if (!runCommand('node netlify-build.js', 'Failed to run Netlify build script.')) {
        process.exit(1);
    }

    // Step 3: Optimize images (simplified version)
    console.log("\nStep 3/5: Optimizing images");
    runCommand('node scripts/optimize-images.js', 'Failed to optimize images, but continuing build process...');

    // Step 4: Minify HTML
    console.log("\nStep 4/5: Minifying HTML");
    runCommand('node scripts/minify-html.js', 'Failed to minify HTML, but continuing build process...');

    // Step 5: Compress assets
    console.log("\nStep 5/5: Compressing assets");
    runCommand('node scripts/compress-assets.js', 'Failed to compress assets, but continuing build process...');

    console.log("\nNetlify optimized build process completed successfully!");
}

main().catch(error => {
    console.error("Unhandled error in build process:", error);
    process.exit(1);
}); 