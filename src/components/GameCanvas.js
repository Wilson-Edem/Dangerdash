import React from 'react';
import { StyleSheet, View } from 'react-native';
import {
  Canvas, Rect, Group, LinearGradient, vec, useImage, Image,
} from '@shopify/react-native-skia';
import { GAME_CONFIG } from '../constants/gameConfig';
import { PALETTE } from '../constants/palette';
import Player from './Player';
import Platform from './Platform';
import Items from './Items';

export default function GameCanvas({
  playerX, playerY, powerJumpFlash, platforms, items, score,
  gameState, isGrounded, animFrame, activePower, gravityFlipped,
  hasShield, deathFadeAlpha, skinColors,
}) {
  const bgSky = useImage(require('../../assets/images/background/bg_sky_gradient.png'));
  const bgCityFar = useImage(require('../../assets/images/background/bg_city_far.png'));
  const bgCityNear = useImage(require('../../assets/images/background/bg_city_near.png'));
  const waterTile = useImage(require('../../assets/images/environment/water_fluid_tile.png'));

  const farOffset = (score * 0.8) % GAME_CONFIG.VIRTUAL_WIDTH;
  const nearOffset = (score * 2.2) % GAME_CONFIG.VIRTUAL_WIDTH;
  const waterHeight = GAME_CONFIG.VIRTUAL_HEIGHT - GAME_CONFIG.WATER_LEVEL_Y;

  return (
    <View style={styles.canvasContainer}>
      <Canvas style={styles.canvas}>

        <Rect x={0} y={0} width={GAME_CONFIG.VIRTUAL_WIDTH} height={GAME_CONFIG.VIRTUAL_HEIGHT}>
          <LinearGradient
            start={vec(0, 0)}
            end={vec(0, GAME_CONFIG.VIRTUAL_HEIGHT)}
            colors={[PALETTE.BG_TOP, PALETTE.BG_MID, PALETTE.BG_BOTTOM]}
          />
        </Rect>

        {bgSky && (
          <Image image={bgSky} x={0} y={0} width={GAME_CONFIG.VIRTUAL_WIDTH} height={GAME_CONFIG.VIRTUAL_HEIGHT} fit="cover" />
        )}

        {bgCityFar && (
          <Group>
            <Image image={bgCityFar} x={-farOffset} y={170} width={GAME_CONFIG.VIRTUAL_WIDTH} height={170} fit="fill" />
            <Image image={bgCityFar} x={GAME_CONFIG.VIRTUAL_WIDTH - farOffset} y={170} width={GAME_CONFIG.VIRTUAL_WIDTH} height={170} fit="fill" />
          </Group>
        )}

        {bgCityNear && (
          <Group>
            <Image image={bgCityNear} x={-nearOffset} y={210} width={GAME_CONFIG.VIRTUAL_WIDTH} height={170} fit="fill" />
            <Image image={bgCityNear} x={GAME_CONFIG.VIRTUAL_WIDTH - nearOffset} y={210} width={GAME_CONFIG.VIRTUAL_WIDTH} height={170} fit="fill" />
          </Group>
        )}

        {/* 🔧 FIXED WATER: plain Image, fit="fill" */}
        {waterTile ? (
          <Image
            image={waterTile}
            x={0}
            y={GAME_CONFIG.WATER_LEVEL_Y}
            width={GAME_CONFIG.VIRTUAL_WIDTH}
            height={waterHeight}
            fit="fill"
          />
        ) : (
          <Rect
            x={0}
            y={GAME_CONFIG.WATER_LEVEL_Y}
            width={GAME_CONFIG.VIRTUAL_WIDTH}
            height={waterHeight}
            color={PALETTE.WATER_COLOR}
          />
        )}

        <Platform platforms={platforms} />
        <Items items={items} />

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