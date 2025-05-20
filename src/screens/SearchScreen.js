import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  FlatList, 
  ActivityIndicator,
  Image
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import * as userAPI from '../api/userAPI';

const BLOOD_TYPES = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const SearchScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBloodType, setSelectedBloodType] = useState(null);
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showMap, setShowMap] = useState(false);

  // Load donors when blood type changes
  useEffect(() => {
    const fetchDonors = async () => {
      if (selectedBloodType) {
        setLoading(true);
        try {
          const nearbyDonors = await userAPI.getNearbyDonors(selectedBloodType);
          setDonors(nearbyDonors);
        } catch (error) {
          console.error('Error fetching donors:', error);
        } finally {
          setLoading(false);
        }
      } else {
        // Clear donors if no blood type is selected
        setDonors([]);
      }
    };

    fetchDonors();
  }, [selectedBloodType]);

  const handleSearch = async () => {
    setLoading(true);
    try {
      // In a real app, this would search by name, location, etc.
      // For now, we'll just use the mock data
      const allDonors = await userAPI.getNearbyDonors();
      
      // Filter by search query if provided
      if (searchQuery) {
        const filteredDonors = allDonors.filter(donor => 
          `${donor.firstName} ${donor.lastName}`.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setDonors(filteredDonors);
      } else {
        setDonors(allDonors);
      }
    } catch (error) {
      console.error('Error searching donors:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderBloodTypeButton = (bloodType) => {
    const isSelected = selectedBloodType === bloodType;
    
    return (
      <TouchableOpacity
        key={bloodType}
        style={[
          styles.bloodTypeButton,
          { borderColor: theme.colors.primary },
          isSelected && { backgroundColor: theme.colors.primary }
        ]}
        onPress={() => setSelectedBloodType(isSelected ? null : bloodType)}
      >
        <Text
          style={[
            styles.bloodTypeText,
            { color: isSelected ? theme.colors.white : theme.colors.primary }
          ]}
        >
          {bloodType}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderDonorItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.donorCard, { borderColor: theme.colors.border }]}
      onPress={() => navigation.navigate('DonorDetail', { donor: item })}
    >
      <View style={styles.donorInfo}>
        <Text style={[styles.donorName, { color: theme.colors.text }]}>
          {item.firstName} {item.lastName}
        </Text>
        <Text style={[styles.donorDetails, { color: theme.colors.textSecondary }]}>
          {item.distance} • Last donation: {item.lastDonation}
        </Text>
      </View>
      <View style={[styles.bloodTypeBadge, { backgroundColor: theme.colors.primary }]}>
        <Text style={[styles.bloodTypeBadgeText, { color: theme.colors.white }]}>
          {item.bloodType}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <Ionicons 
        name="search-outline" 
        size={64} 
        color={theme.colors.textSecondary} 
      />
      <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
        {selectedBloodType 
          ? `No donors found with blood type ${selectedBloodType}` 
          : 'Select a blood type or search by name'}
      </Text>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Search Bar */}
      <View style={[styles.searchContainer, { backgroundColor: theme.colors.surface }]}>
        <TextInput
          style={[styles.searchInput, { color: theme.colors.text }]}
          placeholder="Search donors by name"
          placeholderTextColor={theme.colors.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={handleSearch}
        />
        <TouchableOpacity 
          style={[styles.searchButton, { backgroundColor: theme.colors.primary }]}
          onPress={handleSearch}
        >
          <Ionicons name="search" size={24} color={theme.colors.white} />
        </TouchableOpacity>
      </View>

      {/* Blood Type Filter */}
      <View style={styles.bloodTypeContainer}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          Filter by Blood Type
        </Text>
        <View style={styles.bloodTypeList}>
          {BLOOD_TYPES.map(renderBloodTypeButton)}
        </View>
      </View>

      {/* View Toggle */}
      <View style={styles.viewToggleContainer}>
        <TouchableOpacity
          style={[
            styles.viewToggleButton,
            !showMap && { backgroundColor: theme.colors.primary },
            { borderColor: theme.colors.primary }
          ]}
          onPress={() => setShowMap(false)}
        >
          <Text
            style={[
              styles.viewToggleText,
              { color: !showMap ? theme.colors.white : theme.colors.primary }
            ]}
          >
            List View
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.viewToggleButton,
            showMap && { backgroundColor: theme.colors.primary },
            { borderColor: theme.colors.primary }
          ]}
          onPress={() => setShowMap(true)}
        >
          <Text
            style={[
              styles.viewToggleText,
              { color: showMap ? theme.colors.white : theme.colors.primary }
            ]}
          >
            Map View
          </Text>
        </TouchableOpacity>
      </View>

      {/* Results */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={[styles.loadingText, { color: theme.colors.textSecondary }]}>
            Searching for donors...
          </Text>
        </View>
      ) : showMap ? (
        <View style={styles.mapContainer}>
          <Text style={[styles.mapPlaceholder, { color: theme.colors.textSecondary }]}>
            Map view will be implemented in a future update
          </Text>
          <Ionicons name="map-outline" size={64} color={theme.colors.textSecondary} />
        </View>
      ) : (
        <FlatList
          data={donors}
          renderItem={renderDonorItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.donorList}
          ListEmptyComponent={renderEmptyList}
        />
      )}

      {/* Create Request Button */}
      <TouchableOpacity
        style={[styles.createRequestButton, { backgroundColor: theme.colors.primary }]}
        onPress={() => navigation.navigate('CreateRequest')}
      >
        <Ionicons name="add-circle-outline" size={24} color={theme.colors.white} />
        <Text style={[styles.createRequestText, { color: theme.colors.white }]}>
          Create Blood Request
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    borderRadius: 8,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  searchInput: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
  searchButton: {
    padding: 12,
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bloodTypeContainer: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  bloodTypeList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  bloodTypeButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 8,
    marginBottom: 8,
  },
  bloodTypeText: {
    fontWeight: '500',
  },
  viewToggleContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  viewToggleButton: {
    flex: 1,
    paddingVertical: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  viewToggleText: {
    fontWeight: '500',
  },
  donorList: {
    flexGrow: 1,
  },
  donorCard: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 12,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  donorInfo: {
    flex: 1,
  },
  donorName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  donorDetails: {
    fontSize: 14,
  },
  bloodTypeBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bloodTypeBadgeText: {
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  mapContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  mapPlaceholder: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
  },
  createRequestButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 8,
    marginTop: 16,
  },
  createRequestText: {
    marginLeft: 8,
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default SearchScreen;