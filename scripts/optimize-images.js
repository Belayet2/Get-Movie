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
const MAX_WIDTH = 1200;

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
    const webpPath = path.join(dir, `${filename}.webp`);

    try {
        // Get image metadata
        const metadata = await sharp(imagePath).metadata();

        // Skip if image is already optimized (smaller than MAX_WIDTH)
        if (metadata.width <= MAX_WIDTH) {
            console.log(`Skipping ${imagePath} (already optimized)`);
            return;
        }

        // Resize and convert to WebP
        await sharp(imagePath)
            .resize(Math.min(metadata.width, MAX_WIDTH))
            .webp({ quality: 80 })
            .toFile(webpPath);

        console.log(`Optimized: ${imagePath} -> ${webpPath}`);

        // Replace original with WebP if not already WebP
        if (ext !== '.webp') {
            fs.unlinkSync(imagePath);
            console.log(`Removed original: ${imagePath}`);
        }
    } catch (error) {
        console.error(`Error optimizing ${imagePath}:`, error);
    }
}

async function main() {
    console.log('Finding images to optimize...');
    const images = findImages(PUBLIC_DIR);
    console.log(`Found ${images.length} images`);

    for (const image of images) {
        await optimizeImage(image);
    }

    console.log('Image optimization complete!');
}

main().catch(console.error); 