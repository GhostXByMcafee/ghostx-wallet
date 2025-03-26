import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import PasswordStrengthMeter from '../../components/common/PasswordStrengthMeter';
import ToggleSwitch from '../../components/common/ToggleSwitch';
import { RootStackParamList } from '../../navigation/types';
import analyticsService from '../../services/analytics/analyticsService';
import encryptionService from '../../services/encryption/encryptionService';
import useWalletStore from '../../store/useWalletStore';

type NavigationProp = StackNavigationProp<RootStackParamList, 'SetupSecurity'>;
type RouteProps = RouteProp<RootStackParamList, 'SetupSecurity'>;

const SetupSecurityScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProps>();
  const { createWallet } = useWalletStore();
  const { alias } = route.params || {};
  
  const [passkey, setPasskey] = useState('');
  const [confirmPasskey, setConfirmPasskey] = useState('');
  const [enableBiometric, setEnableBiometric] = useState(false);
  const [isBiometricSupported, setIsBiometricSupported] = useState(false);
  const [passkeyError, setPasskeyError] = useState('');
  const [confirmError, setConfirmError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  React.useEffect(() => {
    analyticsService.trackScreen('SetupSecurityScreen');
    checkBiometricSupport();
  }, []);
  
  const checkBiometricSupport = async () => {
    const supported = await encryptionService.isBiometricSupported();
    setIsBiometricSupported(supported);
  };

  const validatePasskey = (passkey: string): boolean => {
    if (passkey.length < 8) {
      setPasskeyError('The password must be at least 8 characters long');
      return false;
    }
    
    const hasUpperCase = /[A-Z]/.test(passkey);
    const hasLowerCase = /[a-z]/.test(passkey);
    const hasNumber = /\d/.test(passkey);
    const hasSpecial = /[^A-Za-z0-9]/.test(passkey);
    
    if (!hasUpperCase || !hasLowerCase || !hasNumber || !hasSpecial) {
      setPasskeyError('The password must include uppercase, lowercase, numbers and special characters');
      return false;
    }
    
    setPasskeyError('');
    return true;
  };
  
  const validateConfirmPasskey = (confirm: string): boolean => {
    if (confirm !== passkey) {
      setConfirmError('The passwords do not match');
      return false;
    }
    
    setConfirmError('');
    return true;
  };

  const handlePasskeyChange = (text: string) => {
    setPasskey(text);
    if (passkeyError) validatePasskey(text);
    if (confirmPasskey) validateConfirmPasskey(confirmPasskey);
  };

  const handleConfirmChange = (text: string) => {
    setConfirmPasskey(text);
    if (confirmError) validateConfirmPasskey(text);
  };

  const handleToggleBiometric = (value: boolean) => {
    setEnableBiometric(value);
  };

  const handleContinue = async () => {
    if (!validatePasskey(passkey) || !validateConfirmPasskey(confirmPasskey)) {
      return;
    }

    navigation.navigate('BiometricSetup', {
      alias,
      passkey,
      enableBiometric
    });
  };

  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.container}>
        <Text style={styles.title}>Setup your wallet security</Text>
        
        <Text style={styles.description}>
          Create a secure password to protect your wallet. This password will be required to access your funds.
        </Text>
        
        <Card style={styles.formCard}>
          <Input
            label="Password"
            placeholder="Enter your password"
            value={passkey}
            onChangeText={handlePasskeyChange}
            secureTextEntry
            isPassword
            error={passkeyError}
          />
          <PasswordStrengthMeter password={passkey} />
          
          <Input
            label="Confirm password"
            placeholder="Confirm your password"
            value={confirmPasskey}
            onChangeText={handleConfirmChange}
            secureTextEntry
            isPassword
            error={confirmError}
          />
          
          {isBiometricSupported && (
            <View style={styles.biometricContainer}>
              <ToggleSwitch
                label="Enable biometric authentication"
                value={enableBiometric}
                onValueChange={handleToggleBiometric}
              />
              <Text style={styles.biometricDescription}>
                Use your fingerprint for faster and more secure access.
              </Text>
            </View>
          )}
          
          <Text style={styles.securityTips}>
            Security tips:
            {'\n'}- Use a unique password that you don't use on other sites
            {'\n'}- Include letters, numbers and symbols
            {'\n'}- Never share your password with anyone
          </Text>
        </Card>
        
        <View style={styles.buttonContainer}>
          <Button
            title="Continue"
            onPress={handleContinue}
            disabled={!passkey || !confirmPasskey || !!passkeyError || !!confirmError}
          />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: '#121212',
  },
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: '#BBBBBB',
    marginBottom: 32,
  },
  formCard: {
    marginBottom: 24,
  },
  biometricContainer: {
    marginTop: 16,
  },
  biometricDescription: {
    fontSize: 14,
    color: '#999999',
    marginTop: 8,
  },
  securityTips: {
    fontSize: 14,
    color: '#AAAAAA',
    marginTop: 24,
    lineHeight: 22,
  },
  buttonContainer: {
    marginTop: 16,
  },
});

export default SetupSecurityScreen; 