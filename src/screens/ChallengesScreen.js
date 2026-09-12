import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { getDailyChallenges } from '../constants/challenges';
import { loadSave, writeSave } from '../utils/saveManager';

function todaySeed() {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}

export default function ChallengesScreen({ onBack }) {
  const [save, setSave] = useState(null);
  const challenges = getDailyChallenges(todaySeed());

  useEffect(() => { loadSave().then(setSave); }, []);

  const claim = async (ch) => {
    if (save.challengeCompletedIds.includes(ch.id)) return;
    await writeSave({
      totalCoins: save.totalCoins + ch.reward,
      challengeCompletedIds: [...save.challengeCompletedIds, ch.id],
    });
    setSave(await loadSave());
  };

  if (!save) return null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack}><Text style={styles.back}>← BACK</Text></TouchableOpacity>
        <Text style={styles.coins}>🪙 {save.totalCoins}</Text>
      </View>

      <Text style={styles.title}>DAILY VHITE CHALLENGES</Text>
      <Text style={styles.subtitle}>Reset every 24 hours</Text>

      <ScrollView contentContainerStyle={styles.list}>
        {challenges.map((ch) => {
          const claimed = save.challengeCompletedIds.includes(ch.id);
          const progress = save.challengeProgress[ch.id] || 0;
          const done = progress >= ch.target;

          return (
            <View key={ch.id} style={[styles.card, done && styles.cardDone]}>
              <Text style={styles.cardTitle}>{ch.text}</Text>
              <Text style={styles.cardProgress}>{Math.min(progress, ch.target)} / {ch.target}</Text>
              <TouchableOpacity style={[styles.claimBtn, (claimed || !done) && styles.claimDisabled]} disabled={claimed || !done} onPress={() => claim(ch)}>
                <Text style={styles.claimText}>
                  {claimed ? '✓ CLAIMED' : done ? `CLAIM 🪙 ${ch.reward}` : `🪙 ${ch.reward}`}
                </Text>
              </TouchableOpacity>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#030108', padding: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  back: { color: '#00F0FF', fontSize: 16, fontWeight: 'bold', fontFamily: 'monospace' },
  coins: { color: '#FFD700', fontSize: 18, fontWeight: 'bold', fontFamily: 'monospace' },
  title: { color: '#00F0FF', fontSize: 24, fontWeight: '900', fontFamily: 'monospace', letterSpacing: 3 },
  subtitle: { color: '#A855F7', fontSize: 12, fontFamily: 'monospace', marginBottom: 16 },
  list: { paddingBottom: 40 },
  card: { backgroundColor: 'rgba(10, 20, 30, 0.9)', borderWidth: 2, borderColor: '#333', borderRadius: 10, padding: 14, marginBottom: 12 },
  cardDone: { borderColor: '#00FF66' },
  cardTitle: { color: '#fff', fontSize: 15, fontWeight: 'bold', fontFamily: 'monospace' },
  cardProgress: { color: '#A855F7', fontSize: 13, fontFamily: 'monospace', marginTop: 6 },
  claimBtn: { marginTop: 10, backgroundColor: '#00F0FF', borderRadius: 6, padding: 10, alignItems: 'center' },
  claimDisabled: { backgroundColor: '#333' },
  claimText: { color: '#000', fontWeight: 'bold', fontFamily: 'monospace' },
});