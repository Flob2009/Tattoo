import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as Linking from 'expo-linking';
import AsyncStorage from '@react-native-async-storage/async-storage';

import SplashScreen from '../screens/SplashScreen';
import HomeScreen from '../screens/HomeScreen';
import SelectSchoolScreen from '../screens/SelectSchoolScreen';
import SkolengoWebview from '../screens/SkolengoWebview';
import DashboardScreen from '../screens/DashboardScreen';

const Stack = createStackNavigator();

// ✅ Configuration du deep linking
const linking = {
  prefixes: ['skoapp-prod://'],
  config: {
    screens: {
      Dashboard: 'sign-in-callback',
    },
  },
};

const AppNavigator = () => {
  useEffect(() => {
    const handleDeepLink = async (event: { url: string }) => {
      if (!event.url) return;

      console.log("🔗 Deep link détecté :", event.url);
      try {
        const parsedUrl = new URL(event.url);
        const code = parsedUrl.searchParams.get("code");

        if (code) {
          console.log("✅ Code d'autorisation reçu :", code);
          await AsyncStorage.setItem("skolengo_auth_code", code);
          console.log("💾 Code stocké en local");

          // 🚀 **Ouvrir directement l'URL du Dashboard**
          const dashboardURL = Linking.createURL("Dashboard");
          console.log("🟣 Ouverture de l'URL Dashboard :", dashboardURL);
          Linking.openURL(dashboardURL);
        }
      } catch (error) {
        console.error("❌ Erreur lors du traitement du deep link :", error);
      }
    };

    // ✅ Vérifier l'URL au démarrage
    Linking.getInitialURL().then((url) => {
      if (url) handleDeepLink({ url });
    });

    // ✅ Abonnement aux événements de deep linking
    const subscription = Linking.addEventListener("url", handleDeepLink);

    return () => {
      if (subscription.remove) subscription.remove();
    };
  }, []);

  return (
    <NavigationContainer linking={linking}>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{
          headerStyle: { backgroundColor: '#6A0DAD' },
          headerTintColor: '#FFF',
        }}
      >
        <Stack.Screen name="Splash" component={SplashScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Accueil' }} />
        <Stack.Screen name="SelectSchoolScreen" component={SelectSchoolScreen} options={{ title: 'Sélection d’école' }} />
        <Stack.Screen name="SkolengoWebview" component={SkolengoWebview} options={{ title: 'Connexion EduConnect' }} />
        <Stack.Screen name="Dashboard" component={DashboardScreen} options={{ title: 'Mon Dashboard' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;