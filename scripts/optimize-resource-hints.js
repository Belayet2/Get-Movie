const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const cheerio = require('cheerio');
const URL = require('url').URL;

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

        // Track domains for preconnect
        const domains = new Set();

        // Find all external resources
        $('script[src], link[href], img[src], source[src], source[srcset]').each((i, el) => {
            const $el = $(el);
            const url = $el.attr('src') || $el.attr('href') || $el.attr('srcset');

            if (!url || url.startsWith('data:') || url.startsWith('#')) {
                return;
            }

            try {
                // Try to parse the URL
                let parsedUrl;
                if (url.startsWith('http')) {
                    parsedUrl = new URL(url);
                } else if (url.startsWith('//')) {
                    parsedUrl = new URL(`https:${url}`);
                } else {
                    return; // Skip relative URLs
                }

                // Add the domain to the set
                domains.add(parsedUrl.origin);
            } catch (e) {
                // Skip invalid URLs
            }
        });

        // Add preconnect for each domain
        const head = $('head');
        domains.forEach(domain => {
            // Skip if preconnect already exists
            if ($(`link[rel="preconnect"][href="${domain}"]`).length > 0) {
                return;
            }

            // Add preconnect
            const preconnect = $('<link>');
            preconnect.attr('rel', 'preconnect');
            preconnect.attr('href', domain);
            preconnect.attr('crossorigin', 'anonymous');
            head.append(preconnect);

            // Add dns-prefetch as fallback
            const dnsPrefetch = $('<link>');
            dnsPrefetch.attr('rel', 'dns-prefetch');
            dnsPrefetch.attr('href', domain);
            head.append(dnsPrefetch);
        });

        // Find critical resources for preload
        const criticalResources = [];

        // Preload hero images
        $('img[src]').slice(0, 1).each((i, el) => {
            const $el = $(el);
            const src = $el.attr('src');
            if (src && !src.startsWith('data:') && !criticalResources.includes(src)) {
                criticalResources.push(src);
            }
        });

        // Preload critical fonts
        $('link[rel="stylesheet"]').each((i, el) => {
            const $el = $(el);
            const href = $el.attr('href');
            if (href && href.includes('font')) {
                criticalResources.push(href);
            }
        });

        // Add preload for critical resources
        criticalResources.forEach(resource => {
            // Skip if preload already exists
            if ($(`link[rel="preload"][href="${resource}"]`).length > 0) {
                return;
            }

            // Determine resource type
            let as = 'fetch';
            if (resource.match(/\.(jpe?g|png|gif|webp|avif)$/i)) {
                as = 'image';
            } else if (resource.match(/\.(woff2?|ttf|otf|eot)$/i)) {
                as = 'font';
            } else if (resource.match(/\.css$/i)) {
                as = 'style';
            } else if (resource.match(/\.js$/i)) {
                as = 'script';
            }

            // Add preload
            const preload = $('<link>');
            preload.attr('rel', 'preload');
            preload.attr('href', resource);
            preload.attr('as', as);
            if (as === 'font') {
                preload.attr('crossorigin', 'anonymous');
            }
            head.append(preload);
        });

        // Write the modified HTML back to the file
        fs.writeFileSync(htmlPath, $.html(), 'utf8');

        console.log(`✅ Optimized resource hints for ${htmlPath}`);
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

    console.log(`\nResource hints optimization complete!`);
    console.log(`✅ Successfully processed: ${successCount} files`);
    console.log(`❌ Failed to process: ${failCount} files`);
}

main(); 