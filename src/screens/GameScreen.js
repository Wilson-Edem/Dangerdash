import React from 'react';
import { StyleSheet, View, TouchableWithoutFeedback } from 'react-native';
import GameCanvas from '../components/GameCanvas';
import { useGameEngine } from '../utils/useGameEngine';

export default function GameScreen() {
  const {
    gameState,
    score,
    coins,
    health,
    playerX,
    playerY,
    powerJumpFlash,
    platforms,
    handleScreenTap,
  } = useGameEngine();

  return (
    <TouchableWithoutFeedback onPress={handleScreenTap}>
      <View style={styles.touchContainer}>
        <GameCanvas
          playerX={playerX}
          playerY={playerY}
          powerJumpFlash={powerJumpFlash}
          platforms={platforms}
          score={score}
          coins={coins}
          health={health}
          gameState={gameState}
        />
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  touchContainer: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});