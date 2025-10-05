import GooglePlacesAutocomplete from '@/components/GooglePlacesAutocomplete';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { router } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
    Animated,
    Dimensions,
    Modal,
    ScrollView,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

const { width, height } = Dimensions.get('window');

export default function PlanDateScreen() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [startingPoint, setStartingPoint] = useState('');
  const [destination, setDestination] = useState('');
  const [distance, setDistance] = useState('5');
  const [waypoints, setWaypoints] = useState<string[]>([]);
  const [mapRegion, setMapRegion] = useState({
    latitude: 20.5937,
    longitude: 78.9629,
    latitudeDelta: 15,
    longitudeDelta: 15,
  });

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
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

  const openPlanModal = () => {
    setIsModalVisible(true);
  };

  const closePlanModal = () => {
    setIsModalVisible(false);
  };

  const addWaypoint = () => {
    setWaypoints([...waypoints, '']);
  };

  const removeWaypoint = (index: number) => {
    setWaypoints(waypoints.filter((_, i) => i !== index));
  };

  const findRecommendations = () => {
    // Implementation for finding recommendations and ETA
    console.log('Finding recommendations...');
  };

  const confirmDate = () => {
    // Implementation for confirming the date
    console.log('Date confirmed!');
    closePlanModal();
  };

  return (
    <ThemedView style={styles.container}>
      <Animated.View 
        style={[
          styles.header,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }
        ]}
      >
        <ThemedText style={styles.title}>Plan a Date</ThemedText>
        <View style={styles.headerButtons}>
          <TouchableOpacity 
            style={styles.mapButton}
            onPress={() => router.push('/map')}
          >
            <IconSymbol name="map.fill" size={20} color="#f472b6" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.createButton} onPress={openPlanModal}>
            <IconSymbol name="plus" size={20} color="#FFFFFF" />
            <ThemedText style={styles.createButtonText}>Create Plan</ThemedText>
          </TouchableOpacity>
        </View>
      </Animated.View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Animated.View 
          style={[
            styles.section,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <ThemedText style={styles.sectionTitle}>Planned Dates</ThemedText>
          <ThemedText style={styles.sectionDescription}>
            Your upcoming romantic dates
          </ThemedText>
        </Animated.View>

        <View style={styles.plannedDatesContainer}>
          {[
            { id: '1', place: 'Central Park', date: 'Dec 15, 2024' },
            { id: '2', place: 'Brooklyn Bridge', date: 'Dec 22, 2024' },
            { id: '3', place: 'Times Square', date: 'Dec 28, 2024' },
            { id: '4', place: 'High Line Park', date: 'Jan 5, 2025' },
          ].map((item, index) => (
            <Animated.View
              key={item.id}
              style={[
                {
                  opacity: fadeAnim,
                  transform: [
                    { translateY: slideAnim },
                    { scale: scaleAnim }
                  ]
                }
              ]}
            >
              <TouchableOpacity style={styles.plannedDateBar}>
                <ThemedText style={styles.plannedDatePlace}>{item.place}</ThemedText>
                <ThemedText style={styles.plannedDateText}>{item.date}</ThemedText>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>
      </ScrollView>

      {/* Plan Your Date Modal */}
      <Modal
        visible={isModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={closePlanModal}
      >
        <View style={styles.modalContainer}>
          {/* Modal Header */}
          <View style={styles.modalHeader}>
            <ThemedText style={styles.modalTitle}>Plan Your Date</ThemedText>
            <TouchableOpacity onPress={closePlanModal} style={styles.closeButton}>
              <IconSymbol name="xmark" size={24} color="#657786" />
            </TouchableOpacity>
          </View>

          <View style={styles.modalContent}>
            {/* Left Side - Form */}
            <View style={styles.formContainer}>
              {/* Starting Point */}
              <View style={styles.inputGroup}>
                <ThemedText style={styles.inputLabel}>Starting Point</ThemedText>
                <GooglePlacesAutocomplete
                  placeholder="Where are you starting from?"
                  value={startingPoint}
                  onChangeText={setStartingPoint}
                  onPlaceSelect={(place) => {
                    setStartingPoint(place.description);
                    console.log('Starting point selected:', place);
                  }}
                />
              </View>

              {/* Destination */}
              <View style={styles.inputGroup}>
                <ThemedText style={styles.inputLabel}>Destination</ThemedText>
                <GooglePlacesAutocomplete
                  placeholder="Where are you going?"
                  value={destination}
                  onChangeText={setDestination}
                  onPlaceSelect={(place) => {
                    setDestination(place.description);
                    console.log('Destination selected:', place);
                  }}
                />
              </View>

              {/* Distance */}
              <View style={styles.inputGroup}>
                <ThemedText style={styles.inputLabel}>Distance (km)</ThemedText>
                <TextInput
                  style={styles.textInput}
                  value={distance}
                  onChangeText={setDistance}
                  keyboardType="numeric"
                  placeholder="5"
                />
              </View>

              {/* Waypoints */}
              <View style={styles.inputGroup}>
                <View style={styles.waypointsHeader}>
                  <ThemedText style={styles.inputLabel}>Waypoints</ThemedText>
                  <TouchableOpacity style={styles.addStopButton} onPress={addWaypoint}>
                    <IconSymbol name="plus" size={16} color="#f472b6" />
                    <ThemedText style={styles.addStopText}>Add Stop</ThemedText>
                  </TouchableOpacity>
                </View>
                {waypoints.map((waypoint, index) => (
                  <View key={index} style={styles.waypointItem}>
                    <GooglePlacesAutocomplete
                      placeholder={`Stop ${index + 1}`}
                      value={waypoint}
                      onChangeText={(text) => {
                        const newWaypoints = [...waypoints];
                        newWaypoints[index] = text;
                        setWaypoints(newWaypoints);
                      }}
                      onPlaceSelect={(place) => {
                        const newWaypoints = [...waypoints];
                        newWaypoints[index] = place.description;
                        setWaypoints(newWaypoints);
                        console.log(`Waypoint ${index + 1} selected:`, place);
                      }}
                    />
                    <TouchableOpacity 
                      style={styles.removeWaypointButton}
                      onPress={() => removeWaypoint(index)}
                    >
                      <IconSymbol name="xmark" size={16} color="#E0245E" />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>

              {/* Find Recommendations Button */}
              <TouchableOpacity style={styles.findButton} onPress={findRecommendations}>
                <ThemedText style={styles.findButtonText}>find recommendations and eta</ThemedText>
              </TouchableOpacity>
            </View>

            {/* Right Side - Map */}
            <View style={styles.mapContainer}>
              <MapView
                provider={PROVIDER_GOOGLE}
                style={styles.map}
                region={mapRegion}
                showsUserLocation={true}
                showsMyLocationButton={false}
              >
                {/* Markers for starting point and destination */}
                {startingPoint && (
                  <Marker
                    coordinate={{ latitude: 20.5937, longitude: 78.9629 }}
                    title="Starting Point"
                    pinColor="green"
                  />
                )}
                {destination && (
                  <Marker
                    coordinate={{ latitude: 19.0760, longitude: 72.8777 }}
                    title="Destination"
                    pinColor="red"
                  />
                )}
              </MapView>
            </View>
          </View>

          {/* Modal Footer */}
          <View style={styles.modalFooter}>
            <TouchableOpacity style={styles.cancelButton} onPress={closePlanModal}>
              <ThemedText style={styles.cancelButtonText}>Cancel</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity style={styles.confirmButton} onPress={confirmDate}>
              <ThemedText style={styles.confirmButtonText}>Confirm Date</ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#14171A',
    letterSpacing: -0.5,
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  mapButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F7F9FA',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E1E8ED',
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E0245E',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    shadowColor: '#E0245E',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  createButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginTop: 24,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#14171A',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  sectionDescription: {
    fontSize: 15,
    color: '#657786',
    lineHeight: 22,
  },
  plannedDatesContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  plannedDateBar: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E1E8ED',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  plannedDatePlace: {
    fontSize: 16,
    fontWeight: '600',
    color: '#14171A',
    marginBottom: 4,
    letterSpacing: -0.2,
  },
  plannedDateText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#657786',
    letterSpacing: -0.1,
  },
  // Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E1E8ED',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#14171A',
  },
  closeButton: {
    padding: 8,
  },
  modalContent: {
    flex: 1,
    flexDirection: 'row',
  },
  formContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F8F9FA',
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#14171A',
    marginBottom: 8,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: '#14171A',
  },
  waypointsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  addStopButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7F9FA',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E1E8ED',
  },
  addStopText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#f472b6',
    marginLeft: 4,
  },
  waypointItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  removeWaypointButton: {
    marginLeft: 8,
    padding: 4,
  },
  findButton: {
    backgroundColor: '#E0245E',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 20,
  },
  findButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  mapContainer: {
    flex: 1,
    backgroundColor: '#E1E8ED',
  },
  map: {
    flex: 1,
  },
  modalFooter: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: '#E1E8ED',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#F7F9FA',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E1E8ED',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#657786',
  },
  confirmButton: {
    flex: 1,
    backgroundColor: '#657786',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
