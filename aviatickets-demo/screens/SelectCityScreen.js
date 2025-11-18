// screens/SelectCityScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import { AIRPORTS } from '../constants/airports';
import { useNavigation, useRoute } from '@react-navigation/native';

export default function SelectCityScreen() {
  const nav = useNavigation();
  const route = useRoute();
  const target = route.params?.target || 'from';
  const [query, setQuery] = useState('');
  const [list, setList] = useState(AIRPORTS);

  useEffect(() => {
    setList(AIRPORTS.filter(a => {
      if (!query) return true;
      const q = query.toLowerCase();
      return a.code.toLowerCase().startsWith(q) || a.city.toLowerCase().includes(q);
    }));
  }, [query]);

  const pick = (code) => {
    // возвращаем код в предыдущий экран
    nav.navigate('MainTabs'); // если хотим попасть в табы
    // но правильнее: goBack и передать param — проще: используем navigate to Home с params
    nav.navigate('MainTabs', { screen: 'Home', params: { selectedCity: { target, code } } });
    // NOTE: HomeScreen сейчас не смотрит params; для теста — Home просто использует навигационные параметры если есть
  };

  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Выберите город ({target === 'from' ? 'Откуда' : 'Куда'})</Text>
      <TextInput style={styles.input} placeholder="Поиск города или код" value={query} onChangeText={setQuery} />
      <FlatList data={list} keyExtractor={i => i.code} renderItem={({item}) => (
        <TouchableOpacity style={styles.item} onPress={() => pick(item.code)}>
          <Text style={styles.code}>{item.code}</Text>
          <Text style={styles.city}>{item.city}</Text>
        </TouchableOpacity>
      )} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen:{flex:1, padding:16, backgroundColor:'#fff'},
  title:{ fontSize:18, fontWeight:'700', marginBottom:8 },
  input:{ borderWidth:1, borderColor:'#eee', borderRadius:8, padding:10, marginBottom:10, backgroundColor:'#fafafa' },
  item:{ paddingVertical:12, borderBottomWidth:1, borderBottomColor:'#f0f0f0', flexDirection:'row', alignItems:'center' },
  code:{ width:64, fontWeight:'700' },
  city:{ color:'#666' }
});