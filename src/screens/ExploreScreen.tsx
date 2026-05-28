import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { FlatList, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useListagramStore } from '../store';
import { moderateScale, scale, verticalScale } from '../utils/responsive';

export const ExploreScreen: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { users } = useListagramStore();

  const filteredUsers = searchQuery.trim() === '' 
    ? [] 
    : users.filter(user => 
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        user.id.toLowerCase().includes(searchQuery.toLowerCase())
      );

  const categories = ['Trending', 'Music', 'Comedy', 'Gaming', 'Sports', 'Fashion'];

  const renderUserItem = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={styles.userItem} 
      onPress={() => {
        // In a real app, navigate to user profile
        console.log('Navigate to user:', item.id);
      }}
    >
      <View style={styles.userAvatar}>
        <MaterialCommunityIcons name="account" size={moderateScale(24)} color="#fff" />
      </View>
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{item.name}</Text>
        <Text style={styles.userId}>@{item.id}</Text>
      </View>
      <MaterialCommunityIcons name="chevron-right" size={moderateScale(20)} color="#555" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Search Header */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <MaterialCommunityIcons name="magnify" size={moderateScale(20)} color="#888" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search users..."
            placeholderTextColor="#888"
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCapitalize="none"
          />
          {searchQuery !== '' && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <MaterialCommunityIcons name="close-circle" size={moderateScale(18)} color="#888" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {searchQuery.trim() !== '' ? (
        <FlatList
          data={filteredUsers}
          keyExtractor={(item) => item.id}
          renderItem={renderUserItem}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No users found matching &quot;{searchQuery}&quot;</Text>
            </View>
          }
        />
      ) : (
        <View style={styles.content}>
          <Text style={styles.sectionTitle}>Explore Categories</Text>
          <View style={styles.categoryGrid}>
            {categories.map((category, index) => (
              <TouchableOpacity key={index} style={styles.categoryItem}>
                <View style={styles.categoryIcon}>
                  <MaterialCommunityIcons name="play" size={moderateScale(24)} color="#fff" />
                </View>
                <Text style={styles.categoryText}>{category}</Text>
              </TouchableOpacity>
            ))}
          </View>
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
  searchContainer: {
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(10),
    borderBottomWidth: 0.5,
    borderBottomColor: '#222',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    borderRadius: scale(10),
    paddingHorizontal: scale(10),
    height: verticalScale(40),
  },
  searchIcon: {
    marginRight: scale(8),
  },
  searchInput: {
    flex: 1,
    color: '#fff',
    fontSize: moderateScale(16),
    padding: 0,
  },
  content: {
    flex: 1,
    padding: scale(16),
  },
  sectionTitle: {
    color: '#fff',
    fontSize: moderateScale(18),
    fontWeight: 'bold',
    marginBottom: verticalScale(15),
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: scale(10),
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    paddingHorizontal: scale(15),
    paddingVertical: verticalScale(10),
    borderRadius: scale(20),
    borderWidth: 1,
    borderColor: '#333',
  },
  categoryIcon: {
    marginRight: scale(8),
  },
  categoryText: {
    color: '#fff',
    fontSize: moderateScale(14),
    fontWeight: '500',
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(12),
    borderBottomWidth: 0.5,
    borderBottomColor: '#111',
  },
  userAvatar: {
    width: scale(40),
    height: scale(40),
    borderRadius: scale(20),
    backgroundColor: '#262626',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: scale(12),
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    color: '#fff',
    fontSize: moderateScale(15),
    fontWeight: 'bold',
  },
  userId: {
    color: '#888',
    fontSize: moderateScale(13),
  },
  emptyContainer: {
    padding: verticalScale(50),
    alignItems: 'center',
  },
  emptyText: {
    color: '#555',
    fontSize: moderateScale(14),
    textAlign: 'center',
  },
});
