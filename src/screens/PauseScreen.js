import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';

export default function PauseScreen({ onResume, onRestart, onMenu }) {
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.overlayBg }]}>
      <Text style={[styles.title, { color: theme.colors.titleText }]}>PAUSED</Text>

      <TouchableOpacity
        style={[styles.btn, { borderColor: theme.colors.buttonBorder, backgroundColor: theme.colors.buttonBg }]}
        onPress={onResume}
      >
        <Text style={[styles.btnText, { color: theme.colors.buttonText }]}>▶ RESUME</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.btn, { borderColor: theme.colors.buttonBorder, backgroundColor: theme.colors.buttonBg }]}
        onPress={onRestart}
      >
        <Text style={[styles.btnText, { color: theme.colors.buttonText }]}>↻ RESTART</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.btn, { borderColor: theme.colors.buttonBorder, backgroundColor: theme.colors.buttonBg }]}
        onPress={onMenu}
      >
        <Text style={[styles.btnText, { color: theme.colors.buttonText }]}>← MAIN MENU</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 52, fontWeight: '900', fontFamily: 'monospace', letterSpacing: 6, marginBottom: 40 },
  btn: { borderWidth: 2, borderRadius: 10, paddingVertical: 14, paddingHorizontal: 40, marginBottom: 14, minWidth: 260, alignItems: 'center' },
  btnText: { fontSize: 18, fontWeight: 'bold', fontFamily: 'monospace', letterSpacing: 2 },
});