import type { ConfigContext, ExpoConfig } from "expo/config";

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: "Bite",
  slug: "bite-app",
  scheme: "bite-app",
  version: "0.1.0",
  orientation: "portrait",
  icon: "./assets/icon.png",
  userInterfaceStyle: "automatic",
  updates: {
    fallbackToCacheTimeout: 0,
  },
  newArchEnabled: true,
  assetBundlePatterns: ["**/*"],
  ios: {
    bundleIdentifier: "com.lexand.bite",
    supportsTablet: true,
    icon: {
      light: "./assets/icon.png",
      dark: "./assets/icon.png",
    },
  },
  android: {
    package: "com.lexand.bite",
    adaptiveIcon: {
      foregroundImage: "./assets/icon.png",
      backgroundColor: "#1F104A",
    },
    edgeToEdgeEnabled: true,
  },
  extra: {
    eas: {
      projectId: "745216f6-deb5-45f6-925d-7706c1e8168c",
    },
  },
  experiments: {
    tsconfigPaths: true,
    typedRoutes: true,
  },
  plugins: [
    "expo-router",
    "expo-secure-store",
    "expo-web-browser",
    [
      "expo-splash-screen",
      {
        backgroundColor: "#E4E4E7",
        image: "./assets/icon.png",
        dark: {
          backgroundColor: "#18181B",
          image: "./assets/icon.png",
        },
      },
    ],
    [
      "expo-image-picker",
      {
        photosPermission: "Esta aplicación necesita acceder a tus fotos.",
      },
    ],
    [
      "expo-camera",
      {
        cameraPermission: "Allow $(PRODUCT_NAME) to access your camera",
        microphonePermission: "Allow $(PRODUCT_NAME) to access your microphone",
        recordAudioAndroid: true,
      },
    ],
  ],
  owner: "lexand-dev",
});
