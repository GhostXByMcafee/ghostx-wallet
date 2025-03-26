import { ImageSourcePropType } from "react-native";

export interface TokenBalance {
  id: string;
  symbol: string;
  name: string;
  balance: string;
  decimals: number;
  iconUrl: ImageSourcePropType;
}

export interface Proposal {
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

export interface Vote {
  proposalId: string;
  voter: string;
  support: boolean;
  voteWeight: number;
  timestamp: string;
  id: string;
}

export interface InputProps {
  label?: string;
  error?: string;
  isPassword?: boolean;
  containerStyle?: any;
  labelStyle?: any;
  inputStyle?: any;
  errorStyle?: any;
  [key: string]: any;
} 

export interface ToggleSwitchProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
  label?: string;
  containerStyle?: any;
  labelStyle?: any;
} 

export interface CardProps {
  children: React.ReactNode;
  title?: string;
  style?: any;
  titleStyle?: any;
  contentStyle?: any;
  onPress?: () => void;
} 



