import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useEffect, useRef } from 'react';
import {
    Dimensions,
    FlatList,
    StyleSheet,
    Text,
    View,
    ViewToken
} from 'react-native';
import { useListagramStore } from '../store';
import { VideoReel } from './VideoReel';

const { height } = Dimensions.get('window');

interface ReelsFeedProps {
  onNetworkStatusChange?: (isOnline: boolean) => void;
}

export const ReelsFeed: React.FC<ReelsFeedProps> = ({ onNetworkStatusChange }) => {
  const { reels, currentReelIndex, setCurrentReelIndex, loadReels, networkStatus } =
    useListagramStore();

  const onViewableItemsChanged = React.useCallback(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0) {
        const index = viewableItems[0].index;
        if (index !== null && index !== undefined) {
          setCurrentReelIndex(index);
        }
      }
    },
    [setCurrentReelIndex]
  );

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 90,
  });
  
  const viewabilityConfigCallbackPairs = useRef([
    {
      viewabilityConfig: viewabilityConfig.current,
      onViewableItemsChanged,
    },
  ]);

  useEffect(() => {
    loadReels();
  }, [loadReels]);

  useEffect(() => {
    if (onNetworkStatusChange) {
      onNetworkStatusChange(networkStatus.isOnline || networkStatus.isConnectedToMesh);
    }
  }, [networkStatus, onNetworkStatusChange]);

  const renderReel = ({ item, index }: { item: any; index: number }) => {
    if (!item || !item.id) return null;
    return <VideoReel reel={item} isActive={index === currentReelIndex} />;
  };

  return (
    <View style={styles.container}>
      {/* Network Status Indicator */}
      <View style={styles.networkStatusBar}>
        <MaterialCommunityIcons
          name={networkStatus.isOnline ? 'wifi' : 'wifi-off'}
          size={16}
          color={networkStatus.isOnline ? '#4CAF50' : '#f44336'}
          style={{ marginRight: 6 }}
        />
        <Text style={styles.networkStatusText}>
          {networkStatus.isOnline
            ? 'Online'
            : networkStatus.isConnectedToMesh
            ? `Mesh (${networkStatus.connectedNodes} nodes)`
            : 'Offline'}
        </Text>
      </View>

      {reels && reels.length > 0 ? (
        <FlatList
          data={reels}
          renderItem={renderReel}
          keyExtractor={(item, index) => item?.id || `reel-${index}`}
          pagingEnabled
          snapToInterval={height}
          decelerationRate="fast"
          viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs.current}
          onEndReachedThreshold={0.5}
          scrollEventThrottle={16}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Loading reels...</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  emptyText: {
    color: '#fff',
    fontSize: 16,
  },
  networkStatusBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    backgroundColor: 'rgba(0,0,0,0.8)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  networkStatusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
});
