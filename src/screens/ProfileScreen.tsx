import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
    FlatList,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { useListagramStore } from '../store';
import { moderateScale, scale, SCREEN_WIDTH, verticalScale } from '../utils/responsive';

export const ProfileScreen: React.FC = () => {
  const { currentUser, followingIds, reels, switchAccount, accounts, notifications } = useListagramStore();
  const router = useRouter();
  const myReels = reels.filter((reel) => reel.userId === currentUser.id);
  const myReelCount = myReels.length;

  const unreadNotifications = notifications.filter(n => !n.read).length;

  const renderPostItem = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.postItem}>
      <View style={styles.postPlaceholder}>
        <MaterialCommunityIcons name="play" size={moderateScale(32)} color="rgba(255,255,255,0.5)" />
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerTitleContainer} onPress={() => {
          if (accounts.length > 1) {
            // Simple switch for demo
            const nextIndex = (accounts.findIndex(a => a.id === currentUser.id) + 1) % accounts.length;
            switchAccount(accounts[nextIndex].id);
          }
        }}>
          <Text style={styles.headerTitle}>{currentUser.name}</Text>
          <MaterialCommunityIcons name="chevron-down" size={moderateScale(18)} color="#fff" />
        </TouchableOpacity>
        <View style={styles.headerIcons}>
          <TouchableOpacity style={styles.headerIcon} onPress={() => router.push('/upload')}>
            <MaterialCommunityIcons name="plus-box-outline" size={moderateScale(28)} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerIcon} onPress={() => router.push('/notifications')}>
            <MaterialCommunityIcons name="heart-outline" size={moderateScale(28)} color="#fff" />
            {unreadNotifications > 0 && (
              <View style={styles.badge} />
            )}
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerIcon}>
            <MaterialCommunityIcons name="menu" size={moderateScale(28)} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        ListHeaderComponent={
          <>
            {/* Profile Info */}
            <View style={styles.profileInfo}>
              <View style={styles.avatarContainer}>
                <View style={styles.avatar}>
                  <MaterialCommunityIcons name="account" size={moderateScale(50)} color="#fff" />
                </View>
              </View>

              <View style={styles.statsContainer}>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>{myReelCount}</Text>
                  <Text style={styles.statLabel}>Posts</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>{currentUser.followers}</Text>
                  <Text style={styles.statLabel}>Followers</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>{followingIds.length}</Text>
                  <Text style={styles.statLabel}>Following</Text>
                </View>
              </View>
            </View>

            {/* Bio */}
            <View style={styles.bioContainer}>
              <Text style={styles.displayName}>{currentUser.name}</Text>
              <Text style={styles.bioText}>{currentUser.bio || 'Sharing moments with the world.'}</Text>
            </View>

            {/* Buttons */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.mainButton}>
                <Text style={styles.buttonText}>Edit Profile</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.mainButton}>
                <Text style={styles.buttonText}>Share Profile</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.smallButton}>
                <MaterialCommunityIcons name="account-plus-outline" size={moderateScale(20)} color="#fff" />
              </TouchableOpacity>
            </View>

            {/* Tabs */}
            <View style={styles.tabsContainer}>
              <TouchableOpacity style={[styles.tabItem, styles.activeTab]}>
                <MaterialCommunityIcons name="grid" size={moderateScale(24)} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.tabItem}>
                <MaterialCommunityIcons name="movie-outline" size={moderateScale(24)} color="#888" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.tabItem}>
                <MaterialCommunityIcons name="account-outline" size={moderateScale(24)} color="#888" />
              </TouchableOpacity>
            </View>
          </>
        }
        data={myReels}
        renderItem={renderPostItem}
        keyExtractor={(item) => item.id}
        numColumns={3}
        contentContainerStyle={styles.postGrid}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons name="camera-outline" size={moderateScale(64)} color="#333" />
            <Text style={styles.emptyText}>No Posts Yet</Text>
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
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(10),
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    color: '#fff',
    fontSize: moderateScale(22),
    fontWeight: 'bold',
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIcon: {
    marginLeft: scale(15),
    position: 'relative',
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
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: scale(16),
    paddingTop: verticalScale(10),
  },
  avatarContainer: {
    marginRight: scale(30),
  },
  avatar: {
    width: scale(86),
    height: scale(86),
    borderRadius: scale(43),
    backgroundColor: '#262626',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#363636',
  },
  statsContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingRight: scale(10),
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    color: '#fff',
    fontSize: moderateScale(18),
    fontWeight: 'bold',
  },
  statLabel: {
    color: '#fff',
    fontSize: moderateScale(14),
  },
  bioContainer: {
    paddingHorizontal: scale(16),
    marginTop: verticalScale(12),
  },
  displayName: {
    color: '#fff',
    fontSize: moderateScale(14),
    fontWeight: 'bold',
  },
  bioText: {
    color: '#fff',
    fontSize: moderateScale(14),
    marginTop: verticalScale(2),
  },
  buttonContainer: {
    flexDirection: 'row',
    paddingHorizontal: scale(16),
    marginTop: verticalScale(15),
    gap: scale(8),
  },
  mainButton: {
    flex: 1,
    height: verticalScale(35),
    backgroundColor: '#262626',
    borderRadius: scale(8),
    justifyContent: 'center',
    alignItems: 'center',
  },
  smallButton: {
    width: verticalScale(35),
    height: verticalScale(35),
    backgroundColor: '#262626',
    borderRadius: scale(8),
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: moderateScale(14),
    fontWeight: '600',
  },
  tabsContainer: {
    flexDirection: 'row',
    marginTop: verticalScale(20),
    borderBottomWidth: 0.5,
    borderBottomColor: '#262626',
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: verticalScale(12),
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#fff',
  },
  postGrid: {
    paddingBottom: verticalScale(20),
  },
  postItem: {
    width: SCREEN_WIDTH / 3,
    height: SCREEN_WIDTH / 3,
    padding: 1,
  },
  postPlaceholder: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    marginTop: verticalScale(100),
    alignItems: 'center',
  },
  emptyText: {
    color: '#fff',
    fontSize: moderateScale(20),
    fontWeight: 'bold',
    marginTop: verticalScale(10),
  },
});
