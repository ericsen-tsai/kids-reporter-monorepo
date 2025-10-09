#!/bin/bash

# Add 'use client' directive to the beginning of the files if not already present
for file in ./dist/index.js ./dist/index.mjs; do
  if [ -f "$file" ]; then
    if ! grep -q "'use client'" "$file" && ! grep -q '"use client"' "$file"; then
      # Create a temporary file with the directive
      echo '"use client";' > "${file}.tmp"
      cat "$file" >> "${file}.tmp"
      mv "${file}.tmp" "$file"
      echo "Added 'use client' directive to $(basename "$file")"
    else
      echo "'use client' directive already exists in $(basename "$file")"
    fi
  fi
done