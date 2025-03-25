export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
  
  Welcome: undefined;
  CreateWallet: undefined;
  SetupSecurity: { alias: string };
  BiometricSetup: { 
    alias: string;
    passkey: string;
    enableBiometric: boolean;
  };
  Success: { 
    alias: string;
    passkey: string;
    enableBiometric: boolean;
  };
  
  MainTabs: undefined;
  
  Dashboard: undefined;
  TokenDetails: {
    tokenId: string;
  };
  Governance: undefined;
  ProposalDetails: { proposalId: string };
  CreateProposal: undefined;
  Settings: undefined;
}; 