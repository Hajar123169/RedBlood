import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, TextInput, Alert } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';

const LoginScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }

    setLoading(true);
    try {
      // Show welcome message before attempting to login
      Alert.alert('Welcome to RedBlood App', 'Login successful!');

      // Then proceed with actual login
      await login(email, password);
      // No need to navigate - AppNavigator will handle this based on auth state
    } catch (error) {
      Alert.alert('Error', 'Failed to sign in. Please check your credentials.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.logoContainer}>
        <Image 
          source={require('../../../assets/images/icon.png')} 
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={[styles.appName, { color: theme.colors.primary }]}>RedBlood</Text>
        <Text style={[styles.tagline, { color: theme.colors.textSecondary }]}>
          Connect blood donors with those in need
        </Text>
      </View>

      <View style={styles.formContainer}>
        <Text style={[styles.label, { color: theme.colors.text }]}>Email</Text>
        <TextInput
          style={[styles.input, { 
            borderColor: theme.colors.border,
            color: theme.colors.text,
            backgroundColor: theme.colors.surface,
          }]}
          placeholder="Enter your email"
          placeholderTextColor={theme.colors.textSecondary}
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
          editable={true} // Ensure the input is editable
        />

        <Text style={[styles.label, { color: theme.colors.text }]}>Password</Text>
        <TextInput
          style={[styles.input, { 
            borderColor: theme.colors.border,
            color: theme.colors.text,
            backgroundColor: theme.colors.surface,
          }]}
          placeholder="Enter your password"
          placeholderTextColor={theme.colors.textSecondary}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          editable={true} // Ensure the input is editable
        />

        <TouchableOpacity 
          style={[styles.button, { backgroundColor: theme.colors.primary }]}
          onPress={handleLogin}
          disabled={loading}
        >
          <Text style={[styles.buttonText, { color: theme.colors.white }]}>
            {loading ? 'Signing In...' : 'Sign In'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, styles.secondaryButton, { borderColor: theme.colors.primary }]}
          onPress={() => navigation.navigate('Register')}
        >
          <Text style={[styles.buttonText, { color: theme.colors.primary }]}>Create Account</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity 
        style={styles.forgotPassword}
        onPress={() => navigation.navigate('ForgotPassword')}
      >
        <Text style={[styles.forgotPasswordText, { color: theme.colors.textSecondary }]}>
          Forgot Password?
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  tagline: {
    fontSize: 16,
    textAlign: 'center',
  },
  formContainer: {
    width: '100%',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    marginBottom: 20,
  },
  button: {
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  forgotPassword: {
    alignItems: 'center',
  },
  forgotPasswordText: {
    fontSize: 14,
  },
});

export default LoginScreen;
