#!/bin/bash
# Migrate full dataset (docs + assets) from old project to client project
# Run: ./scripts/migrate-sanity-dataset.sh

set -e
BACKUP="sanity-backup-$(date +%Y%m%d).tar.gz"

echo "1. Exporting from old project (nok9of5b)..."
NEXT_PUBLIC_SANITY_PROJECT_ID=nok9of5b npx sanity dataset export production "$BACKUP"

echo "2. Importing to client project (jdi6zc8z)..."
NEXT_PUBLIC_SANITY_PROJECT_ID=jdi6zc8z npx sanity dataset import "$BACKUP" production

echo "3. Cleaning up..."
rm "$BACKUP"

echo "Done! Content migrated to client project."
