import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { moderateScale, scale, verticalScale } from '../utils/responsive';

export const ExploreScreen: React.FC = () => {
  const categories = ['Trending', 'Music', 'Comedy', 'Gaming', 'Sports', 'Fashion'];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Explore</Text>
      </View>

      <ScrollView style={styles.content}>
        {categories.map((category, index) => (
          <TouchableOpacity key={index} style={styles.categoryItem}>
            <View style={styles.categoryIcon}>
              <MaterialCommunityIcons name="play" size={moderateScale(24)} color="#fff" />
            </View>
            <Text style={styles.categoryText}>{category}</Text>
            <MaterialCommunityIcons name="chevron-right" size={moderateScale(24)} color="#888" />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    paddingTop: verticalScale(16),
    paddingBottom: verticalScale(16),
    paddingHorizontal: scale(16),
    borderBottomWidth: 1,
    borderBottomColor: '#222',
  },
  title: {
    fontSize: moderateScale(28),
    fontWeight: 'bold',
    color: '#fff',
  },
  content: {
    flex: 1,
    paddingTop: verticalScale(8),
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: verticalScale(16),
    paddingHorizontal: scale(16),
    borderBottomWidth: 1,
    borderBottomColor: '#222',
  },
  categoryIcon: {
    width: scale(48),
    height: scale(48),
    borderRadius: scale(24),
    backgroundColor: '#1a1a1a',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: scale(16),
  },
  categoryText: {
    flex: 1,
    fontSize: moderateScale(16),
    color: '#fff',
    fontWeight: '500',
  },
});
