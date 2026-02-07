# Quick Start Guide - HAYAT

## Fastest Way to Run

### Option 1: Automated Setup (Recommended)

```bash
cd "/Users/linabenna/Desktop/c0mpiled hayat/hayat"
./setup.sh
```

Then:
```bash
# Terminal 1: Start Metro
npm start

# Terminal 2: Run the app
npm run ios      # For iOS
# OR
npm run android  # For Android
```

### Option 2: Manual Setup

#### Step 1: Install Dependencies
```bash
cd "/Users/linabenna/Desktop/c0mpiled hayat/hayat"
npm install
```

#### Step 2: Initialize React Native Structure (if needed)

If you don't have `ios/` and `android/` folders:

```bash
# Create a temporary React Native project to get native folders
npx react-native@latest init HayatTemp --template react-native-template-typescript

# Copy the native folders
cp -r HayatTemp/ios .
cp -r HayatTemp/android .
rm -rf HayatTemp
```

#### Step 3: Install iOS Dependencies (macOS only)
```bash
cd ios
pod install
cd ..
```

#### Step 4: Run the App

**Terminal 1 - Start Metro:**
```bash
npm start
```

**Terminal 2 - Run App:**
```bash
# iOS
npm run ios

# Android (make sure emulator is running or device is connected)
npm run android
```

## What You'll See

1. **Auth Screen** - Click "Sign in with UAE Pass" (simulated login)
2. **Home Screen** with:
   - 4 Agent Widgets (Family Guardian, Residency & Identity, Compliance Sentinel, Well-Being)
   - Chatbot interface at the bottom
3. **Interact:**
   - Tap any widget to see explanations
   - Type in chatbot to ask questions
   - Agents monitor in the background

## Common Issues & Quick Fixes

### "Command not found: react-native"
```bash
npm install -g react-native-cli
```

### "Cannot find module"
```bash
rm -rf node_modules
npm install
```

### iOS: "Pod install failed"
```bash
cd ios
rm -rf Pods Podfile.lock
pod install
cd ..
```

### Android: "SDK not found"
- Open Android Studio
- Go to SDK Manager
- Install Android SDK Platform 33
- Set ANDROID_HOME environment variable

### Metro bundler cache issues
```bash
npm start -- --reset-cache
```

## System Requirements

- **Node.js**: v18 or higher
- **iOS**: macOS, Xcode, CocoaPods
- **Android**: Android Studio, Java JDK

## Need More Help?

- See `RUN.md` for detailed instructions
- Check `SETUP.md` for troubleshooting
- Review `README.md` for project overview
