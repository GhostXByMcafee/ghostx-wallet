import { TokenBalance, Proposal, Vote } from '../../types';

// Example data for development
export const mockTokens: TokenBalance[] = [
  {
    id: '1',
    name: 'Ethereum',
    symbol: 'ETH',
    balance: '2.34',
    decimals: 18,
    iconUrl: 'https://cryptologos.cc/logos/ethereum-eth-logo.png',
  },
  {
    id: '2',
    name: 'USD Coin',
    symbol: 'USDC',
    balance: '156.78',
    decimals: 6,
    iconUrl: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png',
  },
  {
    id: '3',
    name: 'Ghost Token',
    symbol: 'GHOST',
    balance: '1245.67',
    decimals: 18,
    iconUrl: 'https://via.placeholder.com/64',
  },
];

export const mockProposals: Proposal[] = [
  {
    id: '1',
    title: 'Reduce transaction fees by 20%',
    description: 'This proposal seeks to reduce transaction fees on the network by 20% to make the platform more accessible to new users...',
    creator: '0x1234567890abcdef',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'active',
    votesFor: 156780,
    votesAgainst: 98450,
    executed: false,
  },
  {
    id: '2',
    title: 'Implement a rewards program for active users',
    description: 'This proposal seeks to implement a rewards program for users who actively use the platform...',
    creator: '0x1234567890abcdef',
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    startDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    endDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'closed',
    votesFor: 245680,
    votesAgainst: 134570,
    executed: true,
  },
];

export const mockVotes: Vote[] = [
  {
    id: '1',
    proposalId: '1',
    voter: '0x1234567890abcdef',
    support: true,
    voteWeight: 1250,
    timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '2',
    proposalId: '1',
    voter: '0x2345678901bcdef',
    support: false,
    voteWeight: 750,
    timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

let tokens = [...mockTokens];
let proposals = [...mockProposals];
let votes = [...mockVotes];

export const getTokens = () => [...tokens];
export const getProposals = () => [...proposals];
export const getVotes = () => [...votes];

export const addProposal = (proposal: Omit<Proposal, 'id' | 'createdAt' | 'status' | 'votesFor' | 'votesAgainst' | 'startDate' | 'endDate' | 'executed'>) => {
  const startDate = new Date().toISOString();
  const endDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
  
  const newProposal: Proposal = {
    ...proposal,
    id: `${proposals.length + 1}`,
    createdAt: new Date().toISOString(),
    startDate: startDate,
    endDate: endDate,
    status: 'active',
    votesFor: 0,
    votesAgainst: 0,
    executed: false,
  };
  
  proposals = [...proposals, newProposal];
  return newProposal;
};

export const addVote = (vote: Omit<Vote, 'id' | 'timestamp'>) => {
  const newVote: Vote = {
    ...vote,
    id: `${votes.length + 1}`,
    timestamp: new Date().toISOString(),
  };
  
  votes = [...votes, newVote];
  
  proposals = proposals.map(proposal => {
    if (proposal.id === vote.proposalId) {
      return {
        ...proposal,
        votesFor: vote.support ? proposal.votesFor + vote.voteWeight : proposal.votesFor,
        votesAgainst: !vote.support ? proposal.votesAgainst + vote.voteWeight : proposal.votesAgainst,
      };
    }
    return proposal;
  });
  
  return newVote;
};

export const resetDatabase = () => {
  tokens = [...mockTokens];
  proposals = [...mockProposals];
  votes = [...mockVotes];
}; 