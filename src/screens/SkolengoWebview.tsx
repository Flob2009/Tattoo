import React, { useState, useRef, useEffect } from 'react';
import { View, ActivityIndicator, Alert, Text, Button } from 'react-native';
import { WebView } from 'react-native-webview';
import { encode as btoa } from 'base-64';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Linking from 'expo-linking';
import { useRoute } from '@react-navigation/native'; // ✅ Fix pour récupérer les paramètres

import { OID_CLIENT_ID, OID_CLIENT_SECRET, REDIRECT_URI } from '../auth/AuthConfig';

const SkolengoWebview = ({ navigation }) => {
  const route = useRoute();
  const school = route?.params?.school ?? null; // ✅ Vérification stricte
  const [authUrl, setAuthUrl] = useState<string | null>(null);
  const [discovery, setDiscovery] = useState<any>(null);
  const webViewRef = useRef<WebView>(null);

  // 🔥 Si aucune école n'est reçue, afficher un message d'erreur
  useEffect(() => {
    if (!school) {
      console.error("❌ ERREUR : Aucune école reçue dans SkolengoWebview !");
      Alert.alert("Erreur", "Aucune école sélectionnée.");
      navigation.goBack();
    }
  }, [school]);

  console.log("📌 École sélectionnée dans WebView :", school);

  useEffect(() => {
    const fetchDiscovery = async () => {
      if (!school?.emsOIDCWellKnownUrl) {
        Alert.alert("Erreur", "Aucune URL d'authentification trouvée pour cette école.");
        navigation.goBack();
        return;
      }

      const discoveryUrl = school.emsOIDCWellKnownUrl.replace(/\/$/, '') + "/.well-known/openid-configuration";
      console.log("🔍 Tentative de récupération du document de découverte :", discoveryUrl);

      try {
        const response = await fetch(discoveryUrl);
        if (!response.ok) throw new Error(`Erreur HTTP ${response.status}`);

        const discoveryDoc = await response.json();
        console.log("📌 Document OIDC récupéré :", JSON.stringify(discoveryDoc, null, 2));

        if (!discoveryDoc.authorization_endpoint || !discoveryDoc.token_endpoint) {
          throw new Error("❌ `authorization_endpoint` ou `token_endpoint` non trouvé.");
        }

        setDiscovery(discoveryDoc);

        const url = `${discoveryDoc.authorization_endpoint}?client_id=${OID_CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=openid+profile+email&state=random_state_string`;

        console.log("✅ URL d'authentification générée :", url);
        setAuthUrl(url);
      } catch (error) {
        console.error("❌ Erreur lors de la récupération de l'URL OIDC :", error.message);
        Alert.alert("Erreur", "Impossible d'obtenir l'URL d'authentification.");
        navigation.goBack();
      }
    };

    fetchDiscovery();
  }, [school]);

  // ✅ Fonction pour intercepter la redirection et récupérer le code
  const handleNavigationStateChange = async (e: any) => {
    console.log("🌐 Navigation détectée :", e.url);

    if (e.url.startsWith(REDIRECT_URI)) {
      console.log("🔄 Redirection détectée après connexion !");
      const params = new URL(e.url).searchParams;
      const code = params.get("code");

      if (!code || !discovery) {
        Alert.alert("Erreur", "Impossible de récupérer le code d'authentification.");
        return;
      }

      console.log("✅ Code d'autorisation obtenu :", code);

      try {
        console.log("🔄 Échange du code contre un token...");

        const tokenResponse = await fetch(discovery.token_endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: `Basic ${btoa(OID_CLIENT_ID + ":" + OID_CLIENT_SECRET)}`,
          },
          body: new URLSearchParams({
            client_id: OID_CLIENT_ID,
            client_secret: OID_CLIENT_SECRET,
            code,
            redirect_uri: REDIRECT_URI,
            grant_type: "authorization_code",
          }).toString(),
        });

        if (!tokenResponse.ok) throw new Error(`Erreur HTTP ${tokenResponse.status}`);

        const tokenData = await tokenResponse.json();
        console.log("✅ Token reçu :", tokenData);

        if (!tokenData.access_token) {
          throw new Error("❌ Aucun access_token reçu.");
        }

        await AsyncStorage.setItem("skolengo_token", JSON.stringify(tokenData));
        Alert.alert("Succès", "Connexion réussie !");
        
        // 🚀 **Utiliser Linking.openURL pour la redirection**
        const dashboardURL = Linking.createURL("Dashboard");
        console.log("🟣 Ouverture de l'URL Dashboard :", dashboardURL);
        Linking.openURL(dashboardURL);

      } catch (error) {
        console.error("❌ Erreur lors de l'échange du token :", error.message);
        Alert.alert("Erreur", "Impossible d'échanger le code contre un token.");
      }
    }
  };

  return (
    <View style={{ flex: 1 }}>
      {authUrl ? (
        <WebView 
          ref={webViewRef} 
          source={{ uri: authUrl }} 
          onNavigationStateChange={handleNavigationStateChange} // ✅ Ajout ici
        />
      ) : (
        <ActivityIndicator size="large" color="#6A0DAD" />
      )}
    </View>
  );
};

export default SkolengoWebview;