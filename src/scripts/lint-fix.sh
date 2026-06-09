#!/usr/bin/env bash
set -euo pipefail

ESLINT="eslint --cache --cache-strategy=content --cache-location node_modules/.cache/eslint"

echo ""
echo "── Pre-fix report ──────────────────────────────"
($ESLINT || true)
(stylelint "**/*.scss" || true)

echo ""
echo "── Applying fixes ──────────────────────────────"
$ESLINT --fix
stylelint "**/*.scss" --fix

echo ""
echo "── Done ────────────────────────────────────────"
