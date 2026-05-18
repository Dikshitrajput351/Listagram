import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import {
    Dimensions,
    FlatList,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { useListagramStore } from '../store';

const { width } = Dimensions.get('window');

export const ProfileScreen: React.FC = () => {
  const { currentUser, followingIds, reels, switchAccount, accounts } = useListagramStore();
  const myReels = reels.filter((reel) => reel.userId === currentUser.id);
  const myReelCount = myReels.length;

  const renderPostItem = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.postItem}>
      <View style={styles.postPlaceholder}>
        <MaterialCommunityIcons name="play" size={32} color="rgba(255,255,255,0.5)" />
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
          <MaterialCommunityIcons name="chevron-down" size={18} color="#fff" />
        </TouchableOpacity>
        <View style={styles.headerIcons}>
          <TouchableOpacity style={styles.headerIcon}>
            <MaterialCommunityIcons name="plus-box-outline" size={28} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerIcon}>
            <MaterialCommunityIcons name="menu" size={28} color="#fff" />
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
                  <MaterialCommunityIcons name="account" size={50} color="#fff" />
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
                <MaterialCommunityIcons name="account-plus-outline" size={20} color="#fff" />
              </TouchableOpacity>
            </View>

            {/* Tabs */}
            <View style={styles.tabsContainer}>
              <TouchableOpacity style={[styles.tabItem, styles.activeTab]}>
                <MaterialCommunityIcons name="grid" size={24} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.tabItem}>
                <MaterialCommunityIcons name="movie-outline" size={24} color="#888" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.tabItem}>
                <MaterialCommunityIcons name="account-outline" size={24} color="#888" />
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
            <MaterialCommunityIcons name="camera-outline" size={64} color="#333" />
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
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
  },
  headerIcons: {
    flexDirection: 'row',
  },
  headerIcon: {
    marginLeft: 20,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  avatarContainer: {
    marginRight: 30,
  },
  avatar: {
    width: 86,
    height: 86,
    borderRadius: 43,
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
    paddingRight: 10,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  statLabel: {
    color: '#fff',
    fontSize: 14,
  },
  bioContainer: {
    paddingHorizontal: 16,
    marginTop: 12,
  },
  displayName: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  bioText: {
    color: '#fff',
    fontSize: 14,
    marginTop: 2,
  },
  buttonContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginTop: 15,
    gap: 8,
  },
  mainButton: {
    flex: 1,
    height: 35,
    backgroundColor: '#262626',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  smallButton: {
    width: 35,
    height: 35,
    backgroundColor: '#262626',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  tabsContainer: {
    flexDirection: 'row',
    marginTop: 20,
    borderBottomWidth: 0.5,
    borderBottomColor: '#262626',
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#fff',
  },
  postGrid: {
    paddingBottom: 20,
  },
  postItem: {
    width: width / 3,
    height: width / 3,
    padding: 1,
  },
  postPlaceholder: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    marginTop: 100,
    alignItems: 'center',
  },
  emptyText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
  },
});
