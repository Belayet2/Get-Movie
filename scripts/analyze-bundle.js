const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Install required packages if not already installed
try {
    require.resolve('webpack-bundle-analyzer');
} catch (e) {
    console.log('Installing webpack-bundle-analyzer...');
    execSync('npm install webpack-bundle-analyzer --save-dev');
}

console.log('Starting bundle analysis...');

// Set environment variable for Next.js to enable bundle analyzer
process.env.ANALYZE = 'true';

// Run the build with bundle analyzer
try {
    execSync('next build', { stdio: 'inherit' });
    console.log('Bundle analysis complete!');

    // Provide recommendations based on common issues
    console.log('\nRecommendations for bundle optimization:');
    console.log('1. Look for large dependencies and consider alternatives');
    console.log('2. Use dynamic imports for code splitting');
    console.log('3. Implement tree shaking for unused code');
    console.log('4. Consider using smaller libraries or removing unused ones');
    console.log('5. Lazy load components below the fold');

} catch (error) {
    console.error('Error during bundle analysis:', error);
    process.exit(1);
} 