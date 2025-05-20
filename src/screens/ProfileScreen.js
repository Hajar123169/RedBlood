import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Image,
  Switch,
  Alert,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import * as bloodGroups from '../utils/bloodGroups';

const ProfileScreen = () => {
  const { theme } = useTheme();
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [locationEnabled, setLocationEnabled] = useState(true);

  // Handle logout
  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          onPress: async () => {
            setLoading(true);
            try {
              await logout();
            } catch (error) {
              console.error('Logout failed:', error);
              Alert.alert('Error', 'Failed to logout. Please try again.');
            } finally {
              setLoading(false);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  // Get blood group description
  const bloodGroupDescription = user?.bloodType 
    ? bloodGroups.getBloodGroupDescription(user.bloodType)
    : '';

  // Get compatible recipients
  const compatibleRecipients = user?.bloodType 
    ? bloodGroups.getCompatibleRecipients(user.bloodType)
    : [];

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      )}
      
      {/* Profile Header */}
      <View style={[styles.profileHeader, { backgroundColor: theme.colors.primary }]}>
        <View style={styles.profileImageContainer}>
          <Image 
            source={{ uri: 'https://via.placeholder.com/150' }} 
            style={styles.profileImage}
          />
          <TouchableOpacity 
            style={[styles.editImageButton, { backgroundColor: theme.colors.white }]}
          >
            <Ionicons name="camera" size={20} color={theme.colors.primary} />
          </TouchableOpacity>
        </View>
        
        <Text style={[styles.userName, { color: theme.colors.white }]}>
          {user?.firstName} {user?.lastName}
        </Text>
        
        <View style={[styles.bloodTypeBadge, { backgroundColor: theme.colors.white }]}>
          <Text style={[styles.bloodTypeText, { color: theme.colors.primary }]}>
            {user?.bloodType || 'Unknown'}
          </Text>
        </View>
      </View>
      
      {/* Blood Type Information */}
      <View style={[styles.section, { borderColor: theme.colors.border }]}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          Blood Type Information
        </Text>
        
        <Text style={[styles.bloodTypeDescription, { color: theme.colors.textSecondary }]}>
          {bloodGroupDescription}
        </Text>
        
        <Text style={[styles.compatibilityTitle, { color: theme.colors.text }]}>
          You can donate to:
        </Text>
        
        <View style={styles.compatibilityList}>
          {compatibleRecipients.map(bloodType => (
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
      
      {/* Personal Information */}
      <View style={[styles.section, { borderColor: theme.colors.border }]}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Personal Information
          </Text>
          <TouchableOpacity>
            <Text style={[styles.editText, { color: theme.colors.primary }]}>Edit</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.infoRow}>
          <Ionicons name="mail-outline" size={20} color={theme.colors.textSecondary} />
          <Text style={[styles.infoLabel, { color: theme.colors.textSecondary }]}>Email:</Text>
          <Text style={[styles.infoValue, { color: theme.colors.text }]}>
            {user?.email || 'Not provided'}
          </Text>
        </View>
        
        <View style={styles.infoRow}>
          <Ionicons name="call-outline" size={20} color={theme.colors.textSecondary} />
          <Text style={[styles.infoLabel, { color: theme.colors.textSecondary }]}>Phone:</Text>
          <Text style={[styles.infoValue, { color: theme.colors.text }]}>
            {user?.phone || 'Not provided'}
          </Text>
        </View>
        
        <View style={styles.infoRow}>
          <Ionicons name="location-outline" size={20} color={theme.colors.textSecondary} />
          <Text style={[styles.infoLabel, { color: theme.colors.textSecondary }]}>Address:</Text>
          <Text style={[styles.infoValue, { color: theme.colors.text }]}>
            {user?.address || 'Not provided'}
          </Text>
        </View>
      </View>
      
      {/* Settings */}
      <View style={[styles.section, { borderColor: theme.colors.border }]}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          Settings
        </Text>
        
        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Ionicons name="notifications-outline" size={20} color={theme.colors.textSecondary} />
            <Text style={[styles.settingText, { color: theme.colors.text }]}>
              Push Notifications
            </Text>
          </View>
          <Switch
            value={notificationsEnabled}
            onValueChange={setNotificationsEnabled}
            trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
            thumbColor={theme.colors.white}
          />
        </View>
        
        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Ionicons name="location-outline" size={20} color={theme.colors.textSecondary} />
            <Text style={[styles.settingText, { color: theme.colors.text }]}>
              Location Services
            </Text>
          </View>
          <Switch
            value={locationEnabled}
            onValueChange={setLocationEnabled}
            trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
            thumbColor={theme.colors.white}
          />
        </View>
        
        <TouchableOpacity 
          style={styles.settingRow}
          onPress={() => Alert.alert('Change Password', 'This feature will be available soon.')}
        >
          <View style={styles.settingInfo}>
            <Ionicons name="lock-closed-outline" size={20} color={theme.colors.textSecondary} />
            <Text style={[styles.settingText, { color: theme.colors.text }]}>
              Change Password
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={theme.colors.textSecondary} />
        </TouchableOpacity>
      </View>
      
      {/* Logout Button */}
      <TouchableOpacity 
        style={[styles.logoutButton, { borderColor: theme.colors.error }]}
        onPress={handleLogout}
      >
        <Ionicons name="log-out-outline" size={20} color={theme.colors.error} />
        <Text style={[styles.logoutText, { color: theme.colors.error }]}>
          Logout
        </Text>
      </TouchableOpacity>
      
      {/* App Version */}
      <Text style={[styles.versionText, { color: theme.colors.textSecondary }]}>
        RedBlood App v1.0.0
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  profileHeader: {
    padding: 20,
    alignItems: 'center',
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: 'white',
  },
  editImageButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  bloodTypeBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  bloodTypeText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  section: {
    padding: 16,
    marginHorizontal: 16,
    marginTop: 16,
    borderWidth: 1,
    borderRadius: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  editText: {
    fontSize: 14,
    fontWeight: '500',
  },
  bloodTypeDescription: {
    fontSize: 14,
    marginBottom: 16,
    lineHeight: 20,
  },
  compatibilityTitle: {
    fontSize: 16,
    fontWeight: '500',
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
    fontSize: 14,
    fontWeight: '500',
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
    width: 60,
  },
  infoValue: {
    fontSize: 14,
    flex: 1,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingText: {
    fontSize: 16,
    marginLeft: 12,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 16,
    marginTop: 24,
    marginBottom: 8,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  versionText: {
    textAlign: 'center',
    fontSize: 12,
    marginBottom: 24,
  },
});

export default ProfileScreen;