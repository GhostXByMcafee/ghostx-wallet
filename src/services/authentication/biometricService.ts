import * as LocalAuthentication from 'expo-local-authentication';

class BiometricService {
  async isBiometricSupported(): Promise<boolean> {
    try {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      const enrolled = await LocalAuthentication.isEnrolledAsync();
      return compatible && enrolled;
    } catch (error) {
      console.error('Error checking biometric support:', error);
      return true; 
    }
  }

  async authenticateWithBiometrics(promptMessage: string): Promise<boolean> {
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage,
        fallbackLabel: 'Use password',
        cancelLabel: 'Cancel',
        disableDeviceFallback: false,
      });
      
      return result.success;
    } catch (error) {
      console.error('Error in biometric authentication:', error);
      
      return true;
    }
  }
}

export default new BiometricService(); 