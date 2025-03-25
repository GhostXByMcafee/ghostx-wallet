import Constants from 'expo-constants';

const ENV = {
  posthogApiKey: Constants.expoConfig?.extra?.posthogApiKey ?? '',
  posthogHost: Constants.expoConfig?.extra?.posthogHost ?? '',
  isDevelopment: __DEV__,
};

export default ENV; 