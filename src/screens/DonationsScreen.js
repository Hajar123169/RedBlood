import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  FlatList, 
  ActivityIndicator,
  Modal,
  TextInput,
  ScrollView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import * as userAPI from '../api/userAPI';

const DonationsScreen = ({ navigation, route }) => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const [donations, setDonations] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(route.params?.initialTab || 'donations');
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleLocation, setScheduleLocation] = useState('');

  // Load donations and requests data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const donationsData = await userAPI.getDonationHistory();
        setDonations(donationsData);

        const requestsData = await userAPI.getRequestHistory();
        setRequests(requestsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleScheduleDonation = () => {
    // Navigate to the donation schedule screen
    navigation.navigate('DonationSchedule');

    // Close the modal if it's open
    setShowScheduleModal(false);

    // Reset form
    setScheduleDate('');
    setScheduleLocation('');
  };

  const renderDonationItem = ({ item }) => (
    <View style={[styles.card, { borderColor: theme.colors.border }]}>
      <View style={styles.cardHeader}>
        <Text style={[styles.cardTitle, { color: theme.colors.text }]}>
          {item.type}
        </Text>
        <View style={[styles.statusBadge, { 
          backgroundColor: item.status === 'Completed' 
            ? theme.colors.success 
            : theme.colors.warning 
        }]}>
          <Text style={[styles.statusText, { color: theme.colors.white }]}>
            {item.status}
          </Text>
        </View>
      </View>

      <View style={styles.cardDetails}>
        <View style={styles.detailRow}>
          <Ionicons name="calendar-outline" size={16} color={theme.colors.textSecondary} />
          <Text style={[styles.detailText, { color: theme.colors.textSecondary }]}>
            {item.date}
          </Text>
        </View>

        <View style={styles.detailRow}>
          <Ionicons name="location-outline" size={16} color={theme.colors.textSecondary} />
          <Text style={[styles.detailText, { color: theme.colors.textSecondary }]}>
            {item.location}
          </Text>
        </View>

        <View style={styles.detailRow}>
          <Ionicons name="water-outline" size={16} color={theme.colors.textSecondary} />
          <Text style={[styles.detailText, { color: theme.colors.textSecondary }]}>
            {item.amount}
          </Text>
        </View>
      </View>
    </View>
  );

  const renderRequestItem = ({ item }) => (
    <View style={[styles.card, { borderColor: theme.colors.border }]}>
      <View style={styles.cardHeader}>
        <View style={[styles.bloodTypeBadge, { backgroundColor: theme.colors.primary }]}>
          <Text style={[styles.bloodTypeText, { color: theme.colors.white }]}>
            {item.bloodType}
          </Text>
        </View>
        <View style={[styles.statusBadge, { 
          backgroundColor: item.status === 'Fulfilled' 
            ? theme.colors.success 
            : theme.colors.warning 
        }]}>
          <Text style={[styles.statusText, { color: theme.colors.white }]}>
            {item.status}
          </Text>
        </View>
      </View>

      <View style={styles.cardDetails}>
        <View style={styles.detailRow}>
          <Ionicons name="calendar-outline" size={16} color={theme.colors.textSecondary} />
          <Text style={[styles.detailText, { color: theme.colors.textSecondary }]}>
            {item.date}
          </Text>
        </View>

        <View style={styles.detailRow}>
          <Ionicons name="medkit-outline" size={16} color={theme.colors.textSecondary} />
          <Text style={[styles.detailText, { color: theme.colors.textSecondary }]}>
            {item.hospital}
          </Text>
        </View>

        <View style={styles.detailRow}>
          <Ionicons name="alert-circle-outline" size={16} color={theme.colors.textSecondary} />
          <Text style={[styles.detailText, { color: theme.colors.textSecondary }]}>
            Urgency: {item.urgency}
          </Text>
        </View>
      </View>
    </View>
  );

  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <Ionicons 
        name={activeTab === 'donations' ? 'water-outline' : 'alert-circle-outline'} 
        size={64} 
        color={theme.colors.textSecondary} 
      />
      <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
        {activeTab === 'donations' 
          ? 'No donation history found' 
          : 'No blood requests found'}
      </Text>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Tab Selector */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === 'donations' && { 
              borderBottomWidth: 2,
              borderBottomColor: theme.colors.primary 
            }
          ]}
          onPress={() => setActiveTab('donations')}
        >
          <Text style={[
            styles.tabText, 
            { 
              color: activeTab === 'donations' 
                ? theme.colors.primary 
                : theme.colors.textSecondary 
            }
          ]}>
            My Donations
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === 'requests' && { 
              borderBottomWidth: 2,
              borderBottomColor: theme.colors.primary 
            }
          ]}
          onPress={() => setActiveTab('requests')}
        >
          <Text style={[
            styles.tabText, 
            { 
              color: activeTab === 'requests' 
                ? theme.colors.primary 
                : theme.colors.textSecondary 
            }
          ]}>
            Blood Requests
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={[styles.loadingText, { color: theme.colors.textSecondary }]}>
            Loading {activeTab === 'donations' ? 'donations' : 'requests'}...
          </Text>
        </View>
      ) : (
        <FlatList
          data={activeTab === 'donations' ? donations : requests}
          renderItem={activeTab === 'donations' ? renderDonationItem : renderRequestItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={renderEmptyList}
        />
      )}

      {/* Action Button */}
      {activeTab === 'donations' ? (
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: theme.colors.primary }]}
          onPress={() => navigation.navigate('DonationSchedule')}
        >
          <Ionicons name="calendar" size={24} color={theme.colors.white} />
          <Text style={[styles.actionButtonText, { color: theme.colors.white }]}>
            Schedule Donation
          </Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: theme.colors.primary }]}
          onPress={() => navigation.navigate('CreateRequest')}
        >
          <Ionicons name="add-circle-outline" size={24} color={theme.colors.white} />
          <Text style={[styles.actionButtonText, { color: theme.colors.white }]}>
            Create Blood Request
          </Text>
        </TouchableOpacity>
      )}

      {/* Schedule Donation Modal */}
      <Modal
        visible={showScheduleModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowScheduleModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.colors.background }]}>
            <Text style={[styles.modalTitle, { color: theme.colors.text }]}>
              Schedule Blood Donation
            </Text>

            <Text style={[styles.inputLabel, { color: theme.colors.text }]}>Date</Text>
            <TextInput
              style={[styles.input, { 
                borderColor: theme.colors.border,
                color: theme.colors.text,
                backgroundColor: theme.colors.surface,
              }]}
              placeholder="YYYY-MM-DD"
              placeholderTextColor={theme.colors.textSecondary}
              value={scheduleDate}
              onChangeText={setScheduleDate}
            />

            <Text style={[styles.inputLabel, { color: theme.colors.text }]}>Location</Text>
            <TextInput
              style={[styles.input, { 
                borderColor: theme.colors.border,
                color: theme.colors.text,
                backgroundColor: theme.colors.surface,
              }]}
              placeholder="Blood donation center"
              placeholderTextColor={theme.colors.textSecondary}
              value={scheduleLocation}
              onChangeText={setScheduleLocation}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, { borderColor: theme.colors.primary }]}
                onPress={() => setShowScheduleModal(false)}
              >
                <Text style={[styles.modalButtonText, { color: theme.colors.primary }]}>
                  Cancel
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: theme.colors.primary }]}
                onPress={handleScheduleDonation}
              >
                <Text style={[styles.modalButtonText, { color: theme.colors.white }]}>
                  Schedule
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  tabButton: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '500',
  },
  listContainer: {
    padding: 16,
    flexGrow: 1,
  },
  card: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  bloodTypeBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bloodTypeText: {
    fontWeight: 'bold',
  },
  cardDetails: {
    marginTop: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailText: {
    marginLeft: 8,
    fontSize: 14,
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
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 8,
    margin: 16,
  },
  actionButtonText: {
    marginLeft: 8,
    fontWeight: 'bold',
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    borderRadius: 8,
    padding: 24,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  inputLabel: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    marginBottom: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  modalButton: {
    flex: 0.48,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default DonationsScreen;
