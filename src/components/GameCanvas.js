import React from 'react';
import { StyleSheet, View } from 'react-native';
import {
  Canvas,
  Rect,
  Group,
  Text,
  matchFont,
  LinearGradient,
  vec,
  RoundedRect,
  useImage,
  Image,
} from '@shopify/react-native-skia';
import { GAME_CONFIG } from '../constants/gameConfig';
import { PALETTE } from '../constants/palette';
import Player from './Player';
import Platform from './Platform';
import Items from './Items';
import HUD from './HUD';

const titleFontStyle = { fontFamily: 'monospace', fontSize: 26, fontWeight: 'bold' };
const titleFont = matchFont(titleFontStyle);

const subFontStyle = { fontFamily: 'monospace', fontSize: 16, fontWeight: 'bold' };
const subFont = matchFont(subFontStyle);

export default function GameCanvas({
  playerX,
  playerY,
  powerJumpFlash,
  platforms,
  items,
  score,
  coins,
  health,
  hasShield,
  isGrounded,
  animFrame,
  gameState,
}) {
  const bgSky = useImage(require('../../assets/images/background/bg_sky_gradient.png'));
  const bgCityFar = useImage(require('../../assets/images/background/bg_city_far.png'));
  const bgCityNear = useImage(require('../../assets/images/background/bg_city_near.png'));

  const farOffset = (score * 0.8) % GAME_CONFIG.VIRTUAL_WIDTH;
  const nearOffset = (score * 2.2) % GAME_CONFIG.VIRTUAL_WIDTH;

  return (
    <View style={styles.canvasContainer}>
      <Canvas style={styles.canvas}>
        
        <Rect x={0} y={0} width={GAME_CONFIG.VIRTUAL_WIDTH} height={GAME_CONFIG.VIRTUAL_HEIGHT}>
          <LinearGradient
            start={vec(0, 0)}
            end={vec(0, GAME_CONFIG.VIRTUAL_HEIGHT)}
            colors={[PALETTE.DARK_BG_START, PALETTE.DARK_BG_MID, PALETTE.DARK_BG_END]}
          />
        </Rect>

        {bgSky && (
          <Image
            image={bgSky}
            x={0}
            y={0}
            width={GAME_CONFIG.VIRTUAL_WIDTH}
            height={GAME_CONFIG.VIRTUAL_HEIGHT}
            fit="fill"
          />
        )}

        {bgCityFar && (
          <Group>
            <Image
              image={bgCityFar}
              x={-farOffset}
              y={60}
              width={GAME_CONFIG.VIRTUAL_WIDTH}
              height={260}
              fit="fill"
            />
            <Image
              image={bgCityFar}
              x={GAME_CONFIG.VIRTUAL_WIDTH - farOffset}
              y={60}
              width={GAME_CONFIG.VIRTUAL_WIDTH}
              height={260}
              fit="fill"
            />
          </Group>
        )}

        {bgCityNear && (
          <Group>
            <Image
              image={bgCityNear}
              x={-nearOffset}
              y={100}
              width={GAME_CONFIG.VIRTUAL_WIDTH}
              height={250}
              fit="fill"
            />
            <Image
              image={bgCityNear}
              x={GAME_CONFIG.VIRTUAL_WIDTH - nearOffset}
              y={100}
              width={GAME_CONFIG.VIRTUAL_WIDTH}
              height={250}
              fit="fill"
            />
          </Group>
        )}

        <Rect
          x={0}
          y={GAME_CONFIG.WATER_LEVEL_Y}
          width={GAME_CONFIG.VIRTUAL_WIDTH}
          height={GAME_CONFIG.VIRTUAL_HEIGHT - GAME_CONFIG.WATER_LEVEL_Y}
        >
          <LinearGradient
            start={vec(0, GAME_CONFIG.WATER_LEVEL_Y)}
            end={vec(0, GAME_CONFIG.VIRTUAL_HEIGHT)}
            colors={[PALETTE.WATER_TOP, PALETTE.NEON_BLUE, PALETTE.WATER_BOTTOM]}
          />
        </Rect>

        <Platform platforms={platforms} />
        <Items items={items} />

        <Player
          playerX={playerX}
          playerY={playerY}
          powerJumpFlash={powerJumpFlash}
          isGrounded={isGrounded}
          hasShield={hasShield}
          animFrame={animFrame}
        />

        {score > 100 && (
          <Group opacity={0.35}>
            <Rect x={(score * 12) % 800} y={80} width={120} height={2} color={PALETTE.NEON_CYAN} />
            <Rect x={(score * 18) % 800} y={190} width={90} height={1.5} color={PALETTE.WHITE} />
            <Rect x={(score * 15) % 800} y={280} width={150} height={2} color={PALETTE.NEON_PINK} />
          </Group>
        )}

        <Rect
          x={0}
          y={0}
          width={GAME_CONFIG.VIRTUAL_WIDTH}
          height={GAME_CONFIG.VIRTUAL_HEIGHT}
          color={PALETTE.NEON_CYAN}
          opacity={powerJumpFlash}
        />

        <HUD score={score} coins={coins} health={health} hasShield={hasShield} />

        {gameState === GAME_CONFIG.STATE.MENU && (
          <Group>
            <RoundedRect
              x={180}
              y={160}
              width={440}
              height={110}
              r={12}
              color={PALETTE.HUD_SURFACE}
            />
            <Text
              x={225}
              y={210}
              text="DANGER DASH MOBILE"
              font={titleFont}
              color={PALETTE.NEON_CYAN}
            />
            <Text
              x={265}
              y={245}
              text="TAP ANYWHERE TO RUN"
              font={subFont}
              color={PALETTE.WHITE}
            />
          </Group>
        )}

        {gameState === GAME_CONFIG.STATE.GAMEOVER && (
          <Group>
            <RoundedRect
              x={200}
              y={150}
              width={400}
              height={130}
              r={12}
              color={PALETTE.HUD_SURFACE}
            />
            <Text
              x={310}
              y={200}
              text="GAME OVER"
              font={titleFont}
              color={PALETTE.NEON_PINK}
            />
            <Text
              x={280}
              y={235}
              text={`FINAL SCORE: ${score}`}
              font={subFont}
              color={PALETTE.WHITE}
            />
            <Text
              x={255}
              y={260}
              text="TAP TO TRY AGAIN"
              font={subFont}
              color={PALETTE.NEON_CYAN}
            />
          </Group>
        )}

      </Canvas>
    </View>
  );
}

const styles = StyleSheet.create({
  canvasContainer: {
    width: GAME_CONFIG.VIRTUAL_WIDTH,
    height: GAME_CONFIG.VIRTUAL_HEIGHT,
    backgroundColor: '#000000',
  },
  canvas: {
    flex: 1,
  },
});