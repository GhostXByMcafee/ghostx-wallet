import EncryptedStorage from 'react-native-encrypted-storage';
import * as LocalAuthentication from 'expo-local-authentication';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

interface WalletData {
  alias: string;
  privateKey: string;
  publicKey: string;
  biometricEnabled: boolean;
}

interface UserData {
  userId: string;
  displayName: string;
  email?: string;
  preferences?: Record<string, any>;
}

class EncryptionService {
  private memoryStorage: Record<string, string> = {};
  private readonly WALLET_STORAGE_KEY = 'WALLET_DATA';
  private readonly USER_STORAGE_KEY = 'USER_DATA';

  async saveUserData(userData: UserData): Promise<boolean> {
    try {
      this.memoryStorage[this.USER_STORAGE_KEY] = JSON.stringify(userData);
      console.log('[EncryptionService] User saved:', userData.displayName);
      return true;
    } catch (error) {
      console.error('[EncryptionService] Error saving user data:', error);
      return false;
    }
  }

  async getUserData(): Promise<UserData | null> {
    try {
      const userData = this.memoryStorage[this.USER_STORAGE_KEY];
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('[EncryptionService] Error retrieving user data:', error);
      return null;
    }
  }

  async saveWalletData(walletData: WalletData): Promise<boolean> {
    try {
      this.memoryStorage[this.WALLET_STORAGE_KEY] = JSON.stringify(walletData);
      console.log('[EncryptionService] Wallet saved for:', walletData.alias);
      return true;
    } catch (error) {
      console.error('[EncryptionService] Error saving wallet data:', error);
      return false;
    }
  }

  async getWalletData(): Promise<WalletData | null> {
    try {
      const walletData = this.memoryStorage[this.WALLET_STORAGE_KEY];
      return walletData ? JSON.parse(walletData) : null;
    } catch (error) {
      console.error('[EncryptionService] Error retrieving wallet data:', error);
      return null;
    }
  }

  async hasUserAccount(): Promise<boolean> {
    try {
      const userData = this.memoryStorage[this.USER_STORAGE_KEY];
      return !!userData;
    } catch (error) {
      console.error('[EncryptionService] Error checking user account:', error);
      return false;
    }
  }

  async checkWalletExists(): Promise<boolean> {
    try {
      const walletData = await this.getWalletData();
      return !!walletData && !!walletData.publicKey;
    } catch (error) {
      console.error('[EncryptionService] Error checking wallet existence:', error);
      return false;
    }
  }

  async clearAllData(): Promise<boolean> {
    try {
      this.memoryStorage = {};
      console.log('[EncryptionService] All data cleared');
      return true;
    } catch (error) {
      console.error('[EncryptionService] Error clearing data:', error);
      return false;
    }
  }

  /**
   * Checks if the device supports biometric authentication
   * @returns true if the device supports biometrics
   */
  async isBiometricSupported(): Promise<boolean> {
    const compatible = await LocalAuthentication.hasHardwareAsync();
    const enrolled = await LocalAuthentication.isEnrolledAsync();
    return compatible && enrolled;
  }

  /**
   * Authenticates the user using biometrics
   * @param promptMessage Message to display to the user
   * @returns true if the authentication is successful
   */
  async authenticateWithBiometrics(promptMessage: string): Promise<boolean> {
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage,
        disableDeviceFallback: false,
      });
      return result.success;
    } catch (error) {
      console.error('Error in biometric authentication:', error);
      return false;
    }
  }

  /**
   * Stores a secure value using SecureStore (for smaller values)
   * @param key Storage key
   * @param value Value to store
   */
  async secureStore(key: string, value: string): Promise<boolean> {
    try {
      await SecureStore.setItemAsync(key, value);
      return true;
    } catch (error) {
      console.error('Error storing in SecureStore:', error);
      return false;
    }
  }

  /**
   * Retrieves a secure value from SecureStore
   * @param key Storage key
   * @returns Stored value or null if it doesn't exist
   */
  async secureRetrieve(key: string): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync(key);
    } catch (error) {
      console.error('Error retrieving from SecureStore:', error);
      return null;
    }
  }
}

export default new EncryptionService(); 