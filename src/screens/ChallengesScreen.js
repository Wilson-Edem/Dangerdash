import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { getDailyChallenges } from '../constants/challenges';
import { loadSave, writeSave } from '../utils/saveManager';
import { setNotificationBadgeCount } from '../utils/notificationManager';

function todaySeed() {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}

export default function ChallengesScreen({ onBack }) {
  const { theme } = useTheme();
  const [save, setSave] = useState(null);
  const challenges = getDailyChallenges(todaySeed());

  useEffect(() => {
    loadSave().then(setSave).catch(() => {});
  }, []);

  const claim = async (ch) => {
    if (!save || save.challengeCompletedIds.includes(ch.id)) return;
    if (Number(save.currentLevel || 1) < Number(ch.minLevel || 1)) return;

    const updatedNotificationIds = (save.challengeNotificationIds || []).filter(
      (id) => id !== ch.id
    );

    const challengeBonus = 1 + 0.10 * Number(save.upgrades?.challenge_bonus || 0);
    const coinReward = Math.floor(Number(ch.reward || 0) * challengeBonus);

    const updated = await writeSave({
      totalCoins: Number(save.totalCoins || 0) + coinReward,
      challengeCompletedIds: [
        ...save.challengeCompletedIds,
        ch.id,
      ],
      challengeNotificationIds: updatedNotificationIds,
      challengeClaimedDate: todaySeed(),
    });

    await setNotificationBadgeCount(updatedNotificationIds.length);
    setSave(updated);
  };

  if (!save) return null;

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.screenBg }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack}>
          <Text style={[styles.back, { color: theme.colors.buttonText }]}>← BACK</Text>
        </TouchableOpacity>
        <View style={styles.headerStats}>
          <Text style={[styles.levelText, { color: theme.colors.subtitleText }]}>LV {save.currentLevel}</Text>
          <Text style={[styles.xp, { color: theme.colors.coinGold }]}>XP {save.xp}</Text>
          <Text style={[styles.coins, { color: theme.colors.coinGold }]}>🪙 {save.totalCoins}</Text>
        </View>
      </View>

      <Text style={[styles.title, { color: theme.colors.titleText }]}>DAILY CHALLENGES</Text>
      <Text style={[styles.subtitle, { color: theme.colors.subtitleText }]}>6 TASKS • RESET EVERY 24 HOURS • EARN XP + COINS</Text>

      <ScrollView contentContainerStyle={styles.list}>
        {challenges.map((ch) => {
          const locked = Number(save.currentLevel || 1) < Number(ch.minLevel || 1);
          const claimed = save.challengeCompletedIds.includes(ch.id);
          const progress = Number(save.challengeProgress?.[ch.id] || 0);
          const done = progress >= Number(ch.target || 0);

          return (
            <View
              key={ch.id}
              style={[
                styles.card,
                {
                  borderColor: locked
                    ? '#2B2B2B'
                    : done
                      ? theme.colors.buttonBorder
                      : '#333',
                  opacity: locked ? 0.65 : 1,
                },
              ]}
            >
              <View style={styles.cardTop}>
                <Text style={[styles.cardTier, { color: locked ? '#666' : theme.colors.coinGold }]}>
                  {ch.tier} • LV {ch.minLevel}+
                </Text>
                {locked && <Text style={styles.lock}>🔒 LOCKED</Text>}
              </View>

              <Text style={[styles.cardTitle, { color: locked ? '#777' : theme.colors.hudText }]}>
                {locked ? 'LEVEL LOCKED TASK' : ch.text}
              </Text>

              <Text style={[styles.cardProgress, { color: locked ? '#555' : theme.colors.subtitleText }]}>
                {locked ? `Reach Level ${ch.minLevel} to activate this task` : `${Math.min(progress, ch.target)} / ${ch.target}`}
              </Text>

              <View style={styles.rewardRow}>
                <Text style={[styles.reward, { color: locked ? '#555' : theme.colors.coinGold }]}>+{ch.xp} XP</Text>
                <Text style={[styles.reward, { color: locked ? '#555' : theme.colors.coinGold }]}>🪙 {ch.reward}</Text>
              </View>

              <TouchableOpacity
                style={[
                  styles.claimBtn,
                  {
                    backgroundColor:
                      locked || claimed || !done
                        ? '#333'
                        : theme.colors.buttonBorder,
                  },
                ]}
                disabled={locked || claimed || !done}
                onPress={() => claim(ch)}
              >
                <Text
                  style={[
                    styles.claimText,
                    {
                      color:
                        locked || claimed || !done
                          ? '#777'
                          : theme.colors.screenBg,
                    },
                  ]}
                >
                  {locked ? `UNLOCK AT LEVEL ${ch.minLevel}` : claimed ? '✓ CLAIMED' : done ? `CLAIM • +${Math.floor(ch.reward * (1 + 0.10 * Number(save.upgrades?.challenge_bonus || 0)))} COINS` : `IN PROGRESS • +${ch.reward}`}
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
  container: { flex: 1, padding: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  back: { fontSize: 16, fontWeight: 'bold', fontFamily: 'monospace' },
  headerStats: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  levelText: { fontSize: 12, fontWeight: '900', fontFamily: 'monospace' },
  xp: { fontSize: 13, fontWeight: '900', fontFamily: 'monospace' },
  coins: { fontSize: 15, fontWeight: '900', fontFamily: 'monospace' },
  title: { fontSize: 24, fontWeight: '900', fontFamily: 'monospace', letterSpacing: 3 },
  subtitle: { fontSize: 10, fontWeight: '800', fontFamily: 'monospace', marginBottom: 12 },
  list: { paddingBottom: 40 },
  card: { borderWidth: 2, borderRadius: 10, padding: 13, marginBottom: 10 },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardTier: { fontSize: 9, fontWeight: '900', letterSpacing: 1.5, fontFamily: 'monospace' },
  lock: { color: '#666', fontSize: 8, fontWeight: '900', fontFamily: 'monospace' },
  cardTitle: { fontSize: 14, fontWeight: '900', fontFamily: 'monospace', marginTop: 6 },
  cardProgress: { fontSize: 10, fontFamily: 'monospace', marginTop: 5 },
  rewardRow: { flexDirection: 'row', gap: 14, marginTop: 8 },
  reward: { fontSize: 10, fontWeight: '900', fontFamily: 'monospace' },
  claimBtn: { marginTop: 9, borderRadius: 6, padding: 9, alignItems: 'center' },
  claimText: { fontSize: 10, fontWeight: '900', fontFamily: 'monospace', letterSpacing: 0.8 },
});
