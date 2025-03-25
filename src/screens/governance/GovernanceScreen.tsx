import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/types';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import useWalletStore from '../../store/useWalletStore';
import analyticsService from '../../services/analytics/analyticsService';
import { Proposal } from '../../types';

type NavigationProp = StackNavigationProp<RootStackParamList>;

const GovernanceScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { proposals, isLoading, tokens, fetchProposals } = useWalletStore();
  const [refreshing, setRefreshing] = useState(false);
  
  useEffect(() => {
    console.log("Governance screen in focus");
    analyticsService.trackScreen('GovernanceScreen');
    
    const fetchData = async () => {
      if (fetchProposals) {
        await fetchProposals();
      } else {
        console.error("fetchProposals method is not available in WalletStore");
      }
    };
    
    fetchData();
  }, [fetchProposals]);

  const handleRefresh = async () => {
    setRefreshing(true);
    if (fetchProposals) {
      await fetchProposals();
    }
    setRefreshing(false);
  };

  const navigateToProposalDetails = (proposalId: string) => {
    navigation.navigate('ProposalDetails', { proposalId });
  };

  const navigateToCreateProposal = () => {
    navigation.navigate('CreateProposal');
  };

  // Calculate total voting power
  const calculateVotingPower = () => {
    return tokens.reduce((total, token) => {
      return total + parseFloat(token.balance);
    }, 0).toFixed(2);
  };

  const renderProposalItem = ({ item }: { item: Proposal }) => (
    <TouchableOpacity onPress={() => navigateToProposalDetails(item.id)}>
      <Card style={styles.proposalCard}>
        <View style={styles.proposalHeader}>
          <Text style={styles.proposalTitle}>{item.title}</Text>
          <View style={[
            styles.statusBadge,
            item.status === 'active' ? styles.activeBadge : 
            item.status === 'passed' ? styles.passedBadge : styles.rejectedBadge
          ]}>
            <Text style={styles.statusText}>
              {item.status === 'active' ? 'Active' : 
               item.status === 'passed' ? 'Passed' : 'Rejected'}
            </Text>
          </View>
        </View>
        
        <Text style={styles.proposalDescription} numberOfLines={2}>
          {item.description}
        </Text>
        
        <View style={styles.proposalFooter}>
          <Text style={styles.proposalDate}>
            Ends: {new Date(item.endDate).toLocaleDateString()}
          </Text>
          <Text style={styles.voteCount}>
            {item.votesFor + item.votesAgainst} votes
          </Text>
        </View>
      </Card>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Governance</Text>
        <Text style={styles.subtitle}>Participate in decisions with your tokens</Text>
      </View>
      
      <Card style={styles.powerCard}>
        <View style={styles.powerContainer}>
          <Text style={styles.powerLabel}>Your Voting Power</Text>
          <Text style={styles.powerValue}>{calculateVotingPower()}</Text>
        </View>
      </Card>

      <View style={styles.listContainer}>
        <View style={styles.listHeader}>
          <Text style={styles.listTitle}>Active Proposals</Text>
          <Button 
            title="Create Proposal"
            onPress={navigateToCreateProposal}
            variant="primary"
            size="small"
          />
        </View>
        
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#3366FF" />
            <Text style={styles.loadingText}>Loading proposals...</Text>
          </View>
        ) : proposals.length === 0 ? (
          <Card style={styles.emptyCard}>
            <Text style={styles.emptyText}>No proposals available</Text>
            <Text style={styles.emptySubtext}>
              Create a new proposal or check back later
            </Text>
          </Card>
        ) : (
          <FlatList
            data={proposals}
            renderItem={renderProposalItem}
            keyExtractor={item => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
            onRefresh={handleRefresh}
            refreshing={refreshing}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  header: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#BBBBBB',
    lineHeight: 22,
  },
  powerCard: {
    margin: 20,
    marginTop: 0,
    marginBottom: 16,
  },
  powerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  powerLabel: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  powerValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  listContainer: {
    flex: 1,
    margin: 20,
    marginTop: 0,
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  listContent: {
    paddingBottom: 20,
  },
  proposalCard: {
    marginBottom: 12,
  },
  proposalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  proposalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    flex: 1,
    marginRight: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeBadge: {
    backgroundColor: 'rgba(51, 102, 255, 0.2)',
  },
  passedBadge: {
    backgroundColor: 'rgba(76, 217, 100, 0.2)',
  },
  rejectedBadge: {
    backgroundColor: 'rgba(255, 59, 48, 0.2)',
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  proposalDescription: {
    fontSize: 14,
    color: '#BBBBBB',
    marginBottom: 12,
    lineHeight: 20,
  },
  proposalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  proposalDate: {
    fontSize: 12,
    color: '#AAAAAA',
  },
  voteCount: {
    fontSize: 12,
    color: '#AAAAAA',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#AAAAAA',
  },
  emptyCard: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#AAAAAA',
    textAlign: 'center',
  },
});

export default GovernanceScreen; 