import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';

const ForgotPasswordScreen = ({ navigation }) => {
  const { forgotPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  const handleResetPassword = async () => {
    // Basic validation
    if (!email.trim()) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    setLoading(true);

    try {
      // Call the forgotPassword function from AuthContext
      await forgotPassword(email);

      setResetSent(true);
    } catch (error) {
      Alert.alert('Error', 'Failed to send password reset email. Please try again.');
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
          <Text style={styles.headerTitle}>Forgot Password</Text>
          <View style={{width: 24}} />
        </View>

        <View style={styles.logoContainer}>
          <Image 
            source={require('../../../assets/images/icon.png')} 
            style={styles.logo} 
          />
        </View>

        {!resetSent ? (
          <View style={styles.formContainer}>
            <Text style={styles.instructionText}>
              Enter your email address and we'll send you a link to reset your password.
            </Text>

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

            <TouchableOpacity 
              style={[styles.resetButton, loading && styles.disabledButton]}
              onPress={handleResetPassword}
              disabled={loading}
            >
              <Text style={styles.resetButtonText}>
                {loading ? 'Sending...' : 'Reset Password'}
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.successContainer}>
            <Ionicons name="mail" size={60} color="#E53935" style={styles.emailIcon} />
            <Text style={styles.successTitle}>Check Your Email</Text>
            <Text style={styles.successText}>
              We've sent a password reset link to {email}. Please check your inbox and follow the instructions to reset your password.
            </Text>

            <TouchableOpacity 
              style={styles.backToLoginButton}
              onPress={() => navigation.navigate('Login')}
            >
              <Text style={styles.backToLoginText}>Back to Sign In</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.resendButton}
              onPress={handleResetPassword}
            >
              <Text style={styles.resendText}>Resend Email</Text>
            </TouchableOpacity>
          </View>
        )}
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
    marginVertical: 30,
  },
  logo: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
  },
  formContainer: {
    width: '100%',
  },
  instructionText: {
    fontSize: 16,
    color: '#666',
    lineHeight: 22,
    marginBottom: 24,
    textAlign: 'center',
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
    marginBottom: 30,
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
  resetButton: {
    backgroundColor: '#E53935',
    borderRadius: 8,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#ffcccc',
  },
  resetButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  successContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  emailIcon: {
    marginBottom: 20,
  },
  successTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  successText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 30,
  },
  backToLoginButton: {
    backgroundColor: '#E53935',
    borderRadius: 8,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginBottom: 16,
  },
  backToLoginText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resendButton: {
    borderWidth: 1,
    borderColor: '#E53935',
    borderRadius: 8,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  resendText: {
    color: '#E53935',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ForgotPasswordScreen;
