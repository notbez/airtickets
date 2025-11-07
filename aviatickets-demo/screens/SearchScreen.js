import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text } from 'react-native';

export default function SearchScreen({ navigation }) {
  const [from, setFrom] = useState('SVO');
  const [to, setTo] = useState('LED');
  const [date, setDate] = useState('2025-12-20');

  const search = async () => {
    try {
      const res = await fetch(`http://192.168.31.31:3000/flights/search?from=${from}&to=${to}&date=${date}`);
      const data = await res.json();
      navigation.navigate('Results', { results: data.results || [] });
    } catch (e) {
      alert('Ошибка соединения с сервером');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Поиск авиабилетов</Text>
      <TextInput style={styles.input} placeholder="Откуда" value={from} onChangeText={setFrom}/>
      <TextInput style={styles.input} placeholder="Куда" value={to} onChangeText={setTo}/>
      <TextInput style={styles.input} placeholder="Дата (YYYY-MM-DD)" value={date} onChangeText={setDate}/>
      <Button title="Найти" onPress={search}/>
    </View>
  );
}

const styles = StyleSheet.create({
  container:{flex:1,justifyContent:'center',padding:20,backgroundColor:'#fff'},
  title:{fontSize:20,fontWeight:'600',marginBottom:20,textAlign:'center'},
  input:{borderWidth:1,borderColor:'#ccc',borderRadius:8,padding:10,marginBottom:10}
});