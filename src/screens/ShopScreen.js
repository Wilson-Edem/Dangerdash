import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { SKINS } from '../constants/skins';
import { UPGRADES } from '../constants/upgrades';
import { loadSave, unlockSkin, equipSkin, buyUpgrade } from '../utils/saveManager';

export default function ShopScreen({ onBack }) {
  const { theme } = useTheme();
  const [save, setSave] = useState(null);
  const [tab, setTab] = useState('skins');
  const [message, setMessage] = useState('');

  const refresh = async () => setSave(await loadSave());
  useEffect(() => { refresh(); }, []);

  const handleSkin = async (skin) => {
    setMessage('');
    if (save.currentLevel < skin.minLevel) {
      setMessage(`${skin.name} unlocks at Level ${skin.minLevel}.`);
      return;
    }

    if (save.ownedSkins.includes(skin.id)) {
      await equipSkin(skin.id);
    } else {
      const ok = await unlockSkin(skin.id, skin.price, skin.minLevel);
      if (!ok) {
        setMessage(`Not enough coins for ${skin.name}.`);
        return;
      }
    }
    await refresh();
  };

  const handleUpgrade = async (up) => {
    setMessage('');
    if (save.currentLevel < up.minLevel) {
      setMessage(`${up.name} unlocks at Level ${up.minLevel}.`);
      return;
    }

    const current = save.upgrades[up.id] || 0;
    if (current >= up.maxLevel) return;

    const cost = up.costs[current];
    const ok = await buyUpgrade(up.id, cost, current, up.minLevel);
    if (ok) {
      await refresh();
    } else {
      setMessage(`Not enough coins for ${up.name}.`);
    }
  };

  if (!save) return null;

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.screenBg }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack}>
          <Text style={[styles.back, { color: theme.colors.buttonText }]}>← BACK</Text>
        </TouchableOpacity>
        <View style={styles.headerStats}>
          <Text style={[styles.level, { color: theme.colors.subtitleText }]}>LV {save.currentLevel}</Text>
          <Text style={[styles.coins, { color: theme.colors.coinGold }]}>🪙 {save.totalCoins}</Text>
        </View>
      </View>

      <Text style={[styles.title, { color: theme.colors.titleText }]}>SHOP</Text>
      <Text style={[styles.subtitle, { color: theme.colors.subtitleText }]}>LOW • MEDIUM • HIGH ECONOMY</Text>

      <View style={styles.tabs}>
        <TouchableOpacity
          onPress={() => setTab('skins')}
          style={[styles.tab, { borderColor: tab === 'skins' ? theme.colors.buttonBorder : '#333' }]}
        >
          <Text style={[styles.tabText, { color: theme.colors.buttonText }]}>SKINS</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setTab('upgrades')}
          style={[styles.tab, { borderColor: tab === 'upgrades' ? theme.colors.buttonBorder : '#333' }]}
        >
          <Text style={[styles.tabText, { color: theme.colors.buttonText }]}>UPGRADES</Text>
        </TouchableOpacity>
      </View>

      {message ? <Text style={[styles.message, { color: theme.colors.subtitleText }]}>{message}</Text> : null}

      <ScrollView contentContainerStyle={styles.list}>
        {tab === 'skins' && SKINS.map((skin) => {
          const locked = save.currentLevel < skin.minLevel;
          const owned = save.ownedSkins.includes(skin.id);
          const equipped = save.equippedSkin === skin.id;

          return (
            <TouchableOpacity
              key={skin.id}
              style={[
                styles.card,
                {
                  borderColor: equipped ? theme.colors.buttonBorder : locked ? '#292929' : '#333',
                  opacity: locked ? 0.6 : 1,
                },
              ]}
              onPress={() => handleSkin(skin)}
            >
              <View style={styles.cardTop}>
                <Text style={[styles.tier, { color: locked ? '#666' : theme.colors.coinGold }]}>{skin.tier}</Text>
                <Text style={[styles.levelReq, { color: locked ? '#666' : theme.colors.subtitleText }]}>LV {skin.minLevel}+</Text>
              </View>
              <View style={styles.swatchRow}>
                {skin.colors.map((c, i) => <View key={i} style={[styles.swatch, { backgroundColor: c }]} />)}
              </View>
              <Text style={[styles.cardTitle, { color: locked ? '#777' : theme.colors.hudText }]}>{locked ? '🔒 LOCKED SKIN' : skin.name}</Text>
              <Text style={[styles.cardSub, { color: locked ? '#555' : theme.colors.subtitleText }]}>
                {locked ? `Reach Level ${skin.minLevel}` : equipped ? 'EQUIPPED' : owned ? 'TAP TO EQUIP' : `🪙 ${skin.price}`}
              </Text>
            </TouchableOpacity>
          );
        })}

        {tab === 'upgrades' && UPGRADES.map((up) => {
          const current = save.upgrades[up.id] || 0;
          const maxed = current >= up.maxLevel;
          const locked = save.currentLevel < up.minLevel;

          return (
            <TouchableOpacity
              key={up.id}
              style={[
                styles.card,
                {
                  borderColor: maxed ? theme.colors.buttonBorder : locked ? '#292929' : '#333',
                  opacity: locked ? 0.6 : 1,
                },
              ]}
              onPress={() => handleUpgrade(up)}
              disabled={maxed}
            >
              <View style={styles.cardTop}>
                <Text style={[styles.tier, { color: locked ? '#666' : theme.colors.coinGold }]}>{up.tier}</Text>
                <Text style={[styles.levelReq, { color: locked ? '#666' : theme.colors.subtitleText }]}>LV {up.minLevel}+</Text>
              </View>
              <Text style={[styles.cardTitle, { color: locked ? '#777' : theme.colors.hudText }]}>{locked ? '🔒 LOCKED UPGRADE' : up.name}</Text>
              <Text style={[styles.cardSub, { color: locked ? '#555' : theme.colors.subtitleText }]}>{locked ? `Reach Level ${up.minLevel} to access` : up.description}</Text>
              <Text style={[styles.cardCost, { color: locked ? '#555' : theme.colors.coinGold }]}> 
                {locked ? `LOCKED • LEVEL ${up.minLevel}` : maxed ? '✓ MAXED' : `LV ${current}/${up.maxLevel} • 🪙 ${up.costs[current]}`}
              </Text>
            </TouchableOpacity>
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
  headerStats: { flexDirection: 'row', gap: 14, alignItems: 'center' },
  level: { fontSize: 12, fontWeight: '900', fontFamily: 'monospace' },
  coins: { fontSize: 17, fontWeight: '900', fontFamily: 'monospace' },
  title: { fontSize: 30, fontWeight: '900', fontFamily: 'monospace', letterSpacing: 4 },
  subtitle: { fontSize: 10, fontWeight: '800', fontFamily: 'monospace', letterSpacing: 2, marginBottom: 12 },
  tabs: { flexDirection: 'row', gap: 10, marginBottom: 8 },
  tab: { paddingVertical: 8, paddingHorizontal: 20, borderWidth: 2, borderRadius: 8 },
  tabText: { fontWeight: '900', fontFamily: 'monospace', letterSpacing: 1 },
  message: { fontSize: 10, fontFamily: 'monospace', marginBottom: 8 },
  list: { paddingBottom: 40 },
  card: { borderWidth: 2, borderRadius: 10, padding: 13, marginBottom: 10 },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  tier: { fontSize: 9, fontWeight: '900', letterSpacing: 1.5, fontFamily: 'monospace' },
  levelReq: { fontSize: 9, fontWeight: '900', fontFamily: 'monospace' },
  swatchRow: { flexDirection: 'row', gap: 6, marginTop: 8, marginBottom: 7 },
  swatch: { width: 26, height: 26, borderRadius: 5, borderWidth: 1, borderColor: '#fff' },
  cardTitle: { fontSize: 15, fontWeight: '900', fontFamily: 'monospace' },
  cardSub: { fontSize: 11, fontFamily: 'monospace', marginTop: 4 },
  cardCost: { fontSize: 11, fontWeight: '900', fontFamily: 'monospace', marginTop: 8 },
});
