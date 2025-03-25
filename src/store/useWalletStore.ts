import { create } from 'zustand';
import encryptionService from '../services/encryption/encryptionService';

interface TokenBalance {
  id: string;
  symbol: string;
  name: string;
  balance: string;
  decimals: number;
  iconUrl?: string;
}

interface Proposal {
  id: string;
  title: string;
  description: string;
  creator: string;
  startDate: string;
  endDate: string;
  status: 'active' | 'passed' | 'rejected' | 'pending';
  votesFor: number;
  votesAgainst: number;
  executed: boolean;
  createdAt: string;
}

interface Vote {
  proposalId: string;
  voter: string;
  support: boolean;
  voteWeight: number;
  timestamp: string;
}

interface WalletState {
  isInitialized: boolean;
  isLoading: boolean;
  error: string | null;
  alias: string | null;
  publicKey: string | null;
  isBiometricEnabled: boolean;
  tokens: TokenBalance[];
  proposals: Proposal[];
  votes: Vote[];
  
  initializeWallet: () => Promise<void>;
  createWallet: (alias: string, passkey: string, enableBiometric: boolean) => Promise<boolean>;
  fetchBalances: () => Promise<void>;
  fetchProposals: () => Promise<void>;
  createProposal: (title: string, description: string) => Promise<boolean>;
  castVote: (proposalId: string, support: boolean) => Promise<boolean>;
  setBiometricEnabled: (enabled: boolean) => Promise<boolean>;
  logout: () => Promise<void>;
}

const DEMO_TOKENS: TokenBalance[] = [
  {
    id: '1',
    symbol: 'GTX',
    name: 'GhostEx Token',
    balance: '1000.0',
    decimals: 18,
    iconUrl: 'https://via.placeholder.com/64',
  },
  {
    id: '2',
    symbol: 'USDC',
    name: 'USD Coin',
    balance: '500.0',
    decimals: 6,
    iconUrl: 'https://via.placeholder.com/64',
  },
];

