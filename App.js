import React, { useState, useEffect } from 'react';
import { StyleSheet, View, StatusBar } from 'react-native';
import * as ScreenOrientation from 'expo-screen-orientation';
import LoadingScreen from './src/screens/LoadingScreen';
import MenuScreen from './src/screens/MenuScreen';
import GameScreen from './src/screens/GameScreen';
import GameOverScreen from './src/screens/GameOverScreen';
import ShopScreen from './src/screens/ShopScreen';
import ChallengesScreen from './src/screens/ChallengesScreen';
import OptionsScreen from './src/screens/OptionsScreen';
import { useResponsiveCanvas } from './src/utils/useResponsiveCanvas';
import { initAudioSession, preloadAllAudio, playMusic } from './src/utils/audioManager';
import { loadSave, recordRun } from './src/utils/saveManager';
import { GAME_CONFIG } from './src/constants/gameConfig';

const APP_STATE = {
  LOADING: 'LOADING',
  MENU: 'MENU',
  PLAYING: 'PLAYING',
  GAMEOVER: 'GAMEOVER',
  SHOP: 'SHOP',
  CHALLENGES: 'CHALLENGES',
  OPTIONS: 'OPTIONS',
};

export default function App() {
  const [appState, setAppState] = useState(APP_STATE.LOADING);
  const [lastResult, setLastResult] = useState({ score: 0, coins: 0, isNewHigh: false });
  const [saveData, setSaveData] = useState(null);
  const { scale, translateX, translateY, virtualWidth, virtualHeight } = useResponsiveCanvas();

  useEffect(() => {
    let mounted = true;
    async function boot() {
      await initAudioSession();
      await preloadAllAudio();
      const save = await loadSave();
      if (mounted) {
        setSaveData(save);
        await playMusic('menu_theme');
      }
    }
    boot();
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE).catch(() => {});
    return () => { mounted = false; };
  }, []);

  const handleGameOver = async (score, coins) => {
    const isNewHigh = await recordRun(score, coins);
    const save = await loadSave();
    setSaveData(save);
    setLastResult({ score, coins, isNewHigh });
    setAppState(APP_STATE.GAMEOVER);
  };

  const renderScreen = () => {
    switch (appState) {
      case APP_STATE.LOADING:
        return <LoadingScreen onFinishLoading={() => setAppState(APP_STATE.MENU)} />;
      case APP_STATE.MENU:
        return (
          <MenuScreen
            onPlay={() => setAppState(APP_STATE.PLAYING)}
            onShop={() => setAppState(APP_STATE.SHOP)}
            onChallenges={() => setAppState(APP_STATE.CHALLENGES)}
            onOptions={() => setAppState(APP_STATE.OPTIONS)}
          />
        );
      case APP_STATE.PLAYING:
        return <GameScreen onGameOver={handleGameOver} />;
      case APP_STATE.GAMEOVER:
        return (
          <GameOverScreen
            score={lastResult.score}
            coins={lastResult.coins}
            isNewHigh={lastResult.isNewHigh}
            runLog={saveData?.runLog || []}
            onRetry={() => setAppState(APP_STATE.PLAYING)}
            onMenu={() => setAppState(APP_STATE.MENU)}
          />
        );
      case APP_STATE.SHOP:
        return <ShopScreen onBack={() => setAppState(APP_STATE.MENU)} />;
      case APP_STATE.CHALLENGES:
        return <ChallengesScreen onBack={() => setAppState(APP_STATE.MENU)} />;
      case APP_STATE.OPTIONS:
        return <OptionsScreen onBack={() => setAppState(APP_STATE.MENU)} />;
      default:
        return null;
    }
  };

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
          },
        ]}
      >
        {renderScreen()}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  rootContainer: { flex: 1, backgroundColor: '#000000' },
  viewportFrame: {
    position: 'absolute',
    backgroundColor: '#030108',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
});