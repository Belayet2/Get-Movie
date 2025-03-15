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
const FORMATS = ['webp', 'avif']; // Support both WebP and AVIF

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

// Function to optimize an image
async function optimizeImage(imagePath) {
    const ext = path.extname(imagePath).toLowerCase();
    const dir = path.dirname(imagePath);
    const filename = path.basename(imagePath, ext);

    try {
        // Get image metadata
        const metadata = await sharp(imagePath).metadata();

        // Create a base sharp instance for reuse
        const baseImage = sharp(imagePath);

        // Generate optimized versions for each width and format
        for (const width of WIDTHS) {
            // Skip if the original image is smaller than the target width
            if (metadata.width <= width) {
                console.log(`Skipping ${width}px variant for ${imagePath} (original is smaller)`);
                continue;
            }

            // Resize the image once for this width
            const resizedImage = baseImage.clone().resize(width);

            // Generate each format
            for (const format of FORMATS) {
                const outputPath = path.join(dir, `${filename}-${width}.${format}`);

                // Skip if the variant already exists
                if (fs.existsSync(outputPath)) {
                    console.log(`Skipping ${outputPath} (already exists)`);
                    continue;
                }

                // Apply format-specific options
                if (format === 'webp') {
                    await resizedImage.clone().webp({ quality: 80 }).toFile(outputPath);
                } else if (format === 'avif') {
                    await resizedImage.clone().avif({ quality: 65 }).toFile(outputPath);
                }

                console.log(`Generated ${format.toUpperCase()}: ${outputPath}`);
            }
        }

        // Also create a full-size optimized version in each format
        for (const format of FORMATS) {
            const outputPath = path.join(dir, `${filename}.${format}`);

            // Skip if the variant already exists
            if (fs.existsSync(outputPath)) {
                console.log(`Skipping ${outputPath} (already exists)`);
                continue;
            }

            // Apply format-specific options
            if (format === 'webp') {
                await baseImage.clone().webp({ quality: 85 }).toFile(outputPath);
            } else if (format === 'avif') {
                await baseImage.clone().avif({ quality: 70 }).toFile(outputPath);
            }

            console.log(`Generated full-size ${format.toUpperCase()}: ${outputPath}`);
        }

    } catch (error) {
        console.error(`Error optimizing ${imagePath}:`, error);
    }
}

async function main() {
    console.log('Finding images to optimize...');
    const images = findImages(PUBLIC_DIR);
    console.log(`Found ${images.length} images`);

    let processed = 0;
    for (const image of images) {
        await optimizeImage(image);
        processed++;
        console.log(`Progress: ${processed}/${images.length} (${Math.round(processed / images.length * 100)}%)`);
    }

    console.log('Advanced image optimization complete!');
}

main().catch(console.error); 