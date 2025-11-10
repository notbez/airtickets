import React from 'react';
import { View, Text, Button, StyleSheet, Linking } from 'react-native';

export default function TicketScreen({ route }) {
  const { booking } = route.params;

  const openPDF = () => {
    const url = `https://airtickets-bcpu.onrender.com/booking/${booking.id}/pdf`;
    Linking.openURL(url);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Бронь оформлена ✅</Text>
      <Text>ID: {booking.id}</Text>
      <Text>Статус: {booking.status}</Text>
      <Button title="Открыть PDF" onPress={openPDF} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  title: { fontSize: 20, fontWeight: '600', marginBottom: 10 },
});