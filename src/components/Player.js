import React from 'react';
import { Group, Circle, BlurMask, Image, useImage } from '@shopify/react-native-skia';
import { GAME_CONFIG } from '../constants/gameConfig';
import { PALETTE } from '../constants/palette';

export default function Player({
  playerX,
  playerY,
  powerJumpFlash,
  isGrounded,
  hasShield,
  animFrame,
  activePower,
  gravityFlipped,
  skinColors,
}) {
  const spriteImage = useImage(require('../../assets/images/player/player_spritesheet.png'));
  const shieldAuraImage = useImage(require('../../assets/images/items/shield_aura.png'));

  const imgWidth = spriteImage?.width() ?? 0;
  const imgHeight = spriteImage?.height() ?? 0;
  const frameWidth = imgWidth > 0 ? imgWidth / 4 : GAME_CONFIG.PLAYER_WIDTH;
  const frameHeight = imgHeight > 0 ? imgHeight : GAME_CONFIG.PLAYER_HEIGHT;

  const currentFrame = isGrounded ? animFrame % 4 : 1;
  const auraColor = activePower ? PALETTE.POWER_COLORS[activePower] : null;
  const centerX = playerX + GAME_CONFIG.PLAYER_WIDTH / 2;
  const centerY = playerY + GAME_CONFIG.PLAYER_HEIGHT / 2;

  return (
    <Group>
      {auraColor && (
        <Circle cx={centerX} cy={centerY} r={GAME_CONFIG.PLAYER_HEIGHT * 0.95} color={auraColor} opacity={0.5}>
          <BlurMask blur={20} style="solid" />
        </Circle>
      )}

      {powerJumpFlash > 0 && (
        <Circle cx={centerX} cy={centerY} r={GAME_CONFIG.PLAYER_HEIGHT * 0.85} color={PALETTE.NEON_CYAN} opacity={powerJumpFlash}>
          <BlurMask blur={15} style="solid" />
        </Circle>
      )}

      {spriteImage && (
        <Image
          image={spriteImage}
          x={playerX}
          y={gravityFlipped ? playerY + GAME_CONFIG.PLAYER_HEIGHT : playerY}
          width={GAME_CONFIG.PLAYER_WIDTH}
          height={gravityFlipped ? -GAME_CONFIG.PLAYER_HEIGHT : GAME_CONFIG.PLAYER_HEIGHT}
          fit="fill"
          rect={{ x: currentFrame * frameWidth, y: 0, width: frameWidth, height: frameHeight }}
        />
      )}

      {hasShield && shieldAuraImage && (
        <Image
          image={shieldAuraImage}
          x={playerX - 20}
          y={playerY - 18}
          width={GAME_CONFIG.PLAYER_WIDTH + 40}
          height={GAME_CONFIG.PLAYER_HEIGHT + 36}
          fit="contain"
        />
      )}
    </Group>
  );
}