import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, Alert } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/types';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import encryptionService from '../../services/encryption/encryptionService';
import analyticsService from '../../services/analytics/analyticsService';

type NavigationProp = StackNavigationProp<RootStackParamList, 'BiometricSetup'>;
type RouteProps = RouteProp<RootStackParamList, 'BiometricSetup'>;

const BiometricSetupScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProps>();
  const { alias, passkey, enableBiometric } = route.params;
  
  const [attempts, setAttempts] = useState(0);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  
  useEffect(() => {
    analyticsService.trackScreen('BiometricSetupScreen');
    if (enableBiometric) {
      authenticateWithBiometrics();
    }
  }, []);

  const authenticateWithBiometrics = async () => {
    if (attempts >= 3) {
      analyticsService.trackEvent({
        name: 'biometric_max_attempts_reached',
      });
      
      Alert.alert(
        "Attempts limit reached",
        "You have reached the limit of biometric authentication attempts. You will continue without biometrics.",
        [
          { text: "Continue", onPress: () => proceedToSuccess(false) }
        ]
      );
      return;
    }
    
    setIsAuthenticating(true);
    
    try {
      analyticsService.trackEvent({
        name: 'biometric_authentication_started',
        properties: { attempt: attempts + 1 }
      });
      
      const isAuthenticated = await encryptionService.authenticateWithBiometrics(
        "Verifica tu identidad para configurar la biometría"
      );
      
      if (isAuthenticated) {
        analyticsService.trackEvent({
          name: 'biometric_authentication_success',
        });
        proceedToSuccess(true);
      } else {
        setAttempts(prev => prev + 1);
        analyticsService.trackEvent({
          name: 'biometric_authentication_failed',
          properties: { attempts: attempts + 1 }
        });
        
        Alert.alert(
          "Authentication failed",
          "Unable to verify your identity. Please try again.",
          [{ text: "Accept" }]
        );
      }
    } catch (error) {
      console.error('Biometric authentication error:', error);
      setAttempts(prev => prev + 1);
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleSkip = () => {
    analyticsService.trackEvent({
      name: 'biometric_setup_skipped',
    });
    proceedToSuccess(false);
  };

  const proceedToSuccess = (withBiometrics: boolean) => {
    navigation.navigate('Success', {
      alias,
      passkey,
      enableBiometric: withBiometrics,
    });
  };

  const getStyles = () => StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#121212',
      padding: 20,
    },
    contentContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      color: '#FFFFFF',
      marginBottom: 24,
      textAlign: 'center',
    },
    subtitle: {
      fontSize: 18,
      color: '#BBBBBB',
      marginBottom: 32,
    },
    biometricCard: {
      alignItems: 'center',
      marginBottom: 24,
    },
    fingerprint: {
      width: 120,
      height: 120,
      marginVertical: 24,
    },
    instructionText: {
      fontSize: 16,
      color: '#FFFFFF',
      textAlign: 'center',
      marginBottom: 16,
    },
    attemptsText: {
      fontSize: 14,
      color: attempts >= 3 ? '#FF4D4D' : '#BBBBBB',
      marginTop: 8,
    },
    buttonContainer: {
      marginTop: 16,
    },
    button: {
      marginBottom: 12,
    },
    skipButton: {
      marginTop: 8,
    },
  });
  
  const styles = getStyles();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Biometric setup</Text>
      <Text style={styles.subtitle}>
        Increase the security of your wallet through biometric authentication.
      </Text>
      
      <Card style={styles.biometricCard}>
        <Image
          source={{ uri: 'https://via.placeholder.com/120.png?text=Fingerprint' }}
          style={styles.fingerprint}
          resizeMode="contain"
        />
        
        <Text style={styles.instructionText}>
          Use your fingerprint to confirm your identity
        </Text>
        
        <Text style={styles.attemptsText}>
          Remaining attempts: {3 - attempts}
        </Text>
      </Card>
      
      <View style={styles.buttonContainer}>
        <Button
          title="Retry"
          onPress={authenticateWithBiometrics}
          disabled={isAuthenticating || attempts >= 3}
          loading={isAuthenticating}
          style={styles.button}
        />
        
        <Button
          title="Continue without biometrics"
          onPress={handleSkip}
          variant="outline"
          style={styles.skipButton}
          disabled={isAuthenticating}
        />
      </View>
    </View>
  );
};

export default BiometricSetupScreen; 