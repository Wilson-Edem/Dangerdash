import React from 'react';

import {
  Group,
  Circle,
  BlurMask,
  Image,
  useImage,
} from '@shopify/react-native-skia';

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

  const spriteImage = useImage(
    theme.assets.playerSprite
  );

  const shieldAuraImage = useImage(
    theme.assets.shieldAura
  );

  const imgWidth =
    spriteImage?.width() || 0;

  const imgHeight =
    spriteImage?.height() || 0;

  const frameWidth =
    imgWidth > 0
      ? imgWidth / 4
      : GAME_CONFIG.PLAYER_WIDTH;

  const frameHeight =
    imgHeight > 0
      ? imgHeight
      : GAME_CONFIG.PLAYER_HEIGHT;

  const currentFrame =
    isGrounded
      ? animFrame % 4
      : 1;

  const auraColor =
    (activePower &&
      PALETTE.POWER_COLORS[
        activePower
      ]) ||
    (skinColors &&
      skinColors[0]) ||
    theme.colors.comboText;

  const offsetY =
    GAME_CONFIG.SPRITE_OFFSET_Y || 0;

  const renderY =
    playerY + offsetY;

  const centerX =
    playerX +
    GAME_CONFIG.PLAYER_WIDTH / 2;

  const centerY =
    renderY +
    GAME_CONFIG.PLAYER_HEIGHT / 2;

  return (
    <Group>
      {/* =========================
          POWER AURA
      ========================== */}

      {activePower && (
        <Circle
          cx={centerX}
          cy={centerY}
          r={
            GAME_CONFIG.PLAYER_HEIGHT *
            0.88
          }
          color={auraColor}
          opacity={0.38}
        >
          <BlurMask
            blur={18}
            style="solid"
          />
        </Circle>
      )}

      {/* =========================
          POWER JUMP FLASH
      ========================== */}

      {powerJumpFlash > 0 && (
        <Circle
          cx={centerX}
          cy={centerY}
          r={
            GAME_CONFIG.PLAYER_HEIGHT *
            0.78
          }
          color={
            theme.colors.hudBorder
          }
          opacity={Math.min(
            1,
            powerJumpFlash
          )}
        >
          <BlurMask
            blur={14}
            style="solid"
          />
        </Circle>
      )}

      {/* =========================
          PLAYER SPRITE
      ========================== */}

      {spriteImage && (
        <Image
          image={spriteImage}
          x={Math.round(playerX)}
          y={Math.round(
            gravityFlipped
              ? renderY +
                  GAME_CONFIG.PLAYER_HEIGHT
              : renderY
          )}
          width={
            GAME_CONFIG.PLAYER_WIDTH
          }
          height={
            gravityFlipped
              ? -GAME_CONFIG.PLAYER_HEIGHT
              : GAME_CONFIG.PLAYER_HEIGHT
          }

          /*
           * contain prevents the sprite from
           * being stretched unnaturally.
           */
          fit="contain"

          rect={{
            x:
              currentFrame *
              frameWidth,

            y: 0,

            width: frameWidth,

            height: frameHeight,
          }}
        />
      )}

      {/* =========================
          SHIELD
      ========================== */}

      {hasShield &&
        shieldAuraImage && (
          <Image
            image={shieldAuraImage}
            x={
              Math.round(playerX) - 18
            }
            y={
              Math.round(renderY) - 16
            }
            width={
              GAME_CONFIG.PLAYER_WIDTH +
              36
            }
            height={
              GAME_CONFIG.PLAYER_HEIGHT +
              32
            }
            fit="contain"
          />
        )}
    </Group>
  );
}