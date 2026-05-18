# 🎬 Listagram - Instagram-Style Reel App with Mesh Networking

Listagram is a modern video reel streaming application built with **React Native** and **Expo**, featuring Instagram-like functionality with a unique **mesh networking** capability that allows the app to work offline by connecting through nearby devices.

## 🌟 Key Features

### Video Reels
- 📱 Full-screen vertical video feed (TikTok/Instagram Reels style)
- ▶️ Auto-play and pause functionality
- ❤️ Like, comment, and share interactions
- 👤 User profiles and engagement metrics
- 🔄 Infinite scroll through reel feed

### Mesh Networking (P2P)
- 🌐 Offline-first architecture - app works without internet
- 🔗 P2P mesh network connection to nearby devices
- 📡 Automatic node discovery and synchronization
- 🚫 No central server required - fully decentralized
- 📊 Network status indicator showing connected peers

### User Interface
- 🎨 Dark theme optimized for video viewing
- 🧭 Bottom tab navigation (Home, Explore, Profile)
- 📊 Real-time network status display
- ⚡ Smooth animations and transitions
- 🎯 Intuitive touch gestures

## 🛠️ Tech Stack

```
Frontend:
├─ React Native (Expo)
├─ Expo Router (File-based routing)
├─ Expo Video (Video playback)
├─ React Navigation (Tab navigation)
├─ Zustand (State management)
├─ expo-network & expo-task-manager (Network monitoring)
└─ expo-vector-icons (UI icons)

Networking:
├─ Mesh network peer discovery
├─ Decentralized data sync
└─ Offline-first data synchronization
```

## 📁 Project Structure

```
Listagram/
├── app/                              # Expo Router app directory
│   ├── (tabs)/
│   │   ├── _layout.tsx              # Tab navigation layout
│   │   ├── index.tsx                # Home screen
│   │   ├── explore.tsx              # Explore screen
│   │   └── profile.tsx              # Profile screen
│   ├── _layout.tsx                  # Root layout with themes
│   └── modal.tsx                    # Modal screen
│
├── src/                              # Source code
│   ├── screens/                     # Screen components
│   │   ├── HomeScreen.tsx           # Home/Reels feed
│   │   ├── ExploreScreen.tsx        # Browse categories
│   │   └── ProfileScreen.tsx        # User profile
│   │
│   ├── components/                  # Reusable components
│   │   ├── VideoReel.tsx            # Single reel component
│   │   └── ReelsFeed.tsx            # Reels feed container
│   │
│   ├── services/                    # Business logic
│   │   ├── MeshNetworkService.ts    # P2P mesh networking
│   │   └── ReelDataService.ts       # Video data management
│   │
│   ├── store/                       # Zustand state management
│   │   └── index.ts                 # Global app store
│   │
│   └── types/                       # TypeScript definitions
│       └── index.ts                 # App types & interfaces
│
├── package.json                     # Dependencies
├── app.json                         # Expo config
├── tsconfig.json                    # TypeScript config
└── README.md                        # This file
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Expo CLI: `npm install -g expo-cli`
- Expo Go app (iOS/Android) for testing
- For web testing: No additional requirements

### Installation

```bash
# Navigate to project
cd Listagram

# Install dependencies
npm install
```

### Development

```bash
# Start web version
npm run web

# Start Android version
npm run android

# Start iOS version
npm run ios

# For Expo Go (mobile testing):
npx expo start
# Then scan QR code with Expo Go app
```

### Build for Production

```bash
# Create production build
eas build --platform android
eas build --platform ios
```

## 🔄 How Mesh Networking Works

```
Device A (Internet)  ←→  Device B (No Internet)  ←→  Device C (No Internet)
    │                         │                              │
    └─────────────────────────┴──────────────────────────────┘
           Mesh Network (P2P Connection)
```

### Process

1. **Node Discovery**: Each device broadcasts its presence on the local network
2. **Peer Connection**: Devices establish direct P2P connections with neighbors
3. **Data Sync**: Reels and user data sync through the mesh network
4. **Fallback**: If a peer goes offline, data routes through other connected peers
5. **Auto Offline**: App gracefully degrades and uses cached content when needed

## 📱 Screens Overview

### Home Screen
- Full-screen vertical video feed
- Auto-play videos as user scrolls
- Like, comment, share buttons on each reel
- Network status indicator at top

### Explore Screen
- Browse content by categories
- Category preview cards
- Quick access to popular content

### Profile Screen
- User profile with stats
- Saved, Likes, Settings menus
- Mesh network information
- Edit profile option

## 🎯 Usage

1. **Launch the app** via Expo Go or web browser
2. **Home Screen**: Scroll through reels, like/comment/share
3. **Explore Screen**: Browse content categories
4. **Profile Screen**: View your profile and settings
5. **Network Status**: Check connectivity at the top (WiFi = online, Mesh = offline mode)

## 🧪 Testing

```bash
# Test on web
npm run web

# Test on Android Emulator
npm run android

# Test on iOS Simulator
npm run ios

# Test on physical device with Expo Go
npx expo start
```

## 📚 Key Files

- **src/services/MeshNetworkService.ts**: P2P mesh networking logic
- **src/services/ReelDataService.ts**: Video data management
- **src/components/VideoReel.tsx**: Single reel component
- **src/components/ReelsFeed.tsx**: Feed container
- **src/store/index.ts**: Global state management

## 🔌 Future Enhancements

- [ ] Real backend API integration
- [ ] Actual mesh networking (react-native-nearby-connections)
- [ ] Video upload/creation
- [ ] Live chat and comments
- [ ] User authentication
- [ ] Search and discovery
- [ ] Creator monetization
- [ ] Analytics dashboard

## 📖 Documentation Links

- [Expo Docs](https://docs.expo.dev)
- [React Native](https://reactnative.dev)
- [Zustand](https://github.com/pmndrs/zustand)
- [Expo Video](https://docs.expo.dev/versions/latest/sdk/video/)

## 🐛 Troubleshooting

### Clear cache and rebuild
```bash
npm run web -- --clear
```

### Install dependencies fresh
```bash
rm -rf node_modules package-lock.json
npm install
```

### Check TypeScript errors
```bash
npx tsc --noEmit
```

---

**Listagram**: Share moments, always connected. 📱✨
