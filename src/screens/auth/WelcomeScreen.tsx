import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import {
  Image,
  StyleSheet,
  Text,
  useWindowDimensions,
  View
} from 'react-native';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import { RootStackParamList } from '../../navigation/types';
import analyticsService from '../../services/analytics/analyticsService';

type NavigationProp = StackNavigationProp<RootStackParamList, 'Welcome'>;

const WelcomeScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { width } = useWindowDimensions();
  
  React.useEffect(() => {
    analyticsService.initialize().then(() => {
      console.log("Analytics service initialized");
      analyticsService.trackScreen('WelcomeScreen');
    });
  }, []);

  const handleCreateWallet = () => {
    console.log("Create Wallet button pressed!");
    analyticsService.trackEvent({
      name: 'start_wallet_creation',
    });
    navigation.navigate('CreateWallet');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Image
            source={require('../../../assets/icon.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
        <Text style={styles.title}>Welcome to ghostEX Wallet</Text>
        <Text style={styles.subtitle}>
          A secure and private wallet to manage your digital assets
        </Text>
      </View>

      <Card style={styles.featuresCard}>
        <View style={styles.featureItem}>
          <Text style={styles.featureTitle}>Total Security</Text>
          <View style={styles.featureRow}>
            <Ionicons name="shield-checkmark" size={24} color="#4CAF50" />
            <Text style={styles.featureDescription}>
              Your keys never leave your device
            </Text>
          </View>
        </View>
        
        <View style={styles.featureItem}>
          <Text style={styles.featureTitle}>Full Control</Text>
          <View style={styles.featureRow}>
            <Ionicons name="flash" size={24} color="#2196F3" />
            <Text style={styles.featureDescription}>
              Manage your tokens without intermediaries
            </Text>
          </View>
        </View>
        
        <View style={styles.featureItem}>
          <Text style={styles.featureTitle}>Governance</Text>
          <View style={styles.featureRow}>
            <Ionicons name="finger-print" size={24} color="#9C27B0" />
            <Text style={styles.featureDescription}>
              Participate in network decisions with your tokens
            </Text>
          </View>
        </View>
      </Card>

      <Button
        title="Create Wallet"
        onPress={handleCreateWallet}
        variant="primary"
        style={styles.createButton}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 16,
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 30,
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  logo: {
    width: 100,
    height: 100,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#BBBBBB',
    textAlign: 'center',
  },
  featuresCard: {
    marginTop: 10,
    marginBottom: 20  ,
  },
  featureItem: {
    marginBottom: 16,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    color: '#AAAAAA',
  },
  createButton: {
    marginTop: 'auto',
    marginBottom: 20,
  },
  featureContainer: {
    marginVertical: 20,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    paddingHorizontal: 20,
  },
  featureText: {
    marginLeft: 12,
    fontSize: 16,
    color: '#333',
  },
});

export default WelcomeScreen; 