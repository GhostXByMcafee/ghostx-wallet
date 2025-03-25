import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl, SafeAreaView, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/types';
import Card from '../../components/common/Card';
import useWalletStore from '../../store/useWalletStore';
import analyticsService from '../../services/analytics/analyticsService';
import { TokenBalance } from '../../types';

type NavigationProp = StackNavigationProp<RootStackParamList>;

const DashboardScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { tokens, fetchBalances, isLoading, publicKey, alias } = useWalletStore();
  
  useEffect(() => {
    console.log("Dashboard screen mounted");
    analyticsService.logScreen('Dashboard');
    
    if (tokens.length === 0) {
      console.log("No tokens, loading balances...");
      fetchBalances();
    }
  }, []);
  
  const handleTokenPress = (tokenId: string) => {
    console.log("Token pressed:", tokenId);
    navigation.navigate('TokenDetails', { tokenId });
  };
  
  const handleRefresh = () => {
    console.log("Manual refresh triggered");
    fetchBalances();
  };
  
  const ListHeaderComponent = () => (
    <View>
      <View style={styles.header}>
        <Text style={styles.greeting}>Hello, {alias || 'User'}</Text>
        <Text style={styles.walletLabel}>Your wallet</Text>
        <Text style={styles.walletAddress}>{publicKey}</Text>
      </View>
      
      <View style={styles.balanceContainer}>
        <Text style={styles.balanceLabel}>Total balance</Text>
        <Text style={styles.totalBalance}>$2,500.00</Text>
      </View>
      
      <Text style={styles.sectionTitle}>Your Assets</Text>
    </View>
  );
  
  const renderTokenItem = ({ item }: { item: TokenBalance }) => (
    <TouchableOpacity 
      onPress={() => handleTokenPress(item.id)}
      activeOpacity={0.7}
      style={styles.tokenCardContainer}
    >
      <Card style={styles.tokenCard}>
        <View style={styles.tokenInfo}>
          <View style={styles.tokenIconContainer}>
            <View style={styles.tokenIconPlaceholder} />
          </View>
          <View style={styles.tokenDetails}>
            <Text style={styles.tokenSymbol}>{item.symbol}</Text>
            <Text style={styles.tokenName}>{item.name}</Text>
          </View>
        </View>
        <View style={styles.tokenBalance}>
          <Text style={styles.balanceText}>{item.balance}</Text>
          <Text style={styles.usdValue}>≈ ${parseFloat(item.balance) * 2.5}</Text>
        </View>
      </Card>
    </TouchableOpacity>
  );
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#121212" />
      
      <FlatList
        data={tokens}
        keyExtractor={item => item.id}
        renderItem={renderTokenItem}
        ListHeaderComponent={ListHeaderComponent}
        style={styles.list}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={handleRefresh}
            tintColor="#FFFFFF"
            colors={["#3366FF"]}
          />
        }
        showsVerticalScrollIndicator={true}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 20,
  },
  header: {
    padding: 16,
    paddingTop: 20,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  walletLabel: {
    fontSize: 14,
    color: '#AAAAAA',
    marginTop: 8,
  },
  walletAddress: {
    fontSize: 12,
    color: '#CCCCCC',
    marginTop: 2,
  },
  balanceContainer: {
    padding: 16,
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    marginHorizontal: 16,
    marginTop: 8,
  },
  balanceLabel: {
    fontSize: 14,
    color: '#AAAAAA',
  },
  totalBalance: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 24,
    marginBottom: 8,
    paddingHorizontal: 16,
  },
  tokenCardContainer: {
    marginHorizontal: 16,
    marginVertical: 6,
  },
  tokenCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  tokenInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tokenIconContainer: {
    marginRight: 12,
  },
  tokenIconPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#3366FF',
  },
  tokenDetails: {
    justifyContent: 'center',
  },
  tokenSymbol: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  tokenName: {
    fontSize: 14,
    color: '#AAAAAA',
    marginTop: 2,
  },
  tokenBalance: {
    alignItems: 'flex-end',
  },
  balanceText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  usdValue: {
    fontSize: 14,
    color: '#AAAAAA',
    marginTop: 2,
  },
});

export default DashboardScreen; 