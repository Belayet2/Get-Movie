const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Install html-minifier if not already installed
try {
    require.resolve('html-minifier');
} catch (e) {
    console.log('Installing html-minifier...');
    execSync('npm install html-minifier --save-dev');
}

const minify = require('html-minifier').minify;

const OUT_DIR = path.join(__dirname, '../out');

// Minification options
const minifyOptions = {
    collapseWhitespace: true,
    removeComments: true,
    removeRedundantAttributes: true,
    removeScriptTypeAttributes: true,
    removeStyleLinkTypeAttributes: true,
    useShortDoctype: true,
    minifyCSS: true,
    minifyJS: true,
};

// Function to recursively find all HTML files in a directory
function findHtmlFiles(dir) {
    let results = [];
    const items = fs.readdirSync(dir);

    for (const item of items) {
        const itemPath = path.join(dir, item);
        const stat = fs.statSync(itemPath);

        if (stat.isDirectory()) {
            results = results.concat(findHtmlFiles(itemPath));
        } else if (itemPath.endsWith('.html')) {
            results.push(itemPath);
        }
    }

    return results;
}

// Function to minify an HTML file
function minifyHtmlFile(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        const minified = minify(content, minifyOptions);

        // Calculate size reduction
        const originalSize = content.length;
        const minifiedSize = minified.length;
        const reduction = ((originalSize - minifiedSize) / originalSize * 100).toFixed(2);

        fs.writeFileSync(filePath, minified, 'utf8');
        console.log(`Minified ${filePath} - Reduced by ${reduction}% (${originalSize} → ${minifiedSize} bytes)`);
    } catch (error) {
        console.error(`Error minifying ${filePath}:`, error);
    }
}

// Main function
function main() {
    if (!fs.existsSync(OUT_DIR)) {
        console.error(`Output directory ${OUT_DIR} does not exist. Run 'next build' first.`);
        process.exit(1);
    }

    console.log('Finding HTML files to minify...');
    const htmlFiles = findHtmlFiles(OUT_DIR);
    console.log(`Found ${htmlFiles.length} HTML files`);

    for (const file of htmlFiles) {
        minifyHtmlFile(file);
    }

    console.log('HTML minification complete!');
}

main(); 