import React from 'react';

import {
  StyleSheet,
  View,
} from 'react-native';

import {
  Canvas,
  Rect,
  Group,
  LinearGradient,
  vec,
  useImage,
  Image,
  ImageShader,
} from '@shopify/react-native-skia';

import { GAME_CONFIG } from '../constants/gameConfig';

import { PALETTE } from '../constants/palette';

import { useTheme } from '../context/ThemeContext';

import { THEMES } from '../constants/themes';

import Player from './Player';
import Platform from './Platform';
import Items from './Items';

export default function GameCanvas({
  playerX,
  playerY,
  powerJumpFlash,
  platforms,
  items,
  score,
  gameState,
  isGrounded,
  animFrame,
  activePower,
  gravityFlipped,
  hasShield,
  deathFadeAlpha,
  skinColors,
}) {
  const {
    theme,
    themeKey,
  } = useTheme();

  /*
   * Keep both theme image sets loaded.
   *
   * This means changing themes does not depend on
   * Skia decoding a brand-new image at the exact
   * moment the user presses the theme button.
   */
  const cyberSky =
    useImage(
      THEMES.cyberpunk.assets.bgSky
    );

  const woodenSky =
    useImage(
      THEMES.wooden.assets.bgSky
    );

  const cyberFar =
    useImage(
      THEMES.cyberpunk.assets.bgFar
    );

  const woodenFar =
    useImage(
      THEMES.wooden.assets.bgFar
    );

  const cyberNear =
    useImage(
      THEMES.cyberpunk.assets.bgNear
    );

  const woodenNear =
    useImage(
      THEMES.wooden.assets.bgNear
    );

  const cyberWater =
    useImage(
      THEMES.cyberpunk.assets.waterTile
    );

  const woodenWater =
    useImage(
      THEMES.wooden.assets.waterTile
    );

  const bgSky =
    themeKey === 'wooden'
      ? woodenSky
      : cyberSky;

  const bgCityFar =
    themeKey === 'wooden'
      ? woodenFar
      : cyberFar;

  const bgCityNear =
    themeKey === 'wooden'
      ? woodenNear
      : cyberNear;

  const waterTile =
    themeKey === 'wooden'
      ? woodenWater
      : cyberWater;

  const farOffset =
    (score * 0.55) %
    GAME_CONFIG.VIRTUAL_WIDTH;

  const nearOffset =
    (score * 1.35) %
    GAME_CONFIG.VIRTUAL_WIDTH;

  const waterHeight =
    Math.max(
      0,
      GAME_CONFIG.VIRTUAL_HEIGHT -
        GAME_CONFIG.WATER_LEVEL_Y
    );

  const WATER_TILE_W = 180;

  const waterScrollX =
    (animFrame * 1.35) %
    WATER_TILE_W;

  const waterBobY =
    Math.sin(
      animFrame * 0.055
    ) * 2;

  return (
    <View
      style={styles.container}
    >
      {/*
       * The key is critical.
       *
       * When themeKey changes, the complete Skia
       * rendering subtree is recreated. That means
       * Platform, Items and Player also receive the
       * new theme assets instead of retaining an
       * old Skia image object.
       */}
      <Canvas
        key={`canvas-theme-${themeKey}`}
        style={styles.canvas}
      >
        {/* =========================
            BACKGROUND GRADIENT
        ========================== */}

        <Rect
          x={0}
          y={0}
          width={
            GAME_CONFIG.VIRTUAL_WIDTH
          }
          height={
            GAME_CONFIG.VIRTUAL_HEIGHT
          }
        >
          <LinearGradient
            start={vec(0, 0)}
            end={vec(
              0,
              GAME_CONFIG.VIRTUAL_HEIGHT
            )}
            colors={[
              PALETTE.BG_TOP,
              PALETTE.BG_MID,
              PALETTE.BG_BOTTOM,
            ]}
          />
        </Rect>

        {/* =========================
            SKY
        ========================== */}

        {bgSky && (
          <Image
            image={bgSky}
            x={0}
            y={0}
            width={
              GAME_CONFIG.VIRTUAL_WIDTH
            }
            height={
              GAME_CONFIG.VIRTUAL_HEIGHT
            }
            fit="cover"
          />
        )}

        {/* =========================
            FAR BACKGROUND
        ========================== */}

        {bgCityFar && (
          <Group>
            <Image
              image={bgCityFar}
              x={-farOffset}
              y={155}
              width={
                GAME_CONFIG.VIRTUAL_WIDTH
              }
              height={185}
              fit="fill"
              opacity={0.88}
            />

            <Image
              image={bgCityFar}
              x={
                GAME_CONFIG.VIRTUAL_WIDTH -
                farOffset
              }
              y={155}
              width={
                GAME_CONFIG.VIRTUAL_WIDTH
              }
              height={185}
              fit="fill"
              opacity={0.88}
            />
          </Group>
        )}

        {/* =========================
            NEAR BACKGROUND
        ========================== */}

        {bgCityNear && (
          <Group>
            <Image
              image={bgCityNear}
              x={-nearOffset}
              y={205}
              width={
                GAME_CONFIG.VIRTUAL_WIDTH
              }
              height={175}
              fit="fill"
              opacity={0.94}
            />

            <Image
              image={bgCityNear}
              x={
                GAME_CONFIG.VIRTUAL_WIDTH -
                nearOffset
              }
              y={205}
              width={
                GAME_CONFIG.VIRTUAL_WIDTH
              }
              height={175}
              fit="fill"
              opacity={0.94}
            />
          </Group>
        )}

        {/* =========================
            WATER
        ========================== */}

        {waterTile ? (
          <Group>
            <Rect
              x={0}
              y={
                GAME_CONFIG.WATER_LEVEL_Y +
                waterBobY
              }
              width={
                GAME_CONFIG.VIRTUAL_WIDTH
              }
              height={
                waterHeight
              }
            >
              <ImageShader
                image={waterTile}
                fit="none"
                rect={{
                  x:
                    -waterScrollX,
                  y: 0,
                  width:
                    WATER_TILE_W,
                  height:
                    waterHeight,
                }}
                tx="repeat"
                ty="clamp"
              />
            </Rect>

            <Rect
              x={0}
              y={
                GAME_CONFIG.WATER_LEVEL_Y +
                waterBobY
              }
              width={
                GAME_CONFIG.VIRTUAL_WIDTH
              }
              height={3}
              color={PALETTE.WHITE}
              opacity={0.62}
            />

            <Rect
              x={0}
              y={
                GAME_CONFIG.WATER_LEVEL_Y +
                waterBobY +
                3
              }
              width={
                GAME_CONFIG.VIRTUAL_WIDTH
              }
              height={2}
              color={
                PALETTE.NEON_CYAN
              }
              opacity={0.45}
            />
          </Group>
        ) : (
          <Rect
            x={0}
            y={
              GAME_CONFIG.WATER_LEVEL_Y
            }
            width={
              GAME_CONFIG.VIRTUAL_WIDTH
            }
            height={
              waterHeight
            }
            color={
              PALETTE.WATER_COLOR
            }
          />
        )}

        {/* =========================
            PLATFORMS
        ========================== */}

        <Platform
          platforms={platforms}
        />

        {/* =========================
            ITEMS
        ========================== */}

        <Items
          items={items}
        />

        {/* =========================
            PLAYER
        ========================== */}

        <Player
          playerX={playerX}
          playerY={playerY}
          powerJumpFlash={
            powerJumpFlash
          }
          isGrounded={
            isGrounded
          }
          hasShield={
            hasShield
          }
          animFrame={
            animFrame
          }
          activePower={
            activePower
          }
          gravityFlipped={
            gravityFlipped
          }
          skinColors={
            skinColors
          }
        />

        {/* =========================
            DEATH FADE
        ========================== */}

        {deathFadeAlpha > 0 && (
          <Rect
            x={0}
            y={0}
            width={
              GAME_CONFIG.VIRTUAL_WIDTH
            }
            height={
              GAME_CONFIG.VIRTUAL_HEIGHT
            }
            color="#070009"
            opacity={Math.min(
              1,
              deathFadeAlpha
            )}
          />
        )}
      </Canvas>
    </View>
  );
}

const styles =
  StyleSheet.create({
    container: {
      width:
        GAME_CONFIG.VIRTUAL_WIDTH,
      height:
        GAME_CONFIG.VIRTUAL_HEIGHT,
      backgroundColor:
        '#030408',
    },

    canvas: {
      flex: 1,
    },
  });