import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Alert } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';

const RegisterScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const { register } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    bloodType: '',
  });

  const handleChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const handleRegister = async () => {
    // Basic validation
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password || !formData.confirmPassword) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    // Password match validation
    if (formData.password !== formData.confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      // Prepare user data for registration
      const userData = {
        fullName: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        password: formData.password,
        bloodType: formData.bloodType,
      };

      // Call the register function from AuthContext
      await register(userData);

      Alert.alert(
        'Success',
        'Account created successfully',
        [{ text: 'OK', onPress: () => navigation.navigate('Login') }]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to create account. Please try again.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.contentContainer}
    >
      <Text style={[styles.title, { color: theme.colors.text }]}>Create Account</Text>
      <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
        Join RedBlood and help save lives
      </Text>

      <View style={styles.form}>
        <View style={styles.inputRow}>
          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: theme.colors.text }]}>First Name</Text>
            <TextInput
              style={[styles.input, { 
                borderColor: theme.colors.border,
                color: theme.colors.text,
                backgroundColor: theme.colors.surface,
              }]}
              placeholder="First Name"
              placeholderTextColor={theme.colors.textSecondary}
              value={formData.firstName}
              onChangeText={(text) => handleChange('firstName', text)}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: theme.colors.text }]}>Last Name</Text>
            <TextInput
              style={[styles.input, { 
                borderColor: theme.colors.border,
                color: theme.colors.text,
                backgroundColor: theme.colors.surface,
              }]}
              placeholder="Last Name"
              placeholderTextColor={theme.colors.textSecondary}
              value={formData.lastName}
              onChangeText={(text) => handleChange('lastName', text)}
            />
          </View>
        </View>

        <Text style={[styles.label, { color: theme.colors.text }]}>Email</Text>
        <TextInput
          style={[styles.input, { 
            borderColor: theme.colors.border,
            color: theme.colors.text,
            backgroundColor: theme.colors.surface,
          }]}
          placeholder="Email"
          placeholderTextColor={theme.colors.textSecondary}
          keyboardType="email-address"
          autoCapitalize="none"
          value={formData.email}
          onChangeText={(text) => handleChange('email', text)}
        />

        <Text style={[styles.label, { color: theme.colors.text }]}>Password</Text>
        <TextInput
          style={[styles.input, { 
            borderColor: theme.colors.border,
            color: theme.colors.text,
            backgroundColor: theme.colors.surface,
          }]}
          placeholder="Password"
          placeholderTextColor={theme.colors.textSecondary}
          secureTextEntry
          value={formData.password}
          onChangeText={(text) => handleChange('password', text)}
        />

        <Text style={[styles.label, { color: theme.colors.text }]}>Confirm Password</Text>
        <TextInput
          style={[styles.input, { 
            borderColor: theme.colors.border,
            color: theme.colors.text,
            backgroundColor: theme.colors.surface,
          }]}
          placeholder="Confirm Password"
          placeholderTextColor={theme.colors.textSecondary}
          secureTextEntry
          value={formData.confirmPassword}
          onChangeText={(text) => handleChange('confirmPassword', text)}
        />

        <TouchableOpacity 
          style={[styles.button, { backgroundColor: theme.colors.primary }]}
          onPress={handleRegister}
          disabled={loading}
        >
          <Text style={[styles.buttonText, { color: theme.colors.white }]}>
            {loading ? 'Creating Account...' : 'Create Account'}
          </Text>
        </TouchableOpacity>

        <View style={styles.loginContainer}>
          <Text style={[styles.loginText, { color: theme.colors.textSecondary }]}>
            Already have an account?
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={[styles.loginLink, { color: theme.colors.primary }]}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 30,
  },
  form: {
    width: '100%',
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  inputContainer: {
    width: '48%',
  },
  label: {
    fontSize: 14,
    marginBottom: 5,
    marginTop: 15,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
  },
  button: {
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  loginText: {
    fontSize: 14,
    marginRight: 5,
  },
  loginLink: {
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default RegisterScreen;
