import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { Ionicons } from '@expo/vector-icons';

const HomeScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const { user, logout } = useAuth();

  // Mock data for recent donations and nearby requests
  const recentDonations = [
    { id: 1, date: 'May 15, 2023', location: 'Central Blood Bank', type: 'Whole Blood' },
    { id: 2, date: 'Jan 10, 2023', location: 'City Hospital', type: 'Plasma' },
  ];

  const nearbyRequests = [
    { id: 1, bloodType: 'O+', hospital: 'General Hospital', distance: '2.5 km', urgency: 'High' },
    { id: 2, bloodType: 'AB-', hospital: 'Children\'s Medical Center', distance: '4.2 km', urgency: 'Critical' },
    { id: 3, bloodType: 'B+', hospital: 'University Hospital', distance: '5.8 km', urgency: 'Medium' },
  ];

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Welcome Section */}
      <View style={styles.welcomeSection}>
        <Text style={[styles.welcomeText, { color: theme.colors.text }]}>
          Welcome{user ? `, ${user.firstName || 'User'}` : ''}!
        </Text>
        <Text style={[styles.subText, { color: theme.colors.textSecondary }]}>
          Thank you for helping save lives
        </Text>
      </View>

      {/* Quick Actions */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity 
          style={[styles.actionButton, { backgroundColor: theme.colors.primary }]}
          onPress={() => navigation.navigate('Donate')}
        >
          <Ionicons name="water" size={24} color={theme.colors.white} />
          <Text style={[styles.actionText, { color: theme.colors.white }]}>Donate Blood</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.actionButton, { backgroundColor: theme.colors.error }]}
          onPress={() => navigation.navigate('Requests')}
        >
          <Ionicons name="alert-circle" size={24} color={theme.colors.white} />
          <Text style={[styles.actionText, { color: theme.colors.white }]}>Request Blood</Text>
        </TouchableOpacity>
      </View>

      {/* Nearby Requests Section */}
      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Nearby Blood Requests</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Requests')}>
            <Text style={[styles.seeAllText, { color: theme.colors.primary }]}>See All</Text>
          </TouchableOpacity>
        </View>

        {nearbyRequests.map(request => (
          <TouchableOpacity 
            key={request.id}
            style={[styles.requestCard, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}
            onPress={() => console.log('View request details')}
          >
            <View style={[styles.bloodTypeBadge, { 
              backgroundColor: request.urgency === 'Critical' ? theme.colors.error : theme.colors.primary 
            }]}>
              <Text style={[styles.bloodTypeText, { color: theme.colors.white }]}>{request.bloodType}</Text>
            </View>
            <View style={styles.requestInfo}>
              <Text style={[styles.hospitalName, { color: theme.colors.text }]}>{request.hospital}</Text>
              <Text style={[styles.requestDetails, { color: theme.colors.textSecondary }]}>
                {request.distance} • {request.urgency} Urgency
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.colors.textSecondary} />
          </TouchableOpacity>
        ))}
      </View>

      {/* Recent Donations Section */}
      {recentDonations.length > 0 && (
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Your Recent Donations</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
              <Text style={[styles.seeAllText, { color: theme.colors.primary }]}>See All</Text>
            </TouchableOpacity>
          </View>

          {recentDonations.map(donation => (
            <View 
              key={donation.id}
              style={[styles.donationCard, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}
            >
              <Ionicons name="calendar" size={24} color={theme.colors.primary} style={styles.donationIcon} />
              <View style={styles.donationInfo}>
                <Text style={[styles.donationDate, { color: theme.colors.text }]}>{donation.date}</Text>
                <Text style={[styles.donationDetails, { color: theme.colors.textSecondary }]}>
                  {donation.location} • {donation.type}
                </Text>
              </View>
            </View>
          ))}
        </View>
      )}

      {/* Eligibility Check Button */}
      <TouchableOpacity 
        style={[styles.eligibilityButton, { borderColor: theme.colors.primary }]}
        onPress={() => console.log('Check eligibility')}
      >
        <Ionicons name="checkmark-circle" size={24} color={theme.colors.primary} />
        <Text style={[styles.eligibilityText, { color: theme.colors.primary }]}>Check Your Donation Eligibility</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  welcomeSection: {
    padding: 20,
    paddingBottom: 10,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  subText: {
    fontSize: 16,
    marginTop: 5,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 8,
    flex: 0.48,
  },
  actionText: {
    marginLeft: 8,
    fontWeight: 'bold',
  },
  sectionContainer: {
    padding: 20,
    paddingTop: 10,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '500',
  },
  requestCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
  },
  bloodTypeBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  bloodTypeText: {
    fontWeight: 'bold',
  },
  requestInfo: {
    flex: 1,
  },
  hospitalName: {
    fontWeight: '500',
    fontSize: 16,
    marginBottom: 4,
  },
  requestDetails: {
    fontSize: 14,
  },
  donationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
  },
  donationIcon: {
    marginRight: 15,
  },
  donationInfo: {
    flex: 1,
  },
  donationDate: {
    fontWeight: '500',
    fontSize: 16,
    marginBottom: 4,
  },
  donationDetails: {
    fontSize: 14,
  },
  eligibilityButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 8,
    borderWidth: 2,
    margin: 20,
  },
  eligibilityText: {
    marginLeft: 8,
    fontWeight: 'bold',
  },
});

export default HomeScreen;