#!/bin/bash

# Simple Docker build test script
PACKAGE="${1:-frontend}"

echo "Building Docker image for: $PACKAGE"

# Clean local build files and node_modules
echo "Cleaning local build files and node_modules..."
rm -rf "packages/$PACKAGE/node_modules"
rm -rf "packages/$PACKAGE/dist"
rm -rf "packages/$PACKAGE/.next"
rm -rf "packages/$PACKAGE/lib"
rm -rf "packages/$PACKAGE/build"

# Copy yarn.lock and tsconfig.base.json to package directory
cp yarn.lock "packages/$PACKAGE/"
cp tsconfig.base.json "packages/$PACKAGE/"

# Change to package directory
cd "packages/$PACKAGE"

# Create minimal .env.local if it doesn't exist
if [[ ! -f ".env.local" ]]; then
    echo "Creating .env.local file"
    cat > .env.local << EOF
NODE_ENV=production
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_GRAPHQL_URL=http://localhost:3001/graphql
EOF
fi

# Build Docker image
echo "Building Docker image..."
docker build -t "kids-reporter-$PACKAGE:test" .

if [[ $? -eq 0 ]]; then
    echo "✅ Build successful!"
    # Clean up tsconfig.base.json and yarn.lock
    echo "Cleaning up tsconfig.base.json and yarn.lock..."
    rm -f "packages/$PACKAGE/tsconfig.base.json"
    rm -f "packages/$PACKAGE/yarn.lock"
else
    echo "❌ Build failed!"
    exit 1
fi