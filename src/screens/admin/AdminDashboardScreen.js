import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { useRequest } from '../../contexts/RequestContext';
import { useUserData } from '../../contexts/UserDataContext';
import { useDonation } from '../../contexts/DonationContext';

const AdminDashboardScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const { requests, loading: requestsLoading, fetchUserRequests } = useRequest();
  const { donors, loading: donorsLoading, fetchNearbyDonors } = useUserData();
  const { donations, loading: donationsLoading, fetchDonations } = useDonation();
  
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState({
    totalDonors: 0,
    totalRequests: 0,
    pendingRequests: 0,
    totalDonations: 0,
    inventoryLevels: {
      'A+': 0,
      'A-': 0,
      'B+': 0,
      'B-': 0,
      'AB+': 0,
      'AB-': 0,
      'O+': 0,
      'O-': 0,
    },
  });

  // Load data when component mounts
  useEffect(() => {
    fetchUserRequests();
    fetchNearbyDonors();
    fetchDonations();
  }, []);

  // Calculate stats when data changes
  useEffect(() => {
    if (!requestsLoading && !donorsLoading && !donationsLoading) {
      calculateStats();
    }
  }, [requests, donors, donations, requestsLoading, donorsLoading, donationsLoading]);

  // Calculate statistics for dashboard
  const calculateStats = () => {
    const pendingRequests = requests.filter(req => req.status === 'Pending').length;
    
    // Calculate inventory levels based on donations
    const inventory = {
      'A+': 0,
      'A-': 0,
      'B+': 0,
      'B-': 0,
      'AB+': 0,
      'AB-': 0,
      'O+': 0,
      'O-': 0,
    };
    
    donations.forEach(donation => {
      if (donation.status === 'Completed' && donation.bloodType) {
        inventory[donation.bloodType] += parseInt(donation.amount || 1);
      }
    });
    
    setStats({
      totalDonors: donors.length,
      totalRequests: requests.length,
      pendingRequests,
      totalDonations: donations.length,
      inventoryLevels: inventory,
    });
  };

  // Handle approve request
  const handleApproveRequest = (requestId) => {
    // In a real app, this would call an API to approve the request
    alert(`Request ${requestId} approved`);
  };

  // Handle reject request
  const handleRejectRequest = (requestId) => {
    // In a real app, this would call an API to reject the request
    alert(`Request ${requestId} rejected`);
  };

  // Render dashboard tab
  const renderDashboard = () => (
    <ScrollView style={styles.tabContent}>
      <View style={styles.statsContainer}>
        <View style={[styles.statCard, { backgroundColor: theme.colors.primary }]}>
          <Text style={[styles.statValue, { color: theme.colors.white }]}>
            {stats.totalDonors}
          </Text>
          <Text style={[styles.statLabel, { color: theme.colors.white }]}>
            Total Donors
          </Text>
        </View>
        
        <View style={[styles.statCard, { backgroundColor: theme.colors.success }]}>
          <Text style={[styles.statValue, { color: theme.colors.white }]}>
            {stats.totalDonations}
          </Text>
          <Text style={[styles.statLabel, { color: theme.colors.white }]}>
            Total Donations
          </Text>
        </View>
        
        <View style={[styles.statCard, { backgroundColor: theme.colors.warning }]}>
          <Text style={[styles.statValue, { color: theme.colors.white }]}>
            {stats.pendingRequests}
          </Text>
          <Text style={[styles.statLabel, { color: theme.colors.white }]}>
            Pending Requests
          </Text>
        </View>
        
        <View style={[styles.statCard, { backgroundColor: theme.colors.error }]}>
          <Text style={[styles.statValue, { color: theme.colors.white }]}>
            {stats.totalRequests}
          </Text>
          <Text style={[styles.statLabel, { color: theme.colors.white }]}>
            Total Requests
          </Text>
        </View>
      </View>
      
      <View style={[styles.section, { borderColor: theme.colors.border }]}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          Blood Inventory
        </Text>
        
        <View style={styles.inventoryContainer}>
          {Object.entries(stats.inventoryLevels).map(([bloodType, level]) => (
            <View key={bloodType} style={styles.inventoryItem}>
              <View style={[styles.bloodTypeBadge, { backgroundColor: theme.colors.primary }]}>
                <Text style={[styles.bloodTypeText, { color: theme.colors.white }]}>
                  {bloodType}
                </Text>
              </View>
              <View style={styles.inventoryBarContainer}>
                <View 
                  style={[
                    styles.inventoryBar, 
                    { 
                      backgroundColor: level < 5 ? theme.colors.error : theme.colors.success,
                      width: `${Math.min(level * 10, 100)}%`,
                    }
                  ]}
                />
              </View>
              <Text style={[styles.inventoryLevel, { color: theme.colors.text }]}>
                {level} units
              </Text>
            </View>
          ))}
        </View>
      </View>
      
      <View style={[styles.section, { borderColor: theme.colors.border }]}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          Recent Activity
        </Text>
        
        <View style={styles.activityList}>
          {[...requests, ...donations]
            .sort((a, b) => new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date))
            .slice(0, 5)
            .map((item, index) => (
              <View 
                key={index}
                style={[styles.activityItem, { borderBottomColor: theme.colors.border }]}
              >
                <Ionicons 
                  name={item.type ? 'water' : 'alert-circle'} 
                  size={24} 
                  color={item.type ? theme.colors.primary : theme.colors.warning} 
                />
                <View style={styles.activityInfo}>
                  <Text style={[styles.activityTitle, { color: theme.colors.text }]}>
                    {item.type ? `${item.type} Donation` : `Blood Request (${item.bloodType})`}
                  </Text>
                  <Text style={[styles.activityDetails, { color: theme.colors.textSecondary }]}>
                    {item.date || new Date(item.createdAt).toLocaleDateString()} • {item.status}
                  </Text>
                </View>
              </View>
            ))}
        </View>
      </View>
    </ScrollView>
  );

  // Render donors tab
  const renderDonors = () => (
    <FlatList
      data={donors}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.listContainer}
      renderItem={({ item }) => (
        <View style={[styles.donorCard, { borderColor: theme.colors.border }]}>
          <View style={styles.donorInfo}>
            <Text style={[styles.donorName, { color: theme.colors.text }]}>
              {item.firstName} {item.lastName}
            </Text>
            <Text style={[styles.donorDetails, { color: theme.colors.textSecondary }]}>
              {item.bloodType} • {item.location} • Last donation: {item.lastDonation || 'Never'}
            </Text>
          </View>
          <View style={styles.donorActions}>
            <TouchableOpacity
              style={[styles.iconButton, { backgroundColor: theme.colors.primary }]}
              onPress={() => navigation.navigate('DonorDetail', { donor: item })}
            >
              <Ionicons name="eye-outline" size={18} color={theme.colors.white} />
            </TouchableOpacity>
          </View>
        </View>
      )}
      ListEmptyComponent={
        <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
          No donors found
        </Text>
      }
    />
  );

  // Render requests tab
  const renderRequests = () => (
    <FlatList
      data={requests}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.listContainer}
      renderItem={({ item }) => (
        <View style={[styles.requestCard, { borderColor: theme.colors.border }]}>
          <View style={styles.requestHeader}>
            <View style={[styles.bloodTypeBadge, { backgroundColor: theme.colors.primary }]}>
              <Text style={[styles.bloodTypeText, { color: theme.colors.white }]}>
                {item.bloodType}
              </Text>
            </View>
            <View style={[
              styles.statusBadge, 
              { 
                backgroundColor: 
                  item.status === 'Fulfilled' ? theme.colors.success :
                  item.status === 'Pending' ? theme.colors.warning :
                  theme.colors.error
              }
            ]}>
              <Text style={[styles.statusText, { color: theme.colors.white }]}>
                {item.status}
              </Text>
            </View>
          </View>
          
          <View style={styles.requestInfo}>
            <Text style={[styles.requestTitle, { color: theme.colors.text }]}>
              {item.patientName}
            </Text>
            <Text style={[styles.requestDetails, { color: theme.colors.textSecondary }]}>
              {item.hospital} • {item.location} • Urgency: {item.urgency}
            </Text>
            <Text style={[styles.requestDate, { color: theme.colors.textSecondary }]}>
              Requested on: {new Date(item.createdAt).toLocaleDateString()}
            </Text>
          </View>
          
          {item.status === 'Pending' && (
            <View style={styles.requestActions}>
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: theme.colors.success }]}
                onPress={() => handleApproveRequest(item.id)}
              >
                <Text style={[styles.actionButtonText, { color: theme.colors.white }]}>
                  Approve
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: theme.colors.error }]}
                onPress={() => handleRejectRequest(item.id)}
              >
                <Text style={[styles.actionButtonText, { color: theme.colors.white }]}>
                  Reject
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}
      ListEmptyComponent={
        <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
          No requests found
        </Text>
      }
    />
  );

  // Render inventory tab
  const renderInventory = () => (
    <ScrollView style={styles.tabContent}>
      <View style={[styles.section, { borderColor: theme.colors.border }]}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          Current Inventory
        </Text>
        
        <View style={styles.inventoryTable}>
          <View style={[styles.tableHeader, { borderBottomColor: theme.colors.border }]}>
            <Text style={[styles.tableHeaderCell, styles.bloodTypeCell, { color: theme.colors.text }]}>
              Blood Type
            </Text>
            <Text style={[styles.tableHeaderCell, { color: theme.colors.text }]}>
              Available Units
            </Text>
            <Text style={[styles.tableHeaderCell, { color: theme.colors.text }]}>
              Status
            </Text>
          </View>
          
          {Object.entries(stats.inventoryLevels).map(([bloodType, level]) => (
            <View 
              key={bloodType}
              style={[styles.tableRow, { borderBottomColor: theme.colors.border }]}
            >
              <View style={[styles.tableCell, styles.bloodTypeCell]}>
                <View style={[styles.bloodTypeBadge, { backgroundColor: theme.colors.primary }]}>
                  <Text style={[styles.bloodTypeText, { color: theme.colors.white }]}>
                    {bloodType}
                  </Text>
                </View>
              </View>
              
              <Text style={[styles.tableCell, { color: theme.colors.text }]}>
                {level} units
              </Text>
              
              <Text style={[
                styles.tableCell, 
                { 
                  color: level < 5 ? theme.colors.error : 
                         level < 10 ? theme.colors.warning : 
                         theme.colors.success 
                }
              ]}>
                {level < 5 ? 'Critical' : level < 10 ? 'Low' : 'Good'}
              </Text>
            </View>
          ))}
        </View>
      </View>
      
      <View style={[styles.section, { borderColor: theme.colors.border }]}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          Recent Donations
        </Text>
        
        <FlatList
          data={donations.slice(0, 10)}
          keyExtractor={(item, index) => `${item.id || index}`}
          renderItem={({ item }) => (
            <View style={[styles.donationItem, { borderBottomColor: theme.colors.border }]}>
              <View style={styles.donationInfo}>
                <Text style={[styles.donationTitle, { color: theme.colors.text }]}>
                  {item.type || 'Whole Blood'}
                </Text>
                <Text style={[styles.donationDetails, { color: theme.colors.textSecondary }]}>
                  {item.date} • {item.location}
                </Text>
              </View>
              
              <View style={styles.donationAmount}>
                <Text style={[styles.donationAmountText, { color: theme.colors.primary }]}>
                  {item.amount || 1} unit{(item.amount > 1 || !item.amount) ? 's' : ''}
                </Text>
                <Text style={[styles.donationBloodType, { color: theme.colors.textSecondary }]}>
                  {item.bloodType || 'Unknown'}
                </Text>
              </View>
            </View>
          )}
          ListEmptyComponent={
            <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
              No donations found
            </Text>
          }
        />
      </View>
    </ScrollView>
  );

  if (requestsLoading || donorsLoading || donationsLoading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.colors.primary }]}>
        <Text style={[styles.headerTitle, { color: theme.colors.white }]}>
          Admin Dashboard
        </Text>
        <Text style={[styles.headerSubtitle, { color: theme.colors.white }]}>
          Manage donors, requests, and inventory
        </Text>
      </View>
      
      {/* Tab Navigation */}
      <View style={[styles.tabBar, { borderBottomColor: theme.colors.border }]}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === 'dashboard' && { 
              borderBottomWidth: 2,
              borderBottomColor: theme.colors.primary 
            }
          ]}
          onPress={() => setActiveTab('dashboard')}
        >
          <Ionicons 
            name="stats-chart" 
            size={20} 
            color={activeTab === 'dashboard' ? theme.colors.primary : theme.colors.textSecondary} 
          />
          <Text style={[
            styles.tabText, 
            { 
              color: activeTab === 'dashboard' ? theme.colors.primary : theme.colors.textSecondary 
            }
          ]}>
            Dashboard
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === 'donors' && { 
              borderBottomWidth: 2,
              borderBottomColor: theme.colors.primary 
            }
          ]}
          onPress={() => setActiveTab('donors')}
        >
          <Ionicons 
            name="people" 
            size={20} 
            color={activeTab === 'donors' ? theme.colors.primary : theme.colors.textSecondary} 
          />
          <Text style={[
            styles.tabText, 
            { 
              color: activeTab === 'donors' ? theme.colors.primary : theme.colors.textSecondary 
            }
          ]}>
            Donors
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
          <Ionicons 
            name="document-text" 
            size={20} 
            color={activeTab === 'requests' ? theme.colors.primary : theme.colors.textSecondary} 
          />
          <Text style={[
            styles.tabText, 
            { 
              color: activeTab === 'requests' ? theme.colors.primary : theme.colors.textSecondary 
            }
          ]}>
            Requests
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === 'inventory' && { 
              borderBottomWidth: 2,
              borderBottomColor: theme.colors.primary 
            }
          ]}
          onPress={() => setActiveTab('inventory')}
        >
          <Ionicons 
            name="flask" 
            size={20} 
            color={activeTab === 'inventory' ? theme.colors.primary : theme.colors.textSecondary} 
          />
          <Text style={[
            styles.tabText, 
            { 
              color: activeTab === 'inventory' ? theme.colors.primary : theme.colors.textSecondary 
            }
          ]}>
            Inventory
          </Text>
        </TouchableOpacity>
      </View>
      
      {/* Tab Content */}
      <View style={styles.content}>
        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'donors' && renderDonors()}
        {activeTab === 'requests' && renderRequests()}
        {activeTab === 'inventory' && renderInventory()}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 40,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    opacity: 0.8,
  },
  tabBar: {
    flexDirection: 'row',
    borderBottomWidth: 1,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 4,
  },
  content: {
    flex: 1,
  },
  tabContent: {
    flex: 1,
    padding: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statCard: {
    width: '48%',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
  },
  section: {
    padding: 16,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  inventoryContainer: {
    marginBottom: 8,
  },
  inventoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  bloodTypeBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  bloodTypeText: {
    fontWeight: 'bold',
  },
  inventoryBarContainer: {
    flex: 1,
    height: 10,
    backgroundColor: '#EEEEEE',
    borderRadius: 5,
    marginRight: 12,
  },
  inventoryBar: {
    height: 10,
    borderRadius: 5,
  },
  inventoryLevel: {
    width: 60,
    textAlign: 'right',
  },
  activityList: {
    marginTop: 8,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  activityInfo: {
    marginLeft: 12,
    flex: 1,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  activityDetails: {
    fontSize: 14,
  },
  listContainer: {
    padding: 16,
  },
  donorCard: {
    flexDirection: 'row',
    padding: 16,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 12,
    alignItems: 'center',
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
  donorActions: {
    flexDirection: 'row',
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  requestCard: {
    padding: 16,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 12,
  },
  requestHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
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
  requestInfo: {
    marginBottom: 12,
  },
  requestTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  requestDetails: {
    fontSize: 14,
    marginBottom: 4,
  },
  requestDate: {
    fontSize: 12,
  },
  requestActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 0.48,
    paddingVertical: 8,
    borderRadius: 4,
    alignItems: 'center',
  },
  actionButtonText: {
    fontWeight: '500',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 24,
    fontSize: 16,
  },
  inventoryTable: {
    marginTop: 8,
  },
  tableHeader: {
    flexDirection: 'row',
    paddingBottom: 8,
    borderBottomWidth: 1,
    marginBottom: 8,
  },
  tableHeaderCell: {
    flex: 1,
    fontWeight: 'bold',
  },
  bloodTypeCell: {
    width: 80,
    flex: 0,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    borderBottomWidth: 1,
    alignItems: 'center',
  },
  tableCell: {
    flex: 1,
  },
  donationItem: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    alignItems: 'center',
  },
  donationInfo: {
    flex: 1,
  },
  donationTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  donationDetails: {
    fontSize: 14,
  },
  donationAmount: {
    alignItems: 'flex-end',
  },
  donationAmountText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  donationBloodType: {
    fontSize: 12,
  },
});

export default AdminDashboardScreen;