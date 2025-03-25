import React, { useEffect, useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet } from 'react-native';

import WelcomeScreen from '../screens/auth/WelcomeScreen';
import CreateWalletScreen from '../screens/auth/CreateWalletScreen';
import SetupSecurityScreen from '../screens/auth/SetupSecurityScreen';
import BiometricSetupScreen from '../screens/auth/BiometricSetupScreen';
import SuccessScreen from '../screens/auth/SuccessScreen';

import DashboardScreen from '../screens/wallet/DashboardScreen';
import TokenDetailsScreen from '../screens/wallet/TokenDetailsScreen';
import GovernanceScreen from '../screens/governance/GovernanceScreen';
import ProposalDetailsScreen from '../screens/governance/ProposalDetailsScreen';
import CreateProposalScreen from '../screens/governance/CreateProposalScreen';
import SettingsScreen from '../screens/wallet/SettingsScreen';

import { RootStackParamList } from './types';
import useWalletStore from '../store/useWalletStore';
import analyticsService from '../services/analytics/analyticsService';
import LoadingScreen from '../screens/loading/LoadingScreen';

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<RootStackParamList>();

const tabIcon = (iconName: string) => {
  return ({ color, size }: { color: string; size: number }) => (
    <Ionicons name={iconName as any} size={size} color={color} />
  );
};

const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#3366FF',
        tabBarInactiveTintColor: '#888888',
        tabBarStyle: {
          backgroundColor: '#1E1E1E',
          borderTopColor: '#333333',
        },
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          tabBarIcon: tabIcon('wallet-outline'),
          tabBarLabel: "Wallet"
        }}
      />
      <Tab.Screen
        name="Governance"
        component={GovernanceScreen}
        options={{
          tabBarIcon: tabIcon('people-outline'),
          tabBarLabel: "Governance"
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarIcon: tabIcon('settings-outline'),
          tabBarLabel: "Settings"
        }}
      />
    </Tab.Navigator>
  );
};

const AppNavigator = () => {
  const { isInitialized, publicKey, isLoading, initializeWallet } = useWalletStore();
  const [appReady, setAppReady] = useState(false);
  
  useEffect(() => {
    
    const initServices = async () => {
      await analyticsService.initialize();
      
      if (initializeWallet) {
        await initializeWallet();
      }
      
      setAppReady(true);
    };
    
    initServices();
  }, [initializeWallet]);

  if (!appReady) {
    return <LoadingScreen />;
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!publicKey ? (
        <>
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen name="CreateWallet" component={CreateWalletScreen} />
          <Stack.Screen name="SetupSecurity" component={SetupSecurityScreen} />
          <Stack.Screen name="BiometricSetup" component={BiometricSetupScreen} />
          <Stack.Screen name="Success" component={SuccessScreen} />
        </>
      ) : (
        <>
          <Stack.Screen name="Main" component={MainTabs} />
          <Stack.Screen 
            name="TokenDetails" 
            component={TokenDetailsScreen} 
            options={{ 
              headerShown: true,
              headerTitle: "Token Details",
              headerStyle: styles.header,
              headerTintColor: '#FFFFFF'
            }} 
          />
          <Stack.Screen 
            name="ProposalDetails" 
            component={ProposalDetailsScreen} 
            options={{ 
              headerShown: true,
              headerTitle: "Proposal Details",
              headerStyle: styles.header,
              headerTintColor: '#FFFFFF'
            }} 
          />
          <Stack.Screen 
            name="CreateProposal" 
            component={CreateProposalScreen} 
            options={{ 
              headerShown: true,
              headerTitle: "Create Proposal",
              headerStyle: styles.header,
              headerTintColor: '#FFFFFF'
            }} 
          />
        </>
      )}
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#1A1A1A',
    elevation: 0,
    shadowOpacity: 0,
    borderBottomWidth: 0,
  },
});

export default AppNavigator; 