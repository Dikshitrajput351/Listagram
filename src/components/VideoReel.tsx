import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { VideoView, useVideoPlayer } from 'expo-video';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useListagramStore } from '../store';
import { Reel } from '../types';
import { moderateScale, scale, SCREEN_HEIGHT, SCREEN_WIDTH, verticalScale } from '../utils/responsive';

interface VideoReelProps {
  reel?: Reel | null;
  isActive: boolean;
}

export const VideoReel: React.FC<VideoReelProps> = ({ reel, isActive }) => {
  const [isPlaying, setIsPlaying] = useState(isActive);
  const [isLoading, setIsLoading] = useState(true);
  const [videoDuration, setVideoDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [hasError, setHasError] = useState(false);
  const router = useRouter();
  const { likeReel, unlikeReel, toggleFollowUser, followingIds } = useListagramStore();

  const getFilterColor = (filter?: string) => {
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

  const videoSource = reel?.localVideoUrl ? { uri: reel.localVideoUrl } : (reel?.videoUrl ? { uri: reel.videoUrl } : null);

  const player = useVideoPlayer(
    videoSource,
    (player) => {
      if (!player) return;
      player.loop = true;
      player.muted = true;
      player.addListener('statusChange', (payload) => {
        try {
          console.log('Video status:', payload.status, payload.error);
          if (payload.status === 'readyToPlay') {
            setVideoDuration(player.duration || 0);
            setIsLoading(false);
            setHasError(false);
          } else if (payload.status === 'error') {
            console.error('Video error:', payload.error);
            setHasError(true);
            setIsLoading(false);
          } else if (payload.status === 'loading') {
            setIsLoading(true);
          }
        } catch (_e) {
          console.error('Error updating playback status:', _e);
        }
      });
    }
  );

  useEffect(() => {
    if (reel && player && (reel.localVideoUrl || reel.videoUrl)) {
      try {
        const source = reel.localVideoUrl ? { uri: reel.localVideoUrl } : { uri: reel.videoUrl };
        player.replace(source);
      } catch (e) {
        console.error('Error replacing video source:', e);
        setHasError(true);
      }
    }
  }, [reel, player]);

  useEffect(() => {
    if (player && isActive) {
      if (isPlaying) {
        player.play();
      } else {
        player.pause();
      }
    }
  }, [isActive, isPlaying, player]);

  useEffect(() => {
    if (player) {
      const interval = setInterval(() => {
        try {
          setCurrentTime(player.currentTime || 0);
        } catch (_e) {
          // Ignore errors in time updates
        }
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [player]);

  const handleLikePress = async () => {
    if (!reel) return;
    try {
      if (reel.liked) {
        await unlikeReel(reel.id);
      } else {
        await likeReel(reel.id);
      }
    } catch (error) {
      console.error('Error liking reel:', error);
    }
  };

  if (!reel) {
    return (
      <View style={styles.container}>
        <Text style={{ color: '#fff', textAlign: 'center', marginTop: SCREEN_HEIGHT / 2 }}>
          Loading video...
        </Text>
      </View>
    );
  }

  if (hasError) {
    return (
      <View style={styles.container}>
        <View style={styles.errorContainer}>
          <MaterialCommunityIcons name="alert" size={moderateScale(48)} color="#ff9800" />
          <Text style={styles.errorText}>Failed to load video</Text>
          <Text style={styles.errorSubText}>{reel.title}</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {reel && player ? (
        <View style={styles.videoWrapper}>
          <VideoView
            player={player}
            style={styles.video}
            nativeControls={false}
            contentFit="cover"
            allowsPictureInPicture={false}
          />
          {reel.filter && (
            <View style={[styles.filterOverlay, { backgroundColor: getFilterColor(reel.filter) }]} />
          )}
        </View>
      ) : (
        <View style={[styles.video, styles.placeholder]}>
          <Text style={{ color: '#fff', textAlign: 'center' }}>
            {reel ? 'Loading video...' : 'No video available'}
          </Text>
        </View>
      )}

      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#fff" />
        </View>
      )}

      {/* Play/Pause Button */}
      <TouchableOpacity
        style={styles.playButton}
        onPress={() => setIsPlaying(!isPlaying)}
        activeOpacity={0.7}
      >
        <MaterialCommunityIcons
          name={isPlaying ? 'pause-circle' : 'play-circle'}
          size={moderateScale(60)}
          color="#fff"
        />
      </TouchableOpacity>

      {/* User Info & Interactions */}
      <View style={styles.overlay}>
        {/* Bottom section with user info */}
        <View style={styles.bottomSection}>
          <View style={styles.userInfo}>
            <View style={styles.userHeader}>
              <View style={styles.avatarPlaceholder}>
                <MaterialCommunityIcons name="account" size={moderateScale(24)} color="#fff" />
              </View>
              <Text style={styles.userName}>{reel.userName}</Text>
              <TouchableOpacity 
                style={styles.followButtonSmall}
                onPress={() => toggleFollowUser(reel.userId)}
              >
                <Text style={styles.followButtonText}>
                  {followingIds.includes(reel.userId) ? 'Following' : 'Follow'}
                </Text>
              </TouchableOpacity>
            </View>
            
            <Text style={styles.title} numberOfLines={1}>
              {reel.title}
            </Text>
            <Text style={styles.description} numberOfLines={2}>
              {reel.description}
            </Text>
            {reel.musicTitle && (
              <View style={styles.musicContainer}>
                <MaterialCommunityIcons name="music" size={moderateScale(14)} color="#fff" />
                <Text style={styles.musicText} numberOfLines={1}>{reel.musicTitle}</Text>
              </View>
            )}
          </View>

          {/* Action Buttons (Right side) */}
          <View style={styles.actionButtons}>
            {/* Like Button */}
            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleLikePress}
              activeOpacity={0.7}
            >
              <MaterialCommunityIcons
                name={reel.liked ? 'heart' : 'heart-outline'}
                size={moderateScale(35)}
                color={reel.liked ? '#ff3d00' : '#fff'}
              />
              <Text style={styles.actionText}>{reel.likes}</Text>
            </TouchableOpacity>

            {/* Message Button */}
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => router.push('/messages' as any)}
              activeOpacity={0.7}
            >
              <MaterialCommunityIcons name="comment-outline" size={moderateScale(32)} color="#fff" />
              <Text style={styles.actionText}>{reel.comments}</Text>
            </TouchableOpacity>

            {/* Share Button */}
            <TouchableOpacity style={styles.actionButton} activeOpacity={0.7}>
              <MaterialCommunityIcons name="share-variant-outline" size={moderateScale(32)} color="#fff" />
              <Text style={styles.actionText}>{reel.shares}</Text>
            </TouchableOpacity>

            {/* Menu Button */}
            <TouchableOpacity style={styles.actionButton} activeOpacity={0.7}>
              <MaterialCommunityIcons name="dots-horizontal" size={moderateScale(30)} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressBar}>
        <View
          style={[
            styles.progress,
            {
              width: `${(currentTime / videoDuration) * 100 || 0}%`,
            },
          ]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    backgroundColor: '#000',
    position: 'relative',
  },
  videoWrapper: {
    width: '100%',
    height: '100%',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  filterOverlay: {
    ...StyleSheet.absoluteFillObject,
    pointerEvents: 'none',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  placeholder: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  errorContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  errorText: {
    color: '#fff',
    fontSize: moderateScale(18),
    fontWeight: 'bold',
    marginTop: verticalScale(16),
  },
  errorSubText: {
    color: '#999',
    fontSize: moderateScale(14),
    marginTop: verticalScale(8),
  },
  playButton: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: scale(-30),
    marginTop: verticalScale(-30),
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  bottomSection: {
    flexDirection: 'row',
    paddingHorizontal: scale(12),
    paddingBottom: verticalScale(25), // Lowered for better reach
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  userInfo: {
    flex: 1,
    marginRight: scale(12),
    paddingBottom: verticalScale(5),
  },
  userName: {
    color: '#fff',
    fontSize: moderateScale(15),
    fontWeight: 'bold',
    marginRight: scale(10),
  },
  userHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: verticalScale(10),
  },
  avatarPlaceholder: {
    width: scale(32),
    height: scale(32),
    borderRadius: scale(16),
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: scale(10),
    borderWidth: 1,
    borderColor: '#fff',
  },
  followButtonSmall: {
    paddingHorizontal: scale(12),
    paddingVertical: verticalScale(4),
    borderRadius: scale(6),
    borderWidth: 1,
    borderColor: '#fff',
  },
  followButtonText: {
    color: '#fff',
    fontSize: moderateScale(12),
    fontWeight: 'bold',
  },
  title: {
    color: '#fff',
    fontSize: moderateScale(14),
    fontWeight: '500',
    marginBottom: verticalScale(4),
  },
  description: {
    color: '#fff',
    fontSize: moderateScale(14),
    marginBottom: verticalScale(8),
  },
  musicContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(5),
    marginTop: verticalScale(5),
  },
  musicText: {
    color: '#fff',
    fontSize: moderateScale(13),
    fontWeight: '500',
  },
  actionButtons: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: verticalScale(10),
  },
  actionButton: {
    marginBottom: verticalScale(15),
    alignItems: 'center',
  },
  actionText: {
    color: '#fff',
    fontSize: moderateScale(12),
    marginTop: verticalScale(2),
    fontWeight: '600',
  },
  progressBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  progress: {
    height: '100%',
    backgroundColor: '#fff',
  },
});
