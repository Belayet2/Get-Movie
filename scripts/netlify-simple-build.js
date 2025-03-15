const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Function to run a command and handle errors
function runCommand(command, errorMessage, isCritical = false) {
    try {
        console.log(`Running: ${command}`);
        execSync(command, { stdio: 'inherit' });
        return true;
    } catch (error) {
        console.error(`Error: ${errorMessage}`);
        console.error(`Details: ${error.message}`);

        if (isCritical) {
            console.error('Critical error - stopping build process');
            process.exit(1);
        }

        return false;
    }
}

// Main build process
async function main() {
    console.log("\nStarting simplified Netlify build process...");

    // Step 1: Run Next.js build
    console.log("\nStep 1/3: Building Next.js application");
    if (!runCommand('next build', 'Failed to build Next.js application.', true)) {
        process.exit(1);
    }

    // Step 2: Run the original netlify-build.js script
    console.log("\nStep 2/3: Running Netlify build script");
    if (!runCommand('node netlify-build.js', 'Failed to run Netlify build script.', true)) {
        process.exit(1);
    }

    // Step 3: Optimize images (simplified version)
    console.log("\nStep 3/3: Optimizing images");
    runCommand('node scripts/optimize-images.js', 'Failed to optimize images, but continuing build process...');

    console.log("\nNetlify simplified build process completed successfully!");
}

main().catch(error => {
    console.error("Unhandled error in build process:", error);
    process.exit(1);
}); 