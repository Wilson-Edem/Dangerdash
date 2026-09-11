import React, { useState, useEffect } from 'react';
import { StyleSheet, View, StatusBar } from 'react-native';
import * as ScreenOrientation from 'expo-screen-orientation';
import LoadingScreen from './src/screens/LoadingScreen';
import GameScreen from './src/screens/GameScreen';
import { useResponsiveCanvas } from './src/utils/useResponsiveCanvas';
import { initAudioSession, preloadAllAudio, playMusic } from './src/utils/audioManager';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const { scale, translateX, translateY, virtualWidth, virtualHeight } = useResponsiveCanvas();

  // Boot: audio session + preload + landscape lock
  useEffect(() => {
    async function bootAudio() {
      await initAudioSession();
      await preloadAllAudio();
    }
    bootAudio();

    async function lockLandscape() {
      try {
        await ScreenOrientation.lockAsync(
          ScreenOrientation.OrientationLock.LANDSCAPE
        );
      } catch (e) {
        console.warn('Orientation lock notice:', e);
      }
    }
    lockLandscape();
  }, []);

  // Start menu music once loading finishes
  useEffect(() => {
    if (!isLoading) {
      playMusic('menu_theme');
    }
  }, [isLoading]);

  if (isLoading) {
    return (
      <View style={styles.rootContainer}>
        <StatusBar hidden />
        <LoadingScreen onFinishLoading={() => setIsLoading(false)} />
      </View>
    );
  }

  return (
    <View style={styles.rootContainer}>
      <StatusBar hidden />
      <View
        style={[
          styles.viewportFrame,
          {
            width: virtualWidth,
            height: virtualHeight,
            transform: [
              { translateX },
              { translateY },
              { scale },
            ],
          },
        ]}
      >
        <GameScreen />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    backgroundColor: '#000000',
  },
  viewportFrame: {
    position: 'absolute',
    backgroundColor: '#030108',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
});