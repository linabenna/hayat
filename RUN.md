# How to Run HAYAT

## Prerequisites

Before running the app, make sure you have:

1. **Node.js** (version 18 or higher)
   ```bash
   node --version  # Should show v18.x.x or higher
   ```

2. **npm** or **yarn**
   ```bash
   npm --version
   ```

3. **React Native CLI** (optional, but recommended)
   ```bash
   npm install -g react-native-cli
   ```

4. **For iOS Development:**
   - macOS
   - Xcode (latest version)
   - CocoaPods: `sudo gem install cocoapods`
   - Xcode Command Line Tools: `xcode-select --install`

5. **For Android Development:**
   - Android Studio
   - Android SDK
   - Java Development Kit (JDK)
   - Set up Android environment variables

## Step-by-Step Setup

### 1. Navigate to Project Directory

```bash
cd "/Users/linabenna/Desktop/c0mpiled hayat/hayat"
```

### 2. Install Dependencies

```bash
npm install
```

If you encounter issues, try:
```bash
rm -rf node_modules package-lock.json
npm install
```

### 3. Install iOS Dependencies (iOS only)

```bash
cd ios
pod install
cd ..
```

If you don't have an `ios` directory yet, you'll need to initialize the React Native project structure first (see below).

### 4. Start Metro Bundler

In one terminal window:

```bash
npm start
```

Or with cache reset if you have issues:
```bash
npm start -- --reset-cache
```

Keep this terminal running. Metro bundler serves your JavaScript code.

### 5. Run the App

**For iOS (in a new terminal):**
```bash
npm run ios
```

This will:
- Build the iOS app
- Launch the iOS Simulator
- Install and run the app

**For Android (in a new terminal):**
```bash
npm run android
```

Make sure you have:
- An Android emulator running, OR
- An Android device connected via USB with USB debugging enabled

## If React Native Project Structure is Missing

If you don't have `ios/` and `android/` directories, you need to initialize them:

### Option 1: Use React Native CLI (Recommended)

```bash
# Install React Native CLI globally
npm install -g react-native-cli

# Initialize React Native project (if starting fresh)
npx react-native init Hayat --template react-native-template-typescript

# Then copy your src/ folder and other files into the new project
```

### Option 2: Use Expo (Easier, but may need adjustments)

```bash
# Install Expo CLI
npm install -g expo-cli

# Initialize Expo project
npx create-expo-app Hayat --template

# Then migrate your code
```

### Option 3: Manual Setup

1. Create a new React Native project:
   ```bash
   npx react-native init Hayat --template react-native-template-typescript
   ```

2. Copy your `src/` folder and configuration files into the new project

3. Install dependencies:
   ```bash
   npm install
   ```

## Troubleshooting

### Metro Bundler Issues

**Problem:** Metro bundler won't start or shows errors

**Solution:**
```bash
# Clear Metro cache
npm start -- --reset-cache

# Or clear watchman
watchman watch-del-all

# Clear npm cache
npm cache clean --force
```

### iOS Build Issues

**Problem:** Build fails or CocoaPods errors

**Solution:**
```bash
cd ios
rm -rf Pods Podfile.lock
pod deintegrate
pod install
cd ..

# Clean Xcode build
cd ios
xcodebuild clean
cd ..
```

### Android Build Issues

**Problem:** Android build fails

**Solution:**
```bash
cd android
./gradlew clean
cd ..

# Clear Android build cache
cd android
rm -rf .gradle build
cd ..
```

### Module Resolution Errors

**Problem:** Cannot find module errors

**Solution:**
```bash
# Clear all caches
rm -rf node_modules
rm -rf ios/Pods
rm package-lock.json

# Reinstall
npm install
cd ios && pod install && cd ..
```

### TypeScript Errors

**Problem:** TypeScript compilation errors

**Solution:**
```bash
# Check TypeScript version
npx tsc --version

# Try reinstalling types
npm install --save-dev @types/react @types/react-native
```

## Running on Physical Devices

### iOS Device

1. Connect your iPhone via USB
2. Open Xcode: `open ios/hayat.xcworkspace`
3. Select your device from the device dropdown
4. Click Run (or press Cmd+R)

### Android Device

1. Enable USB debugging on your Android device
2. Connect via USB
3. Verify device is connected:
   ```bash
   adb devices
   ```
4. Run:
   ```bash
   npm run android
   ```

## Development Workflow

1. **Start Metro Bundler:**
   ```bash
   npm start
   ```

2. **In another terminal, run the app:**
   ```bash
   # iOS
   npm run ios
   
   # Android
   npm run android
   ```

3. **Make changes to your code** - Metro will automatically reload

4. **Shake device/simulator** to open React Native debugger

## Quick Commands Reference

```bash
# Install dependencies
npm install

# Start Metro bundler
npm start

# Run on iOS
npm run ios

# Run on Android
npm run android

# Run tests
npm test

# Lint code
npm run lint

# Clear Metro cache
npm start -- --reset-cache
```

## Environment Setup

The app uses simulated services by default, so no API keys are required for basic functionality. However, if you want to integrate real services later, create a `.env` file:

```env
LYRA_API_KEY=your_key
CRUSTDATA_API_KEY=your_key
# etc.
```

## Next Steps

Once the app is running:

1. You'll see the **Auth Screen** - Click "Sign in with UAE Pass" (simulated)
2. After authentication, you'll see the **Home Screen** with:
   - Agent widgets showing status
   - Chatbot interface
3. Interact with widgets to see explanations
4. Use the chatbot to ask questions

## Need Help?

- Check the `README.md` for project overview
- See `SETUP.md` for detailed setup instructions
- Review `ARCHITECTURE.md` for system design
- Check `QUICK_REFERENCE.md` for code examples
