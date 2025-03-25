import React, { useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/types';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import analyticsService from '../../services/analytics/analyticsService';

type NavigationProp = StackNavigationProp<RootStackParamList, 'CreateWallet'>;

const CreateWalletScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [alias, setAlias] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState('');
  
  React.useEffect(() => {
    analyticsService.trackScreen('CreateWalletScreen');
  }, []);

  const handleAliasChange = (text: string) => {
    setAlias(text);
    if (error) setError('');
  };

  const validateAlias = (alias: string): boolean => {
    const aliasRegex = /^[a-zA-Z0-9_]{3,20}$/;
    if (!aliasRegex.test(alias)) {
      setError('The alias must be between 3 and 20 characters (letters, numbers and underscores)');
      return false;
    }
    return true;
  };

  const checkAliasAvailability = async (alias: string): Promise<boolean> => {
    setIsVerifying(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const isAvailable = alias.toLowerCase() !== 'admin';
      
      if (!isAvailable) {
        setError('This alias is already in use. Please choose another one.');
      }
      
      return isAvailable;
    } catch (error) {
      setError('Error verifying alias availability. Please try again.');
      return false;
    } finally {
      setIsVerifying(false);
    }
  };

  const handleContinue = async () => {
    if (!validateAlias(alias)) {
      return;
    }
    
    const isAvailable = await checkAliasAvailability(alias);
    
    if (isAvailable) {
      analyticsService.trackEvent({
        name: 'alias_selected',
        properties: {
          aliasLength: alias.length,
        },
      });
      
      navigation.navigate('SetupSecurity', { alias });
    }
  };

  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.container}>
        <Text style={styles.title}>Create your identity on the blockchain</Text>
        
        <Text style={styles.description}>
          Choose a unique alias that will identify you on the blockchain. This alias will be your public address.
        </Text>
        
        <Card style={styles.formCard}>
          <Input
            label="Your alias"
            placeholder="Ej: john_mcafee"
            value={alias}
            onChangeText={handleAliasChange}
            autoCapitalize="none"
            autoCorrect={false}
            error={error}
          />
          
          {isVerifying && (
            <View style={styles.verifyingContainer}>
              <ActivityIndicator size="small" color="#3366FF" />
              <Text style={styles.verifyingText}>Verifying availability...</Text>
            </View>
          )}
          
          <Text style={styles.infoText}>
            Your alias is permanent and cannot be changed once created.
          </Text>
        </Card>
        
        <View style={styles.buttonContainer}>
          <Button
            title="Continue"
            onPress={handleContinue}
            disabled={alias.length < 3 || isVerifying || !!error}
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
  verifyingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  verifyingText: {
    marginLeft: 8,
    color: '#BBBBBB',
    fontSize: 14,
  },
  infoText: {
    fontSize: 14,
    color: '#999999',
    marginTop: 16,
    fontStyle: 'italic',
  },
  buttonContainer: {
    marginTop: 16,
  },
});

export default CreateWalletScreen; 