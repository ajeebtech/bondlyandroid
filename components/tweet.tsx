import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Image } from 'expo-image';
import React, { useRef, useState } from 'react';
import { Animated, StyleSheet, TouchableOpacity, View } from 'react-native';

interface TweetProps {
  id: string;
  user: {
    name: string;
    handle: string;
    avatar: string;
    verified?: boolean;
  };
  content: string;
  image?: string;
  timestamp: string;
  likes: number;
  retweets: number;
  comments: number;
  isLiked?: boolean;
  isRetweeted?: boolean;
}

export default function Tweet({
  user,
  content,
  image,
  timestamp,
  likes,
  retweets,
  comments,
  isLiked = false,
  isRetweeted = false,
}: TweetProps) {
  const [liked, setLiked] = useState(isLiked);
  const [retweeted, setRetweeted] = useState(isRetweeted);
  const [likeCount, setLikeCount] = useState(likes);
  const [retweetCount, setRetweetCount] = useState(retweets);

  // Animation values
  const likeScale = useRef(new Animated.Value(1)).current;
  const retweetScale = useRef(new Animated.Value(1)).current;
  const heartScale = useRef(new Animated.Value(1)).current;
  const retweetRotation = useRef(new Animated.Value(0)).current;

  const handleLike = () => {
    const newLiked = !liked;
    setLiked(newLiked);
    setLikeCount(prev => newLiked ? prev + 1 : prev - 1);

    // Like animation
    Animated.sequence([
      Animated.parallel([
        Animated.timing(likeScale, {
          toValue: 1.3,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(heartScale, {
          toValue: 1.5,
          duration: 150,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(likeScale, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(heartScale, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  };

  const handleRetweet = () => {
    const newRetweeted = !retweeted;
    setRetweeted(newRetweeted);
    setRetweetCount(prev => newRetweeted ? prev + 1 : prev - 1);

    // Retweet animation
    Animated.sequence([
      Animated.parallel([
        Animated.timing(retweetScale, {
          toValue: 1.2,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(retweetRotation, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(retweetScale, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(retweetRotation, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  };
  return (
    <ThemedView style={styles.container}>
      {/* User Info */}
      <View style={styles.userInfo}>
        <Image source={{ uri: user.avatar }} style={styles.avatar} />
        <View style={styles.userDetails}>
          <View style={styles.nameRow}>
            <ThemedText style={styles.userName}>{user.name}</ThemedText>
            {user.verified && (
              <IconSymbol name="checkmark.seal.fill" size={16} color="#f472b6" />
            )}
            <ThemedText style={styles.userHandle}>@{user.handle}</ThemedText>
            <ThemedText style={styles.timestamp}>· {timestamp}</ThemedText>
          </View>
        </View>
        <TouchableOpacity style={styles.moreButton}>
          <IconSymbol name="ellipsis" size={16} color="#657786" />
        </TouchableOpacity>
      </View>

      {/* Tweet Content */}
      <ThemedText style={styles.content}>{content}</ThemedText>

      {/* Tweet Image */}
      {image && (
        <View style={styles.imageContainer}>
          <Image source={{ uri: image }} style={styles.tweetImage} />
        </View>
      )}

      {/* Engagement Bar */}
      <View style={styles.engagementBar}>
        <TouchableOpacity style={styles.engagementItem}>
          <IconSymbol name="bubble.left" size={18} color="#657786" />
          <ThemedText style={styles.engagementText}>{comments}</ThemedText>
        </TouchableOpacity>

        <Animated.View style={{ transform: [{ scale: retweetScale }] }}>
          <TouchableOpacity style={styles.engagementItem} onPress={handleRetweet}>
            <Animated.View style={{ 
              transform: [{ 
                rotate: retweetRotation.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0deg', '180deg']
                })
              }]
            }}>
              <IconSymbol 
                name="arrow.2.squarepath" 
                size={18} 
                color={retweeted ? "#17BF63" : "#657786"} 
              />
            </Animated.View>
            <ThemedText style={[
              styles.engagementText,
              retweeted && styles.activeEngagementText
            ]}>
              {retweetCount}
            </ThemedText>
          </TouchableOpacity>
        </Animated.View>

        <Animated.View style={{ transform: [{ scale: likeScale }] }}>
          <TouchableOpacity style={styles.engagementItem} onPress={handleLike}>
            <Animated.View style={{ transform: [{ scale: heartScale }] }}>
              <IconSymbol 
                name={liked ? "heart.fill" : "heart"} 
                size={18} 
                color={liked ? "#E0245E" : "#657786"} 
              />
            </Animated.View>
            <ThemedText style={[
              styles.engagementText,
              liked && styles.activeEngagementText
            ]}>
              {likeCount}
            </ThemedText>
          </TouchableOpacity>
        </Animated.View>

        <TouchableOpacity style={styles.engagementItem}>
          <IconSymbol name="square.and.arrow.up" size={18} color="#657786" />
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E1E8ED',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  userDetails: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  userName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#14171A',
    marginRight: 4,
  },
  userHandle: {
    fontSize: 15,
    color: '#657786',
    marginRight: 4,
  },
  timestamp: {
    fontSize: 15,
    color: '#657786',
  },
  moreButton: {
    padding: 4,
  },
  content: {
    fontSize: 15,
    lineHeight: 20,
    color: '#14171A',
    marginBottom: 8,
  },
  imageContainer: {
    marginTop: 8,
    borderRadius: 12,
    overflow: 'hidden',
  },
  tweetImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  engagementBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingRight: 40,
  },
  engagementItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  engagementText: {
    fontSize: 13,
    color: '#657786',
    marginLeft: 6,
  },
  activeEngagementText: {
    color: '#E0245E',
  },
});
