import 'react-native-url-polyfill'; // Import du polyfill AVANT tout autre import
import React, { useEffect } from 'react';
import * as Linking from 'expo-linking';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  useEffect(() => {
    const handleDeepLink = async (event: { url: string }) => {
      if (!event.url) return;

      console.log("🔗 Deep link intercepté :", event.url);
      try {
        const parsedUrl = new URL(event.url);
        const code = parsedUrl.searchParams.get("code");

        if (code) {
          console.log("✅ Code reçu :", code);
          await AsyncStorage.setItem("skolengo_auth_code", code);
          console.log("💾 Code stocké en local");

          // 🚀 **Rediriger vers le Dashboard**
          const dashboardURL = Linking.createURL("Dashboard");
          console.log("🟣 Ouverture de l'URL Dashboard :", dashboardURL);
          Linking.openURL(dashboardURL);
        }
      } catch (error) {
        console.error("❌ Erreur dans le deep link :", error);
      }
    };

    // ✅ Vérifier l'URL au démarrage
    Linking.getInitialURL().then((url) => {
      if (url) handleDeepLink({ url });
    });

    // ✅ Écouter les deep links pendant l'utilisation
    const subscription = Linking.addEventListener("url", handleDeepLink);

    return () => {
      if (subscription.remove) subscription.remove();
    };
  }, []);

  return <AppNavigator />;
}