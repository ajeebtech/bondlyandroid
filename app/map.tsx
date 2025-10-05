import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import * as Location from 'expo-location';
import { router } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Alert, Animated, Dimensions, StyleSheet, TouchableOpacity, View } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

const { width, height } = Dimensions.get('window');

export default function MapScreen() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [mapRegion, setMapRegion] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  // Animation values
  const headerTranslateY = useRef(new Animated.Value(-100)).current;
  const locationInfoOpacity = useRef(new Animated.Value(0)).current;
  const locationInfoTranslateY = useRef(new Animated.Value(50)).current;
  const centerButtonScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Entrance animations
    Animated.parallel([
      Animated.timing(headerTranslateY, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(locationInfoOpacity, {
        toValue: 1,
        duration: 800,
        delay: 300,
        useNativeDriver: true,
      }),
      Animated.timing(locationInfoTranslateY, {
        toValue: 0,
        duration: 800,
        delay: 300,
        useNativeDriver: true,
      }),
    ]).start();

    // Get location
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
      setMapRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    })();
  }, []);

  const centerOnUser = async () => {
    // Button press animation
    Animated.sequence([
      Animated.timing(centerButtonScale, {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(centerButtonScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location permission is required to show your location on the map.');
        return;
      }

      let currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);
      setMapRegion({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    } catch (error) {
      Alert.alert('Error', 'Unable to get your current location.');
    }
  };

  return (
    <ThemedView style={styles.container}>
      {/* Animated Header */}
      <Animated.View 
        style={[
          styles.header,
          {
            transform: [{ translateY: headerTranslateY }]
          }
        ]}
      >
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <IconSymbol name="chevron.left" size={24} color="#f472b6" />
        </TouchableOpacity>
        <ThemedText style={styles.title}>My Location</ThemedText>
        <Animated.View style={{ transform: [{ scale: centerButtonScale }] }}>
          <TouchableOpacity onPress={centerOnUser} style={styles.centerButton}>
            <IconSymbol name="location.fill" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>

      {/* Map */}
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        region={mapRegion}
        showsUserLocation={true}
        showsMyLocationButton={false}
        followsUserLocation={true}
        mapType="standard"
        showsCompass={true}
        showsScale={true}
      >
        {location && (
          <Marker
            coordinate={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            }}
            title="You are here"
            description="Your current location"
          />
        )}
      </MapView>

      {/* Animated Location Info */}
      {location && (
        <Animated.View 
          style={[
            styles.locationInfo,
            {
              opacity: locationInfoOpacity,
              transform: [{ translateY: locationInfoTranslateY }]
            }
          ]}
        >
          <View style={styles.locationHeader}>
            <IconSymbol name="location.fill" size={16} color="#f472b6" />
            <ThemedText style={styles.locationTitle}>Current Location</ThemedText>
          </View>
          <ThemedText style={styles.locationText}>
            {location.coords.latitude.toFixed(6)}, {location.coords.longitude.toFixed(6)}
          </ThemedText>
        </Animated.View>
      )}

      {errorMsg && (
        <Animated.View 
          style={[
            styles.errorContainer,
            {
              opacity: locationInfoOpacity,
              transform: [{ translateY: locationInfoTranslateY }]
            }
          ]}
        >
          <IconSymbol name="exclamationmark.triangle.fill" size={20} color="#E0245E" />
          <ThemedText style={styles.errorText}>{errorMsg}</ThemedText>
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
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F7F9FA',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E1E8ED',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#14171A',
    letterSpacing: -0.5,
  },
  centerButton: {
    backgroundColor: '#f472b6',
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#f472b6',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  map: {
    flex: 1,
  },
  locationInfo: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#E1E8ED',
  },
  locationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  locationTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#f472b6',
    marginLeft: 6,
  },
  locationText: {
    fontSize: 13,
    color: '#657786',
    fontFamily: 'monospace',
    letterSpacing: 0.5,
  },
  errorContainer: {
    position: 'absolute',
    top: 120,
    left: 20,
    right: 20,
    backgroundColor: '#FFE6E6',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FF6B6B',
    flexDirection: 'row',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 14,
    color: '#E0245E',
    marginLeft: 8,
    fontWeight: '500',
  },
});
