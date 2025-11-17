import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, TextInput } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import LoadingOverlay from '../components/LoadingOverlay';
import { API_BASE } from '../constants/api';

export default function HomeScreen() {
  const nav = useNavigation();
  const [from, setFrom] = useState('SVO');
  const [to, setTo] = useState('LED');
  const [date, setDate] = useState('2025-12-20');
  const [loading, setLoading] = useState(false);

  const onSearch = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/flights/search?from=${from}&to=${to}&date=${date}`);
      const data = await res.json();
      // имитируем анимацию загрузки чуть дольше
      setTimeout(() => {
        setLoading(false);
        nav.navigate('Results', { results: data.results || [] });
      }, 700);
    } catch (e) {
      setLoading(false);
      alert('Ошибка соединения с сервером');
      console.error(e);
    }
  };

  return (
    <View style={styles.container}>
      {/* header / hero */}
      <View style={styles.hero}>
        <Text style={styles.title}>Добро пожаловать</Text>
        <Text style={styles.subtitle}>Найди лучшие авиарейсы</Text>
        <MaterialCommunityIcons name="airplane" size={48} color="#fff" />
      </View>

      {/* search card */}
      <View style={styles.searchCard}>
        <TextInput style={styles.field} value={from} onChangeText={setFrom} placeholder="Откуда (код)" />
        <TextInput style={styles.field} value={to} onChangeText={setTo} placeholder="Куда (код)" />
        <TextInput style={styles.field} value={date} onChangeText={setDate} placeholder="Дата (YYYY-MM-DD)" />
        <TouchableOpacity style={styles.searchBtn} onPress={onSearch}>
          <Text style={styles.searchBtnText}>Найти</Text>
        </TouchableOpacity>
      </View>

      {loading && <LoadingOverlay />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f7fb' },
  hero: { backgroundColor: '#29A9E0', padding: 28, alignItems: 'center', justifyContent: 'center' },
  title: { color: '#fff', fontSize: 22, fontWeight: '700', marginBottom: 4 },
  subtitle: { color: '#eaf6fb', marginBottom: 12 },
  searchCard: { marginTop: -30, marginHorizontal: 16, padding: 16, backgroundColor: '#fff', borderRadius: 12, shadowColor: '#000', shadowOpacity: 0.06, elevation: 4 },
  field: { borderWidth: 1, borderColor: '#eee', borderRadius: 8, padding: 10, marginBottom: 10 },
  searchBtn: { backgroundColor: '#29A9E0', padding: 12, borderRadius: 8, alignItems: 'center' },
  searchBtnText: { color: '#fff', fontWeight: '700' }
});