import React from 'react';
import { View, Text, Button, FlatList, StyleSheet } from 'react-native';

export default function ResultsScreen({ route, navigation }) {
  const { results } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Результаты поиска</Text>
      <FlatList
        data={results}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text>{item.from} → {item.to}</Text>
            <Text>{item.date} — {item.price}₽</Text>
            <Button title="Бронировать" onPress={() => navigation.navigate('Booking', { flight: item })}/>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container:{flex:1,padding:16,backgroundColor:'#fff'},
  title:{fontSize:18,fontWeight:'600',marginBottom:10},
  card:{borderWidth:1,borderColor:'#ddd',borderRadius:8,padding:12,marginBottom:10}
});