const fs = require('fs');
const path = require('path');

// Ensure the stockfish directory exists
const stockfishDir = path.join(__dirname, 'public', 'stockfish');
if (!fs.existsSync(stockfishDir)) {
  fs.mkdirSync(stockfishDir, { recursive: true });
}

// Files to copy
const files = [
  'stockfish-17-lite.js',
  'stockfish-17-lite-single.js',
  'stockfish-17.js',
  'stockfish-17-single.js'
];

// Copy each file
files.forEach(file => {
  const srcPath = path.join(__dirname, 'node_modules', 'stockfish', 'src', file);
  const destPath = path.join(stockfishDir, file);

  try {
    if (fs.existsSync(srcPath)) {
      fs.copyFileSync(srcPath, destPath);
      console.log(`✓ Copied ${file}`);
    } else {
      console.log(`⚠ File not found: ${file}`);
    }
  } catch (error) {
    console.error(`✗ Failed to copy ${file}:`, error.message);
  }
});

console.log('\nStockfish files copy complete!');
