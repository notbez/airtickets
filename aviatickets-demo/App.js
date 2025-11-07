import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import SearchScreen from './screens/SearchScreen';
import ResultsScreen from './screens/ResultsScreen';
import BookingScreen from './screens/BookingScreen';
import TicketScreen from './screens/TicketScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Search">
        <Stack.Screen name="Search" component={SearchScreen} options={{ title: 'Поиск' }} />
        <Stack.Screen name="Results" component={ResultsScreen} options={{ title: 'Результаты' }} />
        <Stack.Screen name="Booking" component={BookingScreen} options={{ title: 'Бронь' }} />
        <Stack.Screen name="Ticket" component={TicketScreen} options={{ title: 'Билет' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}