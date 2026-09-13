import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, StatusBar } from 'react-native';
import * as ScreenOrientation from 'expo-screen-orientation';

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
import { initAudioSession, preloadAllAudio, playMusic, setAudioFlags } from './src/utils/audioManager';
import { loadSave, recordRun, writeSave } from './src/utils/saveManager';
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
  const [lastResult, setLastResult] = useState({ score: 0, coins: 0, isNewHigh: false });
  const [saveData, setSaveData] = useState(null);
  const [gameKey, setGameKey] = useState(0);
  const { scale, translateX, translateY, virtualWidth, virtualHeight } = useResponsiveCanvas();

  const upgradeLevelsRef = useRef({ extra_jump: 0, magnet_range: 0, slow_fall: 0 });
  const settingsRef = useRef({ soundOn: true, musicOn: true, vibrationOn: true });
  const skinColorsRef = useRef(['#00F0FF', '#FF007F', '#0F172A']);

  useEffect(() => {
    let mounted = true;
    async function boot() {
      await initAudioSession();
      await preloadAllAudio();
      const save = await loadSave();
      if (!mounted) return;
      setSaveData(save);
      upgradeLevelsRef.current = save.upgrades || upgradeLevelsRef.current;
      settingsRef.current = save.settings || settingsRef.current;
      setAudioFlags({
        musicOn: save.settings.musicOn,
        soundOn: save.settings.soundOn,
      });
      // Find equipped skin colors
      const skin = SKINS.find((s) => s.id === (save.equippedSkin || 'default'));
      if (skin) skinColorsRef.current = skin.colors;

      await playMusic('menu_theme');
    }
    boot();

    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE).catch(() => {});

    return () => { mounted = false; };
  }, []);

  const refreshSave = async () => {
    const save = await loadSave();
    setSaveData(save);
    upgradeLevelsRef.current = save.upgrades || upgradeLevelsRef.current;
    settingsRef.current = save.settings || settingsRef.current;
    const skin = SKINS.find((s) => s.id === (save.equippedSkin || 'default'));
    if (skin) skinColorsRef.current = skin.colors;
    return save;
  };

  const handleGameOver = async (score, coins, runStats) => {
    const isNewHigh = await recordRun(score, coins);
    const save = await loadSave();

    // Update challenge progress
    if (save.challengeProgress) {
      const progress = { ...save.challengeProgress };
      const increment = (key, value) => {
        progress[key] = (progress[key] || 0) + value;
      };

      increment('coins_in_run', runStats.coinsThisRun);
      increment('score_run', runStats.maxScore);
      increment('runs_played', 1);
      increment('powerups_used', runStats.powerupsUsed);
      increment('combo_max', runStats.maxCombo);
      increment('survive_frames', runStats.surviveFrames);
      increment('orbs_in_run', runStats.orbsCollected);
      increment('shield_pickups', runStats.shieldsPickedUp);
      increment('deaths', 1);
      increment('total_coins', runStats.coinsThisRun);
      increment('jumps_total', runStats.jumpsThisRun);
      increment('gravity_uses', runStats.gravityUses);
      increment('doubler_uses', runStats.doublerUses);
      increment('speed_max', Math.floor(runStats.maxSpeed * 10) / 10);
      if (isNewHigh) increment('new_high_score', 1);

      // Count how many challenges are completed
      const completed = CHALLENGES.filter((ch) => (progress[ch.id] || 0) >= ch.target).length;
      progress['challenges_done'] = completed;

      await writeSave({ challengeProgress: progress });
      setSaveData(await loadSave());
    }

    setLastResult({ score, coins, isNewHigh });
    setAppState(APP_STATE.GAMEOVER);
  };

  const startPlaying = () => {
    setGameKey((k) => k + 1); // remount GameScreen for clean state
    setAppState(APP_STATE.PLAYING);
  };

  const renderScreen = () => {
    switch (appState) {
      case APP_STATE.LOADING:
        return <LoadingScreen onFinishLoading={() => setAppState(APP_STATE.MENU)} />;
      case APP_STATE.MENU:
        return (
          <MenuScreen
            onPlay={startPlaying}
            onShop={() => setAppState(APP_STATE.SHOP)}
            onChallenges={() => setAppState(APP_STATE.CHALLENGES)}
            onOptions={() => setAppState(APP_STATE.OPTIONS)}
          />
        );
      case APP_STATE.PLAYING:
        return (
          <GameScreen
            key={gameKey}
            onGameOver={handleGameOver}
            onPause={() => setAppState(APP_STATE.PAUSED)}
            upgradeLevels={upgradeLevelsRef.current}
            settings={settingsRef.current}
            skinColors={skinColorsRef.current}
          />
        );
      case APP_STATE.PAUSED:
        return (
          <PauseScreen
            onResume={() => setAppState(APP_STATE.PLAYING)}
            onRestart={startPlaying}
            onMenu={() => setAppState(APP_STATE.MENU)}
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
            onMenu={() => setAppState(APP_STATE.MENU)}
          />
        );
      case APP_STATE.SHOP:
        return <ShopScreen onBack={() => { refreshSave(); setAppState(APP_STATE.MENU); }} />;
      case APP_STATE.CHALLENGES:
        return <ChallengesScreen onBack={() => setAppState(APP_STATE.MENU)} />;
      case APP_STATE.OPTIONS:
        return <OptionsScreen onBack={() => { refreshSave(); setAppState(APP_STATE.MENU); }} />;
      default:
        return null;
    }
  };

  if (!themeReady) return null;

  return (
    <View style={styles.rootContainer}>
      <StatusBar hidden />
      <View
        style={[
          styles.viewportFrame,
          {
            width: virtualWidth,
            height: virtualHeight,
            transform: [{ translateX }, { translateY }, { scale }],
            backgroundColor: theme.colors.screenBg,
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
  rootContainer: { flex: 1, backgroundColor: '#000000' },
  viewportFrame: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
});