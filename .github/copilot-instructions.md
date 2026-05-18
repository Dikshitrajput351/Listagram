# Listagram Project - Development Instructions

Listagram: Instagram-style reel app built on Expo with mesh networking support.

## Project Status: ✅ COMPLETE AND READY FOR DEVELOPMENT

## What's Been Built

### Core Architecture
- ✅ Expo Router with tab-based navigation (Home, Explore, Profile)
- ✅ TypeScript with full type definitions
- ✅ Zustand state management
- ✅ Service-oriented architecture

### Features Implemented

**Video Reels System**
- Full-screen vertical video playback (Instagram/TikTok style)
- Like, comment, share interactions
- User profile information
- Progress bar and playback controls
- Infinite scroll feed with auto-play detection
- Mock data with real video URLs for testing

**Mesh Networking**
- P2P node discovery system
- Network status monitoring (Online/Mesh/Offline)
- Device presence broadcasting
- Graceful offline fallback
- Data synchronization backbone

**User Interface**
- Dark theme optimized for video viewing
- Bottom navigation with 3 screens
- Network status indicator (shows connectivity state)
- Material Design icons
- Responsive layouts

### Technologies & Libraries
- React Native + Expo 55.0+
- Expo Router (file-based routing)
- Zustand (state management)
- expo-video (video playback)
- React Navigation (bottom tabs)
- expo-network & expo-task-manager (network monitoring)
- MaterialCommunityIcons (UI icons)
- TypeScript (type safety)

### Project File Structure

```
src/
├── screens/
│   ├── HomeScreen.tsx          (Reels feed)
│   ├── ExploreScreen.tsx       (Browse categories)
│   └── ProfileScreen.tsx       (User profile)
├── components/
│   ├── VideoReel.tsx           (Single video player)
│   └── ReelsFeed.tsx           (Feed container)
├── services/
│   ├── MeshNetworkService.ts   (P2P networking)
│   └── ReelDataService.ts      (Video data)
├── store/
│   └── index.ts                (Zustand state)
└── types/
    └── index.ts                (TypeScript definitions)

app/(tabs)/
├── _layout.tsx                 (Tab navigation)
├── index.tsx                   (Home screen)
├── explore.tsx                 (Explore screen)
└── profile.tsx                 (Profile screen)
```

## How to Start Developing

### 1. Start the Development Server
```bash
npm run web        # Web version (browser)
npm run android    # Android emulator
npm run ios        # iOS simulator
npx expo start     # Expo Go (scan QR code on mobile)
```

The app will be available at:
- Web: http://localhost:8081
- Mobile: Scan QR code with Expo Go app

### 2. Make Changes
All files auto-reload on save. Start editing:
- `src/screens/` - Modify screens
- `src/components/` - Create new components
- `src/services/` - Update business logic
- `src/store/` - Modify global state

### 3. Test Your Changes
- Hot reload happens automatically (in most cases)
- Press `r` in terminal to reload if needed
- Press `w` to open web version
- Press `a` to open Android
- Press `i` to open iOS

## Key Development Areas

### Add New Features

**Add a new screen:**
1. Create component in `src/screens/NewScreen.tsx`
2. Add route in `app/(tabs)/newscreen.tsx`
3. Add tab in `app/(tabs)/_layout.tsx`

**Add new component:**
1. Create in `src/components/MyComponent.tsx`
2. Export from component files
3. Import in screens

**Add API calls:**
1. Create service in `src/services/`
2. Call from components via store
3. Update state with results

### State Management (Zustand)

```typescript
// In components:
const { reels, likeReel } = useListagramStore();

// Add new state:
// 1. Add to store interface in src/store/index.ts
// 2. Initialize in store
// 3. Use in components
```

### Mesh Networking

Current implementation:
- Monitors network status
- Detects connected peers
- Broadcasts node presence
- Provides fallback to cached data

To integrate real mesh networking:
1. Install `react-native-nearby-connections`
2. Implement actual P2P connections in `MeshNetworkService`
3. Add BLE (Bluetooth Low Energy) for iOS fallback
4. Test on physical devices

### Video Integration

Current: Using mock video URLs (Big Buck Bunny, etc.)

To add your own videos:
1. Store videos in cloud service (Firebase, AWS, etc.)
2. Get URLs
3. Add to mock data or API
4. VideoReel component auto-handles playback

## Important Configuration Files

- **package.json** - Dependencies and build scripts
- **app.json** - Expo app configuration
- **tsconfig.json** - TypeScript settings
- **eas.json** - EAS build config (create if building)

## Common Tasks

### Install new dependencies
```bash
npm install package-name
```

### Build for production
```bash
eas build --platform android
eas build --platform ios
```

### Clear cache and rebuild
```bash
npm run web -- --clear
```

### Type check
```bash
npx tsc --noEmit
```

### Format code
```bash
npx prettier --write "src/**/*.ts{,x}"
```

## Debugging

### Enable Console Logs
Logs appear in terminal and debugger console

### Use React DevTools
```bash
npm install -D @react-devtools/core
```

### View Network Requests
- Use network tab in Chrome DevTools (web)
- Use debugger in VS Code

### TypeScript Errors
- Check Problems panel in VS Code
- Run `npx tsc --noEmit` for full check

## File-Based Routing (Expo Router)

Structure = URLs automatically:
```
app/(tabs)/index.tsx        →  /
app/(tabs)/explore.tsx      →  /explore
app/(tabs)/profile.tsx      →  /profile
```

To add new route:
1. Create file in `app/` directory
2. Automatically becomes a route
3. Navigation works via `useRouter` hook

## Next Development Priorities

1. **API Integration**
   - Connect real backend
   - Implement authentication
   - Replace mock data

2. **Enhanced Mesh Networking**
   - Add actual P2P connections
   - Implement data syncing
   - Add encryption

3. **User Features**
   - Video upload
   - Comments/chat
   - Search
   - Recommendations

4. **Performance**
   - Optimize video loading
   - Implement lazy loading
   - Add caching strategy

5. **Production Ready**
   - Error handling
   - Analytics
   - Crash reporting
   - Push notifications

## Useful Links

- [Expo Docs](https://docs.expo.dev)
- [React Native](https://reactnative.dev)
- [Zustand Guide](https://github.com/pmndrs/zustand)
- [Expo Router](https://expo.github.io/router/)
- [React Navigation](https://reactnavigation.org)

## Troubleshooting

### App won't start
```bash
npm run web -- --clear  # Clear bundler cache
rm -rf node_modules && npm install  # Fresh install
```

### Port already in use
Expo uses port 8081. If blocked:
```bash
npx expo start --port 8082
```

### Video won't play
- Check video URL is accessible
- Verify video format (MP4, WebM)
- Test in browser first

### Mesh network issues
- Both devices must be on same WiFi
- Check firewall isn't blocking port 8888
- Test with console.log debugging

---

## Quick Start Checklist

- [ ] Run `npm install` 
- [ ] Run `npm run web` to start dev server
- [ ] Open http://localhost:8081 in browser
- [ ] See reels feed loading
- [ ] Click home, explore, profile tabs
- [ ] Start editing files in `src/`
- [ ] Watch hot reload work

**Ready to build amazing things!** 🚀