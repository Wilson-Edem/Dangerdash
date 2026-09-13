import React from 'react';
import { StyleSheet, View, Text, TouchableWithoutFeedback, TouchableOpacity } from 'react-native';
import GameCanvas from '../components/GameCanvas';
import { useGameLoop } from '../utils/useGameLoop';
import { GAME_CONFIG } from '../constants/gameConfig';
import { useTheme } from '../context/ThemeContext';
import { PALETTE } from '../constants/palette';

export default function GameScreen({
  onGameOver,
  onPause,
  upgradeLevels,
  settings,
  skinColors,
}) {
  const { theme } = useTheme();

  const {
    gameState,
    score,
    coins,
    health,
    hasShield,
    isGrounded,
    animFrame,
    playerX,
    playerY,
    powerJumpFlash,
    platforms,
    items,
    activePower,
    combo,
    gravityFlipped,
    deathFadeAlpha,
    powerName,
    handleScreenTap,
  } = useGameLoop({ onGameOver, upgradeLevels, settings });

  const showHUD =
    gameState === GAME_CONFIG.STATE.PLAYING ||
    gameState === GAME_CONFIG.STATE.GAMEOVER;

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
          combo={combo}
          gravityFlipped={gravityFlipped}
          deathFadeAlpha={deathFadeAlpha}
          skinColors={skinColors}
        />

        {showHUD && (
          <>
            <View style={styles.hudTop} pointerEvents="none">
              <View>
                <Text style={[styles.hudText, { color: theme.colors.hudText }]}>
                  SCORE: {String(score).padStart(6, '0')}
                </Text>
                <Text style={[styles.hudText, { color: theme.colors.hudText }]}>
                  COINS: {coins}
                </Text>
                <Text style={[styles.hudText, { color: theme.colors.hudText }]}>
                  HP: {'❤️ '.repeat(Math.max(0, health))}
                </Text>
              </View>
              <View style={styles.alignRight}>
                {combo > 0 && (
                  <Text style={[styles.comboText, { color: theme.colors.comboText }]}>
                    COMBO x{combo}
                  </Text>
                )}
                {activePower && (
                  <Text
                    style={[
                      styles.powerText,
                      { color: PALETTE.POWER_COLORS[activePower] || theme.colors.powerText },
                    ]}
                  >
                    {PALETTE.POWER_ICONS[activePower]} {activePower}
                  </Text>
                )}
                {powerName ? (
                  <Text style={[styles.powerName, { color: theme.colors.powerText }]}>
                    {powerName}
                  </Text>
                ) : null}
              </View>
            </View>

            {/* Pause button */}
            {gameState === GAME_CONFIG.STATE.PLAYING && onPause && (
              <TouchableOpacity
                style={[styles.pauseBtn, { borderColor: theme.colors.buttonBorder }]}
                onPress={onPause}
              >
                <Text style={[styles.pauseText, { color: theme.colors.buttonText }]}>❚❚</Text>
              </TouchableOpacity>
            )}
          </>
        )}

        {gameState === GAME_CONFIG.STATE.MENU && (
          <View style={[styles.centerOverlay, { backgroundColor: theme.colors.overlayBg }]} pointerEvents="none">
            <Text style={[styles.titleText, { color: theme.colors.titleText }]}>DANGER DASH</Text>
            <Text style={[styles.subTitleText, { color: theme.colors.subtitleText }]}>MOBILE • BY VHITE</Text>
            <Text style={[styles.promptText, { color: theme.colors.promptText }]}>TAP ANYWHERE TO RUN</Text>
          </View>
        )}

        {gameState === GAME_CONFIG.STATE.GAMEOVER && deathFadeAlpha >= 0.7 && (
          <View style={[styles.centerOverlay, { backgroundColor: theme.colors.overlayBg }]} pointerEvents="none">
            <Text style={[styles.gameOverText, { color: theme.colors.gameOverText }]}>GAME OVER</Text>
            <Text style={[styles.scoreSummaryText, { color: theme.colors.hudText }]}>FINAL SCORE: {score}</Text>
            <Text style={[styles.promptText, { color: theme.colors.promptText }]}>Loading results...</Text>
          </View>
        )}

      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  touchContainer: { flex: 1, width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' },
  hudTop: { position: 'absolute', top: 20, left: 20, right: 20, flexDirection: 'row', justifyContent: 'space-between' },
  alignRight: { alignItems: 'flex-end' },
  hudText: { fontSize: 16, fontWeight: 'bold', fontFamily: 'monospace' },
  comboText: { fontSize: 18, fontWeight: 'bold', fontFamily: 'monospace', marginTop: 4 },
  powerText: { fontSize: 14, fontWeight: 'bold', fontFamily: 'monospace', marginTop: 4 },
  powerName: { fontSize: 11, fontFamily: 'monospace', marginTop: 2, fontStyle: 'italic' },
  pauseBtn: {
    position: 'absolute',
    top: 20,
    right: 20,
    width: 50,
    height: 50,
    borderWidth: 2,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  pauseText: { fontSize: 20, fontWeight: 'bold' },
  centerOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center' },
  titleText: { fontSize: 44, fontWeight: '900', fontFamily: 'monospace', letterSpacing: 4 },
  subTitleText: { fontSize: 16, fontWeight: 'bold', fontFamily: 'monospace', letterSpacing: 3, marginTop: 8 },
  promptText: { fontSize: 16, fontWeight: 'bold', fontFamily: 'monospace', marginTop: 24, letterSpacing: 2 },
  gameOverText: { fontSize: 44, fontWeight: '900', fontFamily: 'monospace', letterSpacing: 4 },
  scoreSummaryText: { fontSize: 20, fontWeight: 'bold', fontFamily: 'monospace', marginTop: 16 },
});