const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Function to run a command and handle errors
function runCommand(command, errorMessage, isCritical = false) {
    try {
        console.log(`\n📋 Running: ${command}`);
        execSync(command, { stdio: 'inherit' });
        console.log(`✅ Success: ${command}`);
        return true;
    } catch (error) {
        console.error(`❌ Error: ${errorMessage}`);
        console.error(`📄 Details: ${error.message}`);

        if (isCritical) {
            console.error('🛑 Critical error - stopping build process');
            process.exit(1);
        }

        return false;
    }
}

// Function to check if a directory exists
function directoryExists(dirPath) {
    try {
        return fs.existsSync(dirPath) && fs.statSync(dirPath).isDirectory();
    } catch (error) {
        return false;
    }
}

// Main build process
async function main() {
    console.log('\n🚀 Starting build process with fallback handling...');

    // Step 1: Install dependencies if needed
    console.log('\n📦 Step 1: Checking and installing dependencies');
    runCommand('node scripts/install-dependencies.js', 'Failed to check dependencies, but continuing build process...');

    // Step 2: Run Next.js build
    console.log('\n🏗️ Step 2: Building Next.js application');
    if (!runCommand('next build', 'Failed to build Next.js application.', true)) {
        return;
    }

    // Check if the out directory exists
    if (!directoryExists('./out')) {
        console.error('❌ Error: Output directory not found. Trying to run netlify-build.js');
        if (!runCommand('node netlify-build.js', 'Failed to run Netlify build script.', true)) {
            return;
        }
    }

    // Step 3: Run advanced image optimization
    console.log('\n🖼️ Step 3: Running advanced image optimization');
    runCommand('node scripts/advanced-image-optimization.js', 'Failed to optimize images, but continuing build process...');

    // Step 4: Generate responsive images
    console.log('\n📱 Step 4: Generating responsive images');
    runCommand('node scripts/generate-responsive-images.js', 'Failed to generate responsive images, but continuing build process...');

    // Step 5: Extract critical CSS
    console.log('\n🎨 Step 5: Extracting critical CSS');
    runCommand('node scripts/extract-critical-css.js', 'Failed to extract critical CSS, but continuing build process...');

    // Step 6: Optimize JavaScript delivery
    console.log('\n📜 Step 6: Optimizing JavaScript delivery');
    runCommand('node scripts/optimize-js-delivery.js', 'Failed to optimize JavaScript delivery, but continuing build process...');

    // Step 7: Optimize resource hints
    console.log('\n🔍 Step 7: Optimizing resource hints');
    runCommand('node scripts/optimize-resource-hints.js', 'Failed to optimize resource hints, but continuing build process...');

    // Step 8: Minify HTML
    console.log('\n📄 Step 8: Minifying HTML');
    runCommand('node scripts/minify-html.js', 'Failed to minify HTML, but continuing build process...');

    // Step 9: Compress assets
    console.log('\n📦 Step 9: Compressing assets');
    runCommand('node scripts/compress-assets.js', 'Failed to compress assets, but continuing build process...');

    console.log('\n✨ Build process completed successfully!');
    console.log('📂 Output directory: ./out');
}

main().catch(error => {
    console.error('🔥 Unhandled error in build process:', error);
    process.exit(1);
});
