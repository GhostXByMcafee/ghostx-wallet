import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/types';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import useWalletStore from '../../store/useWalletStore';
import analyticsService from '../../services/analytics/analyticsService';
import { Ionicons } from '@expo/vector-icons';

type RouteProps = RouteProp<RootStackParamList, 'TokenDetails'>;
type NavigationProp = StackNavigationProp<RootStackParamList, 'TokenDetails'>;

const TokenDetailsScreen: React.FC = () => {
  const route = useRoute<RouteProps>();
  const navigation = useNavigation<NavigationProp>();
  const { tokenId } = route.params;
  
  const { tokens } = useWalletStore();
  const [amount, setAmount] = useState('');
  const [recipientAddress, setRecipientAddress] = useState('');
  const [activeTab, setActiveTab] = useState<'send' | 'receive'>('send');
  
  const token = tokens.find(t => t.id === tokenId);
  
  useEffect(() => {
    if (token) {
      analyticsService.trackScreen('TokenDetailsScreen', { tokenSymbol: token.symbol });
    }
  }, [token]);

  const handleSend = () => {
    Alert.alert(
      "Simulation of transaction",
      `Sent ${amount} ${token?.symbol} to ${recipientAddress}`,
      [{ text: "OK" }]
    );
    
    analyticsService.trackEvent({
      name: 'token_sent',
      properties: {
        tokenId,
        tokenSymbol: token?.symbol,
        amount,
      },
    });
    
    setAmount('');
    setRecipientAddress('');
  };

  if (!token) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Token not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.tokenSymbol}>{token.symbol}</Text>
        <Text style={styles.tokenName}>{token.name}</Text>
        <Text style={styles.tokenBalance}>
          {parseFloat(token.balance).toFixed(token.decimals === 6 ? 2 : 4)}
        </Text>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'send' && styles.activeTab]}
          onPress={() => setActiveTab('send')}
        >
          <Text style={[styles.tabText, activeTab === 'send' && styles.activeTabText]}>
            Send
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === 'receive' && styles.activeTab]}
          onPress={() => setActiveTab('receive')}
        >
          <Text style={[styles.tabText, activeTab === 'receive' && styles.activeTabText]}>
            Receive
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'send' ? (
        <Card style={styles.formCard}>
          <Input
            label={`Amount of ${token.symbol}`}
            placeholder="0.00"
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
          />
          
          <Input
            label="Recipient address"
            placeholder="Enter an alias or address"
            value={recipientAddress}
            onChangeText={setRecipientAddress}
          />
          
          <Button
            title={`Send ${token.symbol}`}
            onPress={handleSend}
            disabled={!amount || !recipientAddress}
            style={styles.actionButton}
          />
        </Card>
      ) : (
        <Card style={styles.receiveCard}>
          <View style={styles.qrCodePlaceholder}>
            <Text style={styles.qrText}>QR Code</Text>
          </View>
          
          <Text style={styles.addressLabel}>Your address:</Text>
          <View style={styles.addressContainer}>
            <Text style={styles.addressText}>
              {`user:${useWalletStore.getState().alias}`}
            </Text>
            <TouchableOpacity style={styles.copyButton}>
              <Ionicons name="copy-outline" size={20} color="#3366FF" />
            </TouchableOpacity>
          </View>
          
          <Text style={styles.infoText}>
            Share this address to receive payments in {token.symbol}
          </Text>
        </Card>
      )}

      <Card style={styles.infoCard}>
        <Text style={styles.infoCardTitle}>Token information</Text>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Decimals:</Text>
          <Text style={styles.infoValue}>{token.decimals}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Token ID:</Text>
          <Text style={styles.infoValue}>{token.id}</Text>
        </View>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  header: {
    padding: 20,
    backgroundColor: '#1E1E1E',
    alignItems: 'center',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  tokenSymbol: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  tokenName: {
    fontSize: 16,
    color: '#AAAAAA',
    marginBottom: 12,
  },
  tokenBalance: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginVertical: 12,
  },
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#1E1E1E',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#3366FF',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#BBBBBB',
  },
  activeTabText: {
    color: '#FFFFFF',
  },
  formCard: {
    margin: 20,
  },
  receiveCard: {
    margin: 20,
    alignItems: 'center',
    padding: 24,
  },
  qrCodePlaceholder: {
    width: 200,
    height: 200,
    backgroundColor: '#2A2A2A',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  qrText: {
    color: '#FFFFFF',
  },
  addressLabel: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 8,
    alignSelf: 'flex-start',
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2A2A2A',
    padding: 12,
    borderRadius: 8,
    width: '100%',
    marginBottom: 16,
  },
  addressText: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 14,
  },
  copyButton: {
    padding: 4,
  },
  infoText: {
    fontSize: 14,
    color: '#AAAAAA',
    textAlign: 'center',
  },
  actionButton: {
    marginTop: 16,
  },
  infoCard: {
    margin: 20,
    marginTop: 0,
  },
  infoCardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
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
  },
  errorText: {
    fontSize: 18,
    color: '#FF4D4D',
    textAlign: 'center',
    margin: 20,
  },
});

export default TokenDetailsScreen; 