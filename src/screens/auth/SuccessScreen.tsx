import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import LottieView from 'lottie-react-native';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import { RootStackParamList } from '../../navigation/types';
import analyticsService from '../../services/analytics/analyticsService';
import useWalletStore from '../../store/useWalletStore';

type NavigationProp = StackNavigationProp<RootStackParamList, 'Success'>;
type RouteProps = RouteProp<RootStackParamList, 'Success'>;

const SuccessScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProps>();
  const { alias, passkey, enableBiometric } = route.params || {};
  const { width } = useWindowDimensions();
  
  const { createWallet, isLoading } = useWalletStore();
  const [isLoadingState, setIsLoading] = useState(false);
  
  useEffect(() => {
    analyticsService.trackScreen('SuccessScreen');
  }, []);

  const handleBridgeUSDC = async () => {
    setIsLoading(true);
    if (alias && passkey) {
      await createWallet(alias, passkey, enableBiometric);
    }
    setIsLoading(false);
    
    analyticsService.trackEvent({
      name: 'bridge_usdc_selected',
    });
  };

  const handleGoDashboard = async () => {
    setIsLoading(true);
    if (alias && passkey) {
      await createWallet(alias, passkey, enableBiometric);
    }
    setIsLoading(false);
    
    analyticsService.trackEvent({
      name: 'go_to_dashboard_selected',
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <LottieView
          source={require('../../../assets/success-fireworks-animation.json')}
          autoPlay
          loop={false}
          style={{
            width: 200,
            height: 200,
            alignSelf: 'center',
            marginBottom: 30
          }}
        />
        
        <Text style={styles.title}>Wallet created successfully!</Text>
        
        <Text style={styles.subtitle}>
          Your identity on the blockchain has been configured correctly.
        </Text>
        
        <Card style={styles.walletInfoCard}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Alias:</Text>
            <Text style={styles.infoValue}>{alias}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Biometrics:</Text>
            <Text style={styles.infoValue}>
              {enableBiometric ? 'Enabled' : 'Disabled'}
            </Text>
          </View>
        </Card>
      </View>

      <View style={styles.optionsContainer}>
        <Text style={styles.optionsTitle}>What do you want to do now?</Text>
        
        <Button
          title="Bridge USDC from Base"
          onPress={handleBridgeUSDC}
          style={styles.optionButton}
          disabled={isLoadingState}
          loading={isLoadingState}
        />
        
        <Button
          title="Go to dashboard"
          onPress={handleGoDashboard}
          variant="outline"
          style={styles.optionButton}
          disabled={isLoadingState}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#121212',
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  successImage: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    color: '#BBBBBB',
    textAlign: 'center',
    marginBottom: 32,
  },
  walletInfoCard: {
    width: '100%',
    marginVertical: 24,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 16,
    color: '#AAAAAA',
  },
  infoValue: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  optionsContainer: {
    width: '100%',
    marginBottom: 40,
  },
  optionsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
    textAlign: 'center',
  },
  optionButton: {
    marginVertical: 8,
  },
});

export default SuccessScreen; 