import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View, StatusBar } from 'react-native';
import * as ScreenOrientation from 'expo-screen-orientation';
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync().catch(() => {});

import { ThemeProvider, useTheme } from './src/context/ThemeContext';
import LoadingScreen from './src/screens/LoadingScreen';
import MenuScreen from './src/screens/MenuScreen';
import GameScreen from './src/screens/GameScreen';
import GameOverScreen from './src/screens/GameOverScreen';
import PauseScreen from './src/screens/PauseScreen';
import ShopScreen from './src/screens/ShopScreen';
import ChallengesScreen from './src/screens/ChallengesScreen';
import OptionsScreen from './src/screens/OptionsScreen';

import { useResponsiveCanvas } from './src/utils/useResponsiveCanvas';
import {
  initAudioSession,
  preloadAllAudio,
  playMusic,
  setAudioFlags,
} from './src/utils/audioManager';

import {
  enableImmersiveMode,
  reassertImmersiveMode,
} from './src/utils/immersiveMode';

import {
  loadSave,
  recordRun,
  writeSave,
} from './src/utils/saveManager';

import { SKINS } from './src/constants/skins';
import { CHALLENGES } from './src/constants/challenges';

const APP_STATE = {
  LOADING: 'LOADING',
  MENU: 'MENU',
  PLAYING: 'PLAYING',
  PAUSED: 'PAUSED',
  GAMEOVER: 'GAMEOVER',
  SHOP: 'SHOP',
  CHALLENGES: 'CHALLENGES',
  OPTIONS: 'OPTIONS',
};

