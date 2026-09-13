import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { loadSave } from '../utils/saveManager';

export default function MenuScreen({ onPlay, onShop, onChallenges, onOptions }) {
  const { theme } = useTheme();
  const [save, setSave] = useState(null);

  useEffect(() => {
    loadSave().then(setSave);
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.screenBg }]}>
      <Text style={[styles.title, { color: theme.colors.titleText }]}>DANGER DASH</Text>
      <Text style={[styles.subtitle, { color: theme.colors.subtitleText }]}>MOBILE • BY VHITE</Text>

      <View style={styles.coinRow}>
        <Text style={[styles.coinText, { color: theme.colors.coinGold }]}>
          🪙 {save?.totalCoins ?? 0}
        </Text>
        <Text style={[styles.coinText, { color: theme.colors.coinGold }]}>
          🏆 {save?.highScore ?? 0}
        </Text>
      </View>

      <TouchableOpacity
        style={[styles.btn, { borderColor: theme.colors.buttonBorder, backgroundColor: theme.colors.buttonBg }]}
        onPress={onPlay}
      >
        <Text style={[styles.btnText, { color: theme.colors.buttonText }]}>▶ PLAY</Text>
      </TouchableOpacity>

      <View style={styles.row}>
        <TouchableOpacity
          style={[styles.btn, styles.halfBtn, { borderColor: theme.colors.buttonBorder, backgroundColor: theme.colors.buttonBg }]}
          onPress={onShop}
        >
          <Text style={[styles.btnText, { color: theme.colors.buttonText }]}>🛒 SHOP</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.btn, styles.halfBtn, { borderColor: theme.colors.buttonBorder, backgroundColor: theme.colors.buttonBg }]}
          onPress={onChallenges}
        >
          <Text style={[styles.btnText, { color: theme.colors.buttonText }]}>🎯 DAILY</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[styles.btn, styles.smallBtn, { borderColor: theme.colors.buttonBorder, backgroundColor: theme.colors.buttonBg }]}
        onPress={onOptions}
      >
        <Text style={[styles.btnText, { color: theme.colors.buttonText }]}>⚙ OPTIONS</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 48, fontWeight: '900', fontFamily: 'monospace', letterSpacing: 6, marginBottom: 4 },
  subtitle: { fontSize: 14, fontWeight: 'bold', fontFamily: 'monospace', letterSpacing: 4, marginBottom: 30 },
  coinRow: { flexDirection: 'row', gap: 24, marginBottom: 30 },
  coinText: { fontSize: 18, fontWeight: 'bold', fontFamily: 'monospace' },
  btn: { borderWidth: 2, borderRadius: 10, paddingVertical: 16, paddingHorizontal: 40, marginBottom: 12, minWidth: 240, alignItems: 'center' },
  row: { flexDirection: 'row', gap: 12 },
  halfBtn: { minWidth: 115, paddingHorizontal: 20 },
  smallBtn: { paddingVertical: 10, paddingHorizontal: 20, minWidth: 0 },
  btnText: { fontSize: 18, fontWeight: 'bold', fontFamily: 'monospace', letterSpacing: 2 },
});