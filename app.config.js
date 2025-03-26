import 'dotenv/config';

export default {
  "expo": {
    "name": "GhostEx Wallet",
    "slug": "ghostex-wallet",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "dark",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#121212"
    },
    "updates": {
      "fallbackToCacheTimeout": 0
    },
    "assetBundlePatterns": [
      "**/*"
    ],
    "ios": {
      "supportsTablet": true,
      "infoPlist": {
        "NSFaceIDUsageDescription": "This application uses Face ID/Touch ID to protect your digital wallet"
      }
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#121212"
      },
      "permissions": [
        "USE_BIOMETRIC",
        "USE_FINGERPRINT"
      ],
      "package": "com.ghostex.wallet"
    },
    "web": {
      "favicon": "./assets/favicon.png"
    },
    "plugins": [
      "expo-secure-store",
      "expo-local-authentication",
      "expo-localization"
    ],
    "extra": {
      "posthogApiKey": process.env.POSTHOG_API_KEY,
      "posthogHost": process.env.POSTHOG_HOST,
      "eas": {
        "projectId": "eas-project-id"
      }
    },
    "experiments": {
      "newArchEnabled": true
    }
  }
}
