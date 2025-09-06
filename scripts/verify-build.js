#!/usr/bin/env node

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

console.log('🔍 Verifying build output...\n')

const distDir = path.join(__dirname, '..', 'dist')
const requiredFiles = [
  'klinecharts-pro.js',
  'klinecharts-pro.umd.js',
  'index.d.ts',
  'klinecharts-pro.css'
]

let allFilesExist = true

// Check if dist directory exists
if (!fs.existsSync(distDir)) {
  console.error('❌ dist/ directory does not exist!')
  console.log('   Run: pnpm run build')
  process.exit(1)
}

console.log('✅ dist/ directory exists')

// Check each required file
requiredFiles.forEach(file => {
  const filePath = path.join(distDir, file)
  if (fs.existsSync(filePath)) {
    const stats = fs.statSync(filePath)
    console.log(`✅ ${file} (${(stats.size / 1024).toFixed(2)} KB)`)
  } else {
    console.error(`❌ ${file} is missing!`)
    allFilesExist = false
  }
})

// List all files in dist directory
console.log('\n📁 All files in dist/:')
try {
  const files = fs.readdirSync(distDir, { withFileTypes: true })
  files.forEach(file => {
    const icon = file.isDirectory() ? '📁' : '📄'
    console.log(`   ${icon} ${file.name}`)
  })
} catch (error) {
  console.error('Error reading dist directory:', error.message)
}

// Check package.json exports
console.log('\n📦 Checking package.json exports...')
const packageJsonPath = path.join(__dirname, '..', 'package.json')
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'))

console.log('   Main:', packageJson.main)
console.log('   Module:', packageJson.module)
console.log('   Types:', packageJson.types)

if (packageJson.exports) {
  console.log('   Exports:', JSON.stringify(packageJson.exports, null, 4))
}

if (allFilesExist) {
  console.log('\n🎉 Build verification successful! Package is ready to publish.')
  process.exit(0)
} else {
  console.log('\n❌ Build verification failed! Some required files are missing.')
  console.log('   Try running: pnpm run build')
  process.exit(1)
}