const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// List of required dependencies for optimization scripts
const requiredDependencies = [
    'sharp',
    'critical',
    'cheerio',
    'html-minifier',
    'brotli'
];

// Function to check if a package is installed
function isPackageInstalled(packageName) {
    try {
        // Try to resolve the package
        require.resolve(packageName);
        return true;
    } catch (e) {
        return false;
    }
}

// Function to install a package
function installPackage(packageName) {
    try {
        console.log(`Installing ${packageName}...`);
        execSync(`npm install --save-dev ${packageName}`, { stdio: 'inherit' });
        return true;
    } catch (error) {
        console.error(`Failed to install ${packageName}: ${error.message}`);
        return false;
    }
}

// Main function
async function main() {
    console.log("Checking for required dependencies...");

    let allInstalled = true;
    const missingDependencies = [];

    // Check each required dependency
    for (const dependency of requiredDependencies) {
        if (!isPackageInstalled(dependency)) {
            missingDependencies.push(dependency);
            allInstalled = false;
        }
    }

    // If all dependencies are installed, we're done
    if (allInstalled) {
        console.log("All required dependencies are installed!");
        return;
    }

    // Install missing dependencies
    console.log(`Missing dependencies: ${missingDependencies.join(', ')}`);
    console.log("Installing missing dependencies...");

    for (const dependency of missingDependencies) {
        const success = installPackage(dependency);
        if (!success) {
            console.error(`Failed to install ${dependency}. Please install it manually.`);
        }
    }

    console.log("Dependency installation complete!");
}

main().catch(error => {
    console.error("Error checking dependencies:", error);
    process.exit(1);
}); 