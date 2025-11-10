import React, { useState } from 'react';
import { View, Text, Button, TextInput, StyleSheet } from 'react-native';

export default function BookingScreen({ route, navigation }) {
  const { flight } = route.params;
  const [email, setEmail] = useState('test@example.com');

  const book = async () => {
    try {
      const body = { flightId: flight.id || 'mock', contact: { email }, price: flight.price };
      const res = await fetch('https://airtickets-bcpu.onrender.com/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        throw new Error('Server response not OK');
      }

      const data = await res.json();
      navigation.navigate('Ticket', { booking: data });
    } catch (err) {
      alert('Ошибка соединения с сервером');
      console.error(err);
    }
  };

  return (
    <View style={styles.container}>
      <Text>Рейс: {flight.from} → {flight.to}</Text>
      <Text>Цена: {flight.price}₽</Text>
      <TextInput style={styles.input} value={email} onChangeText={setEmail} placeholder="Ваш e-mail" />
      <Button title="Оформить бронь" onPress={book} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#fff' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10, marginVertical: 10 },
});