const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const zlib = require('zlib');

// Install brotli if not already installed
try {
    require.resolve('brotli');
} catch (e) {
    console.log('Installing brotli...');
    execSync('npm install brotli --save-dev');
}

const brotli = require('brotli');
const OUT_DIR = path.join(__dirname, '../out');

// File extensions to compress
const COMPRESS_EXTENSIONS = [
    '.html', '.css', '.js', '.json', '.xml', '.svg',
    '.txt', '.ttf', '.otf', '.eot'
];

// Size threshold for compression (1KB)
const SIZE_THRESHOLD = 1024;

// Function to recursively find all compressible files in a directory
function findCompressibleFiles(dir) {
    let results = [];
    const items = fs.readdirSync(dir);

    for (const item of items) {
        const itemPath = path.join(dir, item);
        const stat = fs.statSync(itemPath);

        if (stat.isDirectory()) {
            results = results.concat(findCompressibleFiles(itemPath));
        } else {
            const ext = path.extname(itemPath).toLowerCase();
            if (COMPRESS_EXTENSIONS.includes(ext) && stat.size > SIZE_THRESHOLD) {
                results.push(itemPath);
            }
        }
    }

    return results;
}

// Function to compress a file with Brotli
function compressBrotli(filePath) {
    try {
        const content = fs.readFileSync(filePath);
        const compressed = Buffer.from(brotli.compress(content, {
            mode: 0, // 0 = generic, 1 = text, 2 = font
            quality: 11, // 0-11, higher = better compression but slower
            lgwin: 22, // window size
        }));

        const outputPath = `${filePath}.br`;
        fs.writeFileSync(outputPath, compressed);

        const originalSize = content.length;
        const compressedSize = compressed.length;
        const ratio = ((1 - compressedSize / originalSize) * 100).toFixed(2);

        console.log(`Brotli: ${filePath} (${originalSize} → ${compressedSize} bytes, ${ratio}% reduction)`);
        return { originalSize, compressedSize };
    } catch (error) {
        console.error(`Error compressing ${filePath} with Brotli:`, error);
        return { originalSize: 0, compressedSize: 0 };
    }
}

// Function to compress a file with Gzip
function compressGzip(filePath) {
    try {
        const content = fs.readFileSync(filePath);
        const compressed = zlib.gzipSync(content, { level: 9 });

        const outputPath = `${filePath}.gz`;
        fs.writeFileSync(outputPath, compressed);

        const originalSize = content.length;
        const compressedSize = compressed.length;
        const ratio = ((1 - compressedSize / originalSize) * 100).toFixed(2);

        console.log(`Gzip: ${filePath} (${originalSize} → ${compressedSize} bytes, ${ratio}% reduction)`);
        return { originalSize, compressedSize };
    } catch (error) {
        console.error(`Error compressing ${filePath} with Gzip:`, error);
        return { originalSize: 0, compressedSize: 0 };
    }
}

function main() {
    if (!fs.existsSync(OUT_DIR)) {
        console.error(`Output directory ${OUT_DIR} does not exist. Run 'next build' first.`);
        process.exit(1);
    }

    console.log('Finding files to compress...');
    const files = findCompressibleFiles(OUT_DIR);
    console.log(`Found ${files.length} files to compress`);

    let totalOriginalSize = 0;
    let totalBrotliSize = 0;
    let totalGzipSize = 0;

    for (const file of files) {
        const brotliResult = compressBrotli(file);
        const gzipResult = compressGzip(file);

        totalOriginalSize += brotliResult.originalSize;
        totalBrotliSize += brotliResult.compressedSize;
        totalGzipSize += gzipResult.compressedSize;
    }

    const brotliRatio = ((1 - totalBrotliSize / totalOriginalSize) * 100).toFixed(2);
    const gzipRatio = ((1 - totalGzipSize / totalOriginalSize) * 100).toFixed(2);

    console.log(`\nCompression complete!`);
    console.log(`Total original size: ${(totalOriginalSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`Total Brotli size: ${(totalBrotliSize / 1024 / 1024).toFixed(2)} MB (${brotliRatio}% reduction)`);
    console.log(`Total Gzip size: ${(totalGzipSize / 1024 / 1024).toFixed(2)} MB (${gzipRatio}% reduction)`);
}

main(); 