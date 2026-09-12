import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { SKINS } from '../constants/skins';
import { UPGRADES } from '../constants/upgrades';
import { loadSave, unlockSkin, equipSkin, buyUpgrade } from '../utils/saveManager';

export default function ShopScreen({ onBack }) {
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
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack}><Text style={styles.back}>← BACK</Text></TouchableOpacity>
        <Text style={styles.coins}>🪙 {save.totalCoins}</Text>
      </View>

      <View style={styles.tabs}>
        <TouchableOpacity onPress={() => setTab('skins')} style={[styles.tab, tab === 'skins' && styles.tabActive]}>
          <Text style={styles.tabText}>SKINS</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setTab('upgrades')} style={[styles.tab, tab === 'upgrades' && styles.tabActive]}>
          <Text style={styles.tabText}>UPGRADES</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.list}>
        {tab === 'skins' && SKINS.map((skin) => {
          const owned = save.ownedSkins.includes(skin.id);
          const equipped = save.equippedSkin === skin.id;
          return (
            <TouchableOpacity key={skin.id} style={[styles.card, equipped && styles.cardEquipped]} onPress={() => handleSkin(skin)}>
              <View style={styles.swatchRow}>
                {skin.colors.map((c, i) => <View key={i} style={[styles.swatch, { backgroundColor: c }]} />)}
              </View>
              <Text style={styles.cardTitle}>{skin.name}</Text>
              <Text style={styles.cardSub}>
                {equipped ? 'EQUIPPED' : owned ? 'TAP TO EQUIP' : `🪙 ${skin.price}`}
              </Text>
            </TouchableOpacity>
          );
        })}

        {tab === 'upgrades' && UPGRADES.map((up) => {
          const current = save.upgrades[up.id] || 0;
          const maxed = current >= up.maxLevel;
          return (
            <TouchableOpacity key={up.id} style={styles.card} onPress={() => handleUpgrade(up)} disabled={maxed}>
              <Text style={styles.cardTitle}>{up.name}</Text>
              <Text style={styles.cardSub}>{up.description}</Text>
              <Text style={styles.cardCost}>
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
  container: { flex: 1, backgroundColor: '#030108', padding: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  back: { color: '#00F0FF', fontSize: 16, fontWeight: 'bold', fontFamily: 'monospace' },
  coins: { color: '#FFD700', fontSize: 18, fontWeight: 'bold', fontFamily: 'monospace' },
  tabs: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  tab: { paddingVertical: 8, paddingHorizontal: 20, borderWidth: 2, borderColor: '#333', borderRadius: 8 },
  tabActive: { borderColor: '#00F0FF' },
  tabText: { color: '#00F0FF', fontWeight: 'bold', fontFamily: 'monospace' },
  list: { paddingBottom: 40 },
  card: { backgroundColor: 'rgba(10, 20, 30, 0.9)', borderWidth: 2, borderColor: '#333', borderRadius: 10, padding: 14, marginBottom: 12 },
  cardEquipped: { borderColor: '#00FF66' },
  cardTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold', fontFamily: 'monospace' },
  cardSub: { color: '#A855F7', fontSize: 13, fontFamily: 'monospace', marginTop: 4 },
  cardCost: { color: '#FFD700', fontSize: 14, fontWeight: 'bold', fontFamily: 'monospace', marginTop: 8 },
  swatchRow: { flexDirection: 'row', gap: 6, marginBottom: 8 },
  swatch: { width: 24, height: 24, borderRadius: 4, borderWidth: 1, borderColor: '#fff' },
});