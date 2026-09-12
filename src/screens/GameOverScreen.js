import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import Svg, { Polyline, Line } from 'react-native-svg';

export default function GameOverScreen({ score, coins, isNewHigh, runLog, onRetry, onMenu }) {
  const chartWidth = 300;
  const chartHeight = 100;
  const maxScore = Math.max(...runLog.map((r) => r.score), 100);
  const points = runLog
    .slice()
    .reverse()
    .map((r, i, arr) => {
      const x = arr.length === 1 ? 0 : (i / (arr.length - 1)) * chartWidth;
      const y = chartHeight - (r.score / maxScore) * chartHeight;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <View style={styles.container}>
      <Text style={styles.gameOver}>GAME OVER</Text>
      <Text style={styles.score}>SCORE: {score}</Text>
      <Text style={styles.coins}>🪙 +{coins}</Text>
      {isNewHigh && <Text style={styles.newHigh}>★ NEW HIGH SCORE ★</Text>}

      <Text style={styles.chartTitle}>LAST 10 RUNS</Text>
      <View style={styles.chartBox}>
        <Svg width={chartWidth} height={chartHeight}>
          <Line x1="0" y1={chartHeight - 1} x2={chartWidth} y2={chartHeight - 1} stroke="#333" strokeWidth="1" />
          {points && <Polyline points={points} fill="none" stroke="#00F0FF" strokeWidth="2" />}
        </Svg>
      </View>

      <TouchableOpacity style={styles.btn} onPress={onRetry}>
        <Text style={styles.btnText}> RETRY</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.btn, styles.secondary]} onPress={onMenu}>
        <Text style={styles.btnText}>← MAIN MENU</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#030108', justifyContent: 'center', alignItems: 'center', padding: 20 },
  gameOver: { color: '#FF0055', fontSize: 44, fontWeight: '900', fontFamily: 'monospace', letterSpacing: 4 },
  score: { color: '#fff', fontSize: 24, fontWeight: 'bold', fontFamily: 'monospace', marginTop: 20 },
  coins: { color: '#FFD700', fontSize: 20, fontFamily: 'monospace', marginTop: 8 },
  newHigh: { color: '#FFD700', fontSize: 18, fontWeight: 'bold', fontFamily: 'monospace', marginTop: 12, letterSpacing: 2 },
  chartTitle: { color: '#00F0FF', fontSize: 14, fontWeight: 'bold', fontFamily: 'monospace', marginTop: 30, marginBottom: 10, letterSpacing: 2 },
  chartBox: { borderWidth: 1, borderColor: '#333', borderRadius: 6, padding: 8, marginBottom: 30 },
  btn: { backgroundColor: 'rgba(10, 20, 30, 0.9)', borderColor: '#00F0FF', borderWidth: 2, borderRadius: 10, paddingVertical: 14, paddingHorizontal: 40, marginBottom: 10, minWidth: 240, alignItems: 'center' },
  secondary: { borderColor: '#A855F7' },
  btnText: { color: '#00F0FF', fontSize: 16, fontWeight: 'bold', fontFamily: 'monospace', letterSpacing: 2 },
});