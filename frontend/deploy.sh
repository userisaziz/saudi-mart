#!/bin/bash

# Saudi B2B CRM - Deployment Script for Vercel
set -e

echo "🚀 Starting deployment process..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root."
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm ci

# Run type checking
echo "🔍 Running type checks..."
npm run type-check

# Run linting (optional - can be skipped in CI)
if [ "${SKIP_LINT:-false}" != "true" ]; then
    echo "🔧 Running linter..."
    npm run lint
fi

# Build the application
echo "🏗️  Building application..."
npm run build

# Verify build output
if [ ! -d "dist" ]; then
    echo "❌ Error: Build failed - dist directory not found"
    exit 1
fi

echo "✅ Build completed successfully!"

# Check build size
echo "📊 Build size analysis:"
du -sh dist/*

echo "🎉 Deployment preparation complete!"
echo "📋 Next steps:"
echo "   1. Push your changes to GitHub"
echo "   2. Connect your repository to Vercel"
echo "   3. Configure environment variables in Vercel dashboard"
echo "   4. Deploy!"