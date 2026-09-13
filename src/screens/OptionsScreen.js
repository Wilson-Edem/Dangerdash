import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { THEME_LIST } from '../constants/themes';
import { loadSave, writeSave } from '../utils/saveManager';
import { setAudioFlags } from '../utils/audioManager';

export default function OptionsScreen({ onBack }) {
  const { theme, themeKey, setTheme } = useTheme();
  const [save, setSave] = useState(null);

  useEffect(() => {
    loadSave().then((s) => {
      setSave(s);
      setAudioFlags({
        musicOn: s.settings.musicOn,
        soundOn: s.settings.soundOn,
      });
    });
  }, []);

  const toggle = async (key) => {
    const settings = { ...save.settings, [key]: !save.settings[key] };
    const updated = await writeSave({ settings });
    setSave(updated);
    setAudioFlags({
      musicOn: updated.settings.musicOn,
      soundOn: updated.settings.soundOn,
    });
  };

  if (!save) return null;

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: theme.colors.screenBg }]}>
      <TouchableOpacity onPress={onBack}>
        <Text style={[styles.back, { color: theme.colors.buttonText }]}>← BACK</Text>
      </TouchableOpacity>

      <Text style={[styles.title, { color: theme.colors.titleText }]}>OPTIONS</Text>

      <Text style={[styles.sectionTitle, { color: theme.colors.subtitleText }]}>AUDIO</Text>

      <TouchableOpacity style={styles.row} onPress={() => toggle('musicOn')}>
        <Text style={[styles.rowText, { color: theme.colors.hudText }]}>Music</Text>
        <Text style={[styles.toggle, { color: theme.colors.buttonText }]}>
          {save.settings.musicOn ? 'ON' : 'OFF'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.row} onPress={() => toggle('soundOn')}>
        <Text style={[styles.rowText, { color: theme.colors.hudText }]}>Sound Effects</Text>
        <Text style={[styles.toggle, { color: theme.colors.buttonText }]}>
          {save.settings.soundOn ? 'ON' : 'OFF'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.row} onPress={() => toggle('vibrationOn')}>
        <Text style={[styles.rowText, { color: theme.colors.hudText }]}>Vibration</Text>
        <Text style={[styles.toggle, { color: theme.colors.buttonText }]}>
          {save.settings.vibrationOn ? 'ON' : 'OFF'}
        </Text>
      </TouchableOpacity>

      <Text style={[styles.sectionTitle, { color: theme.colors.subtitleText, marginTop: 30 }]}>THEME</Text>

      {THEME_LIST.map((t) => {
        const active = t.key === themeKey;
        return (
          <TouchableOpacity
            key={t.key}
            style={[
              styles.themeRow,
              { borderColor: active ? theme.colors.buttonBorder : '#333' },
            ]}
            onPress={() => setTheme(t.key)}
          >
            <View>
              <Text style={[styles.themeName, { color: theme.colors.hudText }]}>{t.label}</Text>
              <Text style={[styles.themeSub, { color: theme.colors.subtitleText }]}>{t.subtitle}</Text>
            </View>
            {active && (
              <Text style={[styles.themeCheck, { color: theme.colors.buttonText }]}>✓</Text>
            )}
          </TouchableOpacity>
        );
      })}

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, minHeight: '100%' },
  back: { fontSize: 16, fontWeight: 'bold', fontFamily: 'monospace', marginBottom: 20 },
  title: { fontSize: 32, fontWeight: '900', fontFamily: 'monospace', letterSpacing: 4, marginBottom: 30 },
  sectionTitle: { fontSize: 14, fontWeight: 'bold', fontFamily: 'monospace', letterSpacing: 3, marginBottom: 12 },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 18, borderBottomWidth: 1, borderColor: '#222' },
  rowText: { fontSize: 18, fontFamily: 'monospace' },
  toggle: { fontSize: 18, fontWeight: 'bold', fontFamily: 'monospace' },
  themeRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderWidth: 2, borderRadius: 8, padding: 14, marginBottom: 10 },
  themeName: { fontSize: 16, fontWeight: 'bold', fontFamily: 'monospace' },
  themeSub: { fontSize: 12, fontFamily: 'monospace', marginTop: 2 },
  themeCheck: { fontSize: 24, fontWeight: 'bold' },
});