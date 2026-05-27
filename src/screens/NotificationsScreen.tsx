import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { FlatList, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useListagramStore } from '../store';
import { moderateScale, scale, verticalScale } from '../utils/responsive';

export const NotificationsScreen: React.FC = () => {
  const { notifications, markNotificationsAsRead } = useListagramStore();
  const router = useRouter();

  useEffect(() => {
    markNotificationsAsRead();
  }, [markNotificationsAsRead]);

  const renderNotification = ({ item }: { item: any }) => {
    const isFollow = item.type === 'follow';

    return (
      <View style={styles.notificationItem}>
        <View style={styles.avatar}>
          <MaterialCommunityIcons name="account" size={moderateScale(24)} color="#fff" />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.notificationText}>
            <Text style={styles.userName}>{item.userName}</Text>
            {isFollow ? ' started following you.' : ` liked your video: ${item.reelTitle || 'Post'}`}
          </Text>
          <Text style={styles.timestamp}>
            {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
        </View>
        {isFollow && (
          <TouchableOpacity style={styles.followButton}>
            <Text style={styles.followButtonText}>Follow</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <MaterialCommunityIcons name="chevron-left" size={moderateScale(30)} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <View style={{ width: scale(30) }} />
      </View>

      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={renderNotification}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons name="heart-outline" size={moderateScale(60)} color="#333" />
            <Text style={styles.emptyText}>No notifications yet</Text>
          </View>
        }
      />
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
    paddingHorizontal: scale(10),
    paddingVertical: verticalScale(10),
    borderBottomWidth: 0.5,
    borderBottomColor: '#222',
  },
  backButton: {
    padding: scale(5),
  },
  headerTitle: {
    color: '#fff',
    fontSize: moderateScale(18),
    fontWeight: 'bold',
  },
  listContent: {
    paddingVertical: verticalScale(10),
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(12),
  },
  avatar: {
    width: scale(44),
    height: scale(44),
    borderRadius: scale(22),
    backgroundColor: '#262626',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: scale(12),
  },
  textContainer: {
    flex: 1,
  },
  notificationText: {
    color: '#fff',
    fontSize: moderateScale(14),
    lineHeight: moderateScale(18),
  },
  userName: {
    fontWeight: 'bold',
  },
  timestamp: {
    color: '#888',
    fontSize: moderateScale(12),
    marginTop: verticalScale(2),
  },
  followButton: {
    backgroundColor: '#0095f6',
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(6),
    borderRadius: scale(6),
    marginLeft: scale(10),
  },
  followButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: moderateScale(12),
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: verticalScale(100),
  },
  emptyText: {
    color: '#555',
    fontSize: moderateScale(16),
    marginTop: verticalScale(10),
  },
});
