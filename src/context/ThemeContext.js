import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Asset } from 'expo-asset';
import { THEMES } from '../constants/themes';

const ThemeContext = createContext(undefined);
const STORAGE_KEY = '@danger_dash_theme';

export function ThemeProvider({ children }) {
  const [themeKey, setThemeKey] = useState('cyberpunk');
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        if (saved && THEMES[saved] && mounted) {
          setThemeKey(saved);
        }
      } catch (e) {
        console.warn('Theme load failed:', e);
      } finally {
        if (mounted) setIsReady(true);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  /*
   * Warm the native asset cache in the background. This means
   * switching between themes does not wait for spike/platform/
   * shield/player images to download or decode at the exact
   * moment the user changes the theme.
   *
   * We intentionally do this after the saved theme is resolved
   * so the active theme gets first priority.
   */
  useEffect(() => {
    if (!isReady) return undefined;

    const timer = setTimeout(() => {
      const modules = Object.values(THEMES).flatMap((item) =>
        Object.values(item.assets || {})
      );

      Asset.loadAsync(modules).catch(() => {});
    }, 350);

    return () => clearTimeout(timer);
  }, [isReady]);

  
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