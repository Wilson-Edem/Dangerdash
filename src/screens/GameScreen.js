import React from 'react';
import { StyleSheet, View, Text, TouchableWithoutFeedback } from 'react-native';
import GameCanvas from '../components/GameCanvas';
import { useGameLoop } from '../utils/useGameLoop';
import { GAME_CONFIG } from '../constants/gameConfig';
import { PALETTE } from '../constants/palette';

export default function GameScreen() {
  const {
    gameState, score, coins, health, hasShield, isGrounded, animFrame,
    playerX, playerY, powerJumpFlash, platforms, items,
    activePower, powerTimer, combo, gravityFlipped,
    deathFadeAlpha, highScore,
    handleScreenTap,
  } = useGameLoop();

  const showHUD =
    gameState === GAME_CONFIG.STATE.PLAYING ||
    gameState === GAME_CONFIG.STATE.GAMEOVER;

  return (
    <TouchableWithoutFeedback onPress={handleScreenTap}>
      <View style={styles.touchContainer}>

        {/* ===== SKIA CANVAS (game world) ===== */}
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
          deathFadeAlpha={deathFadeAlpha}
        />

        {/* ===== HUD OVERLAY ===== */}
        {showHUD && (
          <View style={styles.hudTop} pointerEvents="none">
            <View>
              <Text style={styles.hudText}>SCORE: {String(score).padStart(6, '0')}</Text>
              <Text style={styles.hudText}>COINS: {coins}</Text>
              <Text style={styles.hudText}>HP: {'❤️ '.repeat(Math.max(0, health))}</Text>
            </View>
            <View style={styles.alignRight}>
              <Text style={styles.hudText}>HIGH: {highScore}</Text>
              {combo > 0 && <Text style={styles.comboText}>COMBO x{combo}</Text>}
              {activePower && (
                <Text style={[styles.powerText, { color: PALETTE.POWER_COLORS[activePower] || PALETTE.NEON_CYAN }]}>
                  {PALETTE.POWER_ICONS[activePower]} {activePower}
                </Text>
              )}
            </View>
          </View>
        )}

        {/* ===== MENU OVERLAY ===== */}
        {gameState === GAME_CONFIG.STATE.MENU && (
          <View style={styles.centerOverlay} pointerEvents="none">
            <Text style={styles.titleText}>DANGER DASH</Text>
            <Text style={styles.subTitleText}>MOBILE • BY VHITE</Text>
            <Text style={styles.promptText}>TAP ANYWHERE TO RUN</Text>
          </View>
        )}

        {/* ===== GAME OVER OVERLAY ===== */}
        {gameState === GAME_CONFIG.STATE.GAMEOVER && deathFadeAlpha >= 0.7 && (
          <View style={styles.centerOverlay} pointerEvents="none">
            <Text style={styles.gameOverText}>GAME OVER</Text>
            <Text style={styles.scoreSummaryText}>FINAL SCORE: {score}</Text>
            <Text style={styles.promptText}>TAP TO TRY AGAIN</Text>
          </View>
        )}

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
  hudTop: {
    position: 'absolute',
    top: 20,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  alignRight: { alignItems: 'flex-end' },
  hudText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'monospace',
  },
  comboText: {
    color: '#ff007f',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'monospace',
    marginTop: 4,
  },
  powerText: {
    fontSize: 14,
    fontWeight: 'bold',
    fontFamily: 'monospace',
    marginTop: 4,
  },
  centerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(5, 2, 10, 0.55)',
  },
  titleText: {
    color: '#00f0ff',
    fontSize: 44,
    fontWeight: '900',
    fontFamily: 'monospace',
    letterSpacing: 4,
    textShadowColor: '#00f0ff',
    textShadowRadius: 12,
  },
  subTitleText: {
    color: '#a855f7',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'monospace',
    letterSpacing: 3,
    marginTop: 8,
  },
  promptText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'monospace',
    marginTop: 24,
    letterSpacing: 2,
  },
  gameOverText: {
    color: '#ff0055',
    fontSize: 44,
    fontWeight: '900',
    fontFamily: 'monospace',
    letterSpacing: 4,
    textShadowColor: '#ff0055',
    textShadowRadius: 12,
  },
  scoreSummaryText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'monospace',
    marginTop: 16,
  },
});