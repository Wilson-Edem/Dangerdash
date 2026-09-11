import React from 'react';
import { Group, Rect, Circle, BlurMask, Image, useImage } from '@shopify/react-native-skia';
import { GAME_CONFIG } from '../constants/gameConfig';
import { PALETTE } from '../constants/palette';

export default function Player({ playerX, playerY, powerJumpFlash, isGrounded, hasShield, animFrame }) {
  const spriteImage = useImage(require('../../assets/images/player/player_spritesheet.png'));
  const shieldAuraImage = useImage(require('../../assets/images/items/shield_aura.png'));

  const frameWidth = GAME_CONFIG.PLAYER_WIDTH;
  const frameHeight = GAME_CONFIG.PLAYER_HEIGHT;
  const currentFrame = isGrounded ? animFrame % 4 : 1;

  return (
    <Group>
      {powerJumpFlash > 0 && (
        <Circle
          cx={playerX + frameWidth / 2}
          cy={playerY + frameHeight / 2}
          r={frameHeight * 0.85}
          color={PALETTE.NEON_CYAN}
          opacity={powerJumpFlash}
        >
          <BlurMask blur={15} style="solid" />
        </Circle>
      )}

      {hasShield && (
        <Group>
          {shieldAuraImage ? (
            <Image
              image={shieldAuraImage}
              x={playerX - 12}
              y={playerY - 10}
              width={frameWidth + 24}
              height={frameHeight + 20}
              fit="contain"
            />
          ) : (
            <Circle
              cx={playerX + frameWidth / 2}
              cy={playerY + frameHeight / 2}
              r={frameHeight * 0.7}
              color={PALETTE.NEON_BLUE}
              opacity={0.45}
            />
          )}
        </Group>
      )}

      {spriteImage ? (
        <Image
          image={spriteImage}
          x={playerX}
          y={playerY}
          width={frameWidth}
          height={frameHeight}
          fit="fill"
          rect={{
            x: currentFrame * frameWidth,
            y: 0,
            width: frameWidth,
            height: frameHeight,
          }}
        />
      ) : (
        <Group>
          <Rect
            x={playerX}
            y={playerY}
            width={frameWidth}
            height={frameHeight}
            color={PALETTE.NEON_PURPLE}
          />
          <Rect
            x={playerX + 18}
            y={playerY + 8}
            width={16}
            height={8}
            color={PALETTE.NEON_CYAN}
          />
          <Rect
            x={playerX + 4}
            y={playerY + frameHeight - 6}
            width={10}
            height={6}
            color={PALETTE.NEON_PINK}
          />
          <Rect
            x={playerX + 20}
            y={playerY + frameHeight - 6}
            width={10}
            height={6}
            color={PALETTE.NEON_PINK}
          />
        </Group>
      )}
    </Group>
  );
}