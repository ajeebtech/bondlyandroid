import { IconSymbol } from '@/components/ui/icon-symbol';
import axios from 'axios';
import Constants from 'expo-constants';
import React, { useEffect, useRef, useState } from 'react';
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface PlacePrediction {
  place_id: string;
  description: string;
  structured_formatting: {
    main_text: string;
    secondary_text: string;
  };
}

interface GooglePlacesAutocompleteProps {
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  onPlaceSelect: (place: PlacePrediction) => void;
  style?: any;
}

export default function GooglePlacesAutocomplete({
  placeholder,
  value,
  onChangeText,
  onPlaceSelect,
  style
}: GooglePlacesAutocompleteProps) {
  const [predictions, setPredictions] = useState<PlacePrediction[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const GOOGLE_PLACES_API_KEY = Constants.expoConfig?.extra?.googleMapsApiKey || 'YOUR_GOOGLE_MAPS_API_KEY';

  const searchPlaces = async (query: string) => {
    if (!query || query.length < 2) {
      setPredictions([]);
      setShowSuggestions(false);
      return;
    }

    // Check if API key is properly set
    if (GOOGLE_PLACES_API_KEY === 'YOUR_GOOGLE_MAPS_API_KEY') {
      console.log('⚠️ Google Maps API Key not set! Using mock data for testing.');
      // Use mock data for testing
      const mockPredictions: PlacePrediction[] = [
        {
          place_id: 'mock1',
          description: `${query}, City Center`,
          structured_formatting: {
            main_text: `${query}`,
            secondary_text: 'City Center, Downtown'
          }
        },
        {
          place_id: 'mock2', 
          description: `${query} Coffee Shop`,
          structured_formatting: {
            main_text: `${query} Coffee Shop`,
            secondary_text: 'Main Street, Downtown'
          }
        },
        {
          place_id: 'mock3',
          description: `${query} Park`,
          structured_formatting: {
            main_text: `${query} Park`,
            secondary_text: 'Green District'
          }
        },
        {
          place_id: 'mock4',
          description: `${query} Restaurant`,
          structured_formatting: {
            main_text: `${query} Restaurant`,
            secondary_text: 'Food District'
          }
        },
        {
          place_id: 'mock5',
          description: `${query} Shopping Center`,
          structured_formatting: {
            main_text: `${query} Shopping Center`,
            secondary_text: 'Retail District'
          }
        }
      ];
      setPredictions(mockPredictions);
      setShowSuggestions(true);
      return;
    }

    setIsLoading(true);
    
    try {
      console.log('🔍 Searching for places:', query);
      console.log('🔑 Using API Key:', GOOGLE_PLACES_API_KEY.substring(0, 10) + '...');
      
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/place/autocomplete/json`,
        {
          params: {
            input: query,
            key: GOOGLE_PLACES_API_KEY,
            language: 'en',
            // Removed types restriction to get all places
          },
        }
      );

      console.log('📡 API Response:', response.data.status);
      
      if (response.data.status === 'OK') {
        setPredictions(response.data.predictions);
        setShowSuggestions(true);
        console.log('✅ Found', response.data.predictions.length, 'places');
      } else {
        console.log('❌ Google Places API Error:', response.data.status);
        console.log('💡 Make sure Places API is enabled in Google Cloud Console');
        setPredictions([]);
        setShowSuggestions(false);
      }
    } catch (error) {
      console.log('❌ Error fetching places:', error);
      setPredictions([]);
      setShowSuggestions(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTextChange = (text: string) => {
    onChangeText(text);
    
    // Clear previous timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    // Debounce the search
    timeoutRef.current = setTimeout(() => {
      searchPlaces(text);
    }, 300);
  };

  const handlePlaceSelect = (place: PlacePrediction) => {
    onChangeText(place.description);
    onPlaceSelect(place);
    setShowSuggestions(false);
    setPredictions([]);
  };

  const renderSuggestion = ({ item }: { item: PlacePrediction }) => (
    <TouchableOpacity
      style={styles.suggestionItem}
      onPress={() => handlePlaceSelect(item)}
    >
      <IconSymbol name="location.fill" size={16} color="#657786" />
      <View style={styles.suggestionText}>
        <Text style={styles.mainText}>{item.structured_formatting.main_text}</Text>
        <Text style={styles.secondaryText}>{item.structured_formatting.secondary_text}</Text>
      </View>
    </TouchableOpacity>
  );

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <View style={[styles.container, style]}>
      <View style={styles.inputContainer}>
        <IconSymbol name="magnifyingglass" size={16} color="#657786" style={styles.searchIcon} />
        <TextInput
          style={styles.textInput}
          placeholder={placeholder}
          placeholderTextColor="#657786"
          value={value}
          onChangeText={handleTextChange}
          onFocus={() => {
            if (predictions.length > 0) {
              setShowSuggestions(true);
            }
          }}
          onBlur={() => {
            // Delay hiding suggestions to allow for onPress
            setTimeout(() => setShowSuggestions(false), 200);
          }}
        />
        {isLoading && (
          <IconSymbol name="arrow.clockwise" size={16} color="#657786" />
        )}
      </View>
      
      {showSuggestions && predictions.length > 0 && (
        <View style={styles.suggestionsContainer}>
          <FlatList
            data={predictions}
            renderItem={renderSuggestion}
            keyExtractor={(item) => item.place_id}
            style={styles.suggestionsList}
            keyboardShouldPersistTaps="handled"
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E1E8ED',
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: '#14171A',
  },
  suggestionsContainer: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E1E8ED',
    marginTop: 4,
    maxHeight: 200,
    zIndex: 1000,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  suggestionsList: {
    maxHeight: 200,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F7F9FA',
  },
  suggestionText: {
    marginLeft: 8,
    flex: 1,
  },
  mainText: {
    fontSize: 16,
    color: '#14171A',
    fontWeight: '500',
  },
  secondaryText: {
    fontSize: 14,
    color: '#657786',
    marginTop: 2,
  },
});
