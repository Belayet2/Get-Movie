const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Install sharp if not already installed
try {
    require.resolve('sharp');
} catch (e) {
    console.log('Installing sharp for image optimization...');
    execSync('npm install sharp --save-dev');
}

const sharp = require('sharp');

const PUBLIC_DIR = path.join(__dirname, '../public');
const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp'];
const WIDTHS = [640, 750, 828, 1080, 1200];

// Function to recursively find all images in a directory
function findImages(dir) {
    let results = [];
    const items = fs.readdirSync(dir);

    for (const item of items) {
        const itemPath = path.join(dir, item);
        const stat = fs.statSync(itemPath);

        if (stat.isDirectory()) {
            results = results.concat(findImages(itemPath));
        } else {
            const ext = path.extname(itemPath).toLowerCase();
            if (IMAGE_EXTENSIONS.includes(ext)) {
                results.push(itemPath);
            }
        }
    }

    return results;
}

// Function to generate responsive image variants
async function generateResponsiveVariants(imagePath) {
    const ext = path.extname(imagePath).toLowerCase();
    const dir = path.dirname(imagePath);
    const filename = path.basename(imagePath, ext);

    try {
        // Get image metadata
        const metadata = await sharp(imagePath).metadata();

        // Generate variants for each width
        for (const width of WIDTHS) {
            // Skip if the original image is smaller than the target width
            if (metadata.width <= width) {
                console.log(`Skipping ${width}px variant for ${imagePath} (original is smaller)`);
                continue;
            }

            const outputPath = path.join(dir, `${filename}-${width}${ext}`);

            // Skip if the variant already exists
            if (fs.existsSync(outputPath)) {
                console.log(`Skipping ${outputPath} (already exists)`);
                continue;
            }

            // Resize the image
            await sharp(imagePath)
                .resize(width)
                .toFile(outputPath);

            console.log(`Generated: ${outputPath}`);
        }

        // Also generate WebP versions
        if (ext !== '.webp') {
            for (const width of WIDTHS) {
                // Skip if the original image is smaller than the target width
                if (metadata.width <= width) {
                    continue;
                }

                const outputPath = path.join(dir, `${filename}-${width}.webp`);

                // Skip if the variant already exists
                if (fs.existsSync(outputPath)) {
                    console.log(`Skipping ${outputPath} (already exists)`);
                    continue;
                }

                // Resize and convert to WebP
                await sharp(imagePath)
                    .resize(width)
                    .webp({ quality: 80 })
                    .toFile(outputPath);

                console.log(`Generated WebP: ${outputPath}`);
            }
        }
    } catch (error) {
        console.error(`Error processing ${imagePath}:`, error);
    }
}

async function main() {
    console.log('Finding images to process...');
    const images = findImages(PUBLIC_DIR);
    console.log(`Found ${images.length} images`);

    for (const image of images) {
        await generateResponsiveVariants(image);
    }

    console.log('Responsive image generation complete!');
}

main().catch(console.error); 