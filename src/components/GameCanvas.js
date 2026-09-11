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
} from '@shopify/react-native-skia';
import { GAME_CONFIG } from '../constants/gameConfig';

const fontFamily = 'monospace';
const fontStyle = { fontFamily, fontSize: 16, fontWeight: 'bold' };
const font = matchFont(fontStyle);

const titleFontStyle = { fontFamily, fontSize: 26, fontWeight: 'bold' };
const titleFont = matchFont(titleFontStyle);

export default function GameCanvas({
  playerX,
  playerY,
  powerJumpFlash,
  platforms,
  score,
  coins,
  health,
  gameState,
}) {
  return (
    <View style={styles.canvasContainer}>
      <Canvas style={styles.canvas}>

        {/* Layer 1: Background Cyberpunk Gradient */}
        <Rect x={0} y={0} width={GAME_CONFIG.VIRTUAL_WIDTH} height={GAME_CONFIG.VIRTUAL_HEIGHT}>
          <LinearGradient
            start={vec(0, 0)}
            end={vec(0, GAME_CONFIG.VIRTUAL_HEIGHT)}
            colors={['#030114', '#170636', '#2e0d54']}
          />
        </Rect>

        {/* Layer 2: Water Hazard Base */}
        <Rect
          x={0}
          y={GAME_CONFIG.WATER_LEVEL_Y}
          width={GAME_CONFIG.VIRTUAL_WIDTH}
          height={GAME_CONFIG.VIRTUAL_HEIGHT - GAME_CONFIG.WATER_LEVEL_Y}
        >
          <LinearGradient
            start={vec(0, GAME_CONFIG.WATER_LEVEL_Y)}
            end={vec(0, GAME_CONFIG.VIRTUAL_HEIGHT)}
            colors={['#00d8ff', '#0040aa', '#020015']}
          />
        </Rect>

        {/* Layer 3: Platforms */}
        {platforms.map((plat) => (
          <Group key={plat.id}>
            <Rect x={plat.x} y={plat.y} width={plat.width} height={plat.height} color="#3b231c" />
            <Rect x={plat.x} y={plat.y} width={plat.width} height={12} color="#74c442" />
            <Rect x={plat.x + 20} y={plat.y + 35} width={30} height={4} color="#00ffcc" />
            {plat.width > 220 && (
              <Rect x={plat.x + 140} y={plat.y + 60} width={40} height={4} color="#00ffcc" />
            )}
          </Group>
        ))}

        {/* Layer 4: Player Sprite Placeholder */}
        <Rect
          x={playerX}
          y={playerY}
          width={GAME_CONFIG.PLAYER_WIDTH}
          height={GAME_CONFIG.PLAYER_HEIGHT}
          color="#A855F7"
        />

        {/* Layer 5: Power Jump Screen Flash */}
        <Rect
          x={0}
          y={0}
          width={GAME_CONFIG.VIRTUAL_WIDTH}
          height={GAME_CONFIG.VIRTUAL_HEIGHT}
          color="#00FFCC"
          opacity={powerJumpFlash}
        />

        {/* Layer 6: HUD */}
        <RoundedRect x={15} y={15} width={180} height={50} r={6} color="rgba(3, 1, 12, 0.75)" />
        <RoundedRect x={15} y={15} width={180} height={50} r={6} color="#00f0ff" style="stroke" strokeWidth={1.5} />

        <Text x={28} y={46} text={`HP: ${'❤️ '.repeat(health)}`} font={font} color="#FF0055" />

        <RoundedRect x={585} y={15} width={200} height={50} r={6} color="rgba(3, 1, 12, 0.75)" />
        <RoundedRect x={585} y={15} width={200} height={50} r={6} color="#00f0ff" style="stroke" strokeWidth={1.5} />

        <Text x={600} y={36} text={`SCORE: ${String(score).padStart(6, '0')}`} font={font} color="#FFFFFF" />
        <Text x={600} y={56} text={`COINS:  x ${coins}`} font={font} color="#FFD700" />

        {/* Menu Overlay */}
        {gameState === GAME_CONFIG.STATE.MENU && (
          <Group>
            <RoundedRect x={180} y={160} width={440} height={110} r={12} color="rgba(3, 1, 12, 0.88)" />
            <Text x={225} y={210} text="DANGER DASH MOBILE" font={titleFont} color="#00FFCC" />
            <Text x={265} y={245} text="TAP ANYWHERE TO RUN" font={font} color="#FFFFFF" />
          </Group>
        )}

        {/* Game Over Overlay */}
        {gameState === GAME_CONFIG.STATE.GAMEOVER && (
          <Group>
            <RoundedRect x={200} y={150} width={400} height={130} r={12} color="rgba(3, 1, 12, 0.9)" />
            <Text x={310} y={200} text="GAME OVER" font={titleFont} color="#FF0055" />
            <Text x={280} y={235} text={`FINAL SCORE: ${score}`} font={font} color="#FFFFFF" />
            <Text x={255} y={260} text="TAP TO TRY AGAIN" font={font} color="#00FFCC" />
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
  canvas: { flex: 1 },
});