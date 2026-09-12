import React from 'react';
import { StyleSheet, View } from 'react-native';
import {
  Canvas, Rect, Group, LinearGradient, vec, useImage, Image, ImageShader,
} from '@shopify/react-native-skia';
import { GAME_CONFIG } from '../constants/gameConfig';
import { PALETTE } from '../constants/palette';
import Player from './Player';
import Platform from './Platform';
import Items from './Items';

export default function GameCanvas({
  playerX, playerY, powerJumpFlash, platforms, items, score,
  gameState, isGrounded, animFrame, activePower, gravityFlipped,
  hasShield, deathFadeAlpha,
}) {
  const bgSky = useImage(require('../../assets/images/background/bg_sky_gradient.png'));
  const bgCityFar = useImage(require('../../assets/images/background/bg_city_far.png'));
  const bgCityNear = useImage(require('../../assets/images/background/bg_city_near.png'));
  const waterTile = useImage(require('../../assets/images/environment/water_fluid_tile.png'));

  const farOffset = (score * 0.8) % GAME_CONFIG.VIRTUAL_WIDTH;
  const nearOffset = (score * 2.2) % GAME_CONFIG.VIRTUAL_WIDTH;
  const waterHeight = GAME_CONFIG.VIRTUAL_HEIGHT - GAME_CONFIG.WATER_LEVEL_Y;

  // Water animation: horizontal scroll + vertical bob
  const WATER_TILE_W = 180;
  const waterScrollX = (animFrame * 1.6) % WATER_TILE_W;      // flows left
  const waterBobY = Math.sin(animFrame * 0.08) * 3;            // gentle bob

  return (
    <View style={styles.canvasContainer}>
      <Canvas style={styles.canvas}>

        {/* Base gradient */}
        <Rect x={0} y={0} width={GAME_CONFIG.VIRTUAL_WIDTH} height={GAME_CONFIG.VIRTUAL_HEIGHT}>
          <LinearGradient
            start={vec(0, 0)}
            end={vec(0, GAME_CONFIG.VIRTUAL_HEIGHT)}
            colors={[PALETTE.BG_TOP, PALETTE.BG_MID, PALETTE.BG_BOTTOM]}
          />
        </Rect>

        {/* Sky */}
        {bgSky && (
          <Image image={bgSky} x={0} y={0} width={GAME_CONFIG.VIRTUAL_WIDTH} height={GAME_CONFIG.VIRTUAL_HEIGHT} fit="cover" />
        )}

        {/* Far city */}
        {bgCityFar && (
          <Group>
            <Image image={bgCityFar} x={-farOffset} y={170} width={GAME_CONFIG.VIRTUAL_WIDTH} height={170} fit="fill" />
            <Image image={bgCityFar} x={GAME_CONFIG.VIRTUAL_WIDTH - farOffset} y={170} width={GAME_CONFIG.VIRTUAL_WIDTH} height={170} fit="fill" />
          </Group>
        )}

        {/* Near city */}
        {bgCityNear && (
          <Group>
            <Image image={bgCityNear} x={-nearOffset} y={210} width={GAME_CONFIG.VIRTUAL_WIDTH} height={170} fit="fill" />
            <Image image={bgCityNear} x={GAME_CONFIG.VIRTUAL_WIDTH - nearOffset} y={210} width={GAME_CONFIG.VIRTUAL_WIDTH} height={170} fit="fill" />
          </Group>
        )}

        {/* === WATER (animated, flowing) === */}
        {waterTile ? (
          <Group>
            {/* Base water with horizontal scroll */}
            <Rect
              x={0}
              y={GAME_CONFIG.WATER_LEVEL_Y + waterBobY}
              width={GAME_CONFIG.VIRTUAL_WIDTH}
              height={waterHeight}
            >
              <ImageShader
                image={waterTile}
                fit="none"
                rect={{ x: -waterScrollX, y: 0, width: WATER_TILE_W, height: waterHeight }}
                tx="repeat"
                ty="clamp"
              />
            </Rect>

            {/* Bright foam line on the surface */}
            <Rect
              x={0}
              y={GAME_CONFIG.WATER_LEVEL_Y + waterBobY}
              width={GAME_CONFIG.VIRTUAL_WIDTH}
              height={3}
              color={PALETTE.WHITE}
              opacity={0.75}
            />
            <Rect
              x={0}
              y={GAME_CONFIG.WATER_LEVEL_Y + waterBobY + 3}
              width={GAME_CONFIG.VIRTUAL_WIDTH}
              height={2}
              color={PALETTE.NEON_CYAN}
              opacity={0.5}
            />
          </Group>
        ) : (
          <Group>
            <Rect
              x={0}
              y={GAME_CONFIG.WATER_LEVEL_Y + waterBobY}
              width={GAME_CONFIG.VIRTUAL_WIDTH}
              height={waterHeight}
              color={PALETTE.WATER_COLOR}
            />
            <Rect
              x={0}
              y={GAME_CONFIG.WATER_LEVEL_Y + waterBobY}
              width={GAME_CONFIG.VIRTUAL_WIDTH}
              height={3}
              color={PALETTE.WHITE}
              opacity={0.75}
            />
          </Group>
        )}

        {/* Platforms (draw over water — their bottoms disappear into fluid) */}
        <Platform platforms={platforms} />

        {/* Items */}
        <Items items={items} />

        {/* Player */}
        <Player
          playerX={playerX}
          playerY={playerY}
          powerJumpFlash={powerJumpFlash}
          isGrounded={isGrounded}
          hasShield={hasShield}
          animFrame={animFrame}
          activePower={activePower}
          gravityFlipped={gravityFlipped}
        />

        {/* Death fade */}
        <Rect
          x={0}
          y={0}
          width={GAME_CONFIG.VIRTUAL_WIDTH}
          height={GAME_CONFIG.VIRTUAL_HEIGHT}
          color="#0A0005"
          opacity={deathFadeAlpha}
        />

      </Canvas>
    </View>
  );
}

const styles = StyleSheet.create({
  canvasContainer: {
    width: GAME_CONFIG.VIRTUAL_WIDTH,
    height: GAME_CONFIG.VIRTUAL_HEIGHT,
    backgroundColor: '#030408',
  },
  canvas: { flex: 1 },
});