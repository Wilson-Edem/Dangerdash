import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { LEVELS, MAX_LEVEL } from '../constants/levels';
import { loadSave, unlockNextLevel } from '../utils/saveManager';

function ProgressBar({ value, max, color }) {
  const progress = max > 0 ? Math.min(1, Math.max(0, value / max)) : 1;
  return (
    <View style={styles.progressTrack}>
      <View style={[styles.progressFill, { width: `${progress * 100}%`, backgroundColor: color }]} />
    </View>
  );
}

export default function LevelScreen({ onBack }) {
  const { theme } = useTheme();
  const [save, setSave] = useState(null);
  const [message, setMessage] = useState('');

  const refresh = async () => setSave(await loadSave());

  useEffect(() => {
    refresh();
  }, []);

  const handleUnlock = async () => {
    setMessage('');
    const result = await unlockNextLevel();
    if (!result.ok) {
      if (result.reason === 'XP_REQUIREMENT') {
        setMessage('Earn more total XP before unlocking this level.');
      } else if (result.reason === 'XP_COST') {
        setMessage('You have reached the XP requirement, but need more unspent XP to unlock it.');
      } else {
        setMessage('All six levels are already unlocked.');
      }
      setSave(result.save);
      return;
    }
    setMessage(`LEVEL ${result.save.currentLevel} UNLOCKED!`);
    setSave(result.save);
  };

  if (!save) return null;

  const current = Number(save.currentLevel || 1);
  const next = LEVELS.find((level) => level.level === current + 1);
  const currentDefinition = LEVELS[current - 1];
  const totalXP = Number(save.totalXP || 0);
  const unspentXP = Number(save.xp || 0);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.screenBg }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack}>
          <Text style={[styles.back, { color: theme.colors.buttonText }]}>← BACK</Text>
        </TouchableOpacity>
        <View style={styles.xpHeader}>
          <Text style={[styles.xpLabel, { color: theme.colors.subtitleText }]}>XP</Text>
          <Text style={[styles.xpValue, { color: theme.colors.coinGold }]}>{unspentXP}</Text>
        </View>
      </View>

      <Text style={[styles.title, { color: theme.colors.titleText }]}>LEVELS</Text>
      <Text style={[styles.subtitle, { color: theme.colors.subtitleText }]}>EARN XP • UNLOCK • ADVANCE</Text>

      <View style={[styles.heroCard, { borderColor: currentDefinition.color }]}> 
        <Text style={[styles.heroLevel, { color: currentDefinition.color }]}>LEVEL {current}</Text>
        <Text style={[styles.heroName, { color: theme.colors.hudText }]}>{currentDefinition.name}</Text>
        <Text style={[styles.heroSub, { color: theme.colors.subtitleText }]}>{currentDefinition.subtitle}</Text>
        <Text style={[styles.tier, { color: theme.colors.coinGold }]}>ECONOMY TIER: {currentDefinition.tier}</Text>
        <Text style={[styles.totalXP, { color: theme.colors.hudText }]}>TOTAL XP EARNED: {totalXP}</Text>
        {next && (
          <ProgressBar
            value={totalXP}
            max={next.requiredXP}
            color={currentDefinition.color}
          />
        )}
      </View>

      {next && (
        <View style={[styles.unlockCard, { borderColor: theme.colors.buttonBorder }]}> 
          <View style={styles.unlockTop}>
            <View>
              <Text style={[styles.nextLabel, { color: theme.colors.subtitleText }]}>NEXT</Text>
              <Text style={[styles.nextName, { color: theme.colors.hudText }]}>LV {next.level} • {next.name}</Text>
            </View>
            <Text style={[styles.cost, { color: theme.colors.coinGold }]}>XP {next.unlockCost}</Text>
          </View>
          <Text style={[styles.requirement, { color: theme.colors.subtitleText }]}>Requires {next.requiredXP} total XP • You have {totalXP}</Text>
          <TouchableOpacity
            onPress={handleUnlock}
            disabled={totalXP < next.requiredXP || unspentXP < next.unlockCost}
            style={[
              styles.unlockButton,
              {
                backgroundColor:
                  totalXP >= next.requiredXP && unspentXP >= next.unlockCost
                    ? theme.colors.buttonBorder
                    : '#252525',
              },
            ]}
          >
            <Text style={[styles.unlockText, { color: totalXP >= next.requiredXP && unspentXP >= next.unlockCost ? theme.colors.screenBg : '#777' }]}>UNLOCK LEVEL {next.level}</Text>
          </TouchableOpacity>
          {message ? <Text style={[styles.message, { color: theme.colors.subtitleText }]}>{message}</Text> : null}
        </View>
      )}

      <ScrollView contentContainerStyle={styles.list}>
        {LEVELS.map((level) => {
          const unlocked = save.unlockedLevels.includes(level.level);
          const active = level.level === current;
          return (
            <View
              key={level.level}
              style={[
                styles.levelCard,
                {
                  borderColor: unlocked ? level.color : '#292929',
                  opacity: unlocked ? 1 : 0.65,
                },
              ]}
            >
              <View style={styles.levelRow}>
                <View style={[styles.levelNumber, { borderColor: unlocked ? level.color : '#444' }]}>
                  <Text style={[styles.levelNumberText, { color: unlocked ? level.color : '#666' }]}>{level.level}</Text>
                </View>
                <View style={styles.levelInfo}>
                  <Text style={[styles.levelName, { color: unlocked ? theme.colors.hudText : '#777' }]}>
                    {unlocked ? level.name : 'LOCKED'}
                  </Text>
                  <Text style={[styles.levelSub, { color: unlocked ? theme.colors.subtitleText : '#555' }]}>
                    {unlocked ? level.subtitle : `Reach ${level.requiredXP} total XP`}
                  </Text>
                </View>
                <Text style={[styles.status, { color: unlocked ? level.color : '#555' }]}>
                  {active ? 'CURRENT' : unlocked ? 'OPEN' : '🔒'}
                </Text>
              </View>
              {unlocked && (
                <View style={styles.perks}>
                  {level.perks.map((perk) => (
                    <Text key={perk} style={[styles.perk, { color: theme.colors.subtitleText }]}>• {perk}</Text>
                  ))}
                </View>
              )}
            </View>
          );
        })}
        {current === MAX_LEVEL && (
          <Text style={[styles.maxText, { color: theme.colors.coinGold }]}>★ MAX LEVEL REACHED ★</Text>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  back: { fontSize: 16, fontWeight: 'bold', fontFamily: 'monospace' },
  xpHeader: { flexDirection: 'row', alignItems: 'baseline', gap: 7 },
  xpLabel: { fontSize: 11, fontWeight: '900', letterSpacing: 2, fontFamily: 'monospace' },
  xpValue: { fontSize: 18, fontWeight: '900', fontFamily: 'monospace' },
  title: { fontSize: 30, fontWeight: '900', fontFamily: 'monospace', letterSpacing: 4 },
  subtitle: { fontSize: 11, fontWeight: '800', fontFamily: 'monospace', letterSpacing: 2, marginBottom: 12 },
  heroCard: { borderWidth: 2, borderRadius: 12, padding: 15, marginBottom: 10 },
  heroLevel: { fontSize: 12, fontWeight: '900', letterSpacing: 2, fontFamily: 'monospace' },
  heroName: { fontSize: 24, fontWeight: '900', fontFamily: 'monospace', marginTop: 3 },
  heroSub: { fontSize: 11, fontFamily: 'monospace', marginTop: 3 },
  tier: { fontSize: 10, fontWeight: '900', letterSpacing: 2, fontFamily: 'monospace', marginTop: 10 },
  totalXP: { fontSize: 11, fontWeight: '800', fontFamily: 'monospace', marginTop: 8, marginBottom: 6 },
  progressTrack: { height: 8, borderRadius: 8, backgroundColor: '#191919', overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 8 },
  unlockCard: { borderWidth: 2, borderRadius: 10, padding: 13, marginBottom: 10 },
  unlockTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  nextLabel: { fontSize: 9, fontWeight: '900', letterSpacing: 2, fontFamily: 'monospace' },
  nextName: { fontSize: 15, fontWeight: '900', fontFamily: 'monospace', marginTop: 3 },
  cost: { fontSize: 16, fontWeight: '900', fontFamily: 'monospace' },
  requirement: { fontSize: 10, fontFamily: 'monospace', marginTop: 8 },
  unlockButton: { marginTop: 10, paddingVertical: 10, borderRadius: 7, alignItems: 'center' },
  unlockText: { fontSize: 12, fontWeight: '900', fontFamily: 'monospace', letterSpacing: 1.5 },
  message: { fontSize: 10, fontFamily: 'monospace', marginTop: 8 },
  list: { paddingBottom: 30 },
  levelCard: { borderWidth: 2, borderRadius: 10, padding: 12, marginBottom: 9 },
  levelRow: { flexDirection: 'row', alignItems: 'center' },
  levelNumber: { width: 38, height: 38, borderWidth: 2, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  levelNumberText: { fontSize: 18, fontWeight: '900', fontFamily: 'monospace' },
  levelInfo: { flex: 1, marginLeft: 10 },
  levelName: { fontSize: 14, fontWeight: '900', fontFamily: 'monospace' },
  levelSub: { fontSize: 10, fontFamily: 'monospace', marginTop: 2 },
  status: { fontSize: 8, fontWeight: '900', fontFamily: 'monospace' },
  perks: { marginTop: 9, paddingLeft: 48 },
  perk: { fontSize: 9, fontFamily: 'monospace', marginBottom: 2 },
  maxText: { textAlign: 'center', fontSize: 11, fontWeight: '900', fontFamily: 'monospace', letterSpacing: 2, marginVertical: 10 },
});
