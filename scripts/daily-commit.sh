#!/bin/bash

# Daily Commit Script for AI Mock Project
# Usage: ./scripts/daily-commit.sh "Feature Name" "Description"

if [ $# -lt 2 ]; then
    echo "Usage: $0 \"Feature Name\" \"Description\""
    echo "Example: $0 \"Authentication Setup\" \"Added Clerk auth with sign-in/sign-up pages\""
    exit 1
fi

FEATURE_NAME="$1"
DESCRIPTION="$2"
DATE=$(date +"%Y-%m-%d")

echo "🚀 Starting daily commit process..."
echo "📅 Date: $DATE"
echo "🎯 Feature: $FEATURE_NAME"
echo "📝 Description: $DESCRIPTION"
echo ""

# Check if there are changes to commit
if git diff-index --quiet HEAD --; then
    echo "❌ No changes to commit!"
    exit 1
fi

# Add all changes
echo "📦 Adding changes..."
git add .

# Create commit message
COMMIT_MESSAGE="📅 $DATE: $FEATURE_NAME

🎯 Feature: $DESCRIPTION
📝 Changes:
$(git diff --cached --name-only | sed 's/^/- /')

🔧 Tech: Next.js 15, Tailwind CSS v4, Clerk Auth"

# Commit changes
echo "💾 Committing changes..."
echo "$COMMIT_MESSAGE" | git commit -F -

# Push to remote
echo "🚀 Pushing to GitHub..."
git push origin main

echo ""
echo "✅ Daily commit completed successfully!"
echo "📊 Check your GitHub repository for the latest changes." 