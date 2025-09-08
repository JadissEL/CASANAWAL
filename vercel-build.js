#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚀 Starting Vercel build process...');

try {
  // Ensure we're using the correct Node.js version
  console.log('📋 Node.js version:', process.version);
  
  // Install dependencies
  console.log('📦 Installing dependencies...');
  execSync('npm install', { stdio: 'inherit' });
  
  // Build the client
  console.log('🏗️ Building client...');
  execSync('npm run build:client', { stdio: 'inherit' });
  
  // Verify build output
  const distPath = path.join(__dirname, 'dist', 'spa');
  if (fs.existsSync(distPath)) {
    console.log('✅ Client build completed successfully');
  } else {
    throw new Error('Client build failed - dist/spa directory not found');
  }
  
  console.log('🎉 Vercel build completed successfully!');
  
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}
