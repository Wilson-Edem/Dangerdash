import React from 'react';
import { StyleSheet, View, TouchableWithoutFeedback } from 'react-native';
import GameCanvas from '../components/GameCanvas';
import { useGameLoop } from '../utils/useGameLoop';

export default function GameScreen() {
  const {
    gameState, score, coins, health, hasShield, isGrounded, animFrame,
    playerX, playerY, powerJumpFlash, platforms, items,
    activePower, powerTimer, combo, gravityFlipped,
    handleScreenTap,
  } = useGameLoop();

  return (
    <TouchableWithoutFeedback onPress={handleScreenTap}>
      <View style={styles.touchContainer}>
        <GameCanvas
          playerX={playerX}
          playerY={playerY}
          powerJumpFlash={powerJumpFlash}
          platforms={platforms}
          items={items}
          score={score}
          coins={coins}
          health={health}
          hasShield={hasShield}
          isGrounded={isGrounded}
          animFrame={animFrame}
          gameState={gameState}
          activePower={activePower}
          powerTimer={powerTimer}
          combo={combo}
          gravityFlipped={gravityFlipped}
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