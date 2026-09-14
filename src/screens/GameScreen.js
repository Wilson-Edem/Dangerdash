import React from 'react';

import {
  StyleSheet,
  View,
  Text,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from 'react-native';

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
  } = useGameLoop({
    onGameOver,
    upgradeLevels,
    settings,
  });

  const showHUD =
    gameState ===
      GAME_CONFIG.STATE.PLAYING ||
    gameState ===
      GAME_CONFIG.STATE.GAMEOVER;

  return (
    <TouchableWithoutFeedback
      onPress={handleScreenTap}
    >
      <View style={styles.container}>
        <GameCanvas
          playerX={playerX}
          playerY={playerY}
          powerJumpFlash={
            powerJumpFlash
          }
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
          gravityFlipped={
            gravityFlipped
          }
          deathFadeAlpha={
            deathFadeAlpha
          }
          skinColors={skinColors}
        />

        {showHUD && (
          <>
            {/* LEFT HUD */}
            <View
              style={styles.leftHUD}
              pointerEvents="none"
            >
              <View
                style={styles.hudPanel}
              >
                <Text
                  style={
                    styles.scoreLabel
                  }
                >
                  SCORE
                </Text>

                <Text
                  style={
                    styles.scoreValue
                  }
                >
                  {String(score).padStart(
                    6,
                    '0'
                  )}
                </Text>

                <View
                  style={
                    styles.divider
                  }
                />

                <View
                  style={
                    styles.smallStat
                  }
                >
                  <Text
                    style={
                      styles.smallLabel
                    }
                  >
                    COINS
                  </Text>

                  <Text
                    style={[
                      styles.smallValue,
                      {
                        color:
                          theme.colors
                            .coinGold,
                      },
                    ]}
                  >
                    {coins}
                  </Text>
                </View>

                <View
                  style={
                    styles.smallStat
                  }
                >
                  <Text
                    style={
                      styles.smallLabel
                    }
                  >
                    HP
                  </Text>

                  <View
                    style={
                      styles.healthRow
                    }
                  >
                    {[0, 1, 2].map(
                      (index) => (
                        <View
                          key={index}
                          style={[
                            styles.healthBar,
                            index <
                              health &&
                              styles.healthActive,
                          ]}
                        />
                      )
                    )}
                  </View>
                </View>
              </View>
            </View>

            {/* RIGHT HUD */}
            <View
              style={styles.rightHUD}
              pointerEvents="none"
            >
              {combo > 0 && (
                <View
                  style={
                    styles.comboBadge
                  }
                >
                  <Text
                    style={
                      styles.comboText
                    }
                  >
                    COMBO ×{combo}
                  </Text>
                </View>
              )}

              {activePower && (
                <View
                  style={[
                    styles.powerBadge,
                    {
                      borderColor:
                        PALETTE
                          .POWER_COLORS[
                          activePower
                        ] ||
                        theme.colors
                          .hudBorder,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.powerText,
                      {
                        color:
                          PALETTE
                            .POWER_COLORS[
                            activePower
                          ] ||
                          theme.colors
                            .powerText,
                      },
                    ]}
                  >
                    {
                      PALETTE
                        .POWER_ICONS[
                        activePower
                      ]
                    }{' '}
                    {activePower}
                  </Text>

                  {powerName ? (
                    <Text
                      style={
                        styles.powerName
                      }
                    >
                      {powerName}
                    </Text>
                  ) : null}
                </View>
              )}
            </View>

            {/* PAUSE */}
            {gameState ===
              GAME_CONFIG.STATE.PLAYING &&
              onPause && (
                <TouchableOpacity
                  activeOpacity={0.8}
                  style={
                    styles.pauseButton
                  }
                  onPress={onPause}
                >
                  <Text
                    style={
                      styles.pauseText
                    }
                  >
                    ❚❚
                  </Text>
                </TouchableOpacity>
              )}
          </>
        )}

        {/* GAME START OVERLAY */}
        {gameState ===
          GAME_CONFIG.STATE.MENU && (
          <View
            style={
              styles.centerOverlay
            }
            pointerEvents="none"
          >
            <Text
              style={
                styles.titleText
              }
            >
              DANGER DASH
            </Text>

            <Text
              style={
                styles.subtitleText
              }
            >
              MOBILE • BY VHITE
            </Text>

            <Text
              style={
                styles.promptText
              }
            >
              TAP ANYWHERE TO RUN
            </Text>
          </View>
        )}

        {/* GAME OVER */}
        {gameState ===
          GAME_CONFIG.STATE.GAMEOVER &&
          deathFadeAlpha >= 0.7 && (
            <View
              style={
                styles.centerOverlay
              }
              pointerEvents="none"
            >
              <Text
                style={
                  styles.gameOverText
                }
              >
                GAME OVER
              </Text>

              <Text
                style={
                  styles.scoreSummaryText
                }
              >
                FINAL SCORE: {score}
              </Text>

              <Text
                style={
                  styles.promptText
                }
              >
                SAVING RUN...
              </Text>
            </View>
          )}
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },

  /*
   * These values are in the 800x450 virtual
   * coordinate system.
   *
   * The cover-scaled App viewport crops the
   * extra vertical area on wide displays.
   */
  leftHUD: {
    position: 'absolute',
    top: 55,
    left: 16,
  },

  rightHUD: {
    position: 'absolute',
    top: 55,
    right: 78,
    alignItems: 'flex-end',
  },

  hudPanel: {
    minWidth: 142,
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: '#21465A',
    backgroundColor:
      'rgba(3,7,17,0.78)',
  },

  scoreLabel: {
    color: '#66758B',
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 2,
  },

  scoreValue: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '900',
    fontFamily: 'monospace',
    marginTop: 2,
  },

  divider: {
    height: 1,
    backgroundColor: '#203447',
    marginVertical: 7,
  },

  smallStat: {
    flexDirection: 'row',
    justifyContent:
      'space-between',
    alignItems: 'center',
    marginTop: 3,
  },

  smallLabel: {
    color: '#66758B',
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 1.5,
  },

  smallValue: {
    fontSize: 11,
    fontWeight: '900',
    fontFamily: 'monospace',
  },

  healthRow: {
    flexDirection: 'row',
    gap: 3,
  },

  healthBar: {
    width: 17,
    height: 5,
    borderRadius: 2,
    backgroundColor: '#252A34',
  },

  healthActive: {
    backgroundColor: '#FF007F',
  },

  comboBadge: {
    paddingHorizontal: 11,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor:
      'rgba(40,3,27,0.84)',
    borderWidth: 1,
    borderColor: '#FF007F',
  },

  comboText: {
    color: '#FF4FA2',
    fontSize: 12,
    fontWeight: '900',
    fontFamily: 'monospace',
  },

  powerBadge: {
    marginTop: 7,
    minWidth: 125,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor:
      'rgba(3,8,18,0.84)',
    borderWidth: 1,
  },

  powerText: {
    fontSize: 10,
    fontWeight: '900',
    fontFamily: 'monospace',
  },

  powerName: {
    color: '#8E95A5',
    fontSize: 8,
    marginTop: 2,
    fontFamily: 'monospace',
  },

  pauseButton: {
    position: 'absolute',
    top: 55,
    right: 15,
    width: 46,
    height: 46,
    borderRadius: 23,
    borderWidth: 1,
    borderColor: '#00F0FF',
    backgroundColor:
      'rgba(3,7,17,0.88)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  pauseText: {
    color: '#00F0FF',
    fontSize: 17,
    fontWeight: '900',
  },

  centerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:
      'rgba(3,1,8,0.38)',
  },

  titleText: {
    color: '#FFFFFF',
    fontSize: 42,
    fontWeight: '900',
    letterSpacing: 5,
    fontFamily: 'monospace',
    textShadowColor: '#00F0FF',
    textShadowRadius: 18,
  },

  subtitleText: {
    color: '#A855F7',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 3,
    marginTop: 6,
  },

  promptText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 2,
    marginTop: 20,
  },

  gameOverText: {
    color: '#FF007F',
    fontSize: 42,
    fontWeight: '900',
    letterSpacing: 5,
    fontFamily: 'monospace',
    textShadowColor: '#FF007F',
    textShadowRadius: 15,
  },

  scoreSummaryText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '900',
    fontFamily: 'monospace',
    marginTop: 12,
  },
});