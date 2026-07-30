const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '..', 'ITNEXUS', 'dist');
const destDir = path.join(__dirname, '..', 'server', 'public');

console.log(`Syncing frontend build from ${srcDir} to ${destDir}...`);

try {
  // Check if source exists
  if (!fs.existsSync(srcDir)) {
    console.error(`Error: Source directory ${srcDir} does not exist. Did you run the frontend build first?`);
    process.exit(1);
  }

  // Remove destination directory if it exists
  if (fs.existsSync(destDir)) {
    fs.rmSync(destDir, { recursive: true, force: true });
    console.log(`Cleared existing destination: ${destDir}`);
  }

  // Copy directory recursively
  fs.cpSync(srcDir, destDir, { recursive: true });
  console.log('Frontend sync completed successfully!');
} catch (err) {
  console.error('Failed to sync frontend:', err);
  process.exit(1);
}
