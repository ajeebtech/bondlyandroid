import Sidebar from '@/components/sidebar';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import Tweet from '@/components/tweet';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import React, { useRef, useState } from 'react';
import { Animated, FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';

export default function HomeScreen() {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  
  // Animation values
  const fabScale = useRef(new Animated.Value(1)).current;
  const fabRotation = useRef(new Animated.Value(0)).current;
  const sidebarTranslateX = useRef(new Animated.Value(300)).current;
  const sidebarOpacity = useRef(new Animated.Value(0)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;

  const tweets = [
    {
      id: '1',
      user: {
        name: 'Martha Craig',
        handle: 'craig_love',
        avatar: 'https://picsum.photos/48/48?random=1',
      },
      content: 'UXR/UX: You can only bring one item to a remote island to assist your research of native use of tools and usability. What do you bring? #TellMeAboutYou',
      image: 'https://picsum.photos/400/200?random=2',
      timestamp: '12h',
      likes: 21,
      retweets: 5,
      comments: 28,
      isLiked: false,
      isRetweeted: false,
    },
    {
      id: '2',
      user: {
        name: 'Maximmilian',
        handle: 'maxjacobson',
        avatar: 'https://picsum.photos/48/48?random=3',
      },
      content: 'Y\'all ready for this next post?',
      timestamp: '3h',
      likes: 363,
      retweets: 18,
      comments: 46,
      isLiked: true,
      isRetweeted: false,
    },
    {
      id: '3',
      user: {
        name: 'Tabitha Potter',
        handle: 'mis_potter',
        avatar: 'https://picsum.photos/48/48?random=4',
        verified: true,
      },
      content: 'Kobe\'s passing is really sticking w/ me in a way I didn\'t expect. He was an icon, the kind of person who wouldn\'t die this way. My wife compared it to Princess Di\'s accident. But the end can happen for anyone at any time, & I can\'t help but think of anything else lately.',
      timestamp: '14h',
      likes: 11,
      retweets: 1,
      comments: 7,
      isLiked: false,
      isRetweeted: false,
    },
    {
      id: '4',
      user: {
        name: 'karennne',
        handle: 'karennne',
        avatar: 'https://picsum.photos/48/48?random=5',
      },
      content: 'Name a show where the lead character is the worst character on the show I\'ll go first: Sabrina Spellman',
      timestamp: '10h',
      likes: 7461,
      retweets: 1249,
      comments: 1906,
      isLiked: false,
      isRetweeted: true,
    },
  ];

  // Animation functions
  const openSidebar = () => {
    setSidebarVisible(true);
    Animated.parallel([
      Animated.timing(sidebarTranslateX, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(sidebarOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(backdropOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const closeSidebar = () => {
    Animated.parallel([
      Animated.timing(sidebarTranslateX, {
        toValue: 300,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(sidebarOpacity, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(backdropOpacity, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setSidebarVisible(false);
    });
  };

  const handleFabPress = () => {
    // FAB press animation
    Animated.sequence([
      Animated.parallel([
        Animated.timing(fabScale, {
          toValue: 0.9,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(fabRotation, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(fabScale, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(fabRotation, {
          toValue: 0,
          duration: 100,
          useNativeDriver: true,
        }),
      ]),
    ]).start(() => {
      router.push('/compose');
    });
  };

  const renderTweet = ({ item }: { item: any }) => (
    <Tweet
      id={item.id}
      user={item.user}
      content={item.content}
      image={item.image}
      timestamp={item.timestamp}
      likes={item.likes}
      retweets={item.retweets}
      comments={item.comments}
      isLiked={item.isLiked}
      isRetweeted={item.isRetweeted}
    />
  );

  return (
    <ThemedView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={openSidebar}
          style={styles.avatarButton}
        >
          <Image 
            source={{ uri: 'https://picsum.photos/32/32?random=6' }} 
            style={styles.headerAvatar} 
          />
        </TouchableOpacity>
        
        <View style={styles.headerCenter}>
          <ThemedText style={styles.headerTitle}>Home</ThemedText>
        </View>
        
        <TouchableOpacity style={styles.headerRight}>
          <IconSymbol name="sparkles" size={24} color="#1DA1F2" />
        </TouchableOpacity>
      </View>

      {/* Tweet Feed */}
      <FlatList
        data={tweets}
        renderItem={renderTweet}
        keyExtractor={(item) => item.id}
        style={styles.feed}
        showsVerticalScrollIndicator={false}
      />

      {/* Floating Action Button */}
      <Animated.View
        style={[
          styles.fab,
          {
            transform: [
              { scale: fabScale },
              { rotate: fabRotation.interpolate({
                inputRange: [0, 1],
                outputRange: ['0deg', '45deg']
              })}
            ]
          }
        ]}
      >
        <TouchableOpacity onPress={handleFabPress} style={styles.fabButton}>
          <IconSymbol name="pencil" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </Animated.View>

      {/* Sidebar Modal */}
      {sidebarVisible && (
        <Animated.View 
          style={[
            styles.sidebarOverlay,
            {
              opacity: backdropOpacity
            }
          ]}
        >
          <Animated.View 
            style={[
              styles.sidebarContainer,
              {
                opacity: sidebarOpacity,
                transform: [{ translateX: sidebarTranslateX }]
              }
            ]}
          >
            <Sidebar onClose={closeSidebar} />
          </Animated.View>
          <TouchableOpacity 
            style={styles.sidebarBackdrop}
            onPress={closeSidebar}
          />
        </Animated.View>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingTop: 50,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E1E8ED',
  },
  avatarButton: {
    marginRight: 15,
  },
  headerAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#14171A',
  },
  headerRight: {
    padding: 4,
  },
  feed: {
    flex: 1,
  },
  fab: {
    position: 'absolute',
    bottom: 80,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#1DA1F2',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
  },
  fabButton: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 28,
  },
  sidebarOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
  },
  sidebarContainer: {
    width: 300,
    height: '100%',
  },
  sidebarBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
});
