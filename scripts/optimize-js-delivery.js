const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const cheerio = require('cheerio');

// Install cheerio if not already installed
try {
    require.resolve('cheerio');
} catch (e) {
    console.log('Installing cheerio...');
    execSync('npm install cheerio --save-dev');
}

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
function processHtmlFile(htmlPath) {
    try {
        console.log(`Processing ${htmlPath}...`);

        // Read the HTML file
        const html = fs.readFileSync(htmlPath, 'utf8');

        // Load the HTML into cheerio
        const $ = cheerio.load(html);

        // Find all script tags
        const scripts = $('script[src]').toArray();

        // Process each script tag
        scripts.forEach(scriptEl => {
            const script = $(scriptEl);
            const src = script.attr('src');

            // Skip if it's an external script or already has type="module"
            if (src.startsWith('http') || script.attr('type') === 'module') {
                return;
            }

            // Skip if it's a polyfill or legacy script
            if (src.includes('polyfill') || src.includes('legacy')) {
                return;
            }

            // Create a module version of the script
            const moduleScript = $('<script>');
            moduleScript.attr('src', src);
            moduleScript.attr('type', 'module');

            // Create a nomodule version of the script
            const nomoduleScript = $('<script>');
            nomoduleScript.attr('src', src);
            nomoduleScript.attr('nomodule', '');

            // Replace the original script with the module/nomodule versions
            script.replaceWith(moduleScript);
            moduleScript.after(nomoduleScript);
        });

        // Write the modified HTML back to the file
        fs.writeFileSync(htmlPath, $.html(), 'utf8');

        console.log(`✅ Optimized JS delivery for ${htmlPath}`);
        return true;
    } catch (error) {
        console.error(`❌ Error processing ${htmlPath}:`, error);
        return false;
    }
}

function main() {
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
        const success = processHtmlFile(file);
        if (success) {
            successCount++;
        } else {
            failCount++;
        }
    }

    console.log(`\nJS delivery optimization complete!`);
    console.log(`✅ Successfully processed: ${successCount} files`);
    console.log(`❌ Failed to process: ${failCount} files`);
}

main(); 