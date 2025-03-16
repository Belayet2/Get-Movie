const { PurgeCSS } = require('purgecss');
const fs = require('fs');
const path = require('path');

async function purgeUnusedCSS() {
    console.log('Starting CSS purge process...');

    try {
        // Find the CSS file in the out directory
        const outDir = path.join(__dirname, 'out');
        const cssFiles = findCSSFiles(outDir);

        if (cssFiles.length === 0) {
            console.log('No CSS files found in the out directory');
            return;
        }

        console.log(`Found ${cssFiles.length} CSS files to process`);

        // Process each CSS file
        for (const cssFile of cssFiles) {
            console.log(`Processing ${cssFile}...`);

            // Read the CSS file
            const css = fs.readFileSync(cssFile, 'utf8');

            // Run PurgeCSS
            const result = await new PurgeCSS().purge({
                content: [
                    path.join(outDir, '**/*.html'),
                    path.join(outDir, '**/*.js'),
                ],
                css: [{ raw: css }],
                safelist: {
                    standard: [/^dark:/, /^hover:/, /^focus:/, /^active:/, /^group-hover:/, /^lg:/, /^md:/, /^sm:/],
                    deep: [/^dark:/, /^hover:/, /^focus:/, /^active:/, /^group-hover:/, /^lg:/, /^md:/, /^sm:/],
                },
                variables: true,
                keyframes: true,
                fontFace: true,
            });

            if (result.length > 0 && result[0].css) {
                // Calculate size reduction
                const originalSize = css.length;
                const newSize = result[0].css.length;
                const reduction = ((originalSize - newSize) / originalSize * 100).toFixed(2);

                // Write the purged CSS back to the file
                fs.writeFileSync(cssFile, result[0].css);

                console.log(`Purged ${cssFile}`);
                console.log(`Reduced size by ${reduction}% (${originalSize} -> ${newSize} bytes)`);
            } else {
                console.log(`No changes made to ${cssFile}`);
            }
        }

        console.log('CSS purge completed successfully');
    } catch (error) {
        console.error('Error during CSS purge:', error);
    }
}

// Helper function to find CSS files recursively
function findCSSFiles(dir, fileList = []) {
    const files = fs.readdirSync(dir);

    for (const file of files) {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            findCSSFiles(filePath, fileList);
        } else if (path.extname(file) === '.css') {
            fileList.push(filePath);
        }
    }

    return fileList;
}

// Run the purge process
purgeUnusedCSS(); 