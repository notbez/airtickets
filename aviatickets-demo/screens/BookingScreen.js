import React, { useState } from 'react';
import { View, Text, Button, TextInput, StyleSheet } from 'react-native';

export default function BookingScreen({ route, navigation }) {
  const { flight } = route.params;
  const [email, setEmail] = useState('test@example.com');

  const book = async () => {
    const body = { flightId: flight.id || 'mock', contact:{email}, price: flight.price };
    const res = await fetch('http://192.168.31.31:3000/booking', {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify(body)
    });
    const data = await res.json();
    navigation.navigate('Ticket', { booking: data });
  };

  return (
    <View style={styles.container}>
      <Text>Рейс: {flight.from} → {flight.to}</Text>
      <Text>Цена: {flight.price}₽</Text>
      <TextInput style={styles.input} value={email} onChangeText={setEmail} placeholder="Ваш e-mail"/>
      <Button title="Оформить бронь" onPress={book}/>
    </View>
  );
}

const styles = StyleSheet.create({
  container:{flex:1,justifyContent:'center',padding:20,backgroundColor:'#fff'},
  input:{borderWidth:1,borderColor:'#ccc',borderRadius:8,padding:10,marginVertical:10}
});