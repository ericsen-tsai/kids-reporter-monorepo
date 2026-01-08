#!/bin/bash

set -e

echo "Cleaning dist directory..."
rm -rf ./dist
mkdir -p ./dist

echo "Building CJS version..."
npx babel src --out-dir dist --extensions ".ts,.tsx" --source-maps

echo "Copying CSS file..."
cp ./src/styles.css ./dist/styles.css

echo "Generating TypeScript declarations..."
npx tsc --emitDeclarationOnly --declaration --declarationMap --outDir dist

echo "Build completed successfully!"
