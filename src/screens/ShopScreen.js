import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { SKINS } from '../constants/skins';
import { UPGRADES } from '../constants/upgrades';
import { loadSave, unlockSkin, equipSkin, buyUpgrade } from '../utils/saveManager';

export default function ShopScreen({ onBack }) {
  const { theme } = useTheme();
  const [save, setSave] = useState(null);
  const [tab, setTab] = useState('skins');

  const refresh = async () => setSave(await loadSave());
  useEffect(() => { refresh(); }, []);

  const handleSkin = async (skin) => {
    if (save.ownedSkins.includes(skin.id)) {
      await equipSkin(skin.id);
    } else {
      const ok = await unlockSkin(skin.id, skin.price);
      if (!ok) return;
    }
    await refresh();
  };

  const handleUpgrade = async (up) => {
    const current = save.upgrades[up.id] || 0;
    if (current >= up.maxLevel) return;
    const cost = up.costs[current];
    const ok = await buyUpgrade(up.id, cost, current);
    if (ok) await refresh();
  };

  if (!save) return null;

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.screenBg }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack}>
          <Text style={[styles.back, { color: theme.colors.buttonText }]}>← BACK</Text>
        </TouchableOpacity>
        <Text style={[styles.coins, { color: theme.colors.coinGold }]}>🪙 {save.totalCoins}</Text>
      </View>

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

      <ScrollView contentContainerStyle={styles.list}>
        {tab === 'skins' && SKINS.map((skin) => {
          const owned = save.ownedSkins.includes(skin.id);
          const equipped = save.equippedSkin === skin.id;
          return (
            <TouchableOpacity
              key={skin.id}
              style={[styles.card, { borderColor: equipped ? theme.colors.buttonBorder : '#333' }]}
              onPress={() => handleSkin(skin)}
            >
              <View style={styles.swatchRow}>
                {skin.colors.map((c, i) => (
                  <View key={i} style={[styles.swatch, { backgroundColor: c }]} />
                ))}
              </View>
              <Text style={[styles.cardTitle, { color: theme.colors.hudText }]}>{skin.name}</Text>
              <Text style={[styles.cardSub, { color: theme.colors.subtitleText }]}>
                {equipped ? 'EQUIPPED' : owned ? 'TAP TO EQUIP' : `🪙 ${skin.price}`}
              </Text>
            </TouchableOpacity>
          );
        })}

        {tab === 'upgrades' && UPGRADES.map((up) => {
          const current = save.upgrades[up.id] || 0;
          const maxed = current >= up.maxLevel;
          return (
            <TouchableOpacity
              key={up.id}
              style={[styles.card, { borderColor: maxed ? theme.colors.buttonBorder : '#333' }]}
              onPress={() => handleUpgrade(up)}
              disabled={maxed}
            >
              <Text style={[styles.cardTitle, { color: theme.colors.hudText }]}>{up.name}</Text>
              <Text style={[styles.cardSub, { color: theme.colors.subtitleText }]}>{up.description}</Text>
              <Text style={[styles.cardCost, { color: theme.colors.coinGold }]}>
                {maxed ? '✓ MAXED' : `LV ${current}/${up.maxLevel} • 🪙 ${up.costs[current]}`}
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
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  back: { fontSize: 16, fontWeight: 'bold', fontFamily: 'monospace' },
  coins: { fontSize: 18, fontWeight: 'bold', fontFamily: 'monospace' },
  tabs: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  tab: { paddingVertical: 8, paddingHorizontal: 20, borderWidth: 2, borderRadius: 8 },
  tabText: { fontWeight: 'bold', fontFamily: 'monospace' },
  list: { paddingBottom: 40 },
  card: { borderWidth: 2, borderRadius: 10, padding: 14, marginBottom: 12 },
  cardTitle: { fontSize: 18, fontWeight: 'bold', fontFamily: 'monospace' },
  cardSub: { fontSize: 13, fontFamily: 'monospace', marginTop: 4 },
  cardCost: { fontSize: 14, fontWeight: 'bold', fontFamily: 'monospace', marginTop: 8 },
  swatchRow: { flexDirection: 'row', gap: 6, marginBottom: 8 },
  swatch: { width: 24, height: 24, borderRadius: 4, borderWidth: 1, borderColor: '#fff' },
});