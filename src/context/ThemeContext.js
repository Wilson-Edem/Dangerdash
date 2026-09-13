import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { THEMES } from '../constants/themes';

const ThemeContext = createContext(undefined);
const STORAGE_KEY = '@danger_dash_theme';

export function ThemeProvider({ children }) {
  const [themeKey, setThemeKey] = useState('cyberpunk');
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        if (saved && THEMES[saved]) {
          setThemeKey(saved);
        }
      } catch (e) {
        console.warn('Theme load failed:', e);
      } finally {
        setIsReady(true);
      }
    })();
  }, []);

  const setTheme = useCallback(async (key) => {
    if (!THEMES[key]) return;
    setThemeKey(key);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, key);
    } catch (e) {
      console.warn('Theme save failed:', e);
    }
  }, []);

  const theme = THEMES[themeKey] || THEMES.cyberpunk;

  return (
    <ThemeContext.Provider value={{ theme, themeKey, setTheme, isReady }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  // Fail-safe: return default theme if context is not yet available
  if (!ctx) {
    return {
      theme: THEMES.cyberpunk,
      themeKey: 'cyberpunk',
      setTheme: () => {},
      isReady: false,
    };
  }
  return ctx;
}