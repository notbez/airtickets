import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import SearchScreen from '../screens/SearchScreen';
import ResultsScreen from '../screens/ResultsScreen';
import BookingScreen from '../screens/BookingScreen';
import TicketScreen from '../screens/TicketScreen';

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator initialRouteName="Search">
      <Stack.Screen name="Search" component={SearchScreen} options={{ title: 'Search flights' }} />
      <Stack.Screen name="Results" component={ResultsScreen} options={{ title: 'Results' }} />
      <Stack.Screen name="Booking" component={BookingScreen} options={{ title: 'Booking' }} />
      <Stack.Screen name="Ticket" component={TicketScreen} options={{ title: 'Ticket' }} />
    </Stack.Navigator>
  );
}