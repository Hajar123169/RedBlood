import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { useRequest } from '../../contexts/RequestContext';
import { useAuth } from '../../contexts/AuthContext';
import * as bloodGroups from '../../utils/bloodGroups';

const BLOOD_TYPES = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const URGENCY_LEVELS = [
  { id: 'low', label: 'Low', color: '#4CAF50' },
  { id: 'medium', label: 'Medium', color: '#FF9800' },
  { id: 'high', label: 'High', color: '#F44336' },
  { id: 'critical', label: 'Critical', color: '#D32F2F' },
];

const CreateRequestScreen = ({ navigation, route }) => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const { createRequest, loading, error } = useRequest();

  const [formData, setFormData] = useState({
    patientName: '',
    bloodType: route.params?.bloodType || '',
    units: '1',
    hospital: '',
    location: '',
    urgency: '',
    contactPhone: '',
    additionalInfo: '',
  });

  // Pre-fill contact phone if user has one
  useEffect(() => {
    if (user && user.phone) {
      setFormData(prev => ({ ...prev, contactPhone: user.phone }));
    }
  }, [user]);

  // Handle form input changes
  const handleChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  // Handle blood type selection
  const handleBloodTypeSelect = (bloodType) => {
    setFormData({
      ...formData,
      bloodType: formData.bloodType === bloodType ? '' : bloodType,
    });
  };

  // Handle urgency level selection
  const handleUrgencySelect = (urgency) => {
    setFormData({
      ...formData,
      urgency: urgency,
    });
  };

  // Handle form submission
  const handleSubmit = async () => {
    // Validate required fields
    if (!formData.patientName || !formData.bloodType || !formData.hospital || 
        !formData.location || !formData.urgency || !formData.contactPhone) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    try {
      await createRequest({
        ...formData,
        requesterName: user ? `${user.firstName} ${user.lastName}` : formData.patientName,
        requesterEmail: user ? user.email : '',
        status: 'Pending',
        createdAt: new Date().toISOString(),
      });

      Alert.alert(
        'Success',
        'Blood request created successfully',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (err) {
      console.error('Error creating request:', err);
      Alert.alert('Error', 'Failed to create blood request. Please try again.');
    }
  };

  // Get compatible donors for selected blood type
  const getCompatibleDonors = () => {
    if (!formData.bloodType) return [];
    return bloodGroups.getCompatibleDonors(formData.bloodType);
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.text }]}>
          Create Blood Request
        </Text>
        <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
          Please provide details about the blood request
        </Text>
      </View>

      {/* Patient Information */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          Patient Information
        </Text>

        <Text style={[styles.label, { color: theme.colors.text }]}>
          Patient Name *
        </Text>
        <TextInput
          style={[styles.input, { 
            borderColor: theme.colors.border,
            color: theme.colors.text,
            backgroundColor: theme.colors.surface,
          }]}
          placeholder="Enter patient name"
          placeholderTextColor={theme.colors.textSecondary}
          value={formData.patientName}
          onChangeText={(text) => handleChange('patientName', text)}
        />
      </View>

      {/* Blood Type Selection */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          Blood Type Required *
        </Text>

        <View style={styles.bloodTypeContainer}>
          {BLOOD_TYPES.map((type) => (
            <TouchableOpacity
              key={type}
              style={[
                styles.bloodTypeButton,
                { borderColor: theme.colors.primary },
                formData.bloodType === type && { backgroundColor: theme.colors.primary }
              ]}
              onPress={() => handleBloodTypeSelect(type)}
            >
              <Text
                style={[
                  styles.bloodTypeText,
                  { color: formData.bloodType === type ? theme.colors.white : theme.colors.primary }
                ]}
              >
                {type}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {formData.bloodType && (
          <View style={styles.compatibilityContainer}>
            <Text style={[styles.compatibilityTitle, { color: theme.colors.text }]}>
              Compatible donors:
            </Text>
            <View style={styles.compatibilityList}>
              {getCompatibleDonors().map((type) => (
                <View 
                  key={type} 
                  style={[styles.compatibilityBadge, { backgroundColor: theme.colors.primary }]}
                >
                  <Text style={[styles.compatibilityText, { color: theme.colors.white }]}>
                    {type}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </View>

      {/* Request Details */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          Request Details
        </Text>

        <Text style={[styles.label, { color: theme.colors.text }]}>
          Units Required
        </Text>
        <TextInput
          style={[styles.input, { 
            borderColor: theme.colors.border,
            color: theme.colors.text,
            backgroundColor: theme.colors.surface,
          }]}
          placeholder="Number of units"
          placeholderTextColor={theme.colors.textSecondary}
          keyboardType="numeric"
          value={formData.units}
          onChangeText={(text) => handleChange('units', text)}
        />

        <Text style={[styles.label, { color: theme.colors.text }]}>
          Hospital/Clinic Name *
        </Text>
        <TextInput
          style={[styles.input, { 
            borderColor: theme.colors.border,
            color: theme.colors.text,
            backgroundColor: theme.colors.surface,
          }]}
          placeholder="Enter hospital or clinic name"
          placeholderTextColor={theme.colors.textSecondary}
          value={formData.hospital}
          onChangeText={(text) => handleChange('hospital', text)}
        />

        <Text style={[styles.label, { color: theme.colors.text }]}>
          Location *
        </Text>
        <TextInput
          style={[styles.input, { 
            borderColor: theme.colors.border,
            color: theme.colors.text,
            backgroundColor: theme.colors.surface,
          }]}
          placeholder="Enter location"
          placeholderTextColor={theme.colors.textSecondary}
          value={formData.location}
          onChangeText={(text) => handleChange('location', text)}
        />

        <Text style={[styles.label, { color: theme.colors.text }]}>
          Urgency Level *
        </Text>
        <View style={styles.urgencyContainer}>
          {URGENCY_LEVELS.map((urgency) => (
            <TouchableOpacity
              key={urgency.id}
              style={[
                styles.urgencyButton,
                { borderColor: urgency.color },
                formData.urgency === urgency.id && { backgroundColor: urgency.color }
              ]}
              onPress={() => handleUrgencySelect(urgency.id)}
            >
              <Text
                style={[
                  styles.urgencyText,
                  { color: formData.urgency === urgency.id ? theme.colors.white : urgency.color }
                ]}
              >
                {urgency.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Contact Information */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          Contact Information
        </Text>

        <Text style={[styles.label, { color: theme.colors.text }]}>
          Contact Phone *
        </Text>
        <TextInput
          style={[styles.input, { 
            borderColor: theme.colors.border,
            color: theme.colors.text,
            backgroundColor: theme.colors.surface,
          }]}
          placeholder="Enter contact phone number"
          placeholderTextColor={theme.colors.textSecondary}
          keyboardType="phone-pad"
          value={formData.contactPhone}
          onChangeText={(text) => handleChange('contactPhone', text)}
        />

        <Text style={[styles.label, { color: theme.colors.text }]}>
          Additional Information
        </Text>
        <TextInput
          style={[styles.textArea, { 
            borderColor: theme.colors.border,
            color: theme.colors.text,
            backgroundColor: theme.colors.surface,
          }]}
          placeholder="Enter any additional information"
          placeholderTextColor={theme.colors.textSecondary}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
          value={formData.additionalInfo}
          onChangeText={(text) => handleChange('additionalInfo', text)}
        />
      </View>

      {/* Submit Button */}
      <TouchableOpacity
        style={[styles.submitButton, { backgroundColor: theme.colors.primary }]}
        onPress={handleSubmit}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color={theme.colors.white} />
        ) : (
          <>
            <Ionicons name="add-circle-outline" size={20} color={theme.colors.white} />
            <Text style={[styles.submitButtonText, { color: theme.colors.white }]}>
              Create Request
            </Text>
          </>
        )}
      </TouchableOpacity>

      <Text style={[styles.requiredNote, { color: theme.colors.textSecondary }]}>
        * Required fields
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    marginBottom: 16,
  },
  textArea: {
    height: 100,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 16,
  },
  bloodTypeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  bloodTypeButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 8,
    marginBottom: 8,
  },
  bloodTypeText: {
    fontWeight: '500',
  },
  compatibilityContainer: {
    marginTop: 8,
  },
  compatibilityTitle: {
    fontSize: 14,
    marginBottom: 8,
  },
  compatibilityList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  compatibilityBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  compatibilityText: {
    fontSize: 12,
    fontWeight: '500',
  },
  urgencyContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  urgencyButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  urgencyText: {
    fontWeight: '500',
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    borderRadius: 8,
    marginTop: 16,
    marginBottom: 8,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  requiredNote: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
  },
});

export default CreateRequestScreen;
