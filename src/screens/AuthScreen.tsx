/**
 * Authentication Screen
 * UAE Pass login
 */

import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import {uaePassService} from '../services/uae-pass';
import {useAppStore} from '../store/useAppStore';

export const AuthScreen: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const setAuthenticated = useAppStore(state => state.setAuthenticated);

  const handleUaePassLogin = async () => {
    setIsLoading(true);
    
    try {
      await uaePassService.initialize();
      const user = await uaePassService.authenticate();
      setAuthenticated(true, user);
    } catch (error) {
      console.error('Authentication error:', error);
      // In production, show error message to user
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>HAYAT</Text>
          <Text style={styles.subtitle}>
            Your Family Government AI Advisor
          </Text>
        </View>

        <View style={styles.description}>
          <Text style={styles.descriptionText}>
            HAYAT monitors your family's government obligations and acts on
            your behalf. Get notified about visa renewals, fines, vaccinations,
            and more.
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
          onPress={handleUaePassLogin}
          disabled={isLoading}>
          {isLoading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.loginButtonText}>Sign in with UAE Pass</Text>
          )}
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Secure authentication via UAE Pass
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  title: {
    fontSize: 48,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 18,
    color: '#6B7280',
    textAlign: 'center',
  },
  description: {
    marginBottom: 48,
  },
  descriptionText: {
    fontSize: 16,
    color: '#374151',
    lineHeight: 24,
    textAlign: 'center',
  },
  loginButton: {
    backgroundColor: '#3B82F6',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 24,
  },
  loginButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#9CA3AF',
  },
});
