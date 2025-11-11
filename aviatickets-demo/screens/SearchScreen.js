import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text, TouchableOpacity, FlatList, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { AIRPORTS } from '../data/airports';

export default function SearchScreen({ navigation }) {
  const [from, setFrom] = useState('SVO');
  const [to, setTo] = useState('LED');
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [suggestionsFrom, setSuggestionsFrom] = useState([]);
  const [suggestionsTo, setSuggestionsTo] = useState([]);

  const onChangeDate = (event, selectedDate) => {
    setShowPicker(Platform.OS === 'ios');
    if (selectedDate) setDate(selectedDate);
  };

  const formattedDate = date.getFullYear() + '-' +
  String(date.getMonth() + 1).padStart(2, '0') + '-' +
  String(date.getDate()).padStart(2, '0');

  const handleFromChange = (text) => {
    setFrom(text);
    if (text.length > 0) {
      const matches = AIRPORTS.filter(a => a.city.toLowerCase().includes(text.toLowerCase()) || a.code.toLowerCase().includes(text.toLowerCase()));
      setSuggestionsFrom(matches.slice(0, 5));
    } else {
      setSuggestionsFrom([]);
    }
  };

  const handleToChange = (text) => {
    setTo(text);
    if (text.length > 0) {
      const matches = AIRPORTS.filter(a => a.city.toLowerCase().includes(text.toLowerCase()) || a.code.toLowerCase().includes(text.toLowerCase()));
      setSuggestionsTo(matches.slice(0, 5));
    } else {
      setSuggestionsTo([]);
    }
  };

  const search = async () => {
    try {
      const res = await fetch(`https://airtickets-bcpu.onrender.com/flights/search?from=${from}&to=${to}&date=${formattedDate}`);
      const data = await res.json();
      navigation.navigate('Results', { results: data.results || [] });
    } catch (e) {
      alert('Ошибка соединения с сервером');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Поиск авиабилетов</Text>

      <TextInput
        style={styles.input}
        placeholder="Откуда"
        value={from}
        onChangeText={handleFromChange}
      />
      {suggestionsFrom.map((a) => (
        <TouchableOpacity key={a.code} onPress={() => { setFrom(a.code); setSuggestionsFrom([]); }}>
          <Text style={styles.suggestion}>{a.city}</Text>
        </TouchableOpacity>
      ))}

      <TextInput
        style={styles.input}
        placeholder="Куда"
        value={to}
        onChangeText={handleToChange}
      />
      {suggestionsTo.map((a) => (
        <TouchableOpacity key={a.code} onPress={() => { setTo(a.code); setSuggestionsTo([]); }}>
          <Text style={styles.suggestion}>{a.city}</Text>
        </TouchableOpacity>
      ))}

      <TouchableOpacity onPress={() => setShowPicker(true)} style={styles.input}>
        <Text>{formattedDate}</Text>
      </TouchableOpacity>

      {showPicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={onChangeDate}
        />
      )}

      <Button title="Найти" onPress={search} />
    </View>
  );
}

const styles = StyleSheet.create({
  container:{flex:1,justifyContent:'center',padding:20,backgroundColor:'#fff'},
  title:{fontSize:20,fontWeight:'600',marginBottom:20,textAlign:'center'},
  input:{borderWidth:1,borderColor:'#ccc',borderRadius:8,padding:10,marginBottom:10},
  suggestion:{padding:8,borderBottomWidth:1,borderColor:'#eee'}
});