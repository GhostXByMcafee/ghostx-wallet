import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  useWindowDimensions,
  TouchableOpacity,
  Platform
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/types';
import analyticsService from '../../services/analytics/analyticsService';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';

type NavigationProp = StackNavigationProp<RootStackParamList, 'Welcome'>;

const WelcomeScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { width } = useWindowDimensions();
  
  React.useEffect(() => {
    analyticsService.initialize().then(() => {
      console.log("Servicio de analíticas inicializado");
      analyticsService.trackScreen('WelcomeScreen');
    });
  }, []);

  const handleCreateWallet = () => {
    console.log("¡Botón Crear Billetera presionado!");
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
          <Text style={styles.featureDescription}>
            Your keys never leave your device
          </Text>
        </View>
        
        <View style={styles.featureItem}>
          <Text style={styles.featureTitle}>Full Control</Text>
          <Text style={styles.featureDescription}>
            Manage your tokens without intermediaries
          </Text>
        </View>
        
        <View style={styles.featureItem}>
          <Text style={styles.featureTitle}>Governance</Text>
          <Text style={styles.featureDescription}>
            Participate in network decisions with your tokens
          </Text>
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
    marginTop: 20,
    marginBottom: 30,
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
});

export default WelcomeScreen; 