import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
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

export default function OnboardingScreen() {
  const [name, setName] = useState('');
  const { createAccount, setRegistered } = useListagramStore();

  const handleGetStarted = () => {
    const trimmedName = name.trim();
    if (!trimmedName) {
      Alert.alert('Name Required', 'Please enter your name to create an account.');
      return;
    }

    createAccount(trimmedName);
    setRegistered(true);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.inner}>
        <View style={styles.logoContainer}>
          <MaterialCommunityIcons name="instagram" size={scale(100)} color="#fff" />
          <Text style={styles.logoText}>Listagram</Text>
          <Text style={styles.tagline}>Capturing moments, even offline.</Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>What should we call you?</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your name"
            placeholderTextColor="#777"
            value={name}
            onChangeText={setName}
            autoFocus
          />

          <TouchableOpacity
            style={[styles.button, !name.trim() && styles.buttonDisabled]}
            onPress={handleGetStarted}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>Get Started</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            By continuing, you agree to our Terms and Privacy Policy.
          </Text>
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
    marginBottom: verticalScale(50),
  },
  logoText: {
    color: '#fff',
    fontSize: moderateScale(40),
    fontWeight: 'bold',
    marginTop: verticalScale(10),
    fontStyle: 'italic',
  },
  tagline: {
    color: '#888',
    fontSize: moderateScale(16),
    marginTop: verticalScale(8),
  },
  form: {
    width: '100%',
  },
  label: {
    color: '#fff',
    fontSize: moderateScale(18),
    marginBottom: verticalScale(15),
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#1a1a1a',
    borderRadius: moderateScale(12),
    paddingVertical: verticalScale(15),
    paddingHorizontal: scale(20),
    color: '#fff',
    fontSize: moderateScale(16),
    borderWidth: 1,
    borderColor: '#333',
    marginBottom: verticalScale(20),
  },
  button: {
    backgroundColor: '#fff',
    borderRadius: moderateScale(12),
    paddingVertical: verticalScale(15),
    alignItems: 'center',
    shadowColor: '#fff',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  buttonDisabled: {
    backgroundColor: '#555',
  },
  buttonText: {
    color: '#000',
    fontSize: moderateScale(18),
    fontWeight: 'bold',
  },
  footer: {
    position: 'absolute',
    bottom: verticalScale(40),
    left: scale(30),
    right: scale(30),
    alignItems: 'center',
  },
  footerText: {
    color: '#555',
    fontSize: moderateScale(12),
    textAlign: 'center',
  },
});
