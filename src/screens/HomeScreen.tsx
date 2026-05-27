import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { FlatList, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { PostItem } from '../components/PostItem';
import { StoryBar } from '../components/StoryBar';
import { useListagramStore } from '../store';
import { moderateScale, scale, verticalScale } from '../utils/responsive';

export const HomeScreen: React.FC = () => {
  const { reels, loadReels, networkStatus, notifications } = useListagramStore();
  const router = useRouter();

  const unreadNotifications = notifications.filter(n => !n.read).length;

  useEffect(() => {
    loadReels();
  }, [loadReels]);

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconButton} onPress={() => router.push('/upload')}>
          <MaterialCommunityIcons name="plus-box-outline" size={moderateScale(28)} color="#fff" />
        </TouchableOpacity>
        
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>Listagram</Text>
        </View>

        <View style={styles.headerIcons}>
          <TouchableOpacity style={styles.iconButton} onPress={() => router.push('/notifications')}>
            <MaterialCommunityIcons name="heart-outline" size={moderateScale(26)} color="#fff" />
            {unreadNotifications > 0 && (
              <View style={styles.badge} />
            )}
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButtonRight} onPress={() => router.push('/messages')}>
            <MaterialCommunityIcons name="facebook-messenger" size={moderateScale(26)} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={reels}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <PostItem post={item} />}
        ListHeaderComponent={<StoryBar />}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Loading feed...</Text>
          </View>
        }
      />
      
      {/* Mesh Status Mini Indicator */}
      {!networkStatus.isOnline && networkStatus.isConnectedToMesh && (
        <View style={styles.meshIndicator}>
          <MaterialCommunityIcons name="wifi-star" size={moderateScale(14)} color="#fff" />
          <Text style={styles.meshText}>Mesh Active</Text>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: scale(15),
    paddingVertical: verticalScale(10),
    backgroundColor: '#000',
  },
  logoContainer: {
    flex: 1,
    alignItems: 'center',
  },
  logoText: {
    color: '#fff',
    fontSize: moderateScale(24),
    fontWeight: 'bold',
    fontStyle: 'italic',
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    padding: scale(2),
  },
  iconButtonRight: {
    marginLeft: scale(15),
    padding: scale(2),
  },
  badge: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: scale(10),
    height: scale(10),
    borderRadius: scale(5),
    backgroundColor: '#ff3d00',
    borderWidth: 2,
    borderColor: '#000',
  },
  emptyContainer: {
    padding: verticalScale(50),
    alignItems: 'center',
  },
  emptyText: {
    color: '#555',
  },
  meshIndicator: {
    position: 'absolute',
    bottom: verticalScale(10),
    right: scale(10),
    backgroundColor: '#e91e63',
    paddingHorizontal: scale(8),
    paddingVertical: verticalScale(4),
    borderRadius: scale(10),
    flexDirection: 'row',
    alignItems: 'center',
    opacity: 0.8,
  },
  meshText: {
    color: '#fff',
    fontSize: moderateScale(10),
    fontWeight: 'bold',
    marginLeft: scale(4),
  },
});
