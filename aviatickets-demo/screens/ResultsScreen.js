import React from 'react';
import { View, Text, FlatList, StyleSheet, SafeAreaView, Image, TouchableOpacity } from 'react-native';
import FlightCard from '../components/FlightCard';
import { useRoute } from '@react-navigation/native';

export default function ResultsScreen({ navigation }) {
  const route = useRoute();
  const results = route.params?.results || [];

  const renderHeader = () => (
    <>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.back}>{'<'}</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Выберите рейс</Text>
        <View style={{width:24}} />
      </View>

      <View style={styles.routeBox}>
        <Text style={styles.city}>Дубай</Text>
        <Text style={styles.code}>DXB</Text>
        <Image source={require('../assets/plane.png')} style={styles.planeIcon} />
        <Text style={styles.city}>Манчестер</Text>
        <Text style={styles.code}>MAN</Text>
      </View>

      <View style={{ height: 20 }} /> 
    </>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <FlatList
        data={results}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.cardWrapper}>
            <FlightCard 
              item={item} 
              onBook={() => navigation.navigate('MainTabs')}
            />
          </View>
        )}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={{ paddingBottom: 20 }}
        ListEmptyComponent={<Text style={{ textAlign:'center', marginTop:40 }}>Рейсов не найдено</Text>}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:{ 
    flex:1, 
    backgroundColor:'#fff'
  },

  topBar:{ 
    backgroundColor:'#2aa8ff',
    flexDirection:'row', 
    alignItems:'center', 
    justifyContent:'space-between', 
    paddingHorizontal:16, 
    paddingTop:10,
    paddingBottom:12
  },

  back:{ 
    fontSize:24,
    color:'#fff'
  },

  title:{ 
    fontSize:20, 
    fontWeight:'700',
    color:'#fff'
  },

  routeBox:{ 
    backgroundColor:'#2aa8ff',
    padding:20, 
    alignItems:'center',
    borderBottomLeftRadius:20,
    borderBottomRightRadius:20,
  },

  city:{ 
    color:'#fff', 
    fontSize:16 
  },

  code:{ 
    color:'#fff', 
    fontSize:22, 
    fontWeight:'700' 
  },

  planeIcon:{ 
    width:40, 
    height:40, 
    marginVertical:8 
  },

  cardWrapper: {
    marginHorizontal: 16,
    marginBottom: 16,
  }
});