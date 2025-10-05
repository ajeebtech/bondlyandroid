import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Image } from 'expo-image';
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';

export default function MediaScreen() {
  const mediaItems = [
    { id: '1', type: 'photo', url: 'https://picsum.photos/300/300?random=1' },
    { id: '2', type: 'photo', url: 'https://picsum.photos/300/300?random=2' },
    { id: '3', type: 'video', url: 'https://picsum.photos/300/300?random=3' },
    { id: '4', type: 'photo', url: 'https://picsum.photos/300/300?random=4' },
    { id: '5', type: 'photo', url: 'https://picsum.photos/300/300?random=5' },
    { id: '6', type: 'video', url: 'https://picsum.photos/300/300?random=6' },
    { id: '7', type: 'photo', url: 'https://picsum.photos/300/300?random=7' },
    { id: '8', type: 'photo', url: 'https://picsum.photos/300/300?random=8' },
    { id: '9', type: 'video', url: 'https://picsum.photos/300/300?random=9' },
  ];

  const renderMediaItem = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.mediaItem}>
      <Image source={{ uri: item.url }} style={styles.mediaImage} />
      {item.type === 'video' && (
        <View style={styles.playButton}>
          <IconSymbol name="play.fill" size={24} color="#FFFFFF" />
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText style={styles.title}>Media</ThemedText>
        <TouchableOpacity style={styles.addButton}>
          <IconSymbol name="plus" size={20} color="#FFFFFF" />
          <ThemedText style={styles.addButtonText}>Add More Media</ThemedText>
        </TouchableOpacity>
      </View>

      <View style={styles.mediaGrid}>
        <FlatList
          data={mediaItems}
          renderItem={renderMediaItem}
          keyExtractor={(item) => item.id}
          numColumns={3}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.mediaList}
        />
      </View>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingTop: 50,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E1E8ED',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#14171A',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f472b6',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  mediaGrid: {
    flex: 1,
    paddingHorizontal: 15,
    paddingTop: 15,
  },
  mediaList: {
    paddingBottom: 20,
  },
  mediaItem: {
    flex: 1,
    aspectRatio: 1,
    margin: 2,
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
  },
  mediaImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  playButton: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -12 }, { translateY: -12 }],
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
