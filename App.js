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
import LevelScreen from './src/screens/LevelScreen';
import OptionsScreen from './src/screens/OptionsScreen';
import { useResponsiveCanvas } from './src/utils/useResponsiveCanvas';
import { initAudioSession, preloadAllAudio, playMusic, setAudioFlags } from './src/utils/audioManager';
import { enableImmersiveMode, reassertImmersiveMode } from './src/utils/immersiveMode';
import { loadSave, recordRun, writeSave } from './src/utils/saveManager';
import { SKINS } from './src/constants/skins';
import { CHALLENGES, getDailyChallenges } from './src/constants/challenges';
import { initializeNotifications, notifyChallengeCompleted, setNotificationBadgeCount } from './src/utils/notificationManager';

const APP_STATE = {
  LOADING: 'LOADING',
  MENU: 'MENU',
  PLAYING: 'PLAYING',
  PAUSED: 'PAUSED',
  GAMEOVER: 'GAMEOVER',
  SHOP: 'SHOP',
  CHALLENGES: 'CHALLENGES',
  LEVELS: 'LEVELS',
  OPTIONS: 'OPTIONS',
};

function todaySeed() {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}

function GameRoot() {
  const { theme, isReady: themeReady } = useTheme();
  const [appState, setAppState] = useState(APP_STATE.LOADING);
  const [orientationReady, setOrientationReady] = useState(false);
  const [lastResult, setLastResult] = useState({ score: 0, coins: 0, isNewHigh: false });
  const [saveData, setSaveData] = useState(null);
  const [gameKey, setGameKey] = useState(0);

  const { scale, translateX, translateY, virtualWidth, virtualHeight } = useResponsiveCanvas();

  const upgradeLevelsRef = useRef({
    extra_jump: 0,
    magnet_range: 0,
    slow_fall: 0,
    coin_yield: 0,
    xp_catalyst: 0,
    challenge_bonus: 0,
    elite_magnet: 0,
    legendary_fall: 0,
  });

  const settingsRef = useRef({ soundOn: true, musicOn: true, vibrationOn: true });
  const skinColorsRef = useRef(['#00F0FF', '#FF007F', '#0F172A']);

  useEffect(() => {
    let mounted = true;
    const lockLandscape = async () => {
      try {
        await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
      } catch (error) {
        console.warn('Landscape orientation lock failed:', error);
      }
      if (mounted) setOrientationReady(true);
    };
    lockLandscape();
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    if (!orientationReady) return undefined;
    let mounted = true;

    const boot = async () => {
      try {
        await enableImmersiveMode();
        await initializeNotifications();
        await initAudioSession();
        await preloadAllAudio();

        const save = await loadSave();
        if (!mounted) return;

        setSaveData(save);
        upgradeLevelsRef.current = save.upgrades || upgradeLevelsRef.current;
        settingsRef.current = save.settings || settingsRef.current;
        setAudioFlags({
          musicOn: save.settings?.musicOn ?? true,
          soundOn: save.settings?.soundOn ?? true,
        });

        const skin = SKINS.find((item) => item.id === (save.equippedSkin || 'default'));
        if (skin?.colors) skinColorsRef.current = skin.colors;

        await setNotificationBadgeCount(save.challengeNotificationIds?.length || 0);
        await playMusic('menu_theme');
      } catch (error) {
        console.warn('Boot error:', error);
      } finally {
        if (mounted) SplashScreen.hideAsync().catch(() => {});
      }
    };

    boot();
    const immersiveInterval = setInterval(() => reassertImmersiveMode(), 5000);
    return () => {
      mounted = false;
      clearInterval(immersiveInterval);
    };
  }, [orientationReady]);

  const refreshSave = async () => {
    const save = await loadSave();
    setSaveData(save);
    upgradeLevelsRef.current = save.upgrades || upgradeLevelsRef.current;
    settingsRef.current = save.settings || settingsRef.current;
    const skin = SKINS.find((item) => item.id === (save.equippedSkin || 'default'));
    if (skin?.colors) skinColorsRef.current = skin.colors;
    return save;
  };

  const handleGameOver = async (score, coins, runStats = {}) => {
    const isNewHigh = await recordRun(score, coins);
    const save = await loadSave();
    const progress = { ...(save.challengeProgress || {}) };
    const level = Number(save.currentLevel || 1);

    const bestTypes = new Set([
      'coins_in_run', 'score_run', 'combo_max', 'survive_frames',
      'orbs_in_run', 'speed_max', 'new_high_score',
    ]);

    const cumulativeValues = {
      runs_played: 1,
      powerups_used: Number(runStats.powerupsUsed || 0),
      shield_pickups: Number(runStats.shieldsPickedUp || 0),
      deaths: 1,
      total_coins: Number(runStats.coinsThisRun || coins || 0),
      jumps_total: Number(runStats.jumpsThisRun || 0),
      gravity_uses: Number(runStats.gravityUses || 0),
      doubler_uses: Number(runStats.doublerUses || 0),
    };

    const bestValues = {
      coins_in_run: Number(runStats.coinsThisRun || coins || 0),
      score_run: Number(score || 0),
      combo_max: Number(runStats.maxCombo || 0),
      survive_frames: Number(runStats.surviveFrames || 0),
      orbs_in_run: Number(runStats.orbsCollected || 0),
      speed_max: Number(runStats.maxSpeed || 0),
      new_high_score: isNewHigh ? 1 : 0,
    };

    CHALLENGES.forEach((challenge) => {
      if (Number(challenge.minLevel || 1) > level) return;
      const id = challenge.id;
      if (bestTypes.has(challenge.type)) {
        progress[id] = Math.max(Number(progress[id] || 0), Number(bestValues[challenge.type] || 0));
      } else {
        progress[id] = Number(progress[id] || 0) + Number(cumulativeValues[challenge.type] || 0);
      }
    });

    progress.challenges_done = CHALLENGES.filter(
      (challenge) => Number(challenge.minLevel || 1) <= level && Number(progress[challenge.id] || 0) >= Number(challenge.target)
    ).length;

    const dailyChallenges = getDailyChallenges(todaySeed());
    const previousNotifications = new Set(save.challengeNotificationIds || []);
    const previousClaimed = new Set(save.challengeCompletedIds || []);
    const previousXP = new Set(save.challengeXpAwardedIds || []);
    const newlyCompletedMap = new Map();

    dailyChallenges.forEach((challenge) => {
      if (Number(challenge.minLevel || 1) > level) return;
      const before = Number(save.challengeProgress?.[challenge.id] || 0);
      const after = Number(progress[challenge.id] || 0);
      if (before < challenge.target && after >= challenge.target && !previousNotifications.has(challenge.id) && !previousClaimed.has(challenge.id)) {
        if (!previousXP.has(challenge.id)) newlyCompletedMap.set(challenge.id, challenge);
      }
    });

    dailyChallenges.forEach((challenge) => {
      if (Number(challenge.minLevel || 1) > level) return;
      if (
        challenge.type === 'challenges_done' &&
        Number(progress[challenge.id] || 0) < challenge.target &&
        progress.challenges_done >= challenge.target &&
        !previousNotifications.has(challenge.id) &&
        !previousClaimed.has(challenge.id) &&
        !previousXP.has(challenge.id)
      ) {
        progress[challenge.id] = progress.challenges_done;
        newlyCompletedMap.set(challenge.id, challenge);
      }
    });

    const newlyCompleted = [...newlyCompletedMap.values()];
    const xpMultiplier = 1 + 0.10 * Number(save.upgrades?.xp_catalyst || 0);
    const newXP = Math.floor(newlyCompleted.reduce((sum, challenge) => sum + Number(challenge.xp || 0), 0) * xpMultiplier);
    const notificationIds = [...new Set([...(save.challengeNotificationIds || []), ...newlyCompleted.map((challenge) => challenge.id)])];
    const xpAwardedIds = [...new Set([...(save.challengeXpAwardedIds || []), ...newlyCompleted.map((challenge) => challenge.id)])];

    const updated = await writeSave({
      challengeProgress: progress,
      challengeNotificationIds: notificationIds,
      challengeXpAwardedIds: xpAwardedIds,
      xp: Number(save.xp || 0) + newXP,
      totalXP: Number(save.totalXP || 0) + newXP,
      totalJumps: Number(save.totalJumps || 0) + Number(runStats.jumpsThisRun || 0),
      totalShieldPickups: Number(save.totalShieldPickups || 0) + Number(runStats.shieldsPickedUp || 0),
    });

    for (const challenge of newlyCompleted) await notifyChallengeCompleted(challenge);
    await setNotificationBadgeCount(notificationIds.length);
    setSaveData(updated);
    setLastResult({ score, coins, isNewHigh });
    setAppState(APP_STATE.GAMEOVER);
  };

  const startPlaying = () => {
    setGameKey((value) => value + 1);
    setAppState(APP_STATE.PLAYING);
  };

  const menu = (
    <MenuScreen
      onPlay={startPlaying}
      onShop={() => setAppState(APP_STATE.SHOP)}
      onChallenges={() => setAppState(APP_STATE.CHALLENGES)}
      onLevels={() => setAppState(APP_STATE.LEVELS)}
      onOptions={() => setAppState(APP_STATE.OPTIONS)}
    />
  );

  const renderScreen = () => {
    switch (appState) {
      case APP_STATE.LOADING:
        return <LoadingScreen onFinishLoading={() => setAppState(APP_STATE.MENU)} />;
      case APP_STATE.MENU:
        return menu;
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
        return <PauseScreen onResume={() => setAppState(APP_STATE.PLAYING)} onRestart={startPlaying} onMenu={() => setAppState(APP_STATE.MENU)} />;
      case APP_STATE.GAMEOVER:
        return <GameOverScreen score={lastResult.score} coins={lastResult.coins} isNewHigh={lastResult.isNewHigh} runLog={saveData?.runLog || []} onRetry={() => setAppState(APP_STATE.MENU)} onMenu={() => setAppState(APP_STATE.MENU)} />;
      case APP_STATE.SHOP:
        return <ShopScreen onBack={async () => { await refreshSave(); setAppState(APP_STATE.MENU); }} />;
      case APP_STATE.CHALLENGES:
        return <ChallengesScreen onBack={() => setAppState(APP_STATE.MENU)} />;
      case APP_STATE.LEVELS:
        return <LevelScreen onBack={() => setAppState(APP_STATE.MENU)} />;
      case APP_STATE.OPTIONS:
        return <OptionsScreen onBack={async () => { await refreshSave(); setAppState(APP_STATE.MENU); }} />;
      default:
        return null;
    }
  };

  if (!themeReady || !orientationReady) return null;

  return (
    <View style={styles.root}>
      <StatusBar hidden />
      <View style={[styles.viewport, { width: virtualWidth * scale, height: virtualHeight * scale, left: translateX, top: translateY, backgroundColor: theme.colors.screenBg }]}>
        <View style={{ width: virtualWidth, height: virtualHeight, transform: [{ scale }] }}>
          {renderScreen()}
        </View>
      </View>
    </View>
  );
}

export default function App() {
  return <ThemeProvider><GameRoot /></ThemeProvider>;
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#000000', overflow: 'hidden' },
  viewport: { position: 'absolute', overflow: 'hidden', alignItems: 'center', justifyContent: 'center' },
});