const DEMO_PROPOSALS: Proposal[] = [
  {
    id: '1',
    title: 'Update transaction rates parameters',
    description: 'This proposal seeks to reduce transaction rates on the network by 20% to increase adoption of new users.',
    creator: '0x123...abc',
    startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'active',
    votesFor: 75000,
    votesAgainst: 25000,
    executed: false,
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '2',
    title: 'Integrate with new blockchains',
    description: 'Proposal to integrate the network with Polygon and Arbitrum to increase interoperability.',
    creator: '0x456...def',
    startDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    endDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'passed',
    votesFor: 120000,
    votesAgainst: 30000,
    executed: true,
    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

const useWalletStore = create<WalletState>((set, get) => ({
  isInitialized: false,
  isLoading: false,
  error: null,
  alias: null,
  publicKey: null,
  isBiometricEnabled: false,
  tokens: [],
  proposals: [],
  votes: [],
  
  initializeWallet: async () => {
    try {
      set({ isLoading: true, error: null });
      const walletData = await encryptionService.getWalletData();
      
      if (walletData) {
        set({
          isInitialized: true,
          alias: walletData.alias,
          publicKey: walletData.publicKey,
          isBiometricEnabled: walletData.biometricEnabled,
          tokens: DEMO_TOKENS,
          proposals: DEMO_PROPOSALS,
          isLoading: false
        });
        
      } else {
        set({ isLoading: false });
      }
    } catch (error) {
      set({ error: 'Error al inicializar la billetera', isLoading: false });
      console.error('Error initializing wallet:', error);
    }
  },
  
  createWallet: async (alias, passkey, enableBiometric) => {
    try {
      set({ isLoading: true, error: null });
      
      const privateKey = `0x${Math.random().toString(16).substring(2, 34)}`;
      const publicKey = `0x${Math.random().toString(16).substring(2, 42)}`;
      
      const walletData = {
        alias,
        privateKey,
        publicKey,
        biometricEnabled: enableBiometric
      };
      
      await encryptionService.saveWalletData(walletData);
      
      const userData = {
        userId: publicKey,
        displayName: alias,
        preferences: {
          passkey: passkey
        }
      };
      
      await encryptionService.saveUserData(userData);
      
      set({
        isInitialized: true,
        alias,
        publicKey,
        isBiometricEnabled: enableBiometric,
        tokens: [...DEMO_TOKENS],
        proposals: [...DEMO_PROPOSALS],
        votes: []
      });
      
      return true;
    } catch (error) {
      set({ error: 'Error creating wallet' });
      console.error('Error creating wallet:', error);
      return false;
    } finally {
      set({ isLoading: false });
    }
  },
  
  fetchBalances: async () => {
    try {
      const currentState = get();
      if (currentState.tokens.length > 0 && !currentState.isLoading) {
        console.log("Tokens already loaded, skipping fetchBalances");
        return;
      }

      set({ isLoading: true });
      console.log("Fetching balances...");
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      set({ 
        tokens: [...DEMO_TOKENS],
        isLoading: false 
      });
    } catch (error) {
      console.error('Error fetching balances:', error);
      set({ isLoading: false, error: 'Error loading balances' });
    }
  },
  
  fetchProposals: async () => {
    try {
      set({ isLoading: true, error: null });
      // In a real environment, here we would make calls to the API or blockchain
      // For this demo, we use simulated data
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      set({ proposals: DEMO_PROPOSALS });
    } catch (error) {
      set({ error: 'Error fetching proposals' });
      console.error('Error fetching proposals:', error);
    } finally {
      set({ isLoading: false });
    }
  },
  
  createProposal: async (title, description) => {
    try {
      set({ isLoading: true, error: null });
      
      // In a real environment, we would send this to the blockchain
      const newProposal: Proposal = {
        id: 'new_' + Date.now(),
        title,
        description,
        creator: get().publicKey || '0x000',
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'active',
        votesFor: 0,
        votesAgainst: 0,
        executed: false,
        createdAt: new Date().toISOString(),
      };
      
      set(state => ({
        proposals: [newProposal, ...state.proposals]
      }));
      
      return true;
    } catch (error) {
      set({ error: 'Error creating proposal' });
      console.error('Error creating proposal:', error);
      return false;
    } finally {
      set({ isLoading: false });
    }
  },
  
  castVote: async (proposalId, support) => {
    try {
      set({ isLoading: true, error: null });
      
      const newVote: Vote = {
        proposalId,
        voter: get().publicKey || '0x000',
        support,
        voteWeight: 1000,
        timestamp: new Date().toISOString(),
      };
      
      set(state => ({
        proposals: state.proposals.map(p => 
          p.id === proposalId 
            ? { 
                ...p, 
                votesFor: support ? p.votesFor + newVote.voteWeight : p.votesFor,
                votesAgainst: !support ? p.votesAgainst + newVote.voteWeight : p.votesAgainst,
              }
            : p
        ),
        votes: [...state.votes, newVote]
      }));
      
      return true;
    } catch (error) {
      set({ error: 'Error casting vote' });
      console.error('Error casting vote:', error);
      return false;
    } finally {
      set({ isLoading: false });
    }
  },
  
  setBiometricEnabled: async (enabled) => {
    try {
      set({ isLoading: true, error: null });
      
      const walletData = await encryptionService.getWalletData();
      if (walletData) {
        const updatedWalletData = {
          ...walletData,
          biometricEnabled: enabled
        };
        
        const saved = await encryptionService.saveWalletData(updatedWalletData);
        if (saved) {
          set({ isBiometricEnabled: enabled });
          return true;
        }
      }
      return false;
    } catch (error) {
      set({ error: 'Error setting biometric' });
      console.error('Error setting biometric:', error);
      return false;
    } finally {
      set({ isLoading: false });
    }
  },
  
  logout: async () => {
    try {
      set({ isLoading: true, error: null });
      await encryptionService.clearAllData();
      
      set({
        isInitialized: false,
        alias: null,
        publicKey: null,
        isBiometricEnabled: false,
        tokens: [],
        proposals: [],
        votes: [],
      });
    } catch (error) {
      set({ error: 'Error logging out' });
      console.error('Error logging out:', error);
    } finally {
      set({ isLoading: false });
    }
  }
}));

export default useWalletStore; 