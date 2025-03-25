import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { PostHogProvider } from 'posthog-react-native';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';
import ENV from './src/config/env';

SplashScreen.preventAutoHideAsync();

const App: React.FC = () => {
  useEffect(() => {
    const initializeApp = async () => {
      try {
        await SplashScreen.hideAsync();
      } catch (error) {
        console.error('Error initializing app:', error);
        await SplashScreen.hideAsync();
      }
    };

    initializeApp();
  }, []);

  return (
    <GestureHandlerRootView style={styles.container}>
      <StatusBar style="light" />
      <NavigationContainer>
        <PostHogProvider 
          apiKey={ENV.posthogApiKey}
          options={{
            host: ENV.posthogHost
          }}
        >
          <AppNavigator />
        </PostHogProvider>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
