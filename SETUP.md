# HAYAT Setup Guide

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. iOS Setup

```bash
cd ios
pod install
cd ..
```

### 3. Run the App

**iOS:**
```bash
npm run ios
```

**Android:**
```bash
npm run android
```

## Development Setup

### Prerequisites

- Node.js >= 18
- npm or yarn
- React Native CLI
- Xcode (for iOS)
- Android Studio (for Android)

### Environment Variables

Create a `.env` file in the root directory:

```env
# API Keys (when integrating real services)
LYRA_API_KEY=your_lyra_api_key
CRUSTDATA_API_KEY=your_crustdata_api_key
UAE_PASS_CLIENT_ID=your_uae_pass_client_id
TRACE_API_KEY=your_trace_api_key
UPLIFT_AI_API_KEY=your_uplift_api_key
```

### Project Structure Overview

- `src/agents/` - AI agent implementations
- `src/components/` - Reusable React Native components
- `src/screens/` - App screens
- `src/services/` - Core services (Lyra, Trace, Crustdata, etc.)
- `src/store/` - State management
- `src/types/` - TypeScript type definitions
- `src/utils/` - Utility functions

### Key Services

All services are currently simulated. To integrate real services:

1. **Lyra SDK** - Replace mock in `src/services/lyra.ts`
2. **Crustdata SDK** - Replace mock in `src/services/crustdata.ts`
3. **UAE Pass SDK** - Replace mock in `src/services/uae-pass.ts`
4. **Trace Service** - Replace in-memory storage in `src/services/trace.ts`
5. **Uplift AI** - Replace mock in `src/services/uplift.ts`

### Testing

```bash
npm test
```

### Linting

```bash
npm run lint
```

## Troubleshooting

### Metro Bundler Issues

```bash
npm start -- --reset-cache
```

### iOS Build Issues

```bash
cd ios
rm -rf Pods Podfile.lock
pod install
cd ..
```

### Android Build Issues

```bash
cd android
./gradlew clean
cd ..
```

## Production Build

### iOS

1. Open `ios/hayat.xcworkspace` in Xcode
2. Select your signing team
3. Product > Archive

### Android

```bash
cd android
./gradlew assembleRelease
```

The APK will be in `android/app/build/outputs/apk/release/`
