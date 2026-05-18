import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Reel } from '../types';

interface PostItemProps {
  post: Reel;
}

export const PostItem: React.FC<PostItemProps> = ({ post }) => {
  const [liked, setLiked] = useState(false);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.avatar}>
            <MaterialCommunityIcons name="account" size={20} color="#fff" />
          </View>
          <Text style={styles.userName}>{post.userName}</Text>
        </View>
        <TouchableOpacity>
          <MaterialCommunityIcons name="dots-vertical" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Image / Video Placeholder */}
      <View style={styles.mediaContainer}>
        <View style={styles.mediaPlaceholder}>
          <MaterialCommunityIcons name="image-outline" size={50} color="#333" />
          <Text style={styles.placeholderText}>Image / Video Post</Text>
        </View>
      </View>

      {/* Actions */}
      <View style={styles.actions}>
        <View style={styles.actionsLeft}>
          <TouchableOpacity onPress={() => setLiked(!liked)}>
            <MaterialCommunityIcons
              name={liked ? 'heart' : 'heart-outline'}
              size={26}
              color={liked ? '#ff3d00' : '#fff'}
              style={styles.actionIcon}
            />
          </TouchableOpacity>
          <TouchableOpacity>
            <MaterialCommunityIcons name="comment-outline" size={24} color="#fff" style={styles.actionIcon} />
          </TouchableOpacity>
          <TouchableOpacity>
            <MaterialCommunityIcons name="share-variant-outline" size={24} color="#fff" style={styles.actionIcon} />
          </TouchableOpacity>
        </View>
        <TouchableOpacity>
          <MaterialCommunityIcons name="bookmark-outline" size={26} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.likesText}>{post.likes + (liked ? 1 : 0)} likes</Text>
        <View style={styles.captionContainer}>
          <Text style={styles.userNameCaption}>{post.userName}</Text>
          <Text style={styles.captionText}>{post.title}</Text>
        </View>
        <Text style={styles.timeText}>2 hours ago</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#222',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  userName: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  mediaContainer: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: '#111',
  },
  mediaPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: '#333',
    marginTop: 10,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  actionsLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionIcon: {
    marginRight: 15,
  },
  content: {
    paddingHorizontal: 12,
  },
  likesText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  captionContainer: {
    flexDirection: 'row',
    marginTop: 5,
    flexWrap: 'wrap',
  },
  userNameCaption: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    marginRight: 5,
  },
  captionText: {
    color: '#fff',
    fontSize: 14,
  },
  timeText: {
    color: '#888',
    fontSize: 12,
    marginTop: 5,
  },
});
