import { IconSymbol } from '@/components/ui/icon-symbol';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import React, { useRef, useState } from 'react';
import {
    Alert,
    Animated,
    Dimensions,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    TouchableOpacity
} from 'react-native';
import { Button, Text, TextArea, XStack, YStack } from 'tamagui';

const { width } = Dimensions.get('window');

export default function ComposeScreen() {
  const [tweetText, setTweetText] = useState('');
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  
  const slideAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  React.useEffect(() => {
    // Entrance animations
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
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

  const handleCancel = () => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start(() => {
      router.back();
    });
  };

  const handleTweet = () => {
    // Add tweet logic here
    console.log('Tweet:', tweetText);
    handleCancel();
  };

  const addImage = () => {
    // Simulate adding an image
    const newImage = `https://picsum.photos/200/200?random=${Date.now()}`;
    setSelectedImages(prev => [...prev, newImage]);
  };

  const addMedia = () => {
    // Show media options
    Alert.alert(
      'Add Media',
      'Choose media type',
      [
        { text: 'Camera', onPress: () => addImage() },
        { text: 'Photo Library', onPress: () => addImage() },
        { text: 'GIF', onPress: () => console.log('Add GIF') },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  const removeImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
  };

  const isTweetButtonEnabled = tweetText.trim().length > 0 || selectedImages.length > 0;

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Animated.View 
        style={[
          styles.container,
          {
            opacity: fadeAnim,
            transform: [
              { translateY: slideAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [50, 0]
              })}
            ]
          }
        ]}
      >
        {/* Header */}
        <XStack justifyContent="space-between" alignItems="center" paddingHorizontal="$4" paddingTop="$12" paddingBottom="$4" borderBottomWidth={1} borderBottomColor="$borderColor">
          <Button 
            variant="outlined" 
            size="$3" 
            onPress={handleCancel}
            backgroundColor="transparent"
            borderColor="$pink10"
          >
            <Text color="$pink10" fontWeight="600">Cancel</Text>
          </Button>
          
          <Button 
            onPress={handleTweet}
            backgroundColor={isTweetButtonEnabled ? "$pink10" : "$gray8"}
            disabled={!isTweetButtonEnabled}
            size="$3"
            borderRadius="$10"
            pressStyle={{ scale: 0.95 }}
            animation="bouncy"
          >
            <Text color="white" fontWeight="bold">Tweet</Text>
          </Button>
        </XStack>

        <YStack flex={1} paddingHorizontal="$4" space="$4">
          {/* User Avatar and Input */}
          <XStack paddingTop="$4" alignItems="flex-start" space="$3">
            <Image 
              source={{ uri: 'https://picsum.photos/48/48?random=6' }} 
              style={styles.avatar} 
            />
            <YStack flex={1} position="relative">
              <TextArea
                placeholder="What's happening?"
                value={tweetText}
                onChangeText={setTweetText}
                size="$4"
                minHeight={120}
                maxHeight={200}
                backgroundColor="transparent"
                borderWidth={0}
                focusStyle={{
                  borderWidth: 0,
                  outlineWidth: 0,
                  backgroundColor: "$gray2",
                }}
                onFocus={() => setIsKeyboardVisible(true)}
                onBlur={() => setIsKeyboardVisible(false)}
              />
              
              {/* Character Counter */}
              <XStack position="absolute" bottom="$2" right="$2" backgroundColor="$background" paddingHorizontal="$2" paddingVertical="$1" borderRadius="$2">
                <Text 
                  fontSize="$2" 
                  color={tweetText.length > 260 ? "$red10" : tweetText.length > 240 ? "$orange10" : "$color9"}
                  fontWeight={tweetText.length > 260 ? "600" : "400"}
                >
                  {280 - tweetText.length}
                </Text>
              </XStack>
              
              <Button
                position="absolute"
                right="$3"
                top="$3"
                size="$3"
                borderRadius="$12"
                backgroundColor="$pink10"
                pressStyle={{ scale: 0.9 }}
                animation="bouncy"
                onPress={addMedia}
              >
                <IconSymbol name="photo.fill" size={20} color="#FFFFFF" />
              </Button>
            </YStack>
          </XStack>

          {/* Media Button Row */}
          <XStack justifyContent="space-around" paddingVertical="$4" borderBottomWidth={1} borderBottomColor="$borderColor" space="$3">
            <Button
              variant="outlined"
              size="$3"
              backgroundColor="$gray2"
              borderColor="$borderColor"
              borderRadius="$12"
              pressStyle={{ scale: 0.95 }}
              animation="bouncy"
              onPress={addMedia}
            >
              <XStack alignItems="center" space="$2">
                <IconSymbol name="photo.fill" size={24} color="#f472b6" />
                <Text color="$pink10" fontWeight="600">Add Media</Text>
              </XStack>
            </Button>
            
            <Button
              variant="outlined"
              size="$3"
              backgroundColor="$gray2"
              borderColor="$borderColor"
              borderRadius="$12"
              pressStyle={{ scale: 0.95 }}
              animation="bouncy"
              onPress={() => console.log('Add GIF')}
            >
              <XStack alignItems="center" space="$2">
                <IconSymbol name="gift.fill" size={24} color="#f472b6" />
                <Text color="$pink10" fontWeight="600">GIF</Text>
              </XStack>
            </Button>
            
            <Button
              variant="outlined"
              size="$3"
              backgroundColor="$gray2"
              borderColor="$borderColor"
              borderRadius="$12"
              pressStyle={{ scale: 0.95 }}
              animation="bouncy"
              onPress={() => console.log('Add Poll')}
            >
              <XStack alignItems="center" space="$2">
                <IconSymbol name="chart.bar.fill" size={24} color="#f472b6" />
                <Text color="$pink10" fontWeight="600">Poll</Text>
              </XStack>
            </Button>
          </XStack>

          {/* Selected Images */}
          {selectedImages.length > 0 && (
            <Animated.View 
              style={[
                styles.imagesContainer,
                {
                  opacity: fadeAnim,
                  transform: [{ scale: scaleAnim }]
                }
              ]}
            >
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {selectedImages.map((image, index) => (
                  <Animated.View 
                    key={index}
                    style={[
                      styles.imagePreview,
                      {
                        opacity: fadeAnim,
                        transform: [{ scale: scaleAnim }]
                      }
                    ]}
                  >
                    <Image source={{ uri: image }} style={styles.previewImage} />
                    <TouchableOpacity 
                      style={styles.removeImageButton}
                      onPress={() => removeImage(index)}
                    >
                      <IconSymbol name="xmark.circle.fill" size={20} color="#f472b6" />
                    </TouchableOpacity>
                  </Animated.View>
                ))}
                {selectedImages.length < 4 && (
                  <TouchableOpacity style={styles.addImageButton} onPress={addImage}>
                    <IconSymbol name="camera.fill" size={24} color="#f472b6" />
                  </TouchableOpacity>
                )}
              </ScrollView>
            </Animated.View>
          )}

          {/* Action Bar */}
          <XStack alignItems="center" paddingVertical="$4" borderTopWidth={1} borderTopColor="$borderColor" space="$3">
            <Button
              size="$3"
              borderRadius="$10"
              backgroundColor="$gray2"
              pressStyle={{ scale: 0.9 }}
              animation="bouncy"
              onPress={addMedia}
            >
              <IconSymbol name="photo.fill" size={20} color="#f472b6" />
            </Button>
            
            <Button
              size="$3"
              borderRadius="$10"
              backgroundColor="$gray2"
              pressStyle={{ scale: 0.9 }}
              animation="bouncy"
              onPress={() => console.log('Add GIF')}
            >
              <IconSymbol name="gift.fill" size={20} color="#f472b6" />
            </Button>
            
            <Button
              size="$3"
              borderRadius="$10"
              backgroundColor="$gray2"
              pressStyle={{ scale: 0.9 }}
              animation="bouncy"
              onPress={() => console.log('Add Poll')}
            >
              <IconSymbol name="chart.bar.fill" size={20} color="#f472b6" />
            </Button>
            
            <Button
              size="$3"
              borderRadius="$10"
              backgroundColor="$gray2"
              pressStyle={{ scale: 0.9 }}
              animation="bouncy"
              onPress={() => console.log('Add Location')}
            >
              <IconSymbol name="location.fill" size={20} color="#f472b6" />
            </Button>
          </XStack>
        </YStack>
      </Animated.View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingTop: 50,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E1E8ED',
  },
  cancelButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  cancelText: {
    fontSize: 16,
    color: '#f472b6',
    fontWeight: '600',
  },
  tweetButton: {
    backgroundColor: '#f472b6',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  tweetButtonDisabled: {
    backgroundColor: '#AAB8C2',
  },
  tweetButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  tweetButtonTextDisabled: {
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
    paddingHorizontal: 15,
  },
  inputContainer: {
    flexDirection: 'row',
    paddingTop: 15,
    alignItems: 'flex-start',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  inputWrapper: {
    flex: 1,
    position: 'relative',
  },
  textInput: {
    fontSize: 18,
    lineHeight: 24,
    color: '#14171A',
    minHeight: 100,
    textAlignVertical: 'top',
    paddingRight: 40,
  },
  mediaButton: {
    position: 'absolute',
    right: 10,
    top: 10,
    padding: 12,
    borderRadius: 25,
    backgroundColor: '#f472b6',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  mediaButtonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E1E8ED',
  },
  mediaButtonLarge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 25,
    backgroundColor: '#F7F9FA',
    borderWidth: 1,
    borderColor: '#E1E8ED',
  },
  mediaButtonText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#f472b6',
    fontWeight: '600',
  },
  imagesContainer: {
    marginTop: 15,
    marginBottom: 10,
  },
  imagePreview: {
    position: 'relative',
    marginRight: 10,
  },
  previewImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  removeImageButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
  },
  addImageButton: {
    width: 80,
    height: 80,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#f472b6',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F7F9FA',
  },
  actionBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: '#E1E8ED',
  },
  actionButton: {
    padding: 12,
    marginRight: 15,
    borderRadius: 20,
    backgroundColor: '#F7F9FA',
    minWidth: 44,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  characterCount: {
    marginLeft: 'auto',
  },
  characterCountText: {
    fontSize: 14,
    color: '#657786',
  },
  characterCountWarning: {
    color: '#E0245E',
  },
  tamaguiTextInput: {
    fontSize: 18,
    lineHeight: 24,
    color: '#14171A',
    minHeight: 120,
    maxHeight: 200,
    textAlignVertical: 'top',
    padding: 16,
    paddingRight: 48,
    backgroundColor: 'transparent',
    borderRadius: 8,
  },
});
