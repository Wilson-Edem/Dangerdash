import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Asset } from 'expo-asset';
import { THEMES } from '../constants/themes';

const ThemeContext =
  createContext(undefined);

const STORAGE_KEY =
  '@danger_dash_theme';

async function preloadThemeAssets(
  themeKey
) {
  const assets = Object.values(
    THEMES[themeKey]?.assets || {}
  );

  if (!assets.length) {
    return;
  }

  await Asset.loadAsync(assets);
}

export function ThemeProvider({
  children,
}) {
  const [themeKey, setThemeKey] =
    useState('cyberpunk');

  const [isReady, setIsReady] =
    useState(false);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const saved =
          await AsyncStorage.getItem(
            STORAGE_KEY
          );

        const initialKey =
          saved && THEMES[saved]
            ? saved
            : 'cyberpunk';

        try {
          await preloadThemeAssets(
            initialKey
          );
        } catch (assetError) {
          console.warn(
            'Initial theme preload failed:',
            assetError
          );
        }

        if (mounted) {
          setThemeKey(
            initialKey
          );

          setIsReady(true);
        }
      } catch (error) {
        console.warn(
          'Theme load failed:',
          error
        );

        if (mounted) {
          setIsReady(true);
        }
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  /*
   * Warm the other theme after the active theme
   * is ready.
   */
  useEffect(() => {
    if (!isReady) {
      return undefined;
    }

    let cancelled = false;

    const warmOtherThemes =
      async () => {
        const backgroundAssets =
          Object.entries(THEMES)
            .filter(
              ([key]) =>
                key !== themeKey
            )
            .flatMap(
              ([, item]) =>
                Object.values(
                  item.assets || {}
                )
            );

        if (
          !backgroundAssets.length ||
          cancelled
        ) {
          return;
        }

        try {
          await Asset.loadAsync(
            backgroundAssets
          );
        } catch (error) {
          // Background preloading is best-effort.
        }
      };

    warmOtherThemes();

    return () => {
      cancelled = true;
    };
  }, [
    isReady,
    themeKey,
  ]);

  const setTheme =
    useCallback(
      async (key) => {
        if (
          !THEMES[key] ||
          key === themeKey
        ) {
          return;
        }

        try {
          /*
           * Load the target theme before making
           * it visible.
           */
          await preloadThemeAssets(
            key
          );

          await AsyncStorage.setItem(
            STORAGE_KEY,
            key
          );

          setThemeKey(key);
        } catch (error) {
          console.warn(
            'Theme switch failed:',
            error
          );
        }
      },
      [themeKey]
    );

  const theme =
    THEMES[themeKey] ||
    THEMES.cyberpunk;

  return (
    <ThemeContext.Provider
      value={{
        theme,
        themeKey,
        setTheme,
        isReady,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx =
    useContext(
      ThemeContext
    );

  if (!ctx) {
    return {
      theme:
        THEMES.cyberpunk,

      themeKey:
        'cyberpunk',

      setTheme: async () => {},

      isReady: false,
    };
  }

  return ctx;
}
