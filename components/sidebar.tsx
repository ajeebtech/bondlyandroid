import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Image } from 'expo-image';
import React, { useEffect, useRef } from 'react';
import { Animated, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

interface SidebarProps {
  onClose: () => void;
}

export default function Sidebar({ onClose }: SidebarProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(-50)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;

  useEffect(() => {
    // Entrance animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const menuItems = [
    { icon: 'house.fill', label: 'Home', active: true },
    { icon: 'magnifyingglass', label: 'Explore', active: false },
    { icon: 'bell.fill', label: 'Notifications', active: false },
    { icon: 'envelope.fill', label: 'Messages', active: false },
    { icon: 'bookmark.fill', label: 'Bookmarks', active: false },
    { icon: 'list.bullet', label: 'Lists', active: false },
    { icon: 'person.fill', label: 'Profile', active: false },
    { icon: 'ellipsis.circle', label: 'More', active: false },
  ];

  return (
    <Animated.View 
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [
            { translateY: slideAnim },
            { scale: scaleAnim }
          ]
        }
      ]}
    >
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <IconSymbol name="xmark" size={24} color="#1DA1F2" />
          </TouchableOpacity>
        </View>

        {/* User Profile Section */}
        <View style={styles.profileSection}>
          <Image
            source={{ uri: 'https://picsum.photos/80/80?random=1' }}
            style={styles.avatar}
          />
          <View style={styles.userInfo}>
            <ThemedText style={styles.userName}>John Doe</ThemedText>
            <ThemedText style={styles.userHandle}>@johndoe</ThemedText>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <ThemedText style={styles.statNumber}>1,234</ThemedText>
            <ThemedText style={styles.statLabel}>Following</ThemedText>
          </View>
          <View style={styles.statItem}>
            <ThemedText style={styles.statNumber}>5,678</ThemedText>
            <ThemedText style={styles.statLabel}>Followers</ThemedText>
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.menuContainer}>
          {menuItems.map((item, index) => (
            <TouchableOpacity key={index} style={styles.menuItem}>
              <IconSymbol 
                name={item.icon as any} 
                size={24} 
                color={item.active ? '#1DA1F2' : '#657786'} 
              />
              <ThemedText style={[
                styles.menuLabel,
                item.active && styles.activeMenuLabel
              ]}>
                {item.label}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </View>

        {/* Tweet Button */}
        <TouchableOpacity style={styles.tweetButton}>
          <ThemedText style={styles.tweetButtonText}>Tweet</ThemedText>
        </TouchableOpacity>
      </ScrollView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  closeButton: {
    padding: 8,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#14171A',
  },
  userHandle: {
    fontSize: 14,
    color: '#657786',
    marginTop: 2,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E1E8ED',
  },
  statItem: {
    marginRight: 30,
  },
  statNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#14171A',
  },
  statLabel: {
    fontSize: 12,
    color: '#657786',
    marginTop: 2,
  },
  menuContainer: {
    paddingTop: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  menuLabel: {
    fontSize: 16,
    color: '#657786',
    marginLeft: 15,
  },
  activeMenuLabel: {
    color: '#1DA1F2',
    fontWeight: 'bold',
  },
  tweetButton: {
    backgroundColor: '#1DA1F2',
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginHorizontal: 20,
    marginTop: 20,
    alignItems: 'center',
  },
  tweetButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
