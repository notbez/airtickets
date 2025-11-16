import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import FlightCard from '../components/FlightCard';

export default function ResultsScreen({ route, navigation }) {
  const { results } = route.params;

  const onBook = (flight) => {
    navigation.navigate('Booking', { flight });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Результаты поиска</Text>
      <FlatList
        data={results}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <FlightCard item={item} onBook={onBook} />}
        ListEmptyComponent={<Text style={{textAlign:'center', marginTop:20}}>Ничего не найдено</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container:{flex:1,padding:16,backgroundColor:'#f7f7f7'},
  title:{fontSize:18,fontWeight:'600',marginBottom:10}
});