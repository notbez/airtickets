import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function FlightCard({ item, onBook }) {
  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <Text style={styles.route}>{item.from} → {item.to}</Text>
        <Text style={styles.price}>{item.price} ₽</Text>
      </View>

      <Text style={styles.time}>{item.departTime} — {item.arriveTime}</Text>
      <Text style={styles.provider}>{item.provider}</Text>

      <TouchableOpacity style={styles.btn} onPress={()=> onBook(item)}>
        <Text style={styles.btnText}>Забронировать</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card:{ backgroundColor:'#fff', padding:14, borderRadius:12, marginBottom:12, borderWidth:1, borderColor:'#eee' },
  row:{ flexDirection:'row', justifyContent:'space-between', alignItems:'center' },
  route:{ fontWeight:'700', fontSize:16 },
  price:{ color:'#29A9E0', fontWeight:'700' },
  time:{ marginTop:8, color:'#666' },
  provider:{ marginTop:6, color:'#999', fontSize:12 },
  btn:{ marginTop:12, backgroundColor:'#29A9E0', paddingVertical:10, borderRadius:8, alignItems:'center' },
  btnText:{ color:'#fff', fontWeight:'700' }
});