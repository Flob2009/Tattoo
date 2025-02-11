import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

const HomeScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenue sur Tattoo !</Text>
      <Image
        source={require('../../assets/images/Logo_transparent.png')}
        style={styles.logo}
      />
      <Text style={styles.subtitle}>
        Connectez-vous à vos services scolaires en quelques clics.
      </Text>
      <Text style={styles.choiceText}>Choisissez votre service scolaire :</Text>
      <View style={styles.buttonContainer}>
        <Button
          mode="outlined"
          onPress={() => navigation.navigate('PronoteScreen')}
          style={[styles.button, styles.buttonShadow]}
          labelStyle={styles.buttonLabel}
        >
          Pronote
        </Button>
        <Button
          mode="outlined"
          onPress={() => navigation.navigate('SelectSchoolScreen')}
          style={[styles.button, styles.buttonShadow]}
          labelStyle={styles.buttonLabel}
        >
          Skolengo
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#6A0DAD',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 30,
    fontFamily: 'Poppins_700Bold',
    color: '#FFFFFF',
    marginBottom: 30,
    textAlign: 'center',
  },
  logo: {
    width: 160,
    height: 160,
    resizeMode: 'contain',
    marginBottom: 30,
  },
  subtitle: {
    fontSize: 18,
    fontFamily: 'Poppins_400Regular',
    color: '#FFFFFF',
    marginBottom: 30,
    textAlign: 'center',
  },
  choiceText: {
    fontSize: 20,
    fontFamily: 'Poppins_600SemiBold',
    color: '#FFFFFF',
    marginBottom: 20,
    textAlign: 'center',
  },
  buttonContainer: {
    width: '80%',
    alignItems: 'center',
  },
  button: {
    marginTop: 15,
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderColor: '#6A0DAD',
    borderWidth: 2,
    borderRadius: 25,
    paddingVertical: 10,
  },
  buttonLabel: {
    color: '#6A0DAD',
    fontFamily: 'Poppins_500Medium',
    fontSize: 16,
  },
  buttonShadow: {
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
});

export default HomeScreen;