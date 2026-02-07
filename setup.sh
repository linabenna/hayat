#!/bin/bash

# HAYAT React Native Setup Script
# This script helps set up the React Native project structure

set -e

echo "🚀 HAYAT Setup Script"
echo "===================="
echo ""

# Check Node version
echo "📦 Checking Node.js version..."
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Error: Node.js version 18 or higher is required. Current: $(node -v)"
    exit 1
fi
echo "✅ Node.js version: $(node -v)"
echo ""

# Check if ios/android directories exist
if [ ! -d "ios" ] || [ ! -d "android" ]; then
    echo "⚠️  iOS/Android directories not found."
    echo "📱 Initializing React Native project structure..."
    echo ""
    
    # Create a temporary directory for the template
    TEMP_DIR=$(mktemp -d)
    cd "$TEMP_DIR"
    
    # Initialize a new React Native project with TypeScript
    echo "Creating React Native template..."
    npx react-native@latest init HayatTemp --template react-native-template-typescript --skip-install
    
    # Copy ios and android directories
    if [ -d "HayatTemp/ios" ]; then
        echo "📱 Copying iOS directory..."
        cp -r HayatTemp/ios "$OLDPWD/"
    fi
    
    if [ -d "HayatTemp/android" ]; then
        echo "🤖 Copying Android directory..."
        cp -r HayatTemp/android "$OLDPWD/"
    fi
    
    # Copy other necessary files
    if [ -f "HayatTemp/.watchmanconfig" ]; then
        cp HayatTemp/.watchmanconfig "$OLDPWD/"
    fi
    
    # Clean up
    cd "$OLDPWD"
    rm -rf "$TEMP_DIR"
    
    echo "✅ Project structure initialized!"
    echo ""
fi

# Install npm dependencies
echo "📦 Installing npm dependencies..."
npm install

# Install iOS dependencies (if on macOS)
if [[ "$OSTYPE" == "darwin"* ]]; then
    if [ -d "ios" ]; then
        echo "🍎 Installing iOS dependencies (CocoaPods)..."
        cd ios
        if command -v pod &> /dev/null; then
            pod install
            echo "✅ iOS dependencies installed!"
        else
            echo "⚠️  CocoaPods not found. Install with: sudo gem install cocoapods"
        fi
        cd ..
    fi
else
    echo "ℹ️  Skipping iOS setup (not on macOS)"
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Start Metro bundler: npm start"
echo "2. In another terminal, run:"
echo "   - iOS: npm run ios"
echo "   - Android: npm run android"
echo ""
