import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { useListagramStore } from '../src/store';
import { moderateScale, scale, verticalScale } from '../src/utils/responsive';

type AuthMode = 'LOGIN' | 'SIGNUP';

export default function AuthScreen() {
  const [mode, setAuthMode] = useState<AuthMode>('LOGIN');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login, signup } = useListagramStore();

  const handleAuth = async () => {
    if (!email || !password || (mode === 'SIGNUP' && (!fullName || !username))) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    setIsLoading(true);
    try {
      if (mode === 'LOGIN') {
        const success = await login(email, password);
        if (!success) {
          Alert.alert('Login Failed', 'Invalid credentials or user not found.');
        }
      } else {
        const success = await signup(fullName, email, password);
        if (!success) {
          Alert.alert('Signup Failed', 'Could not create account.');
        }
      }
    } catch (error) {
      console.error('Auth error:', error);
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    setIsLoading(true);
    // Mock Google Login
    setTimeout(() => {
      login('google-user@gmail.com');
      setIsLoading(false);
    }, 1500);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.inner}>
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>Listagram</Text>
        </View>

        <View style={styles.form}>
          {mode === 'SIGNUP' && (
            <>
              <TextInput
                style={styles.input}
                placeholder="Full Name"
                placeholderTextColor="#777"
                value={fullName}
                onChangeText={setFullName}
              />
              <TextInput
                style={styles.input}
                placeholder="Username"
                placeholderTextColor="#777"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
              />
            </>
          )}
          
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#777"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#777"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <TouchableOpacity
            style={[styles.button, isLoading && styles.buttonDisabled]}
            onPress={handleAuth}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#000" />
            ) : (
              <Text style={styles.buttonText}>{mode === 'LOGIN' ? 'Log In' : 'Sign Up'}</Text>
            )}
          </TouchableOpacity>

          <View style={styles.dividerContainer}>
            <View style={styles.divider} />
            <Text style={styles.dividerText}>OR</Text>
            <View style={styles.divider} />
          </View>

          <TouchableOpacity style={styles.googleButton} onPress={handleGoogleLogin} disabled={isLoading}>
            <MaterialCommunityIcons name="google" size={24} color="#4285F4" />
            <Text style={styles.googleButtonText}>Continue with Google</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <TouchableOpacity onPress={() => setAuthMode(mode === 'LOGIN' ? 'SIGNUP' : 'LOGIN')}>
            <Text style={styles.footerText}>
              {mode === 'LOGIN' 
                ? "Don't have an account? Sign up" 
                : "Have an account? Log in"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  inner: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: scale(30),
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: verticalScale(40),
  },
  logoText: {
    color: '#fff',
    fontSize: moderateScale(45),
    fontWeight: 'bold',
    fontStyle: 'italic',
  },
  form: {
    width: '100%',
  },
  input: {
    backgroundColor: '#121212',
    borderRadius: scale(8),
    paddingVertical: verticalScale(12),
    paddingHorizontal: scale(15),
    color: '#fff',
    fontSize: moderateScale(15),
    borderWidth: 1,
    borderColor: '#333',
    marginBottom: verticalScale(12),
  },
  button: {
    backgroundColor: '#fff',
    borderRadius: scale(8),
    paddingVertical: verticalScale(12),
    alignItems: 'center',
    marginTop: verticalScale(10),
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#000',
    fontSize: moderateScale(16),
    fontWeight: 'bold',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: verticalScale(25),
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#333',
  },
  dividerText: {
    color: '#777',
    paddingHorizontal: scale(15),
    fontSize: moderateScale(12),
    fontWeight: 'bold',
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: scale(10),
  },
  googleButtonText: {
    color: '#4285F4',
    fontSize: moderateScale(16),
    fontWeight: '600',
  },
  footer: {
    position: 'absolute',
    bottom: verticalScale(40),
    left: 0,
    right: 0,
    alignItems: 'center',
    borderTopWidth: 0.5,
    borderTopColor: '#333',
    paddingTop: verticalScale(20),
  },
  footerText: {
    color: '#aaa',
    fontSize: moderateScale(14),
  },
});
