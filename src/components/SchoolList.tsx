import React from 'react';
import { FlatList, Text, TouchableOpacity, StyleSheet } from 'react-native';

const schools = [
  { id: '1', name: 'Lycée A', loginUrl: 'https://example.com/educonnect-a' },
  { id: '2', name: 'Lycée B', loginUrl: 'https://example.com/educonnect-b' },
];

export const SchoolList = ({ onSelect }) => {
  return (
    <FlatList
      data={schools}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <TouchableOpacity onPress={() => onSelect(item)} style={styles.item}>
          <Text style={styles.text}>{item.name}</Text>
        </TouchableOpacity>
      )}
    />
  );
};

const styles = StyleSheet.create({
  item: {
    padding: 10,
    marginVertical: 5,
    backgroundColor: '#ffffff',
    borderRadius: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
  },
  text: {
    fontSize: 16,
  },
});