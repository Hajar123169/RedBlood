import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { useDonation } from '../../contexts/DonationContext';
import { useAuth } from '../../contexts/AuthContext';
import { Calendar } from 'react-native-calendars';

const DonationScheduleScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const { 
    donationCenters, 
    loading, 
    error, 
    fetchDonationCenters, 
    scheduleDonation,
    checkEligibility 
  } = useDonation();
  
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedCenter, setSelectedCenter] = useState(null);
  const [step, setStep] = useState(1); // 1: Date, 2: Center, 3: Confirm
  const [eligibilityChecked, setEligibilityChecked] = useState(false);
  const [isEligible, setIsEligible] = useState(false);
  const [eligibilityMessage, setEligibilityMessage] = useState('');

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split('T')[0];
  
  // Load donation centers when component mounts
  useEffect(() => {
    fetchDonationCenters();
  }, []);

  // Check eligibility when user data is available
  useEffect(() => {
    if (user && !eligibilityChecked) {
      handleEligibilityCheck();
    }
  }, [user]);

  // Handle eligibility check
  const handleEligibilityCheck = async () => {
    try {
      const eligibility = await checkEligibility({
        userId: user.id,
        bloodType: user.bloodType,
      });
      
      setIsEligible(eligibility.eligible);
      setEligibilityMessage(eligibility.message);
      setEligibilityChecked(true);
      
      if (!eligibility.eligible) {
        Alert.alert(
          'Eligibility Check',
          eligibility.message,
          [{ text: 'OK', onPress: () => navigation.goBack() }]
        );
      }
    } catch (error) {
      console.error('Error checking eligibility:', error);
      Alert.alert(
        'Error',
        'Failed to check eligibility. Please try again.',
        [{ text: 'OK' }]
      );
    }
  };

  // Handle date selection
  const handleDateSelect = (date) => {
    setSelectedDate(date.dateString);
    setStep(2);
  };

  // Handle center selection
  const handleCenterSelect = (center) => {
    setSelectedCenter(center);
    setStep(3);
  };

  // Handle donation scheduling
  const handleScheduleDonation = async () => {
    if (!selectedDate || !selectedCenter) {
      Alert.alert('Error', 'Please select both date and donation center');
      return;
    }

    try {
      await scheduleDonation({
        date: selectedDate,
        centerId: selectedCenter.id,
        donationType: 'Whole Blood', // Default type
      });
      
      Alert.alert(
        'Success',
        'Donation scheduled successfully!',
        [{ text: 'OK', onPress: () => navigation.navigate('Donations') }]
      );
    } catch (error) {
      console.error('Error scheduling donation:', error);
      Alert.alert(
        'Error',
        'Failed to schedule donation. Please try again.',
        [{ text: 'OK' }]
      );
    }
  };

  // Render donation center item
  const renderCenterItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.centerCard,
        { 
          borderColor: theme.colors.border,
          backgroundColor: selectedCenter?.id === item.id 
            ? `${theme.colors.primary}20` 
            : theme.colors.card 
        }
      ]}
      onPress={() => handleCenterSelect(item)}
    >
      <View style={styles.centerInfo}>
        <Text style={[styles.centerName, { color: theme.colors.text }]}>
          {item.name}
        </Text>
        <Text style={[styles.centerAddress, { color: theme.colors.textSecondary }]}>
          {item.address}
        </Text>
        <View style={styles.centerDetails}>
          <View style={styles.detailItem}>
            <Ionicons name="time-outline" size={16} color={theme.colors.textSecondary} />
            <Text style={[styles.detailText, { color: theme.colors.textSecondary }]}>
              {item.hours}
            </Text>
          </View>
          <View style={styles.detailItem}>
            <Ionicons name="call-outline" size={16} color={theme.colors.textSecondary} />
            <Text style={[styles.detailText, { color: theme.colors.textSecondary }]}>
              {item.phone}
            </Text>
          </View>
        </View>
      </View>
      <Ionicons 
        name={selectedCenter?.id === item.id ? "checkmark-circle" : "chevron-forward"} 
        size={24} 
        color={selectedCenter?.id === item.id ? theme.colors.primary : theme.colors.textSecondary} 
      />
    </TouchableOpacity>
  );

  // Render loading indicator
  if (loading && !eligibilityChecked) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={[styles.loadingText, { color: theme.colors.textSecondary }]}>
          Checking eligibility...
        </Text>
      </View>
    );
  }

  // Render eligibility message if not eligible
  if (eligibilityChecked && !isEligible) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <Ionicons name="alert-circle" size={64} color={theme.colors.error} />
        <Text style={[styles.eligibilityTitle, { color: theme.colors.error }]}>
          Not Eligible
        </Text>
        <Text style={[styles.eligibilityMessage, { color: theme.colors.text }]}>
          {eligibilityMessage}
        </Text>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: theme.colors.primary }]}
          onPress={() => navigation.goBack()}
        >
          <Text style={[styles.buttonText, { color: theme.colors.white }]}>
            Go Back
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.text }]}>
          Schedule Blood Donation
        </Text>
        <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
          {step === 1 ? 'Select Date' : step === 2 ? 'Select Donation Center' : 'Confirm Donation'}
        </Text>
      </View>

      {/* Step Indicator */}
      <View style={styles.stepContainer}>
        <View style={[styles.stepIndicator, { backgroundColor: theme.colors.primary }]}>
          <Text style={[styles.stepText, { color: theme.colors.white }]}>1</Text>
        </View>
        <View style={[styles.stepLine, { backgroundColor: step >= 2 ? theme.colors.primary : theme.colors.border }]} />
        <View style={[styles.stepIndicator, { backgroundColor: step >= 2 ? theme.colors.primary : theme.colors.border }]}>
          <Text style={[styles.stepText, { color: theme.colors.white }]}>2</Text>
        </View>
        <View style={[styles.stepLine, { backgroundColor: step >= 3 ? theme.colors.primary : theme.colors.border }]} />
        <View style={[styles.stepIndicator, { backgroundColor: step >= 3 ? theme.colors.primary : theme.colors.border }]}>
          <Text style={[styles.stepText, { color: theme.colors.white }]}>3</Text>
        </View>
      </View>

      {/* Content based on current step */}
      {step === 1 && (
        <View style={styles.contentContainer}>
          <Calendar
            minDate={today}
            maxDate={new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]} // 90 days from now
            onDayPress={handleDateSelect}
            markedDates={{
              [selectedDate]: { selected: true, selectedColor: theme.colors.primary }
            }}
            theme={{
              calendarBackground: theme.colors.card,
              textSectionTitleColor: theme.colors.textSecondary,
              selectedDayBackgroundColor: theme.colors.primary,
              selectedDayTextColor: theme.colors.white,
              todayTextColor: theme.colors.primary,
              dayTextColor: theme.colors.text,
              textDisabledColor: theme.colors.border,
              arrowColor: theme.colors.primary,
              monthTextColor: theme.colors.text,
            }}
          />
          <Text style={[styles.helperText, { color: theme.colors.textSecondary }]}>
            Please select a date for your blood donation appointment.
          </Text>
        </View>
      )}

      {step === 2 && (
        <View style={styles.contentContainer}>
          {loading ? (
            <ActivityIndicator size="large" color={theme.colors.primary} />
          ) : (
            <FlatList
              data={donationCenters}
              renderItem={renderCenterItem}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.centersList}
              ListEmptyComponent={
                <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
                  No donation centers found nearby.
                </Text>
              }
            />
          )}
        </View>
      )}

      {step === 3 && (
        <ScrollView style={styles.contentContainer}>
          <View style={[styles.confirmationCard, { borderColor: theme.colors.border }]}>
            <Text style={[styles.confirmationTitle, { color: theme.colors.text }]}>
              Donation Details
            </Text>
            
            <View style={styles.confirmationItem}>
              <Ionicons name="calendar" size={20} color={theme.colors.primary} />
              <Text style={[styles.confirmationLabel, { color: theme.colors.textSecondary }]}>
                Date:
              </Text>
              <Text style={[styles.confirmationValue, { color: theme.colors.text }]}>
                {selectedDate}
              </Text>
            </View>
            
            <View style={styles.confirmationItem}>
              <Ionicons name="location" size={20} color={theme.colors.primary} />
              <Text style={[styles.confirmationLabel, { color: theme.colors.textSecondary }]}>
                Center:
              </Text>
              <Text style={[styles.confirmationValue, { color: theme.colors.text }]}>
                {selectedCenter?.name}
              </Text>
            </View>
            
            <View style={styles.confirmationItem}>
              <Ionicons name="map" size={20} color={theme.colors.primary} />
              <Text style={[styles.confirmationLabel, { color: theme.colors.textSecondary }]}>
                Address:
              </Text>
              <Text style={[styles.confirmationValue, { color: theme.colors.text }]}>
                {selectedCenter?.address}
              </Text>
            </View>
            
            <View style={styles.confirmationItem}>
              <Ionicons name="water" size={20} color={theme.colors.primary} />
              <Text style={[styles.confirmationLabel, { color: theme.colors.textSecondary }]}>
                Type:
              </Text>
              <Text style={[styles.confirmationValue, { color: theme.colors.text }]}>
                Whole Blood
              </Text>
            </View>
          </View>
          
          <View style={[styles.reminderCard, { backgroundColor: `${theme.colors.primary}20` }]}>
            <Ionicons name="information-circle" size={24} color={theme.colors.primary} />
            <Text style={[styles.reminderText, { color: theme.colors.text }]}>
              Please remember to bring a valid ID and avoid heavy meals before donation.
            </Text>
          </View>
        </ScrollView>
      )}

      {/* Navigation Buttons */}
      <View style={styles.buttonContainer}>
        {step > 1 && (
          <TouchableOpacity
            style={[styles.button, styles.secondaryButton, { borderColor: theme.colors.primary }]}
            onPress={() => setStep(step - 1)}
          >
            <Text style={[styles.buttonText, { color: theme.colors.primary }]}>
              Back
            </Text>
          </TouchableOpacity>
        )}
        
        {step < 3 ? (
          <TouchableOpacity
            style={[
              styles.button, 
              { 
                backgroundColor: theme.colors.primary,
                opacity: (step === 1 && !selectedDate) || (step === 2 && !selectedCenter) ? 0.5 : 1
              }
            ]}
            onPress={() => {
              if (step === 1 && selectedDate) {
                setStep(2);
              } else if (step === 2 && selectedCenter) {
                setStep(3);
              }
            }}
            disabled={(step === 1 && !selectedDate) || (step === 2 && !selectedCenter)}
          >
            <Text style={[styles.buttonText, { color: theme.colors.white }]}>
              Next
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.button, { backgroundColor: theme.colors.primary }]}
            onPress={handleScheduleDonation}
          >
            <Text style={[styles.buttonText, { color: theme.colors.white }]}>
              Schedule Donation
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
  },
  stepContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  stepIndicator: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepText: {
    fontWeight: 'bold',
  },
  stepLine: {
    height: 2,
    width: 50,
  },
  contentContainer: {
    flex: 1,
    marginBottom: 16,
  },
  helperText: {
    textAlign: 'center',
    marginTop: 16,
    fontSize: 14,
  },
  centersList: {
    flexGrow: 1,
  },
  centerCard: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 12,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  centerInfo: {
    flex: 1,
  },
  centerName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  centerAddress: {
    fontSize: 14,
    marginBottom: 8,
  },
  centerDetails: {
    marginTop: 4,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  detailText: {
    marginLeft: 8,
    fontSize: 14,
  },
  confirmationCard: {
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 16,
  },
  confirmationTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  confirmationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  confirmationLabel: {
    fontSize: 14,
    marginLeft: 8,
    width: 70,
  },
  confirmationValue: {
    fontSize: 14,
    flex: 1,
  },
  reminderCard: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    alignItems: 'center',
  },
  reminderText: {
    fontSize: 14,
    marginLeft: 8,
    flex: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 8,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    marginTop: 24,
  },
  eligibilityTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  eligibilityMessage: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    paddingHorizontal: 24,
  },
});

export default DonationScheduleScreen;