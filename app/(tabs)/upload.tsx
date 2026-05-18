import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import React, { useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { useListagramStore } from '../../src/store';

export default function UploadScreen() {
  const { addNewReel, isUploading, currentUser } = useListagramStore();
  const [selectedVideoUri, setSelectedVideoUri] = useState<string | null>(null);
  const [selectedVideoName, setSelectedVideoName] = useState<string>('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const pickVideo = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Gallery access is required to select a video.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: false,
        quality: 1,
      });

      const asset = Array.isArray((result as any).assets) ? (result as any).assets[0] : undefined;
      const isCanceled = 'canceled' in result ? result.canceled : (result as any).cancelled;
      if (isCanceled || !asset?.uri) {
        return;
      }

      setSelectedVideoUri(asset.uri);
      setSelectedVideoName(asset.fileName || asset.uri.split('/').pop() || 'Selected video');
    } catch (error) {
      console.error('Video picker error:', error);
      Alert.alert('Error', 'Unable to open the gallery. Please try again.');
    }
  };

  const handleUpload = async () => {
    if (!selectedVideoUri || !title.trim() || !description.trim()) {
      Alert.alert('Missing fields', 'Please select a video, and provide a title and description.');
      return;
    }

    await addNewReel({
      userId: currentUser.id,
      userName: currentUser.name,
      videoUrl: selectedVideoUri,
      title: title.trim(),
      description: description.trim(),
    });

    setSelectedVideoUri(null);
    setSelectedVideoName('');
    setTitle('');
    setDescription('');
    Alert.alert('Uploaded', 'Your reel has been added to the feed.');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={styles.header}>Upload Reel</Text>
        <Text style={styles.description}>Add a new video reel to your feed just like Instagram.</Text>
        <Text style={styles.uploadingAs}>Uploading as {currentUser.name}</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Select Video</Text>
          <TouchableOpacity style={styles.pickerButton} onPress={pickVideo} activeOpacity={0.8}>
            <Text style={styles.pickerButtonText}>
              {selectedVideoUri ? 'Change video' : 'Pick video from gallery'}
            </Text>
          </TouchableOpacity>
          {selectedVideoUri ? (
            <Text style={styles.fileName}>{selectedVideoName}</Text>
          ) : (
            <Text style={styles.hintText}>Choose a video from your device library.</Text>
          )}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Title</Text>
          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="Reel title"
            placeholderTextColor="#777"
            style={styles.input}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            value={description}
            onChangeText={setDescription}
            placeholder="Write a short description"
            placeholderTextColor="#777"
            style={[styles.input, styles.textArea]}
            multiline
          />
        </View>

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.buttonWrapper}
        >
          <TouchableOpacity
            style={[styles.uploadButton, isUploading && styles.disabledButton]}
            onPress={handleUpload}
            disabled={isUploading}
          >
            <MaterialCommunityIcons name="cloud-upload" size={24} color="#000" />
            <Text style={styles.uploadText}>{isUploading ? 'Uploading...' : 'Upload Reel'}</Text>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  content: {
    padding: 20,
  },
  header: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    color: '#aaa',
    marginBottom: 12,
    lineHeight: 22,
  },
  uploadingAs: {
    color: '#fff',
    marginBottom: 20,
    fontSize: 14,
  },
  inputGroup: {
    marginBottom: 18,
  },
  label: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#111',
    borderColor: '#222',
    borderWidth: 1,
    borderRadius: 12,
    color: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  buttonWrapper: {
    marginTop: 10,
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    paddingVertical: 16,
    borderRadius: 14,
    gap: 10,
  },
  uploadText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '700',
  },
  disabledButton: {
    opacity: 0.6,
  },
  pickerButton: {
    backgroundColor: '#1f1f1f',
    borderColor: '#333',
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pickerButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  fileName: {
    color: '#fff',
    marginTop: 10,
    fontSize: 14,
  },
  hintText: {
    color: '#777',
    marginTop: 10,
    fontSize: 13,
  },
});
