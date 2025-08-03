#!/bin/bash

# 🚀 Daily Commit Script for AI Mock Interview Project
# Usage: ./scripts/daily-commit.sh "Feature Name" "Description"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}📅 $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if required arguments are provided
if [ $# -lt 2 ]; then
    print_error "Usage: $0 \"Feature Name\" \"Description\""
    echo ""
    echo "Examples:"
    echo "  $0 \"Authentication Setup\" \"Added Clerk auth with sign-in/sign-up pages\""
    echo "  $0 \"Dashboard Layout\" \"Created responsive dashboard with navigation\""
    echo "  $0 \"Question Management\" \"Implemented question creation and editing\""
    exit 1
fi

FEATURE_NAME="$1"
DESCRIPTION="$2"
DATE=$(date +"%Y-%m-%d")
TIME=$(date +"%H:%M")

print_status "🚀 Starting daily commit process..."
print_status "📅 Date: $DATE at $TIME"
print_status "🎯 Feature: $FEATURE_NAME"
print_status "📝 Description: $DESCRIPTION"
echo ""

# Check if we're in a git repository
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    print_error "Not a git repository! Please run this script from your project root."
    exit 1
fi

# Check if there are changes to commit
if git diff-index --quiet HEAD --; then
    print_warning "No changes to commit!"
    print_status "Your working directory is clean."
    exit 0
fi

# Show what files have changed
print_status "📦 Files to be committed:"
git diff --name-only --cached 2>/dev/null || git diff --name-only | while read file; do
    echo "  📄 $file"
done
echo ""

# Add all changes
print_status "📦 Adding changes to staging area..."
if git add .; then
    print_success "Changes staged successfully"
else
    print_error "Failed to stage changes"
    exit 1
fi

# Create detailed commit message
COMMIT_MESSAGE="📅 $DATE: $FEATURE_NAME

🎯 Feature: $DESCRIPTION
📝 Changes:
$(git diff --cached --name-only | sed 's/^/- /')

🔧 Tech: Next.js 15, Tailwind CSS v4, Clerk Auth
⏰ Committed at: $TIME"

# Commit changes
print_status "💾 Creating commit..."
if echo "$COMMIT_MESSAGE" | git commit -F -; then
    print_success "Commit created successfully"
else
    print_error "Failed to create commit"
    exit 1
fi

# Get the commit hash
COMMIT_HASH=$(git rev-parse --short HEAD)
print_status "🔗 Commit Hash: $COMMIT_HASH"

# Push to remote
print_status "🚀 Pushing to GitHub..."
if git push origin master; then
    print_success "Successfully pushed to GitHub"
else
    print_warning "Failed to push to GitHub. You may need to:"
    echo "  1. Set up your GitHub credentials"
    echo "  2. Check your internet connection"
    echo "  3. Run: git push origin master manually"
    exit 1
fi

echo ""
print_success "🎉 Daily commit completed successfully!"
print_status "📊 Check your GitHub repository: https://github.com/eswarmadapani/AI-Mock-Interview.git"
print_status "📈 Your progress has been tracked in DEVELOPMENT_LOG.md"
echo ""
print_status "💡 Next steps:"
echo "  • Update DEVELOPMENT_LOG.md with today's progress"
echo "  • Plan tomorrow's features"
echo "  • Keep up the great work! 🚀" 