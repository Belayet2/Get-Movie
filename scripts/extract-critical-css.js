const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Install critical if not already installed
try {
    require.resolve('critical');
} catch (e) {
    console.log('Installing critical for CSS extraction...');
    execSync('npm install critical --save-dev');
}

const critical = require('critical');
const OUT_DIR = path.join(__dirname, '../out');

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

// Process a single HTML file
async function processCriticalCSS(htmlPath) {
    try {
        console.log(`Processing ${htmlPath}...`);

        // Generate critical CSS
        const result = await critical.generate({
            base: OUT_DIR,
            src: path.relative(OUT_DIR, htmlPath),
            target: {
                html: path.relative(OUT_DIR, htmlPath),
                css: path.join(path.dirname(path.relative(OUT_DIR, htmlPath)), 'critical.css'),
            },
            inline: true,
            extract: true,
            width: 1300,
            height: 900,
            penthouse: {
                timeout: 120000,
            },
        });

        console.log(`✅ Critical CSS extracted for ${htmlPath}`);
        return true;
    } catch (error) {
        console.error(`❌ Error processing ${htmlPath}:`, error);
        return false;
    }
}

async function main() {
    if (!fs.existsSync(OUT_DIR)) {
        console.error(`Output directory ${OUT_DIR} does not exist. Run 'next build' first.`);
        process.exit(1);
    }

    console.log('Finding HTML files to process...');
    const htmlFiles = findHtmlFiles(OUT_DIR);
    console.log(`Found ${htmlFiles.length} HTML files`);

    let successCount = 0;
    let failCount = 0;

    for (const file of htmlFiles) {
        const success = await processCriticalCSS(file);
        if (success) {
            successCount++;
        } else {
            failCount++;
        }
    }

    console.log(`\nCritical CSS extraction complete!`);
    console.log(`✅ Successfully processed: ${successCount} files`);
    console.log(`❌ Failed to process: ${failCount} files`);
}

main().catch(console.error); 