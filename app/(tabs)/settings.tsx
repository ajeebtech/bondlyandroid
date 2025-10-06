import LocationSearch from '@/components/LocationSearch';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { format } from 'date-fns';
import * as Location from 'expo-location';
import { router } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
    Alert,
    Animated,
    Dimensions,
    Linking,
    Modal,
    ScrollView,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

const { width, height } = Dimensions.get('window');

interface Place {
  name?: string;
  formatted_address?: string;
  geometry?: {
    location: {
      lat: () => number;
      lng: () => number;
    } | {
      lat: number;
      lng: number;
    };
  };
  place_id?: string;
  types?: string[];
}

interface LocationPoint {
  address: string;
  place: Place | null;
}

interface RouteInfo {
  distance: string;
  duration: string;
  steps: Array<{
    instruction: string;
    distance: string;
    duration: string;
  }>;
}

interface Waypoint {
  id: string;
  name: string;
  address: string;
  place: Place | null;
}

interface NearbyPlace {
  place_id: string;
  name: string;
  rating?: number;
  price_level?: number;
  types: string[];
  vicinity: string;
  geometry?: {
    location: {
      lat: number;
      lng: number;
    };
  };
}

export default function PlanDateScreen() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [startingPoint, setStartingPoint] = useState<LocationPoint>({ address: '', place: null });
  const [destination, setDestination] = useState<LocationPoint>({ address: '', place: null });
  const [waypoints, setWaypoints] = useState<Waypoint[]>([]);
  const [nearbyPlaces, setNearbyPlaces] = useState<NearbyPlace[]>([]);
  const [isLoadingNearby, setIsLoadingNearby] = useState(false);
  const [showNearbyPlaces, setShowNearbyPlaces] = useState(false);
  const [isMetroMode, setIsMetroMode] = useState(false);
  const [routeInfo, setRouteInfo] = useState<RouteInfo | null>(null);
  const [navigationLink, setNavigationLink] = useState<string>('');
  const [currentLocation, setCurrentLocation] = useState<{lat: number, lng: number} | null>(null);
  const [showDateTimePicker, setShowDateTimePicker] = useState(false);
  const [selectedDateTime, setSelectedDateTime] = useState<Date | null>(null);
  const [budget, setBudget] = useState('');
  const [distance, setDistance] = useState('5');
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
    resetForm();
  };

  const resetForm = () => {
    setStartingPoint({ address: '', place: null });
    setDestination({ address: '', place: null });
    setWaypoints([]);
    setNearbyPlaces([]);
    setShowNearbyPlaces(false);
    setIsMetroMode(false);
    setShowDateTimePicker(false);
    setSelectedDateTime(null);
    setRouteInfo(null);
    setNavigationLink('');
    setBudget('');
    setDistance('5');
  };

  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Location permission is required to get your current location.');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const coords = {
        lat: location.coords.latitude,
        lng: location.coords.longitude
      };
      setCurrentLocation(coords);
      return coords;
    } catch (error) {
      console.error('Error getting location:', error);
      Alert.alert('Error', 'Could not get your current location.');
    }
  };

  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const calculateRoute = async () => {
    if (!startingPoint.place || !destination.place) {
      Alert.alert('Error', 'Please select both starting point and destination');
      return;
    }

    try {
      const origin = startingPoint.place.formatted_address || startingPoint.address;
      const dest = destination.place.formatted_address || destination.address;

      // Generate Google Maps navigation URL
      const startLoc = startingPoint.place.geometry?.location;
      const destLoc = destination.place.geometry?.location;

      if (startLoc && destLoc) {
        const startLat = typeof startLoc.lat === 'function' ? startLoc.lat() : startLoc.lat;
        const startLng = typeof startLoc.lng === 'function' ? startLoc.lng() : startLng;
        const destLat = typeof destLoc.lat === 'function' ? destLoc.lat() : destLat;
        const destLng = typeof destLoc.lng === 'function' ? destLoc.lng() : destLng;

        const navUrl = `https://www.google.com/maps/dir/?api=1&destination=${destLat},${destLng}&travelmode=${isMetroMode ? 'transit' : 'driving'}`;
        setNavigationLink(navUrl);

        // Mock route info for now
        const mockRouteInfo: RouteInfo = {
          distance: '5.2 km',
          duration: '15 minutes',
          steps: [
            { instruction: 'Head north on Main St', distance: '0.5 km', duration: '2 min' },
            { instruction: 'Turn right on Oak Ave', distance: '2.1 km', duration: '6 min' },
            { instruction: 'Turn left on Park Rd', distance: '2.6 km', duration: '7 min' }
          ]
        };
        setRouteInfo(mockRouteInfo);
      }
    } catch (error) {
      console.error('Error calculating route:', error);
      Alert.alert('Error', 'Failed to calculate route. Please try again.');
    }
  };

  const fetchNearbyPlaces = async () => {
    if (!destination.place?.geometry?.location) {
      Alert.alert('Error', 'Please select a destination first');
      return;
    }

    setIsLoadingNearby(true);
    
    try {
      // Mock nearby places for now
      const mockPlaces: NearbyPlace[] = [
        {
          place_id: 'mock1',
          name: 'Romantic Restaurant',
          rating: 4.5,
          price_level: 3,
          types: ['restaurant', 'food'],
          vicinity: 'Near your destination',
          geometry: {
            location: { lat: 20.5937 + 0.001, lng: 78.9629 + 0.001 }
          }
        },
        {
          place_id: 'mock2',
          name: 'Cozy Cafe',
          rating: 4.2,
          price_level: 2,
          types: ['cafe', 'food'],
          vicinity: 'Near your destination',
          geometry: {
            location: { lat: 20.5937 - 0.001, lng: 78.9629 + 0.001 }
          }
        },
        {
          place_id: 'mock3',
          name: 'Beautiful Park',
          rating: 4.8,
          price_level: 0,
          types: ['park', 'tourist_attraction'],
          vicinity: 'Near your destination',
          geometry: {
            location: { lat: 20.5937 + 0.002, lng: 78.9629 - 0.001 }
          }
        }
      ];
      
      setNearbyPlaces(mockPlaces);
      setShowNearbyPlaces(true);
    } catch (error) {
      console.error('Error fetching nearby places:', error);
      Alert.alert('Error', 'Failed to fetch nearby places. Please try again.');
    } finally {
      setIsLoadingNearby(false);
    }
  };

  const addPlaceToRoute = (place: NearbyPlace) => {
    const waypoint: Waypoint = {
      id: place.place_id,
      name: place.name,
      address: place.vicinity,
      place: {
        place_id: place.place_id,
        name: place.name,
        formatted_address: place.vicinity,
        geometry: place.geometry,
        types: place.types
      } as Place
    };
    
    setWaypoints(prev => [...prev, waypoint]);
  };

  const removeWaypoint = (waypointId: string) => {
    setWaypoints(prev => prev.filter(wp => wp.id !== waypointId));
  };

  const handleStartPlaceSelected = (place: Place) => {
    setStartingPoint({
      address: place.formatted_address || place.name || '',
      place
    });
  };

  const handleDestinationPlaceSelected = (place: Place) => {
    setDestination({
      address: place.formatted_address || place.name || '',
      place
    });
  };

  const handleConfirm = () => {
    if (!startingPoint.address || !destination.address) {
      Alert.alert('Error', 'Please set both starting point and destination');
      return;
    }

    setShowDateTimePicker(true);
  };

  const createCalendarEvent = async () => {
    if (!selectedDateTime) {
      Alert.alert('Error', 'Please select a date and time for your date.');
      return;
    }

    try {
      // Format places sequence
      const placesSequence = [];
      placesSequence.push(`Start: ${startingPoint.address}`);
      
      waypoints.forEach((waypoint, index) => {
        placesSequence.push(`Stop ${index + 1}: ${waypoint.name}`);
      });
      
      placesSequence.push(`Destination: ${destination.address}`);

      // Create event description
      const description = [
        `🗺️ Date Route:`,
        placesSequence.join(' → '),
        '',
        `🚗 Navigation: ${navigationLink || 'Navigation link not available'}`,
        '',
        `💰 Budget: ${budget || 'Not specified'}`,
        `🚇 Transport: ${isMetroMode ? 'Metro/Public Transit' : 'Driving'}`,
        '',
        `Route Details:`,
        routeInfo ? `Distance: ${routeInfo.distance} | Duration: ${routeInfo.duration}` : 'Route not calculated'
      ].join('\n');

      // Create calendar event data
      const eventData = {
        title: `Date: ${startingPoint.address} → ${destination.address}`,
        notes: description,
        startDate: selectedDateTime,
        endDate: new Date(selectedDateTime.getTime() + 4 * 60 * 60 * 1000), // 4 hours later
        location: destination.address,
      };

      // For now, just show success message
      Alert.alert(
        'Date Planned! 🎉',
        `Your date has been planned for ${format(selectedDateTime, 'EEEE, MMMM d, yyyy \'at\' h:mm a')}.\n\nRoute: ${placesSequence.join(' → ')}`,
        [
          {
            text: 'OK',
            onPress: () => {
              resetForm();
              closePlanModal();
            }
          }
        ]
      );
    } catch (error) {
      console.error('Error creating calendar event:', error);
      Alert.alert('Error', 'Failed to create calendar event. Please try again.');
    }
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

      {/* Advanced Plan Your Date Modal */}
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

          <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
            {/* Starting Point */}
            <View style={styles.inputGroup}>
              <View style={styles.inputLabelContainer}>
                <ThemedText style={styles.inputLabel}>Starting Point</ThemedText>
                {startingPoint.address && (
                  <View style={styles.badge}>
                    <ThemedText style={styles.badgeText}>A</ThemedText>
                  </View>
                )}
              </View>
              <LocationSearch
                placeholder="Where are you starting from?"
                onPlaceSelected={handleStartPlaceSelected}
                value={startingPoint.address}
              />
            </View>

            {/* Destination */}
            <View style={styles.inputGroup}>
              <View style={styles.inputLabelContainer}>
                <ThemedText style={styles.inputLabel}>Destination</ThemedText>
                {destination.address && (
                  <View style={[styles.badge, styles.badgeBlue]}>
                    <ThemedText style={[styles.badgeText, styles.badgeTextBlue]}>B</ThemedText>
                  </View>
                )}
              </View>
              <LocationSearch
                placeholder="Where are you going?"
                onPlaceSelected={handleDestinationPlaceSelected}
                value={destination.address}
              />
            </View>

            {/* Metro Mode Toggle */}
            <View style={styles.metroToggleContainer}>
              <TouchableOpacity 
                style={[styles.metroButton, isMetroMode && styles.metroButtonActive]}
                onPress={() => setIsMetroMode(!isMetroMode)}
              >
                <IconSymbol name="tram" size={16} color={isMetroMode ? "#FFFFFF" : "#657786"} />
                <ThemedText style={[styles.metroButtonText, isMetroMode && styles.metroButtonTextActive]}>
                  {isMetroMode ? 'Metro mode enabled' : 'Using the metro?'}
                </ThemedText>
              </TouchableOpacity>
            </View>

            {/* Route Calculation Section */}
            {startingPoint.address && destination.address && (
              <View style={styles.routeSection}>
                <View style={styles.routeHeader}>
                  <ThemedText style={styles.routeTitle}>Route Information</ThemedText>
                  <TouchableOpacity style={styles.calculateButton} onPress={calculateRoute}>
                    <IconSymbol name="location" size={16} color="#FFFFFF" />
                    <ThemedText style={styles.calculateButtonText}>Calculate Route</ThemedText>
                  </TouchableOpacity>
                </View>

                {routeInfo && (
                  <View style={styles.routeInfo}>
                    <View style={styles.routeStats}>
                      <View style={styles.routeStat}>
                        <IconSymbol name="car" size={16} color="#f472b6" />
                        <ThemedText style={styles.routeStatLabel}>Distance:</ThemedText>
                        <ThemedText style={styles.routeStatValue}>{routeInfo.distance}</ThemedText>
                      </View>
                      <View style={styles.routeStat}>
                        <IconSymbol name="clock" size={16} color="#f472b6" />
                        <ThemedText style={styles.routeStatLabel}>Duration:</ThemedText>
                        <ThemedText style={styles.routeStatValue}>{routeInfo.duration}</ThemedText>
                      </View>
                    </View>

                    {navigationLink && (
                      <TouchableOpacity 
                        style={styles.navigationButton}
                        onPress={() => Linking.openURL(navigationLink)}
                      >
                        <IconSymbol name="location" size={16} color="#FFFFFF" />
                        <ThemedText style={styles.navigationButtonText}>Open in Google Maps</ThemedText>
                      </TouchableOpacity>
                    )}
                  </View>
                )}
              </View>
            )}

            {/* Nearby Places Section */}
            {destination.address && !showNearbyPlaces && (
              <View style={styles.nearbySection}>
                {isLoadingNearby ? (
                  <TouchableOpacity style={styles.loadingButton} disabled>
                    <View style={styles.loadingSpinner} />
                    <ThemedText style={styles.loadingText}>Finding nearby places...</ThemedText>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity style={styles.nearbyButton} onPress={fetchNearbyPlaces}>
                    <IconSymbol name="location" size={16} color="#f472b6" />
                    <ThemedText style={styles.nearbyButtonText}>Find nearby places</ThemedText>
                  </TouchableOpacity>
                )}
              </View>
            )}

            {/* Nearby Places List */}
            {showNearbyPlaces && nearbyPlaces.length > 0 && (
              <View style={styles.nearbyPlacesSection}>
                <ThemedText style={styles.nearbyPlacesTitle}>Nearby Places</ThemedText>
                <ScrollView style={styles.nearbyPlacesList} showsVerticalScrollIndicator={false}>
                  {nearbyPlaces.map((place) => (
                    <View key={place.place_id} style={styles.nearbyPlaceItem}>
                      <View style={styles.nearbyPlaceInfo}>
                        <ThemedText style={styles.nearbyPlaceName}>{place.name}</ThemedText>
                        <ThemedText style={styles.nearbyPlaceAddress}>{place.vicinity}</ThemedText>
                        <View style={styles.nearbyPlaceDetails}>
                          {place.rating && (
                            <ThemedText style={styles.nearbyPlaceRating}>⭐ {place.rating}</ThemedText>
                          )}
                          {place.price_level && (
                            <ThemedText style={styles.nearbyPlacePrice}>
                              {'$'.repeat(place.price_level)}
                            </ThemedText>
                          )}
                          <ThemedText style={styles.nearbyPlaceType}>
                            {place.types[0]?.replace(/_/g, ' ')}
                          </ThemedText>
                        </View>
                      </View>
                      <TouchableOpacity 
                        style={styles.addPlaceButton}
                        onPress={() => addPlaceToRoute(place)}
                      >
                        <IconSymbol name="plus" size={16} color="#FFFFFF" />
                      </TouchableOpacity>
                    </View>
                  ))}
                </ScrollView>
              </View>
            )}

            {/* Waypoints List */}
            {waypoints.length > 0 && (
              <View style={styles.waypointsSection}>
                <ThemedText style={styles.waypointsTitle}>Route Stops</ThemedText>
                {waypoints.map((waypoint) => (
                  <View key={waypoint.id} style={styles.waypointItem}>
                    <View style={styles.waypointInfo}>
                      <ThemedText style={styles.waypointName}>{waypoint.name}</ThemedText>
                      <ThemedText style={styles.waypointAddress}>{waypoint.address}</ThemedText>
                    </View>
                    <TouchableOpacity 
                      style={styles.removeWaypointButton}
                      onPress={() => removeWaypoint(waypoint.id)}
                    >
                      <IconSymbol name="xmark" size={16} color="#E0245E" />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}

            {/* Budget Input */}
            <View style={styles.inputGroup}>
              <ThemedText style={styles.inputLabel}>Budget (optional)</ThemedText>
              <TextInput
                style={styles.textInput}
                value={budget}
                onChangeText={setBudget}
                placeholder="e.g., $50-100"
                placeholderTextColor="#657786"
              />
            </View>

            {/* Confirm Button */}
            <TouchableOpacity 
              style={[styles.confirmButton, (!startingPoint.address || !destination.address) && styles.confirmButtonDisabled]}
              onPress={handleConfirm}
              disabled={!startingPoint.address || !destination.address}
            >
              <ThemedText style={styles.confirmButtonText}>Find Recommendations and ETA</ThemedText>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>

      {/* Date/Time Picker Modal */}
      {showDateTimePicker && (
        <Modal
          visible={showDateTimePicker}
          animationType="slide"
          presentationStyle="pageSheet"
          onRequestClose={() => setShowDateTimePicker(false)}
        >
          <View style={styles.dateTimeModalContainer}>
            <View style={styles.dateTimeHeader}>
              <ThemedText style={styles.dateTimeTitle}>When is your date?</ThemedText>
              <TouchableOpacity onPress={() => setShowDateTimePicker(false)} style={styles.closeButton}>
                <IconSymbol name="xmark" size={24} color="#657786" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.dateTimeContent}>
              <View style={styles.dateTimeInputGroup}>
                <ThemedText style={styles.dateTimeLabel}>Date</ThemedText>
                <TextInput
                  style={styles.dateTimeInput}
                  value={selectedDateTime ? selectedDateTime.toISOString().split('T')[0] : ''}
                  onChangeText={(text) => {
                    if (text) {
                      const date = new Date(text);
                      if (selectedDateTime) {
                        date.setHours(selectedDateTime.getHours());
                        date.setMinutes(selectedDateTime.getMinutes());
                      }
                      setSelectedDateTime(date);
                    }
                  }}
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor="#657786"
                />
              </View>

              <View style={styles.dateTimeInputGroup}>
                <ThemedText style={styles.dateTimeLabel}>Time</ThemedText>
                <TextInput
                  style={styles.dateTimeInput}
                  value={selectedDateTime ? selectedDateTime.toTimeString().slice(0, 5) : ''}
                  onChangeText={(text) => {
                    if (text && selectedDateTime) {
                      const [hours, minutes] = text.split(':').map(Number);
                      const newDate = new Date(selectedDateTime);
                      newDate.setHours(hours, minutes);
                      setSelectedDateTime(newDate);
                    } else if (text) {
                      const [hours, minutes] = text.split(':').map(Number);
                      const newDate = new Date();
                      newDate.setHours(hours, minutes);
                      setSelectedDateTime(newDate);
                    }
                  }}
                  placeholder="HH:MM"
                  placeholderTextColor="#657786"
                />
              </View>

              <View style={styles.datePlanSummary}>
                <ThemedText style={styles.datePlanTitle}>Your Date Plan:</ThemedText>
                <View style={styles.datePlanDetails}>
                  <ThemedText style={styles.datePlanItem}>📍 Start: {startingPoint.address}</ThemedText>
                  {waypoints.map((wp, i) => (
                    <ThemedText key={wp.id} style={styles.datePlanItem}>
                      📍 Stop {i + 1}: {wp.name}
                    </ThemedText>
                  ))}
                  <ThemedText style={styles.datePlanItem}>🎯 End: {destination.address}</ThemedText>
                  <ThemedText style={styles.datePlanItem}>🚇 Transport: {isMetroMode ? 'Metro' : 'Driving'}</ThemedText>
                </View>
              </View>

              <View style={styles.dateTimeButtons}>
                <TouchableOpacity 
                  style={styles.cancelDateTimeButton}
                  onPress={() => setShowDateTimePicker(false)}
                >
                  <ThemedText style={styles.cancelDateTimeButtonText}>Cancel</ThemedText>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.createEventButton, !selectedDateTime && styles.createEventButtonDisabled]}
                  onPress={createCalendarEvent}
                  disabled={!selectedDateTime}
                >
                  <IconSymbol name="calendar" size={16} color="#FFFFFF" />
                  <ThemedText style={styles.createEventButtonText}>Add to Calendar</ThemedText>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </Modal>
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
  // New Advanced Styles
  inputLabelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  badge: {
    backgroundColor: '#f472b6',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeBlue: {
    backgroundColor: '#1DA1F2',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  badgeTextBlue: {
    color: '#FFFFFF',
  },
  metroToggleContainer: {
    marginBottom: 20,
  },
  metroButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7F9FA',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E1E8ED',
    gap: 8,
  },
  metroButtonActive: {
    backgroundColor: '#1DA1F2',
    borderColor: '#1DA1F2',
  },
  metroButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#657786',
  },
  metroButtonTextActive: {
    color: '#FFFFFF',
  },
  routeSection: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E1E8ED',
  },
  routeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  routeTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#14171A',
  },
  calculateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f472b6',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    gap: 6,
  },
  calculateButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  routeInfo: {
    gap: 12,
  },
  routeStats: {
    flexDirection: 'row',
    gap: 16,
  },
  routeStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  routeStatLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#657786',
  },
  routeStatValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#14171A',
  },
  navigationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#10B981',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 6,
    gap: 6,
  },
  navigationButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  nearbySection: {
    marginBottom: 20,
  },
  nearbyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7F9FA',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E1E8ED',
    gap: 8,
  },
  nearbyButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#f472b6',
  },
  loadingButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7F9FA',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E1E8ED',
    gap: 8,
  },
  loadingSpinner: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#f472b6',
    borderTopColor: 'transparent',
  },
  loadingText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#657786',
  },
  nearbyPlacesSection: {
    marginBottom: 20,
  },
  nearbyPlacesTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#14171A',
    marginBottom: 12,
  },
  nearbyPlacesList: {
    maxHeight: 200,
  },
  nearbyPlaceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 12,
    marginBottom: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E1E8ED',
  },
  nearbyPlaceInfo: {
    flex: 1,
  },
  nearbyPlaceName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#14171A',
    marginBottom: 2,
  },
  nearbyPlaceAddress: {
    fontSize: 12,
    color: '#657786',
    marginBottom: 4,
  },
  nearbyPlaceDetails: {
    flexDirection: 'row',
    gap: 8,
  },
  nearbyPlaceRating: {
    fontSize: 10,
    color: '#F59E0B',
  },
  nearbyPlacePrice: {
    fontSize: 10,
    color: '#10B981',
  },
  nearbyPlaceType: {
    fontSize: 10,
    color: '#657786',
  },
  addPlaceButton: {
    backgroundColor: '#f472b6',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  waypointsSection: {
    marginBottom: 20,
  },
  waypointsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#14171A',
    marginBottom: 12,
  },
  waypointItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7F9FA',
    padding: 12,
    marginBottom: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E1E8ED',
  },
  waypointInfo: {
    flex: 1,
  },
  waypointName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#14171A',
    marginBottom: 2,
  },
  waypointAddress: {
    fontSize: 12,
    color: '#657786',
  },
  removeWaypointButton: {
    backgroundColor: '#FEE2E2',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  confirmButtonDisabled: {
    backgroundColor: '#E1E8ED',
  },
  // Date/Time Picker Modal Styles
  dateTimeModalContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  dateTimeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E1E8ED',
  },
  dateTimeTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#14171A',
  },
  dateTimeContent: {
    flex: 1,
    padding: 20,
  },
  dateTimeInputGroup: {
    marginBottom: 20,
  },
  dateTimeLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#14171A',
    marginBottom: 8,
  },
  dateTimeInput: {
    backgroundColor: '#F7F9FA',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: '#14171A',
    borderWidth: 1,
    borderColor: '#E1E8ED',
  },
  datePlanSummary: {
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E1E8ED',
  },
  datePlanTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#14171A',
    marginBottom: 8,
  },
  datePlanDetails: {
    gap: 4,
  },
  datePlanItem: {
    fontSize: 12,
    color: '#657786',
  },
  dateTimeButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelDateTimeButton: {
    flex: 1,
    backgroundColor: '#F7F9FA',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E1E8ED',
  },
  cancelDateTimeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#657786',
  },
  createEventButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f472b6',
    paddingVertical: 16,
    borderRadius: 8,
    justifyContent: 'center',
    gap: 8,
  },
  createEventButtonDisabled: {
    backgroundColor: '#E1E8ED',
  },
  createEventButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
