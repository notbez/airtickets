import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import FlightCard from '../components/FlightCard';

export default function ResultsScreen({ route, navigation }) {
  const { results = [] } = route.params || {};

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Доступные рейсы</Text>
      <FlatList
        data={results}
        keyExtractor={(item) => item.id || Math.random().toString()}
        renderItem={({item}) => <FlightCard item={item} onBook={(f)=> navigation.navigate('MainTabs')} />}
        ListEmptyComponent={<Text style={{textAlign:'center', marginTop:30}}>Рейсов не найдено</Text>}
        contentContainerStyle={{ padding: 16 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container:{flex:1, backgroundColor:'#fff'},
  header:{fontSize:20, fontWeight:'700', padding:16}
});