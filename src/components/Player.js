import React from 'react';
import { Group, Circle, BlurMask, Image, useImage } from '@shopify/react-native-skia';
import { useTheme } from '../context/ThemeContext';
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
  const { theme } = useTheme();
  const spriteImage = useImage(theme.assets.playerSprite);
  const shieldAuraImage = useImage(theme.assets.shieldAura);

  const imgWidth = spriteImage?.width() ?? 0;
  const imgHeight = spriteImage?.height() ?? 0;
  const frameWidth = imgWidth > 0 ? imgWidth / 4 : GAME_CONFIG.PLAYER_WIDTH;
  const frameHeight = imgHeight > 0 ? imgHeight : GAME_CONFIG.PLAYER_HEIGHT;

  const currentFrame = isGrounded ? animFrame % 4 : 1;

  const auraColor =
    (activePower && PALETTE.POWER_COLORS[activePower]) ||
    (skinColors && skinColors[0]) ||
    theme.colors.comboText;

  // Sprite offset for platform alignment
  const OFFSET_Y = GAME_CONFIG.SPRITE_OFFSET_Y || 0;
  const renderY = playerY + OFFSET_Y;

  const centerX = playerX + GAME_CONFIG.PLAYER_WIDTH / 2;
  const centerY = renderY + GAME_CONFIG.PLAYER_HEIGHT / 2;

  return (
    <Group>
      {/* Active power aura */}
      {activePower && (
        <Circle
          cx={centerX}
          cy={centerY}
          r={GAME_CONFIG.PLAYER_HEIGHT * 0.95}
          color={auraColor}
          opacity={0.5}
        >
          <BlurMask blur={20} style="solid" />
        </Circle>
      )}

      {/* Power jump flash */}
      {powerJumpFlash > 0 && (
        <Circle
          cx={centerX}
          cy={centerY}
          r={GAME_CONFIG.PLAYER_HEIGHT * 0.85}
          color={theme.colors.hudBorder}
          opacity={powerJumpFlash}
        >
          <BlurMask blur={15} style="solid" />
        </Circle>
      )}

      {/* Player sprite — sliced from horizontal spritesheet */}
      {spriteImage && (
        <Image
          image={spriteImage}
          x={Math.round(playerX)}
          y={Math.round(gravityFlipped ? renderY + GAME_CONFIG.PLAYER_HEIGHT : renderY)}
          width={GAME_CONFIG.PLAYER_WIDTH}
          height={gravityFlipped ? -GAME_CONFIG.PLAYER_HEIGHT : GAME_CONFIG.PLAYER_HEIGHT}
          fit="fill"
          rect={{
            x: currentFrame * frameWidth,
            y: 0,
            width: frameWidth,
            height: frameHeight,
          }}
        />
      )}

      {/* Shield aura */}
      {hasShield && shieldAuraImage && (
        <Image
          image={shieldAuraImage}
          x={Math.round(playerX) - 20}
          y={Math.round(renderY) - 18}
          width={GAME_CONFIG.PLAYER_WIDTH + 40}
          height={GAME_CONFIG.PLAYER_HEIGHT + 36}
          fit="contain"
        />
      )}
    </Group>
  );
}