// src/screens/DashboardScreen.tsx
import React, { useContext } from 'react';
import { View, Text, Button } from 'react-native';
import { AuthContext } from '../auth/AuthProvider';

const DashboardScreen = () => {
  const { token, logout } = useContext(AuthContext);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Bienvenue sur le Dashboard !</Text>
      <Text>Votre token : {JSON.stringify(token)}</Text>
      <Button title="Se déconnecter" onPress={logout} />
    </View>
  );
};

export default DashboardScreen;