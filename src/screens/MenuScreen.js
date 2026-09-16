import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../context/ThemeContext';
import { loadSave } from '../utils/saveManager';

export default function MenuScreen({ onPlay, onShop, onChallenges, onOptions, onLevels }) {
  const { theme } = useTheme();
  const [save, setSave] = useState(null);
  const pendingChallengeCount = save?.challengeNotificationIds?.length || 0;
  const pulse = useRef(new Animated.Value(0.85)).current;
  const glow = useRef(new Animated.Value(0.4)).current;

  useEffect(() => { loadSave().then(setSave).catch(() => {}); }, []);
  useEffect(() => {
    const p = Animated.loop(Animated.sequence([
      Animated.timing(pulse, { toValue: 1, duration: 1000, useNativeDriver: true }),
      Animated.timing(pulse, { toValue: 0.85, duration: 1000, useNativeDriver: true }),
    ]));
    const g = Animated.loop(Animated.sequence([
      Animated.timing(glow, { toValue: 1, duration: 900, useNativeDriver: true }),
      Animated.timing(glow, { toValue: 0.45, duration: 900, useNativeDriver: true }),
    ]));
    p.start(); g.start();
    return () => { p.stop(); g.stop(); };
  }, []);

  const Button = ({ children, onPress, primary = false, small = false }) => (
    <TouchableOpacity activeOpacity={0.78} onPress={onPress} style={[styles.button, small && styles.smallButton, primary && styles.primaryButton]}>
      <LinearGradient colors={primary ? ['#123D52', '#17102E'] : ['#0D1424', '#090814']} style={styles.buttonGradient}>
        <Text style={[styles.buttonText, primary && styles.primaryButtonText]}>{children}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.screenBg }]}>
      <View style={styles.topLine} /><View style={styles.bottomLine} />
      <View style={styles.content}>
        <Animated.Text style={[styles.title, { color: theme.colors.titleText, opacity: glow }]}>DANGER DASH</Animated.Text>
        <Text style={[styles.subtitle, { color: theme.colors.subtitleText }]}>MOBILE • BY VHITE</Text>

        <View style={styles.stats}>
          <View style={styles.statCard}><Text style={styles.statIcon}>◈</Text><View><Text style={styles.statLabel}>COINS</Text><Text style={[styles.statValue, { color: theme.colors.coinGold }]}>{save?.totalCoins ?? 0}</Text></View></View>
          <View style={styles.statCard}><Text style={styles.statIcon}>◆</Text><View><Text style={styles.statLabel}>HIGH SCORE</Text><Text style={[styles.statValue, { color: theme.colors.coinGold }]}>{save?.highScore ?? 0}</Text></View></View>
          <View style={styles.statCard}><Text style={styles.statIcon}>LV</Text><View><Text style={styles.statLabel}>LEVEL • XP</Text><Text style={[styles.statValue, { color: theme.colors.coinGold }]}>{save?.currentLevel ?? 1} • {save?.xp ?? 0}</Text></View></View>
        </View>

        <Animated.View style={{ transform: [{ scale: pulse }] }}><Button primary onPress={onPlay}>▶  PLAY</Button></Animated.View>
        <View style={styles.row}>
          <Button onPress={onShop}>SHOP</Button>
          <View style={styles.dailyButtonWrap}>
            <Button onPress={onChallenges}>DAILY</Button>
            {pendingChallengeCount > 0 && <View style={styles.challengeBadge}><Text style={styles.challengeBadgeText}>{pendingChallengeCount > 9 ? '9+' : pendingChallengeCount}</Text></View>}
          </View>
        </View>
        <View style={styles.row}>
          <Button small onPress={onLevels}>★  LEVELS</Button>
          <Button small onPress={onOptions}>⚙  OPTIONS</Button>
        </View>
        <Text style={styles.footer}>RUN • JUMP • SURVIVE</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', overflow: 'hidden' },
  content: { width: '76%', maxWidth: 620, alignItems: 'center' },
  topLine: { position: 'absolute', top: 0, left: '8%', right: '8%', height: 1, backgroundColor: '#00F0FF', opacity: 0.4 },
  bottomLine: { position: 'absolute', bottom: 0, left: '8%', right: '8%', height: 1, backgroundColor: '#A855F7', opacity: 0.3 },
  title: { fontSize: 48, fontWeight: '900', letterSpacing: 7, textShadowColor: '#00F0FF', textShadowRadius: 18, fontFamily: 'monospace' },
  subtitle: { marginTop: 5, marginBottom: 15, fontSize: 12, fontWeight: '800', letterSpacing: 4 },
  stats: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 10, marginBottom: 15 },
  statCard: { minWidth: 145, paddingHorizontal: 13, paddingVertical: 8, borderWidth: 1, borderColor: '#243A52', borderRadius: 9, backgroundColor: 'rgba(7,11,22,0.85)', flexDirection: 'row', alignItems: 'center', gap: 9 },
  statIcon: { color: '#00F0FF', fontSize: 17 },
  statLabel: { color: '#70788A', fontSize: 8, fontWeight: '800', letterSpacing: 1.5 },
  statValue: { marginTop: 2, fontSize: 14, fontWeight: '900', fontFamily: 'monospace' },
  button: { width: 250, height: 48, marginBottom: 9, borderRadius: 9, overflow: 'hidden', borderWidth: 1, borderColor: '#00F0FF' },
  primaryButton: { width: 300, height: 58, borderWidth: 2, marginBottom: 11 },
  smallButton: { width: 185, height: 38, borderColor: '#563C78' },
  buttonGradient: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  buttonText: { color: '#00F0FF', fontSize: 14, fontWeight: '900', letterSpacing: 2, fontFamily: 'monospace' },
  primaryButtonText: { fontSize: 20, color: '#FFFFFF', textShadowColor: '#00F0FF', textShadowRadius: 8 },
  row: { flexDirection: 'row', gap: 10 },
  dailyButtonWrap: { position: 'relative' },
  challengeBadge: { position: 'absolute', top: -7, right: -7, minWidth: 22, height: 22, paddingHorizontal: 5, borderRadius: 11, backgroundColor: '#FF1744', borderWidth: 2, borderColor: '#05060D', alignItems: 'center', justifyContent: 'center', zIndex: 10 },
  challengeBadgeText: { color: '#FFFFFF', fontSize: 10, lineHeight: 12, fontWeight: '900', fontFamily: 'monospace' },
  footer: { marginTop: 12, color: '#4F5362', fontSize: 8, fontWeight: '800', letterSpacing: 3 },
});
