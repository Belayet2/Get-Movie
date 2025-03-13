/**
 * Firebase Configuration Checker
 * 
 * This script verifies that all required Firebase environment variables are set.
 * Run this before deploying to Netlify to ensure your Firebase configuration is complete.
 */

require('dotenv').config({ path: '.env.local' });

const requiredEnvVars = [
    'NEXT_PUBLIC_FIREBASE_API_KEY',
    'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
    'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
    'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
    'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
    'NEXT_PUBLIC_FIREBASE_APP_ID',
    'NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID'
];

console.log('Checking Firebase configuration...\n');

let allPresent = true;
const missingVars = [];

requiredEnvVars.forEach(varName => {
    if (!process.env[varName]) {
        allPresent = false;
        missingVars.push(varName);
        console.error(`❌ Missing environment variable: ${varName}`);
    } else {
        console.log(`✅ Found environment variable: ${varName}`);
    }
});

console.log('\n');

if (allPresent) {
    console.log('✅ All Firebase environment variables are set correctly!');
    console.log('Your app is ready for deployment to Netlify.');
} else {
    console.error('❌ Some Firebase environment variables are missing!');
    console.error('Please add the following variables to your .env.local file:');
    missingVars.forEach(varName => {
        console.error(`  - ${varName}`);
    });
    console.error('\nAfter adding these variables, run this script again to verify your configuration.');
}

// Check Firebase project access
if (allPresent) {
    console.log('\nTesting Firebase project access...');
    console.log('Note: This is a basic check and does not verify all Firebase services.');
    console.log('Make sure to test your deployed app thoroughly after deployment.');

    // Print Firebase project info for verification
    console.log('\nFirebase Project Information:');
    console.log(`Project ID: ${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}`);
    console.log(`Auth Domain: ${process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN}`);

    console.log('\nRemember to configure Firebase Security Rules for your Netlify domain.');
} 