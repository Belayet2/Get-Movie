const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Function to run the build and test it
async function testBuild() {
    try {
        console.log('Running Next.js build...');
        execSync('npm run build', { stdio: 'inherit' });

        console.log('Running Netlify build script...');
        execSync('node netlify-build.js', { stdio: 'inherit' });

        // Check if the about page and redirects are properly set up
        const outDir = path.join(__dirname, 'out');
        const aboutDir = path.join(outDir, 'about');
        const aboutHtml = path.join(outDir, 'about.html');
        const redirectsFile = path.join(outDir, '_redirects');

        console.log('\nChecking build output:');

        if (fs.existsSync(aboutDir)) {
            console.log('✅ about/ directory exists');
        } else {
            console.log('❌ about/ directory is missing');
        }

        if (fs.existsSync(aboutHtml)) {
            console.log('✅ about.html redirect file exists');
        } else {
            console.log('❌ about.html redirect file is missing');
        }

        if (fs.existsSync(redirectsFile)) {
            const redirectsContent = fs.readFileSync(redirectsFile, 'utf8');
            if (redirectsContent.includes('/about')) {
                console.log('✅ _redirects file contains about page redirect');
            } else {
                console.log('❌ _redirects file is missing about page redirect');
            }
        } else {
            console.log('❌ _redirects file is missing');
        }

        console.log('\nBuild test completed successfully!');
    } catch (error) {
        console.error('Error during build test:', error);
        process.exit(1);
    }
}

// Run the test
testBuild(); 