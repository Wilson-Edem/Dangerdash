import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { loadSave } from '../utils/saveManager';

export default function MenuScreen({ onPlay, onShop, onChallenges, onOptions }) {
  const [save, setSave] = useState(null);

  useEffect(() => {
    loadSave().then(setSave);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>DANGERDASH</Text>
      <Text style={styles.subtitle}>MOBILE • BY VHITE</Text>

      <View style={styles.coinRow}>
        <Text style={styles.coinText}>🪙 {save?.totalCoins ?? 0}</Text>
        <Text style={styles.coinText}>🏆 {save?.highScore ?? 0}</Text>
      </View>

      <TouchableOpacity style={styles.btn} onPress={onPlay}>
        <Text style={styles.btnText}> PLAY</Text>
      </TouchableOpacity>

      <View style={styles.row}>
        <TouchableOpacity style={[styles.btn, styles.halfBtn]} onPress={onShop}>
          <Text style={styles.btnText}> SHOP</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.btn, styles.halfBtn]} onPress={onChallenges}>
          <Text style={styles.btnText}> DAILY CHALLENGES</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={[styles.btn, styles.smallBtn]} onPress={onOptions}>
        <Text style={styles.btnText}> OPTIONS</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#030108', justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { color: '#00F0FF', fontSize: 48, fontWeight: '900', fontFamily: 'monospace', letterSpacing: 6, marginBottom: 4 },
  subtitle: { color: '#A855F7', fontSize: 14, fontWeight: 'bold', fontFamily: 'monospace', letterSpacing: 4, marginBottom: 30 },
  coinRow: { flexDirection: 'row', gap: 24, marginBottom: 30 },
  coinText: { color: '#FFD700', fontSize: 18, fontWeight: 'bold', fontFamily: 'monospace' },
  btn: { backgroundColor: 'rgba(10, 20, 30, 0.9)', borderColor: '#00F0FF', borderWidth: 2, borderRadius: 10, paddingVertical: 16, paddingHorizontal: 40, marginBottom: 12, minWidth: 240, alignItems: 'center' },
  row: { flexDirection: 'row', gap: 12 },
  halfBtn: { minWidth: 115, paddingHorizontal: 20 },
  smallBtn: { paddingVertical: 10, paddingHorizontal: 20, minWidth: 0 },
  btnText: { color: '#00F0FF', fontSize: 18, fontWeight: 'bold', fontFamily: 'monospace', letterSpacing: 2 },
});