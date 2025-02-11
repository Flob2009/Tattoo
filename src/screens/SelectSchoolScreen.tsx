import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Searchbar, Card } from 'react-native-paper';

const PRIMARY_COLOR = '#6A0DAD'; // Violet Material
const PoppinsRegular = 'Poppins_400Regular';

// 🔹 Fonction de recherche d'écoles
async function searchSchoolAPI(searchTerm: string, limit = 10) {
  const BASE_URL = 'https://api.skolengo.com/api/v1/bff-sko-app';
  const url = `${BASE_URL}/schools?filter[text]=${encodeURIComponent(searchTerm)}&page[limit]=${limit}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Erreur HTTP ${response.status}`);
    }
    const data = await response.json();

    console.log("📌 Réponse API des écoles :", JSON.stringify(data, null, 2)); // 🔍 Debug

    if (!data.data) return [];

    return data.data.map((item: any) => ({
      id: item.id,
      name: item.attributes?.name ?? 'Inconnu',
      city: item.attributes?.city ?? '',
      emsOIDCWellKnownUrl: item.attributes?.emsOIDCWellKnownUrl ?? null, // 🔹 Vérifier si présent
    }));
  } catch (error) {
    console.error("❌ Erreur lors de la récupération des écoles :", error);
    return [];
  }
}

const SelectSchoolScreen = ({ navigation }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [schools, setSchools] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;
    setLoading(true);
    try {
      const results = await searchSchoolAPI(searchTerm);
      setSchools(results);
    } catch (error) {
      console.error('❌ Erreur lors de la recherche :', error);
      Alert.alert("Erreur", "Une erreur est survenue lors de la recherche.");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectSchool = (schoolItem: any) => {
    console.log("✅ École sélectionnée :", schoolItem); // 🔍 Debug

    if (!schoolItem.emsOIDCWellKnownUrl) {
      Alert.alert(
        "École non supportée",
        "Cette école ne supporte pas la connexion via EduConnect.\nEssayez une autre école."
      );
      return;
    }

    try {
      navigation.navigate('SkolengoWebview', { school: JSON.parse(JSON.stringify(schoolItem)) });
      console.log("🚀 Navigation vers SkolengoWebview avec :", schoolItem);
    } catch (error) {
      console.error("❌ Erreur lors de la navigation :", error);
      Alert.alert("Erreur", "Impossible de naviguer vers l’écran de connexion.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Rechercher une école</Text>

      <Searchbar
        placeholder="Entrez le nom de votre école"
        value={searchTerm}
        onChangeText={setSearchTerm}
        onSubmitEditing={handleSearch}
        style={styles.searchbar}
        inputStyle={styles.searchbarText}
        iconColor={PRIMARY_COLOR}
        placeholderTextColor="#999"
      />

      {loading ? (
        <ActivityIndicator size="large" color={PRIMARY_COLOR} style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={schools}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleSelectSchool(item)}>
              <Card style={styles.schoolCard}>
                <Card.Content>
                  <Text style={styles.schoolName}>{item.name}</Text>
                  {item.city ? <Text style={styles.schoolCity}>{item.city}</Text> : null}
                </Card.Content>
              </Card>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            searchTerm.length > 0 && !loading ? (
              <Text style={styles.empty}>Aucun résultat pour "{searchTerm}".</Text>
            ) : null
          }
          style={{ marginTop: 20 }}
        />
      )}
    </View>
  );
};

export default SelectSchoolScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 26,
    fontFamily: PoppinsRegular,
    color: PRIMARY_COLOR,
    textAlign: 'center',
    marginBottom: 20,
  },
  searchbar: {
    borderRadius: 30,
    borderColor: PRIMARY_COLOR + '55',
    borderWidth: 1,
    elevation: 4,
    height: 60,
    justifyContent: 'center',
    backgroundColor: '#F5F5F5',
  },
  searchbarText: {
    fontFamily: PoppinsRegular,
    fontSize: 18,
  },
  schoolCard: {
    marginVertical: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    elevation: 3,
    padding: 10,
  },
  schoolName: {
    fontFamily: PoppinsRegular,
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  schoolCity: {
    fontFamily: PoppinsRegular,
    fontSize: 15,
    color: '#666',
  },
  empty: {
    fontFamily: PoppinsRegular,
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 30,
  },
});