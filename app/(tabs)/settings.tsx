import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

export default function PlanDateScreen() {
  const dateIdeas = [
    { id: '1', title: 'Coffee & Walk', icon: 'cup.and.saucer.fill', color: '#8B4513' },
    { id: '2', title: 'Dinner Date', icon: 'fork.knife', color: '#FF6B6B' },
    { id: '3', title: 'Movie Night', icon: 'tv.fill', color: '#4ECDC4' },
    { id: '4', title: 'Picnic in Park', icon: 'leaf.fill', color: '#45B7D1' },
    { id: '5', title: 'Museum Visit', icon: 'building.columns.fill', color: '#96CEB4' },
    { id: '6', title: 'Cooking Together', icon: 'chef.hat.fill', color: '#FFEAA7' },
  ];

  const renderDateIdea = (item: any) => (
    <TouchableOpacity key={item.id} style={styles.dateIdeaCard}>
      <View style={[styles.iconContainer, { backgroundColor: item.color }]}>
        <IconSymbol name={item.icon as any} size={24} color="#FFFFFF" />
      </View>
      <ThemedText style={styles.dateIdeaTitle}>{item.title}</ThemedText>
    </TouchableOpacity>
  );

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText style={styles.title}>Plan a Date</ThemedText>
        <TouchableOpacity style={styles.createButton}>
          <IconSymbol name="plus" size={20} color="#FFFFFF" />
          <ThemedText style={styles.createButtonText}>Create Plan</ThemedText>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <ThemedView style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Quick Date Ideas</ThemedText>
          <ThemedText style={styles.sectionDescription}>
            Choose from our curated list of romantic date ideas
          </ThemedText>
        </ThemedView>

        <View style={styles.dateIdeasGrid}>
          {dateIdeas.map(renderDateIdea)}
        </View>

        <ThemedView style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Custom Date</ThemedText>
          <ThemedText style={styles.sectionDescription}>
            Create your own unique date experience
          </ThemedText>
        </ThemedView>

        <TouchableOpacity style={styles.customDateCard}>
          <IconSymbol name="heart.fill" size={24} color="#E0245E" />
          <ThemedText style={styles.customDateText}>Plan Custom Date</ThemedText>
          <IconSymbol name="chevron.right" size={16} color="#657786" />
        </TouchableOpacity>
      </ScrollView>
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
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E0245E',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  createButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  content: {
    flex: 1,
    paddingHorizontal: 15,
  },
  section: {
    marginTop: 20,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#14171A',
    marginBottom: 5,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#657786',
    lineHeight: 20,
  },
  dateIdeasGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  dateIdeaCard: {
    width: '48%',
    backgroundColor: '#F7F9FA',
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E1E8ED',
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  dateIdeaTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#14171A',
    textAlign: 'center',
  },
  customDateCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7F9FA',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E1E8ED',
  },
  customDateText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#14171A',
    marginLeft: 12,
  },
});
