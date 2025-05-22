import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
  Alert,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { useUserData } from '../../contexts/UserDataContext';
import { useAuth } from '../../contexts/AuthContext';
import * as bloodGroups from '../../utils/bloodGroups';

const DonorDetailScreen = ({ navigation, route }) => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const { getDonorDetails, checkBloodCompatibility, loading } = useUserData();
  
  const [donor, setDonor] = useState(route.params?.donor || null);
  const [donorDetails, setDonorDetails] = useState(null);
  const [isCompatible, setIsCompatible] = useState(false);
  
  // Load donor details when component mounts
  useEffect(() => {
    const fetchDonorDetails = async () => {
      if (donor) {
        try {
          const details = await getDonorDetails(donor.id);
          setDonorDetails(details);
          
          // Check blood compatibility if user is logged in
          if (user && user.bloodType) {
            const compatible = checkBloodCompatibility(donor.bloodType, user.bloodType);
            setIsCompatible(compatible);
          }
        } catch (error) {
          console.error('Error fetching donor details:', error);
          Alert.alert('Error', 'Failed to load donor details. Please try again.');
        }
      }
    };
    
    fetchDonorDetails();
  }, [donor, user]);

  // Handle contact donor
  const handleContactDonor = () => {
    if (!donor) return;
    
    Alert.alert(
      'Contact Donor',
      'How would you like to contact this donor?',
      [
        {
          text: 'Call',
          onPress: () => {
            if (donor.phone) {
              Linking.openURL(`tel:${donor.phone}`);
            } else {
              Alert.alert('Error', 'Phone number not available');
            }
          },
        },
        {
          text: 'Message',
          onPress: () => {
            if (donor.phone) {
              Linking.openURL(`sms:${donor.phone}`);
            } else {
              Alert.alert('Error', 'Phone number not available');
            }
          },
        },
        {
          text: 'Email',
          onPress: () => {
            if (donor.email) {
              Linking.openURL(`mailto:${donor.email}`);
            } else {
              Alert.alert('Error', 'Email not available');
            }
          },
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ]
    );
  };

  // Handle request blood
  const handleRequestBlood = () => {
    navigation.navigate('CreateRequest', {
      bloodType: donor.bloodType,
    });
  };

  if (loading || !donor) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Donor Header */}
      <View style={[styles.header, { backgroundColor: theme.colors.primary }]}>
        <View style={styles.profileImageContainer}>
          <Image 
            source={{ uri: donor.profileImage || 'https://via.placeholder.com/150' }} 
            style={styles.profileImage}
          />
        </View>
        
        <Text style={[styles.donorName, { color: theme.colors.white }]}>
          {donor.firstName} {donor.lastName}
        </Text>
        
        <View style={styles.bloodTypeContainer}>
          <View style={[styles.bloodTypeBadge, { backgroundColor: theme.colors.white }]}>
            <Text style={[styles.bloodTypeText, { color: theme.colors.primary }]}>
              {donor.bloodType}
            </Text>
          </View>
          
          {isCompatible && (
            <View style={[styles.compatibilityBadge, { backgroundColor: theme.colors.success }]}>
              <Text style={[styles.compatibilityText, { color: theme.colors.white }]}>
                Compatible
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* Donor Information */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          Donor Information
        </Text>
        
        <View style={styles.infoRow}>
          <Ionicons name="location-outline" size={20} color={theme.colors.primary} />
          <Text style={[styles.infoLabel, { color: theme.colors.textSecondary }]}>Location:</Text>
          <Text style={[styles.infoValue, { color: theme.colors.text }]}>
            {donor.location || 'Not specified'}
          </Text>
        </View>
        
        <View style={styles.infoRow}>
          <Ionicons name="time-outline" size={20} color={theme.colors.primary} />
          <Text style={[styles.infoLabel, { color: theme.colors.textSecondary }]}>Last Donation:</Text>
          <Text style={[styles.infoValue, { color: theme.colors.text }]}>
            {donor.lastDonation || 'No recent donations'}
          </Text>
        </View>
        
        <View style={styles.infoRow}>
          <Ionicons name="water-outline" size={20} color={theme.colors.primary} />
          <Text style={[styles.infoLabel, { color: theme.colors.textSecondary }]}>Blood Type:</Text>
          <Text style={[styles.infoValue, { color: theme.colors.text }]}>
            {donor.bloodType} ({bloodGroups.getBloodGroupDescription(donor.bloodType)})
          </Text>
        </View>
        
        <View style={styles.infoRow}>
          <Ionicons name="fitness-outline" size={20} color={theme.colors.primary} />
          <Text style={[styles.infoLabel, { color: theme.colors.textSecondary }]}>Donations:</Text>
          <Text style={[styles.infoValue, { color: theme.colors.text }]}>
            {donorDetails?.totalDonations || 0} donations made
          </Text>
        </View>
      </View>

      {/* Blood Compatibility */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          Blood Compatibility
        </Text>
        
        <Text style={[styles.compatibilityDescription, { color: theme.colors.textSecondary }]}>
          This donor with blood type {donor.bloodType} can donate to:
        </Text>
        
        <View style={styles.compatibilityList}>
          {bloodGroups.getCompatibleRecipients(donor.bloodType).map(bloodType => (
            <View 
              key={bloodType} 
              style={[styles.compatibilityBadge, { backgroundColor: theme.colors.primary }]}
            >
              <Text style={[styles.compatibilityText, { color: theme.colors.white }]}>
                {bloodType}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* Donation History */}
      {donorDetails?.recentDonations && donorDetails.recentDonations.length > 0 && (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Recent Donations
          </Text>
          
          {donorDetails.recentDonations.map((donation, index) => (
            <View 
              key={index}
              style={[styles.donationCard, { borderColor: theme.colors.border }]}
            >
              <View style={styles.donationHeader}>
                <Text style={[styles.donationType, { color: theme.colors.text }]}>
                  {donation.type}
                </Text>
                <Text style={[styles.donationDate, { color: theme.colors.textSecondary }]}>
                  {donation.date}
                </Text>
              </View>
              <Text style={[styles.donationLocation, { color: theme.colors.textSecondary }]}>
                {donation.location}
              </Text>
            </View>
          ))}
        </View>
      )}

      {/* Action Buttons */}
      <View style={styles.actionContainer}>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: theme.colors.primary }]}
          onPress={handleContactDonor}
        >
          <Ionicons name="call-outline" size={20} color={theme.colors.white} />
          <Text style={[styles.actionButtonText, { color: theme.colors.white }]}>
            Contact Donor
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: theme.colors.error }]}
          onPress={handleRequestBlood}
        >
          <Ionicons name="water-outline" size={20} color={theme.colors.white} />
          <Text style={[styles.actionButtonText, { color: theme.colors.white }]}>
            Request Blood
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    alignItems: 'center',
  },
  profileImageContainer: {
    marginBottom: 16,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: 'white',
  },
  donorName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  bloodTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bloodTypeBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  bloodTypeText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  compatibilityBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  compatibilityText: {
    fontSize: 12,
    fontWeight: '500',
  },
  section: {
    padding: 16,
    marginHorizontal: 16,
    marginTop: 16,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: '#EEEEEE',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 14,
    marginLeft: 8,
    marginRight: 8,
    width: 100,
  },
  infoValue: {
    fontSize: 14,
    flex: 1,
  },
  compatibilityDescription: {
    fontSize: 14,
    marginBottom: 12,
  },
  compatibilityList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  donationCard: {
    padding: 12,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 8,
  },
  donationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  donationType: {
    fontWeight: '500',
  },
  donationDate: {
    fontSize: 12,
  },
  donationLocation: {
    fontSize: 12,
  },
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    marginBottom: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    flex: 0.48,
  },
  actionButtonText: {
    marginLeft: 8,
    fontWeight: 'bold',
  },
});

export default DonorDetailScreen;