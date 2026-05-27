import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { VideoView, useVideoPlayer } from 'expo-video';
import React, { useState } from 'react';
import {
    Alert,
    Dimensions,
    Modal,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { useListagramStore } from '../../src/store';
import { moderateScale, scale, verticalScale } from '../../src/utils/responsive';

const { width, height } = Dimensions.get('window');

type Step = 'SELECT' | 'EDIT' | 'POST';

export default function UploadScreen() {
  const { addNewReel, isUploading, currentUser } = useListagramStore();
  const [step, setStep] = useState<Step>('SELECT');
  const [selectedVideoUri, setSelectedVideoUri] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedMusic, setSelectedMusic] = useState<string | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<string>('Normal');
  const [isMusicModalVisible, setIsMusicModalVisible] = useState(false);

  const filters = ['Normal', 'Clarendon', 'Gingham', 'Moon', 'Lark', 'Reyes', 'Juno'];
  const mockMusic = [
    { id: '1', title: 'Summer Vibes - Pop' },
    { id: '2', title: 'Midnight City - Electronic' },
    { id: '3', title: 'Deep Focus - LoFi' },
    { id: '4', title: 'Acoustic Soul - Folk' },
    { id: '5', title: 'Hip Hop Beats - Urban' },
  ];

  const player = useVideoPlayer(selectedVideoUri, (player) => {
    if (player) {
      player.loop = true;
      player.play();
    }
  });

  const pickVideo = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission denied', 'Gallery access is required.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled && result.assets[0].uri) {
      setSelectedVideoUri(result.assets[0].uri);
      setStep('EDIT');
    }
  };

  const takeVideo = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission denied', 'Camera access is required.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled && result.assets[0].uri) {
      setSelectedVideoUri(result.assets[0].uri);
      setStep('EDIT');
    }
  };

  const handleUpload = async () => {
    if (!selectedVideoUri || !title.trim()) {
      Alert.alert('Missing fields', 'Please provide a title.');
      return;
    }

    await addNewReel({
      userId: currentUser.id,
      userName: currentUser.name,
      videoUrl: selectedVideoUri,
      title: title.trim(),
      description: description.trim(),
      musicTitle: selectedMusic || undefined,
      filter: selectedFilter !== 'Normal' ? selectedFilter : undefined,
    });

    resetState();
    Alert.alert('Uploaded', 'Your reel has been shared!');
  };

  const resetState = () => {
    setStep('SELECT');
    setSelectedVideoUri(null);
    setTitle('');
    setDescription('');
    setSelectedMusic(null);
    setSelectedFilter('Normal');
  };

  const renderSelectStep = () => (
    <View style={styles.selectContainer}>
      <Text style={styles.titleText}>New Reel</Text>
      <View style={styles.optionsContainer}>
        <TouchableOpacity style={styles.optionButton} onPress={pickVideo}>
          <MaterialCommunityIcons name="image-multiple" size={40} color="#fff" />
          <Text style={styles.optionText}>Gallery</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.optionButton} onPress={takeVideo}>
          <MaterialCommunityIcons name="camera" size={40} color="#fff" />
          <Text style={styles.optionText}>Camera</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderEditStep = () => (
    <View style={styles.editContainer}>
      <View style={styles.previewHeader}>
        <TouchableOpacity onPress={() => setStep('SELECT')}>
          <MaterialCommunityIcons name="close" size={30} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setStep('POST')}>
          <Text style={styles.nextText}>Next</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.videoPreviewContainer}>
        <VideoView
          player={player}
          style={styles.videoPreview}
          nativeControls={false}
          contentFit="cover"
        />
        {selectedFilter !== 'Normal' && (
          <View style={[styles.filterOverlay, { backgroundColor: getFilterColor(selectedFilter) }]} />
        )}
      </View>

      <View style={styles.editActions}>
        <TouchableOpacity style={styles.editActionButton} onPress={() => setIsMusicModalVisible(true)}>
          <MaterialCommunityIcons name="music" size={24} color="#fff" />
          <Text style={styles.editActionText}>{selectedMusic ? 'Music Added' : 'Add Music'}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterList}>
        {filters.map((f) => (
          <TouchableOpacity
            key={f}
            style={[styles.filterItem, selectedFilter === f && styles.selectedFilterItem]}
            onPress={() => setSelectedFilter(f)}
          >
            <View style={[styles.filterPreview, { backgroundColor: getFilterColor(f) }]} />
            <Text style={styles.filterName}>{f}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const renderPostStep = () => (
    <SafeAreaView style={styles.container}>
      <View style={styles.postHeader}>
        <TouchableOpacity onPress={() => setStep('EDIT')}>
          <MaterialCommunityIcons name="chevron-left" size={30} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>New Post</Text>
        <TouchableOpacity onPress={handleUpload} disabled={isUploading}>
          <Text style={[styles.nextText, { color: '#0095f6' }]}>{isUploading ? 'Posting...' : 'Share'}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.postContent}>
        <View style={styles.captionContainer}>
          <View style={styles.thumbnailContainer}>
            <VideoView
              player={player}
              style={styles.thumbnail}
              nativeControls={false}
              contentFit="cover"
            />
          </View>
          <TextInput
            style={styles.captionInput}
            placeholder="Write a caption..."
            placeholderTextColor="#888"
            multiline
            value={description}
            onChangeText={setDescription}
          />
        </View>

        <View style={styles.postInputGroup}>
          <Text style={styles.postLabel}>Title</Text>
          <TextInput
            style={styles.titleInput}
            placeholder="Give your reel a title"
            placeholderTextColor="#888"
            value={title}
            onChangeText={setTitle}
          />
        </View>

        {selectedMusic && (
          <View style={styles.selectedMusicInfo}>
            <MaterialCommunityIcons name="music" size={20} color="#fff" />
            <Text style={styles.selectedMusicText}>{selectedMusic}</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );

  const getFilterColor = (filter: string) => {
    switch (filter) {
      case 'Clarendon': return 'rgba(0, 150, 255, 0.1)';
      case 'Gingham': return 'rgba(255, 255, 255, 0.1)';
      case 'Moon': return 'rgba(0, 0, 0, 0.2)';
      case 'Lark': return 'rgba(255, 200, 0, 0.1)';
      case 'Reyes': return 'rgba(255, 255, 200, 0.1)';
      case 'Juno': return 'rgba(255, 100, 100, 0.1)';
      default: return 'transparent';
    }
  };

  return (
    <View style={styles.container}>
      {step === 'SELECT' && renderSelectStep()}
      {step === 'EDIT' && renderEditStep()}
      {step === 'POST' && renderPostStep()}

      <Modal visible={isMusicModalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Music</Text>
              <TouchableOpacity onPress={() => setIsMusicModalVisible(false)}>
                <MaterialCommunityIcons name="close" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
            <ScrollView>
              {mockMusic.map((m) => (
                <TouchableOpacity
                  key={m.id}
                  style={styles.musicItem}
                  onPress={() => {
                    setSelectedMusic(m.title);
                    setIsMusicModalVisible(false);
                  }}
                >
                  <MaterialCommunityIcons name="music-note" size={24} color="#fff" />
                  <Text style={styles.musicTitle}>{m.title}</Text>
                </TouchableOpacity>
              ))}
              <TouchableOpacity
                style={[styles.musicItem, { marginTop: 10, opacity: 0.7 }]}
                onPress={() => {
                  setSelectedMusic(null);
                  setIsMusicModalVisible(false);
                }}
              >
                <Text style={styles.musicTitle}>No Music</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  selectContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleText: {
    color: '#fff',
    fontSize: moderateScale(24),
    fontWeight: 'bold',
    marginBottom: verticalScale(40),
  },
  optionsContainer: {
    flexDirection: 'row',
    gap: scale(40),
  },
  optionButton: {
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    padding: scale(30),
    borderRadius: scale(20),
    width: scale(140),
  },
  optionText: {
    color: '#fff',
    marginTop: verticalScale(10),
    fontSize: moderateScale(16),
    fontWeight: '600',
  },
  editContainer: {
    flex: 1,
  },
  previewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: scale(16),
    paddingTop: verticalScale(40),
    paddingBottom: verticalScale(10),
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  nextText: {
    color: '#fff',
    fontSize: moderateScale(18),
    fontWeight: 'bold',
  },
  videoPreviewContainer: {
    width: width,
    height: height * 0.7,
    backgroundColor: '#111',
  },
  videoPreview: {
    width: '100%',
    height: '100%',
  },
  filterOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  editActions: {
    flexDirection: 'row',
    padding: scale(16),
    justifyContent: 'center',
  },
  editActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#333',
    paddingHorizontal: scale(20),
    paddingVertical: verticalScale(10),
    borderRadius: scale(25),
    gap: scale(10),
  },
  editActionText: {
    color: '#fff',
    fontWeight: '600',
  },
  filterList: {
    paddingHorizontal: scale(16),
  },
  filterItem: {
    alignItems: 'center',
    marginRight: scale(15),
  },
  filterPreview: {
    width: scale(60),
    height: scale(60),
    borderRadius: scale(5),
    marginBottom: verticalScale(5),
    borderWidth: 1,
    borderColor: '#333',
  },
  selectedFilterItem: {
    opacity: 0.8,
  },
  filterName: {
    color: '#fff',
    fontSize: moderateScale(12),
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(10),
    borderBottomWidth: 0.5,
    borderBottomColor: '#222',
  },
  headerTitle: {
    color: '#fff',
    fontSize: moderateScale(18),
    fontWeight: 'bold',
  },
  postContent: {
    flex: 1,
  },
  captionContainer: {
    flexDirection: 'row',
    padding: scale(16),
    gap: scale(15),
  },
  thumbnailContainer: {
    width: scale(80),
    height: scale(100),
    backgroundColor: '#1a1a1a',
    borderRadius: scale(8),
    overflow: 'hidden',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  captionInput: {
    flex: 1,
    color: '#fff',
    fontSize: moderateScale(16),
    paddingTop: 0,
  },
  postInputGroup: {
    padding: scale(16),
    borderTopWidth: 0.5,
    borderTopColor: '#222',
  },
  postLabel: {
    color: '#888',
    fontSize: moderateScale(14),
    marginBottom: verticalScale(5),
  },
  titleInput: {
    color: '#fff',
    fontSize: moderateScale(16),
  },
  selectedMusicInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: scale(16),
    gap: scale(10),
    backgroundColor: '#1a1a1a',
    margin: scale(16),
    borderRadius: scale(10),
  },
  selectedMusicText: {
    color: '#fff',
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#1a1a1a',
    borderTopLeftRadius: scale(20),
    borderTopRightRadius: scale(20),
    padding: scale(20),
    maxHeight: height * 0.7,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: verticalScale(20),
  },
  modalTitle: {
    color: '#fff',
    fontSize: moderateScale(20),
    fontWeight: 'bold',
  },
  musicItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: verticalScale(15),
    borderBottomWidth: 0.5,
    borderBottomColor: '#333',
    gap: scale(15),
  },
  musicTitle: {
    color: '#fff',
    fontSize: moderateScale(16),
  },
});
