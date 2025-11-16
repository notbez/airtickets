import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text, TouchableOpacity, FlatList } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { AIRPORTS } from '../constants/airports';
import { API_BASE } from '../constants/api';

export default function SearchScreen({ navigation }) {
  const [from, setFrom] = useState('SVO');
  const [to, setTo] = useState('LED');
  const [date, setDate] = useState(new Date('2025-12-20'));
  const [showPicker, setShowPicker] = useState(false);
  const [fromSuggestions, setFromSuggestions] = useState([]);
  const [toSuggestions, setToSuggestions] = useState([]);

  const onChangeDate = (event, selectedDate) => {
    setShowPicker(false);
    if (selectedDate) setDate(selectedDate);
  };

  const search = async () => {
    try {
      const iso = date.getFullYear() + '-' + String(date.getMonth() + 1).padStart(2, '0') + '-' + String(date.getDate()).padStart(2, '0');
      const res = await fetch(`${API_BASE}/flights/search?from=${from}&to=${to}&date=${iso}`);
      const data = await res.json();
      navigation.navigate('Results', { results: data.results || [] });
    } catch (e) {
      alert('Ошибка соединения с сервером');
      console.error(e);
    }
  };

  const filterAirports = (text) => {
    return AIRPORTS.filter(a => a.code.toLowerCase().startsWith(text.toLowerCase()) || a.city.toLowerCase().includes(text.toLowerCase()));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Поиск авиабилетов</Text>

      <TextInput
        style={styles.input}
        placeholder="Откуда"
        value={from}
        onChangeText={t => {
          setFrom(t);
          setFromSuggestions(t ? filterAirports(t) : []);
        }}
      />
      {fromSuggestions.length > 0 && (
        <FlatList
          style={styles.suggestions}
          data={fromSuggestions}
          keyExtractor={i => i.code}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => { setFrom(item.code); setFromSuggestions([]); }}>
              <Text style={styles.suggestItem}>{item.code} — {item.city}</Text>
            </TouchableOpacity>
          )}
        />
      )}

      <TextInput
        style={styles.input}
        placeholder="Куда"
        value={to}
        onChangeText={t => {
          setTo(t);
          setToSuggestions(t ? filterAirports(t) : []);
        }}
      />
      {toSuggestions.length > 0 && (
        <FlatList
          style={styles.suggestions}
          data={toSuggestions}
          keyExtractor={i => i.code}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => { setTo(item.code); setToSuggestions([]); }}>
              <Text style={styles.suggestItem}>{item.code} — {item.city}</Text>
            </TouchableOpacity>
          )}
        />
      )}

      <TouchableOpacity onPress={() => setShowPicker(true)} style={styles.dateBtn}>
        <Text style={styles.dateText}>Дата: {date.getFullYear()}-{String(date.getMonth()+1).padStart(2,'0')}-{String(date.getDate()).padStart(2,'0')}</Text>
      </TouchableOpacity>

      {showPicker && (
        <DateTimePicker value={date} mode="date" display="default" onChange={onChangeDate} />
      )}

      <Button title="Найти" onPress={search} />
    </View>
  );
}

const styles = StyleSheet.create({
  container:{flex:1,padding:16,backgroundColor:'#fff'},
  title:{fontSize:20,fontWeight:'600',marginBottom:10,textAlign:'center'},
  input:{borderWidth:1,borderColor:'#ccc',borderRadius:8,padding:10,marginBottom:6},
  suggestions:{maxHeight:120,backgroundColor:'#fff',borderWidth:1,borderColor:'#eee',marginBottom:6},
  suggestItem:{padding:8},
  dateBtn:{padding:10, borderRadius:8, borderWidth:1, borderColor:'#ccc', marginBottom:12},
  dateText:{color:'#111'}
});