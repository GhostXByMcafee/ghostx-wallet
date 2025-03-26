import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ENV from '../../config/env';

type AnalyticsEvent = {
  name: string;
  properties?: Record<string, any>;
};

type UserProperties = Record<string, any>;

class AnalyticsService {
  private isInitialized: boolean = false;
  private analyticsEnabled: boolean = false;
  private userId: string | null = null;
  private sessionId: string | null = null;
  
  private posthog = {
    identify: (id: string) => {
      console.log(`[Analytics] Identify user: ${id}`);
      return Promise.resolve();
    },
    screen: (name: string, properties?: Record<string, any>) => {
      console.log(`[Analytics] Screen view: ${name}`, properties);
      return Promise.resolve();
    },
    capture: (event: string, properties?: Record<string, any>) => {
      console.log(`[Analytics] Event: ${event}`, properties);
      return Promise.resolve();
    },
    optIn: () => {
      console.log(`[Analytics] Opted in`);
      return Promise.resolve();
    },
    optOut: () => {
      console.log(`[Analytics] Opted out`);
      return Promise.resolve();
    },
    reset: () => {
      console.log(`[Analytics] Reset`);
      return Promise.resolve();
    }
  };

  constructor() {
    console.log('[AnalyticsService] Instance created');
    this.sessionId = `session_${new Date().getTime()}_${Math.floor(Math.random() * 1000)}`;
  }

  async initialize(): Promise<boolean> {
    if (this.isInitialized) {
      return true;
    }

    try {
      const analyticsEnabled = await AsyncStorage.getItem('analytics_enabled');
      this.analyticsEnabled = analyticsEnabled === 'true';
      
      console.log('[Analytics] Service initialized, analytics enabled:', this.analyticsEnabled);
      this.isInitialized = true;
      return true;
    } catch (error) {
      console.error('[Analytics] Initialization error:', error);
      return false;
    }
  }

  logScreen(screenName: string, properties?: Record<string, any>): void {
    this.trackScreen(screenName, properties);
  }

  trackScreen(screenName: string, properties?: Record<string, any>): void {
    if (!this.analyticsEnabled || ENV.isDevelopment) {
      console.log(`[Analytics-DEV] Screen view: ${screenName}`, properties);
      return;
    }

    try {
      this.posthog.screen(screenName, {
        ...properties,
        distinct_id: this.userId,
        session_id: this.sessionId,
        platform: Platform.OS,
      });
    } catch (error) {
      console.error('[Analytics] Error tracking screen view:', error);
    }
  }

  trackEvent(event: AnalyticsEvent): void {
    if (!this.analyticsEnabled || ENV.isDevelopment) {
      console.log(`[Analytics-DEV] Event tracked: ${event.name}`, event.properties);
      return;
    }

    try {
      this.posthog.capture(event.name, {
        ...event.properties,
        distinct_id: this.userId,
        session_id: this.sessionId,
        platform: Platform.OS,
      });
    } catch (error) {
      console.error('[Analytics] Error registering event:', error);
    }
  }

  setUserProperties(userId: string, properties?: UserProperties): void {
    try {
      if (!ENV.isDevelopment) {
        this.userId = userId;
        this.posthog.identify(userId);
        console.log('[Analytics] User properties set:', { userId, properties });
      }
    } catch (error) {
      console.error('[Analytics] Error setting user properties:', error);
    }
  }

  async optIn(): Promise<void> {
    await this.enableAnalytics();
  }

  async optOut(): Promise<void> {
    await this.disableAnalytics();
  }

  async enableAnalytics(): Promise<void> {
    try {
      await AsyncStorage.setItem('analytics_enabled', 'true');
      this.analyticsEnabled = true;
      
      if (!ENV.isDevelopment) {
        await this.posthog.optIn();
      }
      
      console.log('[Analytics] Analytics enabled successfully');
    } catch (error) {
      console.error('[Analytics] Error enabling analytics:', error);
    }
  }

  async disableAnalytics(): Promise<void> {
    try {
      await AsyncStorage.setItem('analytics_enabled', 'false');
      this.analyticsEnabled = false;
      
      if (!ENV.isDevelopment) {
        await this.posthog.optOut();
      }
      
      console.log('[Analytics] Analytics disabled successfully');
    } catch (error) {
      console.error('[Analytics] Error disabling analytics:', error);
    }
  }

  async isAnalyticsEnabled(): Promise<boolean> {
    if (!this.isInitialized) {
      await this.initialize();
    }
    return this.analyticsEnabled;
  }

  isOptedOut(): boolean {
    return !this.analyticsEnabled;
  }

  reset(): void {
    try {
      this.posthog.reset();
      console.log('[Analytics] Session reset');
    } catch (error) {
      console.error('[Analytics] Error resetting session:', error);
    }
  }
}

export default new AnalyticsService(); 