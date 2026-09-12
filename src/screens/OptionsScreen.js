import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { loadSave, writeSave } from '../utils/saveManager';

export default function OptionsScreen({ onBack }) {
  const [save, setSave] = useState(null);
  useEffect(() => { loadSave().then(setSave); }, []);

  const toggle = async (key) => {
    const settings = { ...save.settings, [key]: !save.settings[key] };
    const updated = await writeSave({ settings });
    setSave(updated);
  };

  if (!save) return null;

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onBack}><Text style={styles.back}>← BACK</Text></TouchableOpacity>
      <Text style={styles.title}>OPTIONS</Text>

      <TouchableOpacity style={styles.row} onPress={() => toggle('musicOn')}>
        <Text style={styles.rowText}>Music</Text>
        <Text style={styles.toggle}>{save.settings.musicOn ? 'ON' : 'OFF'}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.row} onPress={() => toggle('soundOn')}>
        <Text style={styles.rowText}>Sound Effects</Text>
        <Text style={styles.toggle}>{save.settings.soundOn ? 'ON' : 'OFF'}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.row} onPress={() => toggle('vibrationOn')}>
        <Text style={styles.rowText}>Vibration</Text>
        <Text style={styles.toggle}>{save.settings.vibrationOn ? 'ON' : 'OFF'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#030108', padding: 20 },
  back: { color: '#00F0FF', fontSize: 16, fontWeight: 'bold', fontFamily: 'monospace' },
  title: { color: '#00F0FF', fontSize: 32, fontWeight: '900', fontFamily: 'monospace', letterSpacing: 4, marginTop: 20, marginBottom: 30 },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 18, borderBottomWidth: 1, borderColor: '#222' },
  rowText: { color: '#fff', fontSize: 18, fontFamily: 'monospace' },
  toggle: { color: '#00F0FF', fontSize: 18, fontWeight: 'bold', fontFamily: 'monospace' },
});