import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { router } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import { Animated, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Button, Text, XStack, YStack } from 'tamagui';

export default function SettingsScreen() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
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
    ]).start();
  }, []);

  const settingsSections = [
    {
      title: 'Account',
      items: [
        { icon: 'person.fill', label: 'Profile', subtitle: 'Manage your profile information' },
        { icon: 'lock.fill', label: 'Privacy & Safety', subtitle: 'Control your privacy settings' },
        { icon: 'key.fill', label: 'Security', subtitle: 'Password and security options' },
        { icon: 'envelope.fill', label: 'Email Notifications', subtitle: 'Manage email preferences' },
      ]
    },
    {
      title: 'Preferences',
      items: [
        { icon: 'bell.fill', label: 'Notifications', subtitle: 'Push notification settings' },
        { icon: 'paintbrush.fill', label: 'Display', subtitle: 'Theme and appearance' },
        { icon: 'globe', label: 'Language', subtitle: 'Choose your language' },
        { icon: 'location.fill', label: 'Location', subtitle: 'Location services' },
      ]
    },
    {
      title: 'Support',
      items: [
        { icon: 'questionmark.circle.fill', label: 'Help Center', subtitle: 'Get help and support' },
        { icon: 'exclamationmark.triangle.fill', label: 'Report a Problem', subtitle: 'Report issues or bugs' },
        { icon: 'info.circle.fill', label: 'About', subtitle: 'App version and info' },
      ]
    }
  ];

  const renderSettingItem = (item: any, index: number) => (
    <TouchableOpacity key={index} style={styles.settingItem}>
      <XStack alignItems="center" space="$3" paddingVertical="$3" paddingHorizontal="$4">
        <View style={styles.iconContainer}>
          <IconSymbol name={item.icon as any} size={20} color="#f472b6" />
        </View>
        <YStack flex={1}>
          <Text fontSize="$4" fontWeight="600" color="$color12">
            {item.label}
          </Text>
          <Text fontSize="$3" color="$color9" marginTop="$1">
            {item.subtitle}
          </Text>
        </YStack>
        <IconSymbol name="chevron.right" size={16} color="#657786" />
      </XStack>
    </TouchableOpacity>
  );

  return (
    <ThemedView style={styles.container}>
      <Animated.View 
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }
        ]}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <IconSymbol name="chevron.left" size={24} color="#f472b6" />
          </TouchableOpacity>
          <ThemedText style={styles.headerTitle}>Settings</ThemedText>
          <View style={styles.headerRight} />
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {settingsSections.map((section, sectionIndex) => (
            <View key={sectionIndex} style={styles.section}>
              <ThemedText style={styles.sectionTitle}>{section.title}</ThemedText>
              <View style={styles.sectionContent}>
                {section.items.map((item, itemIndex) => renderSettingItem(item, itemIndex))}
              </View>
            </View>
          ))}

          {/* Logout Button */}
          <View style={styles.logoutSection}>
            <Button
              backgroundColor="$red10"
              borderRadius="$4"
              paddingVertical="$4"
              pressStyle={{ scale: 0.95 }}
              animation="bouncy"
            >
              <XStack alignItems="center" space="$2">
                <IconSymbol name="rectangle.portrait.and.arrow.right" size={20} color="#FFFFFF" />
                <Text color="white" fontWeight="600" fontSize="$4">
                  Log Out
                </Text>
              </XStack>
            </Button>
          </View>
        </ScrollView>
      </Animated.View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  backButton: {
    padding: 8,
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#14171A',
    flex: 1,
  },
  headerRight: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#657786',
    paddingHorizontal: 20,
    paddingBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  sectionContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  settingItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#F7F9FA',
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F7F9FA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoutSection: {
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
});