function GameRoot() {
  const { theme, isReady: themeReady } = useTheme();

  const [appState, setAppState] = useState(APP_STATE.LOADING);
  const [orientationReady, setOrientationReady] = useState(false);
  const [lastResult, setLastResult] = useState({
    score: 0,
    coins: 0,
    isNewHigh: false,
  });

  const [saveData, setSaveData] = useState(null);
  const [gameKey, setGameKey] = useState(0);

  const {
    scale,
    translateX,
    translateY,
    virtualWidth,
    virtualHeight,
  } = useResponsiveCanvas();

  const upgradeLevelsRef = useRef({
    extra_jump: 0,
    magnet_range: 0,
    slow_fall: 0,
  });

  const settingsRef = useRef({
    soundOn: true,
    musicOn: true,
    vibrationOn: true,
  });

  const skinColorsRef = useRef([
    '#00F0FF',
    '#FF007F',
    '#0F172A',
  ]);

  /*
   * Lock orientation BEFORE mounting the actual game UI.
   * This prevents the first frame from being rendered using
   * portrait dimensions and subsequently transformed into landscape.
   */
  useEffect(() => {
    let mounted = true;

    const lockLandscape = async () => {
      try {
        await ScreenOrientation.lockAsync(
          ScreenOrientation.OrientationLock.LANDSCAPE
        );
      } catch (error) {
        console.warn('Landscape orientation lock failed:', error);
      }

      if (mounted) {
        setOrientationReady(true);
      }
    };

    lockLandscape();

    return () => {
      mounted = false;
    };
  }, []);

  /*
   * Boot only after orientation is ready.
   */
  useEffect(() => {
    if (!orientationReady) return undefined;

    let mounted = true;

    const boot = async () => {
      try {
        await enableImmersiveMode();

        await initAudioSession();
        await preloadAllAudio();

        const save = await loadSave();

        if (!mounted) return;

        setSaveData(save);

        upgradeLevelsRef.current =
          save.upgrades || upgradeLevelsRef.current;

        settingsRef.current =
          save.settings || settingsRef.current;

        setAudioFlags({
          musicOn: save.settings?.musicOn ?? true,
          soundOn: save.settings?.soundOn ?? true,
        });

        const skin = SKINS.find(
          (item) =>
            item.id === (save.equippedSkin || 'default')
        );

        if (skin?.colors) {
          skinColorsRef.current = skin.colors;
        }

        await playMusic('menu_theme');
      } catch (error) {
        console.warn('Boot error:', error);
      } finally {
        if (mounted) {
          SplashScreen.hideAsync().catch(() => {});
        }
      }
    };

    boot();

    const immersiveInterval = setInterval(() => {
      reassertImmersiveMode();
    }, 5000);

    return () => {
      mounted = false;
      clearInterval(immersiveInterval);
    };
  }, [orientationReady]);

  const refreshSave = async () => {
    const save = await loadSave();

    setSaveData(save);

    upgradeLevelsRef.current =
      save.upgrades || upgradeLevelsRef.current;

    settingsRef.current =
      save.settings || settingsRef.current;

    const skin = SKINS.find(
      (item) =>
        item.id === (save.equippedSkin || 'default')
    );

    if (skin?.colors) {
      skinColorsRef.current = skin.colors;
    }

    return save;
  };

  const handleGameOver = async (
    score,
    coins,
    runStats
  ) => {
    const isNewHigh = await recordRun(score, coins);
    const save = await loadSave();

    if (save.challengeProgress) {
      const progress = {
        ...save.challengeProgress,
      };

      const increment = (key, value) => {
        progress[key] =
          (progress[key] || 0) + value;
      };

      increment(
        'coins_in_run',
        runStats.coinsThisRun || 0
      );

      increment(
        'score_run',
        runStats.maxScore || 0
      );

      increment(
        'runs_played',
        1
      );

      increment(
        'powerups_used',
        runStats.powerupsUsed || 0
      );

      increment(
        'combo_max',
        runStats.maxCombo || 0
      );

      increment(
        'survive_frames',
        runStats.surviveFrames || 0
      );

      increment(
        'orbs_in_run',
        runStats.orbsCollected || 0
      );

      increment(
        'shield_pickups',
        runStats.shieldsPickedUp || 0
      );

      increment(
        'deaths',
        1
      );

      increment(
        'total_coins',
        runStats.coinsThisRun || 0
      );

      increment(
        'jumps_total',
        runStats.jumpsThisRun || 0
      );

      increment(
        'gravity_uses',
        runStats.gravityUses || 0
      );

      increment(
        'doubler_uses',
        runStats.doublerUses || 0
      );

      increment(
        'speed_max',
        Math.floor(
          (runStats.maxSpeed || 0) * 10
        ) / 10
      );

      if (isNewHigh) {
        increment(
          'new_high_score',
          1
        );
      }

      const completed =
        CHALLENGES.filter(
          (challenge) =>
            (progress[challenge.id] || 0) >=
            challenge.target
        ).length;

      progress.challenges_done = completed;

      await writeSave({
        challengeProgress: progress,
      });

      setSaveData(await loadSave());
    }

    setLastResult({
      score,
      coins,
      isNewHigh,
    });

    setAppState(APP_STATE.GAMEOVER);
  };

  const startPlaying = () => {
    setGameKey((value) => value + 1);
    setAppState(APP_STATE.PLAYING);
  };

  const renderScreen = () => {
    switch (appState) {
      case APP_STATE.LOADING:
        return (
          <LoadingScreen
            onFinishLoading={() =>
              setAppState(APP_STATE.MENU)
            }
          />
        );

      case APP_STATE.MENU:
        return (
          <MenuScreen
            onPlay={startPlaying}
            onShop={() =>
              setAppState(APP_STATE.SHOP)
            }
            onChallenges={() =>
              setAppState(APP_STATE.CHALLENGES)
            }
            onOptions={() =>
              setAppState(APP_STATE.OPTIONS)
            }
          />
        );

      case APP_STATE.PLAYING:
        return (
          <GameScreen
            key={gameKey}
            onGameOver={handleGameOver}
            onPause={() =>
              setAppState(APP_STATE.PAUSED)
            }
            upgradeLevels={upgradeLevelsRef.current}
            settings={settingsRef.current}
            skinColors={skinColorsRef.current}
          />
        );

      case APP_STATE.PAUSED:
        return (
          <PauseScreen
            onResume={() =>
              setAppState(APP_STATE.PLAYING)
            }
            onRestart={startPlaying}
            onMenu={() =>
              setAppState(APP_STATE.MENU)
            }
          />
        );

      case APP_STATE.GAMEOVER:
        return (
          <GameOverScreen
            score={lastResult.score}
            coins={lastResult.coins}
            isNewHigh={lastResult.isNewHigh}
            runLog={saveData?.runLog || []}
            onRetry={startPlaying}
            onMenu={() =>
              setAppState(APP_STATE.MENU)
            }
          />
        );

      case APP_STATE.SHOP:
        return (
          <ShopScreen
            onBack={async () => {
              await refreshSave();
              setAppState(APP_STATE.MENU);
            }}
          />
        );

      case APP_STATE.CHALLENGES:
        return (
          <ChallengesScreen
            onBack={() =>
              setAppState(APP_STATE.MENU)
            }
          />
        );

      case APP_STATE.OPTIONS:
        return (
          <OptionsScreen
            onBack={async () => {
              await refreshSave();
              setAppState(APP_STATE.MENU);
            }}
          />
        );

      default:
        return null;
    }
  };

  if (!themeReady || !orientationReady) {
    return null;
  }

  return (
    <View style={styles.root}>
      <StatusBar hidden />

      <View
        style={[
          styles.viewport,
          {
            width: virtualWidth,
            height: virtualHeight,
            transform: [
              { translateX },
              { translateY },
              { scale },
            ],
            backgroundColor:
              theme.colors.screenBg,
          },
        ]}
      >
        {renderScreen()}
      </View>
    </View>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <GameRoot />
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#000000',
    overflow: 'hidden',
  },

  viewport: {
    position: 'absolute',
    top: 0,
    left: 0,

    justifyContent: 'center',
    alignItems: 'center',

    overflow: 'hidden',
  },
});