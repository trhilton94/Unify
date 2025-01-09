import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

// Define the directory to process
const targetDir = './'; // Adjust to your project root if needed

// Function to process a single file
function processFile(filePath) {
    const content = readFileSync(filePath, 'utf-8');

    // Remove trailing newline if it exists
    const newContent = content.replace(/\n$/, '');

    // Write the modified content back to the file
    if (content !== newContent) {
        writeFileSync(filePath, newContent, 'utf-8');
        console.log(`Processed: ${filePath}`);
    }
}

// Function to recursively process directories
function processDir(dir) {
    const files = readdirSync(dir);

    files.forEach((file) => {
        const filePath = join(dir, file);
        const stat = statSync(filePath);

        // Skip node_modules directory
        if (stat.isDirectory() && file === 'node_modules') {
            return;
        }

        if (stat.isDirectory()) {
            // Recursively process subdirectories
            processDir(filePath);
        } else {
            // Process all files
            processFile(filePath);
        }
    });
}

// Start processing
processDir(targetDir);