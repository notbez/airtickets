import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function FlightCard({ item, onBook }) {
  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <Text style={styles.route}>{item.from} → {item.to}</Text>
        <Text style={styles.price}>{item.price} ₽</Text>
      </View>
      <Text style={styles.time}>{item.departTime} — {item.arriveTime}</Text>
      <Text style={styles.provider}>{item.provider}</Text>
      <TouchableOpacity style={styles.button} onPress={() => onBook(item)}>
        <Text style={styles.buttonText}>Book</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderWidth: 1, borderColor: '#ddd', padding: 12, borderRadius: 8, marginBottom: 12, backgroundColor: '#fff' },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  route: { fontWeight: '600', fontSize: 16 },
  price: { fontWeight: '700', fontSize: 16, color: '#d70000' },
  time: { color: '#555', marginTop: 6 },
  provider: { marginTop: 6, color: '#888', fontSize: 12 },
  button: { marginTop: 10, backgroundColor: '#0a84ff', paddingVertical: 8, borderRadius: 6, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: '600' }
});