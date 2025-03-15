const { execSync } = require('child_process');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Function to run a command and handle errors
function runCommand(command) {
    try {
        console.log(`Running: ${command}`);
        const output = execSync(command, { encoding: 'utf8' });
        console.log(output);
        return { success: true, output };
    } catch (error) {
        console.error(`Error: ${error.message}`);
        return { success: false, error: error.message };
    }
}

// Main function
async function main() {
    console.log('\n🚀 GitHub Setup Helper\n');

    // Check if git is initialized
    const gitStatus = runCommand('git status');
    if (!gitStatus.success) {
        console.log('Initializing git repository...');
        runCommand('git init');
    }

    // Ask for GitHub repository URL
    rl.question('Enter your GitHub repository URL (e.g., https://github.com/username/repo.git): ', (repoUrl) => {
        if (!repoUrl) {
            console.error('Repository URL is required.');
            rl.close();
            return;
        }

        // Add remote origin
        console.log('\nAdding remote origin...');
        const remoteCheck = runCommand('git remote -v');

        if (remoteCheck.success && remoteCheck.output.includes('origin')) {
            console.log('Remote origin already exists. Updating...');
            runCommand(`git remote set-url origin ${repoUrl}`);
        } else {
            runCommand(`git remote add origin ${repoUrl}`);
        }

        // Add all files
        console.log('\nAdding all files to git...');
        runCommand('git add .');

        // Commit changes
        rl.question('\nEnter commit message (default: "Initial commit with Netlify deployment setup"): ', (commitMessage) => {
            const message = commitMessage || 'Initial commit with Netlify deployment setup';
            console.log(`\nCommitting with message: "${message}"...`);
            runCommand(`git commit -m "${message}"`);

            // Push to GitHub
            rl.question('\nPush to GitHub? (y/n, default: y): ', (answer) => {
                if (answer.toLowerCase() !== 'n') {
                    console.log('\nPushing to GitHub...');
                    const pushResult = runCommand('git push -u origin main');

                    if (!pushResult.success && pushResult.error.includes('main -> main (non-fast-forward)')) {
                        console.log('\nTrying with force push...');
                        rl.question('Force push can overwrite remote changes. Continue? (y/n): ', (forceAnswer) => {
                            if (forceAnswer.toLowerCase() === 'y') {
                                runCommand('git push -u origin main --force');
                            }
                            rl.close();
                        });
                    } else {
                        rl.close();
                    }
                } else {
                    console.log('\nSkipping push to GitHub.');
                    rl.close();
                }
            });
        });
    });
}

main().catch(error => {
    console.error('Unhandled error:', error);
    rl.close();
    process.exit(1);
}); 