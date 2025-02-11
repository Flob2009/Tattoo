// src/auth/AuthProvider.tsx
import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { mySkolengoConfig } from './AuthConfig';
import * as AuthSession from 'expo-auth-session';

export const AuthContext = createContext({
  token: null,
  school: null,
  loginWithWebView: async () => {},
  logout: async () => {},
});

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [school, setSchool] = useState(null);

  useEffect(() => {
    // Charger depuis AsyncStorage ou MySkolengoConfig
    (async () => {
      const saved = await AsyncStorage.getItem('myTokenSet');
      if (saved) {
        setToken(JSON.parse(saved));
      } else {
        // Sinon on peut charger la config par défaut
        // si vous avez déjà un tokenSet local
        if (mySkolengoConfig.tokenSet.access_token) {
          setToken(mySkolengoConfig.tokenSet);
        }
      }
      setSchool(mySkolengoConfig.school);
    })();
  }, []);

  // Exemple de fonction login via AuthSession (si tokenSet est expiré ou inexistant)
  const loginWithWebView = async (code, discovery) => {
    const tokenResponse = await AuthSession.exchangeCodeAsync(
      {
        clientId: '...',
        clientSecret: '...',
        redirectUri: '...',
        code,
      },
      discovery
    );
    setToken(tokenResponse);
    await AsyncStorage.setItem('myTokenSet', JSON.stringify(tokenResponse));
  };

  const logout = async () => {
    setToken(null);
    await AsyncStorage.removeItem('myTokenSet');
  };

  return (
    <AuthContext.Provider value={{ token, school, loginWithWebView, logout }}>
      {children}
    </AuthContext.Provider>
  );
};