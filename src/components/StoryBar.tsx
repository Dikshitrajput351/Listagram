import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useListagramStore } from '../store';

export const StoryBar: React.FC = () => {
  const { stories } = useListagramStore();

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Current User Story */}
        <TouchableOpacity style={styles.storyItem}>
          <View style={[styles.avatarContainer, styles.myStoryContainer]}>
            <View style={styles.avatar}>
              <MaterialCommunityIcons name="account" size={32} color="#fff" />
            </View>
            <View style={styles.addIcon}>
              <MaterialCommunityIcons name="plus" size={14} color="#fff" />
            </View>
          </View>
          <Text style={styles.storyName}>Your story</Text>
        </TouchableOpacity>

        {/* Other Users Stories */}
        {stories.map((user) => (
          <TouchableOpacity key={user.id} style={styles.storyItem}>
            <View style={styles.avatarBorder}>
              <View style={styles.avatar}>
                <MaterialCommunityIcons name="account" size={32} color="#fff" />
              </View>
            </View>
            <Text style={styles.storyName} numberOfLines={1}>
              {user.name.split(' ')[0]}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: '#222',
    backgroundColor: '#000',
  },
  scrollContent: {
    paddingHorizontal: 15,
  },
  storyItem: {
    alignItems: 'center',
    marginRight: 15,
    width: 70,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatarBorder: {
    width: 68,
    height: 68,
    borderRadius: 34,
    borderWidth: 2,
    borderColor: '#e91e63', // Instagram-like story color
    justifyContent: 'center',
    alignItems: 'center',
    padding: 2,
  },
  myStoryContainer: {
    width: 68,
    height: 68,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#222',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#0095f6',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#000',
  },
  storyName: {
    color: '#fff',
    fontSize: 11,
    marginTop: 5,
  },
});
