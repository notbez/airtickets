import React from 'react';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';
import { BlurView } from 'expo-blur';
import Animated, { useSharedValue, withTiming, useAnimatedStyle } from 'react-native-reanimated';

export default function LoadingOverlay({ progress = 0.6 }) {
  // Простая реализация: статичный индикатор + полоска анимированная (необязательно)
  return (
    <BlurView intensity={80} tint="light" style={styles.wrapper}>
      <View style={styles.box}>
        <ActivityIndicator size="large" color="#29A9E0" />
        <Text style={styles.text}>Идёт поиск рейсов…</Text>
        <View style={styles.progressBg}>
          <View style={[styles.progressBar, { width: '40%' }]} />
        </View>
      </View>
    </BlurView>
  );
}

const styles = StyleSheet.create({
  wrapper: { ...StyleSheet.absoluteFillObject, alignItems: 'center', justifyContent: 'center' },
  box: { width: 260, height: 160, backgroundColor: 'rgba(255,255,255,0.85)', borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  text: { marginTop: 12, color: '#333' },
  progressBg: { marginTop: 12, width: '80%', height: 8, backgroundColor: '#eee', borderRadius: 8 },
  progressBar: { height: '100%', backgroundColor: '#29A9E0', borderRadius: 8 }
});