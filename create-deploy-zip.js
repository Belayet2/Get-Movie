const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

// Create a file to stream archive data to
const output = fs.createWriteStream(path.join(__dirname, 'netlify-deploy.zip'));
const archive = archiver('zip', {
    zlib: { level: 9 } // Sets the compression level
});

// Listen for all archive data to be written
output.on('close', function () {
    console.log('Archive created successfully!');
    console.log('Total bytes: ' + archive.pointer());
    console.log('The archive is ready for manual upload to Netlify.');
    console.log('File location: ' + path.join(__dirname, 'netlify-deploy.zip'));
});

// Handle warnings and errors
archive.on('warning', function (err) {
    if (err.code === 'ENOENT') {
        console.warn('Warning:', err);
    } else {
        throw err;
    }
});

archive.on('error', function (err) {
    throw err;
});

// Pipe archive data to the file
archive.pipe(output);

// Append the entire out directory
archive.directory(path.join(__dirname, 'out'), false);

// Finalize the archive
archive.finalize(); 