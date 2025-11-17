import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import BottomTabs from './BottomTabs';
import ResultsScreen from '../screens/ResultsScreen';

const Stack = createStackNavigator();

export default function RootNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTabs" component={BottomTabs} />
      <Stack.Screen
        name="Results"
        component={ResultsScreen}
        options={{
          // when navigating to Results we want full-screen stack (no bottom tabs)
          presentation: 'card',
        }}
      />
    </Stack.Navigator>
  );
}