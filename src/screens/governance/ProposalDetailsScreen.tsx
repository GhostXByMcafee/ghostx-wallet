import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/types';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import useWalletStore from '../../store/useWalletStore';
import analyticsService from '../../services/analytics/analyticsService';
import { Ionicons } from '@expo/vector-icons';

type RouteProps = RouteProp<RootStackParamList, 'ProposalDetails'>;
type NavigationProp = StackNavigationProp<RootStackParamList, 'ProposalDetails'>;

const ProposalDetailsScreen: React.FC = () => {
  const route = useRoute<RouteProps>();
  const navigation = useNavigation<NavigationProp>();
  const { proposalId } = route.params;
  
  const { proposals, votes, castVote, isLoading, tokens } = useWalletStore();
  const [userVote, setUserVote] = useState<boolean | null>(null);
  
  const proposal = proposals.find(p => p.id === proposalId);
  
  useEffect(() => {
    if (proposal) {
      analyticsService.trackScreen('ProposalDetailsScreen', {
        proposalId: proposal.id,
        proposalTitle: proposal.title,
      });
      
      const existingVote = votes.find(v => v.proposalId === proposalId);
      if (existingVote) {
        setUserVote(existingVote.support);
      }
    }
  }, [proposal, votes]);

  if (!proposal) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          {isLoading ? (
            <>
              <ActivityIndicator size="large" color="#3366FF" />
              <Text style={styles.loadingText}>Loading proposal...</Text>
            </>
          ) : (
            <Text style={styles.errorText}>Proposal not found</Text>
          )}
        </View>
      </View>
    );
  }

  const canVote = proposal.status === 'active' && userVote === null;
  
  const handleVote = async (support: boolean) => {
    Alert.alert(
      `Confirm vote ${support ? 'for' : 'against'}`,
      `Are you sure you want to vote ${support ? 'for' : 'against'} this proposal?`,
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Confirm", 
          onPress: async () => {
            analyticsService.trackEvent({
              name: 'vote_cast',
              properties: {
                proposalId,
                support,
              },
            });
            
            const success = await castVote(proposalId, support);
            if (success) {
              setUserVote(support);
            }
          }
        }
      ]
    );
  };

  const calculateVotingPower = () => {
    return tokens.reduce((total, token) => {
      return total + parseFloat(token.balance);
    }, 0).toFixed(2);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return '#4CD964';
      case 'passed':
        return '#3366FF';
      case 'rejected':
        return '#FF3B30';
      default:
        return '#8E8E93';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Active';
      case 'passed':
        return 'Approved';
      case 'rejected':
        return 'Rejected';
      case 'pending':
        return 'Pending';
      default:
        return status;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  const totalVotes = proposal.votesFor + proposal.votesAgainst;
  const forPercentage = totalVotes > 0 ? Math.round((proposal.votesFor / totalVotes) * 100) : 0;
  const againstPercentage = totalVotes > 0 ? Math.round((proposal.votesAgainst / totalVotes) * 100) : 0;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{proposal.title}</Text>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(proposal.status) }]}>
            <Text style={styles.statusText}>{getStatusText(proposal.status)}</Text>
          </View>
        </View>
        
        <Text style={styles.createdBy}>Created by: {proposal.creator}</Text>
        <Text style={styles.dates}>
          Start: {formatDate(proposal.startDate)} • End: {formatDate(proposal.endDate)}
        </Text>
      </View>

      <Card style={styles.section}>
        <Text style={styles.sectionTitle}>Description</Text>
        <Text style={styles.description}>{proposal.description}</Text>
      </Card>

      <Card style={styles.section}>
        <Text style={styles.sectionTitle}>Voting results</Text>
        
        <View style={styles.voteStatsContainer}>
          <View style={styles.voteRow}>
            <Text style={styles.voteLabel}>For</Text>
            <View style={styles.progressContainer}>
              <View 
                style={[
                  styles.progressBar, 
                  styles.forBar, 
                  { width: `${forPercentage}%` }
                ]} 
              />
            </View>
            <Text style={styles.voteCount}>{proposal.votesFor}</Text>
            <Text style={styles.votePercentage}>{forPercentage}%</Text>
          </View>
          
          <View style={styles.voteRow}>
            <Text style={styles.voteLabel}>Against</Text>
            <View style={styles.progressContainer}>
              <View 
                style={[
                  styles.progressBar, 
                  styles.againstBar, 
                  { width: `${againstPercentage}%` }
                ]} 
              />
            </View>
            <Text style={styles.voteCount}>{proposal.votesAgainst}</Text>
            <Text style={styles.votePercentage}>{againstPercentage}%</Text>
          </View>
        </View>
        
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Total participation</Text>
          <Text style={styles.totalVotes}>{totalVotes} votes</Text>
        </View>
      </Card>

      {userVote !== null && (
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Your vote</Text>
          <View style={[styles.userVoteContainer, userVote ? styles.userVoteFor : styles.userVoteAgainst]}>
            <Ionicons 
              name={userVote ? "checkmark-circle" : "close-circle"} 
              size={24} 
              color="#FFFFFF" 
            />
            <Text style={styles.userVoteText}>
              You voted {userVote ? 'for' : 'against'} this proposal
            </Text>
          </View>
        </Card>
      )}

      {canVote && (
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Cast your vote</Text>
          
          <View style={styles.votingPowerContainer}>
            <Text style={styles.votingPowerLabel}>Your voting power</Text>
            <Text style={styles.votingPowerValue}>{calculateVotingPower()}</Text>
          </View>
          
          <View style={styles.votingButtonsContainer}>
            <Button
              title="Vote for"
              onPress={() => handleVote(true)}
              style={[styles.votingButton, styles.forButton]}
              loading={isLoading}
              disabled={isLoading}
            />
            
            <Button
              title="Vote against"
              onPress={() => handleVote(false)}
              style={[styles.votingButton, styles.againstButton]}
              loading={isLoading}
              disabled={isLoading}
            />
          </View>
          
          <Text style={styles.votingInfo}>
            Your vote cannot be changed once cast. Please ensure you review all the details of the proposal before voting.
          </Text>
        </Card>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#AAAAAA',
  },
  errorText: {
    fontSize: 18,
    color: '#FF4D4D',
    textAlign: 'center',
  },
  header: {
    padding: 20,
    backgroundColor: '#1E1E1E',
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    flex: 1,
    marginRight: 12,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignItems: 'center',
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  createdBy: {
    fontSize: 14,
    color: '#AAAAAA',
    marginBottom: 4,
  },
  dates: {
    fontSize: 14,
    color: '#AAAAAA',
  },
  section: {
    margin: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: '#BBBBBB',
    lineHeight: 24,
  },
  voteStatsContainer: {
    marginBottom: 12,
  },
  voteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  voteLabel: {
    width: 80,
    fontSize: 14,
    color: '#FFFFFF',
  },
  progressContainer: {
    flex: 1,
    height: 8,
    backgroundColor: '#2A2A2A',
    borderRadius: 4,
    marginHorizontal: 8,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 4,
  },
  forBar: {
    backgroundColor: '#4CD964',
  },
  againstBar: {
    backgroundColor: '#FF3B30',
  },
  voteCount: {
    width: 40,
    fontSize: 14,
    color: '#FFFFFF',
    textAlign: 'right',
    marginRight: 8,
  },
  votePercentage: {
    width: 40,
    fontSize: 14,
    color: '#AAAAAA',
    textAlign: 'right',
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#333333',
  },
  totalLabel: {
    fontSize: 14,
    color: '#FFFFFF',
  },
  totalVotes: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  userVoteContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
  },
  userVoteFor: {
    backgroundColor: 'rgba(76, 217, 100, 0.2)',
  },
  userVoteAgainst: {
    backgroundColor: 'rgba(255, 59, 48, 0.2)',
  },
  userVoteText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#FFFFFF',
  },
  votingPowerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: '#2A2A2A',
    padding: 12,
    borderRadius: 8,
  },
  votingPowerLabel: {
    fontSize: 14,
    color: '#AAAAAA',
  },
  votingPowerValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  votingButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  votingButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  forButton: {
    backgroundColor: '#4CD964',
  },
  againstButton: {
    backgroundColor: '#FF3B30',
  },
  votingInfo: {
    fontSize: 12,
    color: '#AAAAAA',
    fontStyle: 'italic',
    textAlign: 'center',
  },
});

export default ProposalDetailsScreen; 