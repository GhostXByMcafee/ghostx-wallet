import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import InputModal from '../../components/common/InputModal';
import TransactionResultModal from '../../components/common/TransactionResultModal';
import analyticsService from '../../services/analytics/analyticsService';
import useWalletStore from '../../store/useWalletStore';

const SwapScreen: React.FC = () => {
  const { tokens } = useWalletStore();
  const [fromToken, setFromToken] = useState<string | null>(null);
  const [toToken, setToToken] = useState<string | null>(null);
  const [amount, setAmount] = useState('0.0');
  const [estimatedAmount, setEstimatedAmount] = useState('0.0');
  const [isCalculating, setIsCalculating] = useState(false);
  const [exchangeRate, setExchangeRate] = useState(0);
  const [slippage, setSlippage] = useState(0.5);
  
  const [modalVisible, setModalVisible] = useState(false);
  const [modalSuccess, setModalSuccess] = useState(true);
  const [modalTitle, setModalTitle] = useState('');
  const [modalMessage, setModalMessage] = useState('');
  const [modalDetails, setModalDetails] = useState('');
  
  const [inputModalVisible, setInputModalVisible] = useState(false);
  
  const selectedFromToken = tokens.find(t => t.id === fromToken);
  const selectedToToken = tokens.find(t => t.id === toToken);
  
  useEffect(() => {
    analyticsService.trackScreen('SwapScreen');
    
    if (tokens.length > 0 && !fromToken) {
      setFromToken(tokens[0].id);
    }
    
    if (tokens.length > 1 && !toToken) {
      setToToken(tokens[1].id);
    }
  }, [tokens]);
  
  useEffect(() => {
    if (fromToken && toToken) {
      calculateSwapRate();
    }
  }, [fromToken, toToken]);
  
  const calculateSwapRate = async () => {
    if (!fromToken || !toToken) return;
    
    setIsCalculating(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockRate = 0.5 + Math.random() * 1.5;
      setExchangeRate(parseFloat(mockRate.toFixed(4)));
      
      if (amount && parseFloat(amount) > 0) {
        const estimated = parseFloat(amount) * mockRate;
        setEstimatedAmount(estimated.toFixed(6));
      }
    } catch (error) {
      console.error('Error calculating swap rate:', error);
    } finally {
      setIsCalculating(false);
    }
  };
  
  const handleAmountChange = (value: string) => {
    if (/^\d*\.?\d*$/.test(value) || value === '') {
      setAmount(value);
      
      if (exchangeRate > 0 && value && parseFloat(value) > 0) {
        const estimated = parseFloat(value) * exchangeRate;
        setEstimatedAmount(estimated.toFixed(6));
      } else {
        setEstimatedAmount('0.0');
      }
    }
  };
  
  const handleAmountPress = () => {
    setInputModalVisible(true);
  };
  
  const handleAmountSubmit = (value: string) => {
    handleAmountChange(value);
  };
  
  const handleSwapTokens = () => {
    const tempFrom = fromToken;
    setFromToken(toToken);
    setToToken(tempFrom);
    
    setAmount(estimatedAmount);
    
    analyticsService.trackEvent({
      name: 'swap_tokens_flipped',
    });
  };
  
  const handleExecuteSwap = async () => {
    if (!fromToken || !toToken || !amount || parseFloat(amount) <= 0) return;
    
    analyticsService.trackEvent({
      name: 'swap_executed',
      properties: {
        fromToken: selectedFromToken?.symbol,
        toToken: selectedToToken?.symbol,
        amount: parseFloat(amount),
        slippage
      }
    });
    
    try {
      const randomSuccess = Math.random() < 0.8;

      await new Promise(resolve => setTimeout(resolve, 1500));

      if (randomSuccess) {
        setModalSuccess(true);
        setModalTitle('Success');
        setModalMessage(`You have swapped ${amount} ${selectedFromToken?.symbol} for approximately ${estimatedAmount} ${selectedToToken?.symbol}.`);
        setModalDetails(`Exchange rate: 1 ${selectedFromToken?.symbol} = ${exchangeRate.toFixed(6)} ${selectedToToken?.symbol}\nSlippage: ${slippage}%`);
      } else {
        const errorTypes = [
          "Insufficient liquidity",
          "High price impact",
          "Exceeds slippage limit",
          "Blockchain error"
        ];
        const randomError = errorTypes[Math.floor(Math.random() * errorTypes.length)];
        
        setModalSuccess(false);
        setModalTitle('Swap Failed');
        setModalMessage(`The swap could not be completed due to: ${randomError}.`);
        setModalDetails(`Try with a smaller amount or adjust the slippage. If the problem persists, try again later.`);
      }
      
      setModalVisible(true);
      
    } catch (error) {
      setModalSuccess(false);
      setModalTitle('Unexpected Error');
      setModalMessage('An unexpected error occurred while processing your transaction.');
      setModalDetails(`Technical details: ${error}`);
      setModalVisible(true);
    }
  };
  
  const handleCloseModal = () => {
    setModalVisible(false);
    
    if (modalSuccess) {
      setAmount('0.0');
      setEstimatedAmount('0.0');
    }
  };
  
  const renderTokenSelector = (
    title: string, 
    selectedToken: string | null,
    onSelect: (id: string) => void
  ) => (
    <View style={styles.tokenSelector}>
      <Text style={styles.selectorTitle}>{title}</Text>
      <ScrollView 
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.tokenList}
      >
        {tokens.map(token => (
          <TouchableOpacity
            key={token.id}
            style={[
              styles.tokenItem,
              selectedToken === token.id && styles.selectedTokenItem
            ]}
            onPress={() => onSelect(token.id)}
          >
            {token.iconUrl ? (
              <Image 
                source={token.iconUrl} 
                style={styles.tokenIcon} 
              />
            ) : (
              <View style={[styles.tokenIcon, styles.placeholderIcon]}>
                <Text style={styles.tokenIconText}>{token.symbol.charAt(0)}</Text>
              </View>
            )}
            <Text 
              style={[
                styles.tokenSymbol,
                selectedToken === token.id && styles.selectedTokenSymbol
              ]}
            >
              {token.symbol}
            </Text>
            <Text style={styles.tokenBalance}>
              {`${token.balance}`}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
  
  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Swap Tokens</Text>
        <Text style={styles.subtitle}>
          Trade your tokens easily and privately
        </Text>
        
        <Card style={styles.swapCard}>
          {renderTokenSelector('What I have', fromToken, setFromToken)}
          
          {fromToken && (
            <View style={styles.amountContainer}>
              <Text style={styles.amountLabel}>Amount</Text>
              <TouchableOpacity style={styles.maxButton} onPress={() => {
                const maxAmount = selectedFromToken?.balance || '0';
                handleAmountChange(maxAmount);
              }}>
                <Text style={styles.maxButtonText}>MAX</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.amountInput}
                onPress={handleAmountPress}
              >
                <Text style={styles.amountText}>{amount}</Text>
              </TouchableOpacity>
            </View>
          )}
          
          <TouchableOpacity 
            style={styles.swapButton}
            onPress={handleSwapTokens}
          >
            <Text style={styles.swapButtonText}>↑↓</Text>
          </TouchableOpacity>
          
          {renderTokenSelector('What I want', toToken, setToToken)}
          
          {toToken && (
            <View style={styles.estimatedContainer}>
              <Text style={styles.estimatedLabel}>
                You will receive approximately:
              </Text>
              <View style={styles.estimatedRow}>
                {isCalculating ? (
                  <ActivityIndicator size="small" color="#3366FF" />
                ) : (
                  <Text style={styles.estimatedAmount}>
                    {estimatedAmount} {selectedToToken?.symbol}
                  </Text>
                )}
              </View>
              
              <View style={styles.rateContainer}>
                <Text style={styles.rateLabel}>Exchange rate:</Text>
                {isCalculating ? (
                  <ActivityIndicator size="small" color="#3366FF" />
                ) : (
                  <Text style={styles.rateValue}>
                    1 {selectedFromToken?.symbol} = {exchangeRate} {selectedToToken?.symbol}
                  </Text>
                )}
              </View>
              
              <View style={styles.slippageContainer}>
                <Text style={styles.slippageLabel}>Slippage:</Text>
                <View style={styles.slippageOptions}>
                  {[0.5, 1.0, 2.0].map(value => (
                    <TouchableOpacity
                      key={value}
                      style={[
                        styles.slippageOption,
                        slippage === value && styles.slippageOptionSelected
                      ]}
                      onPress={() => setSlippage(value)}
                    >
                      <Text style={[
                        styles.slippageOptionText,
                        slippage === value && styles.slippageOptionTextSelected
                      ]}>
                        {value}%
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>
          )}
          
          <Button
            title="Swap now"
            onPress={handleExecuteSwap}
            disabled={
              !fromToken || 
              !toToken || 
              parseFloat(amount) <= 0 || 
              isCalculating
            }
          />
          
          <Text style={styles.disclaimer}>
            The prices shown are approximate and may vary. The actual transaction could differ based on market conditions.
          </Text>
        </Card>
        
        <TransactionResultModal
          visible={modalVisible}
          onClose={handleCloseModal}
          success={modalSuccess}
          title={modalTitle}
          message={modalMessage}
          details={modalDetails}
        />
        
        <InputModal
          visible={inputModalVisible}
          onClose={() => setInputModalVisible(false)}
          onSubmit={handleAmountSubmit}
          title="Enter the amount"
          initialValue={amount === '0.0' ? '' : amount}
          placeholder="Amount"
          keyboardType="numeric"
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#AAAAAA',
    marginBottom: 24,
  },
  swapCard: {
    padding: 16,
    marginBottom: 16,
    backgroundColor: '#1E1E1E',
  },
  tokenSelector: {
    marginBottom: 16,
  },
  selectorTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  tokenList: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  tokenItem: {
    padding: 10,
    backgroundColor: '#2A2A2A',
    borderRadius: 12,
    marginRight: 8,
    alignItems: 'center',
    minWidth: 80,
  },
  selectedTokenItem: {
    backgroundColor: '#2C4D8E',
  },
  tokenIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  placeholderIcon: {
    backgroundColor: '#444444',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tokenIconText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  tokenSymbol: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  selectedTokenSymbol: {
    color: '#FFFFFF',
  },
  tokenBalance: {
    color: '#AAAAAA',
    fontSize: 12,
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
    paddingBottom: 8,
  },
  amountLabel: {
    color: '#FFFFFF',
    fontSize: 16,
    marginRight: 8,
  },
  maxButton: {
    backgroundColor: '#3366FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 8,
  },
  maxButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  amountInput: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#2A2A2A',
    borderRadius: 8,
    marginLeft: 8,
    justifyContent: 'center'
  },
  amountText: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: '500'
  },
  swapButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#3366FF',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginVertical: 16,
  },
  swapButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  estimatedContainer: {
    marginBottom: 24,
    padding: 16,
    backgroundColor: '#2A2A2A',
    borderRadius: 12,
  },
  estimatedLabel: {
    color: '#AAAAAA',
    fontSize: 14,
    marginBottom: 8,
  },
  estimatedRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  estimatedAmount: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  rateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#333333',
  },
  rateLabel: {
    color: '#AAAAAA',
    fontSize: 14,
  },
  rateValue: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  slippageContainer: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#333333',
  },
  slippageLabel: {
    color: '#AAAAAA',
    fontSize: 14,
    marginBottom: 8,
  },
  slippageOptions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  slippageOption: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#222222',
  },
  slippageOptionSelected: {
    backgroundColor: '#3366FF',
  },
  slippageOptionText: {
    color: '#AAAAAA',
    fontSize: 14,
  },
  slippageOptionTextSelected: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  disclaimer: {
    color: '#888888',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 16,
    fontStyle: 'italic',
  },
  tokenIconPlaceholder: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#3366FF',
    marginRight: 8,
  },
});

export default SwapScreen; 