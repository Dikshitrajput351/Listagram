import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useEffect } from 'react';
import { FlatList, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { PostItem } from '../components/PostItem';
import { StoryBar } from '../components/StoryBar';
import { useListagramStore } from '../store';

export const HomeScreen: React.FC = () => {
  const { reels, loadReels, networkStatus } = useListagramStore();

  useEffect(() => {
    loadReels();
  }, [loadReels]);

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconButton}>
          <MaterialCommunityIcons name="plus-box-outline" size={28} color="#fff" />
        </TouchableOpacity>
        
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>Listagram</Text>
        </View>

        <View style={styles.headerIcons}>
          <TouchableOpacity style={styles.iconButton}>
            <MaterialCommunityIcons name="heart-outline" size={26} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButtonRight}>
            <MaterialCommunityIcons name="facebook-messenger" size={26} color="#fff" />
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
          <MaterialCommunityIcons name="wifi-star" size={14} color="#fff" />
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
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#000',
  },
  logoContainer: {
    flex: 1,
    alignItems: 'center',
  },
  logoText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    fontStyle: 'italic',
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    padding: 2,
  },
  iconButtonRight: {
    marginLeft: 15,
    padding: 2,
  },
  emptyContainer: {
    padding: 50,
    alignItems: 'center',
  },
  emptyText: {
    color: '#555',
  },
  meshIndicator: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: '#e91e63',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    opacity: 0.8,
  },
  meshText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
    marginLeft: 4,
  },
});
