import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import DropDownPicker from 'react-native-dropdown-picker';
import { useAuth } from '../../contexts/AuthContext';

const CreateAccountScreen = ({ navigation }) => {
  const { register } = useAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [birthDate, setBirthDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Blood group dropdown
  const [open, setOpen] = useState(false);
  const [bloodGroup, setBloodGroup] = useState(null);
  const [bloodGroups, setBloodGroups] = useState([
    { label: 'A+', value: 'A+' },
    { label: 'A-', value: 'A-' },
    { label: 'B+', value: 'B+' },
    { label: 'B-', value: 'B-' },
    { label: 'AB+', value: 'AB+' },
    { label: 'AB-', value: 'AB-' },
    { label: 'O+', value: 'O+' },
    { label: 'O-', value: 'O-' },
  ]);

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || birthDate;
    setShowDatePicker(Platform.OS === 'ios');
    setBirthDate(currentDate);
  };

  const formatDate = (date) => {
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  };

  const handleCreateAccount = async () => {
    // Basic validation
    if (!fullName.trim() || !email.trim() || !password.trim() || !confirmPassword.trim() || !bloodGroup) {
      Alert.alert('Error', 'All fields are required');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    // Password match validation
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    // Password strength validation
    if (password.length < 8) {
      Alert.alert('Error', 'Password must be at least 8 characters long');
      return;
    }

    // Age validation (must be at least 18 years old)
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (age < 18 || (age === 18 && monthDiff < 0)) {
      Alert.alert('Error', 'You must be at least 18 years old to register');
      return;
    }

    setLoading(true);

    try {
      // Prepare user data for registration
      const userData = {
        fullName,
        email,
        password,
        birthDate: birthDate.toISOString(),
        bloodGroup,
      };

      // Call the register function from AuthContext
      await register(userData);

      Alert.alert(
        'Account Created',
        'Your account has been created successfully. Please sign in.',
        [{ text: 'OK', onPress: () => navigation.navigate('Login') }]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to create your account. Please try again.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Create Account</Text>
          <View style={{width: 24}} />
        </View>

        <View style={styles.logoContainer}>
          <Image 
            source={require('../../../assets/images/icon.png')} 
            style={styles.logo} 
          />
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.label}>Full Name</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="person-outline" size={20} color="#777" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Enter your full name"
              value={fullName}
              onChangeText={setFullName}
            />
          </View>

          <Text style={styles.label}>Email</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="mail-outline" size={20} color="#777" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <Text style={styles.label}>Password</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={20} color="#777" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Create a password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Ionicons 
                name={showPassword ? "eye-off-outline" : "eye-outline"} 
                size={20} 
                color="#777" 
              />
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>Confirm Password</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={20} color="#777" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Confirm your password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showConfirmPassword}
            />
            <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
              <Ionicons 
                name={showConfirmPassword ? "eye-off-outline" : "eye-outline"} 
                size={20} 
                color="#777" 
              />
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>Date of Birth</Text>
          <TouchableOpacity 
            style={styles.inputContainer}
            onPress={() => setShowDatePicker(true)}
          >
            <Ionicons name="calendar-outline" size={20} color="#777" style={styles.inputIcon} />
            <Text style={styles.dateText}>{formatDate(birthDate)}</Text>
          </TouchableOpacity>

          {showDatePicker && (
            <DateTimePicker
              value={birthDate}
              mode="date"
              display="default"
              onChange={handleDateChange}
              maximumDate={new Date()}
            />
          )}

          <Text style={styles.label}>Blood Group</Text>
          <DropDownPicker
            open={open}
            value={bloodGroup}
            items={bloodGroups}
            setOpen={setOpen}
            setValue={setBloodGroup}
            setItems={setBloodGroups}
            style={styles.dropdown}
            dropDownContainerStyle={styles.dropdownContainer}
            placeholder="Select your blood group"
            placeholderStyle={styles.dropdownPlaceholder}
          />

          <View style={styles.termsContainer}>
            <Text style={styles.termsText}>
              By creating an account, you agree to our{' '}
              <Text style={styles.termsLink}>Terms of Service</Text> and{' '}
              <Text style={styles.termsLink}>Privacy Policy</Text>
            </Text>
          </View>

          <TouchableOpacity 
            style={[styles.createButton, loading && styles.disabledButton]}
            onPress={handleCreateAccount}
            disabled={loading}
          >
            <Text style={styles.createButtonText}>
              {loading ? 'Creating Account...' : 'Create Account'}
            </Text>
          </TouchableOpacity>

          <View style={styles.signInContainer}>
            <Text style={styles.signInText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.signInLink}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logo: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
  },
  formContainer: {
    width: '100%',
  },
  label: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
    fontWeight: '500',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 20,
    height: 50,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    color: '#333',
  },
  dateText: {
    fontSize: 16,
    color: '#333',
  },
  dropdown: {
    borderColor: '#ddd',
    borderRadius: 8,
    height: 50,
    marginBottom: 20,
  },
  dropdownContainer: {
    borderColor: '#ddd',
  },
  dropdownPlaceholder: {
    color: '#999',
  },
  termsContainer: {
    marginBottom: 24,
  },
  termsText: {
    color: '#666',
    fontSize: 14,
    lineHeight: 20,
  },
  termsLink: {
    color: '#E53935',
    fontWeight: '500',
  },
  createButton: {
    backgroundColor: '#E53935',
    borderRadius: 8,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  disabledButton: {
    backgroundColor: '#ffcccc',
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  signInContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  signInText: {
    color: '#666',
    fontSize: 14,
  },
  signInLink: {
    color: '#E53935',
    fontSize: 14,
    fontWeight: '500',
  },
});

export default CreateAccountScreen;
