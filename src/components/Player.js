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
  const { theme, themeKey } = useTheme();

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

  /*
   * ========================================
   * VISIBLE PLAYER SIZE
   * ========================================
   *
   * Physics remains 50x66.
   *
   * The visible sprite is 15% smaller:
   *
   * 50 x 0.85 = 42.5
   * 66 x 0.85 = 56.1
   *
   * We then bottom-align the sprite against
   * the physics hitbox.
   *
   * This means the visible feet sit directly
   * on the platform instead of extending below it.
   */

  const renderScale =
    GAME_CONFIG.PLAYER_RENDER_SCALE || 0.85;

  const renderWidth =
    GAME_CONFIG.PLAYER_WIDTH *
    renderScale;

  const renderHeight =
    GAME_CONFIG.PLAYER_HEIGHT *
    renderScale;

  /*
   * Difference between the physics height
   * and visible sprite height.
   *
   * This keeps the bottom of the sprite
   * aligned with the physics feet.
   */
  const bottomAlignmentOffset =
    GAME_CONFIG.PLAYER_HEIGHT -
    renderHeight;

  /*
   * Additional configurable visual offset.
   *
   * Currently 0.
   */
  const offsetY =
    GAME_CONFIG.SPRITE_OFFSET_Y || 0;

  const renderY =
    playerY +
    bottomAlignmentOffset +
    offsetY;

  /*
   * Center the smaller sprite inside
   * the original physics hitbox.
   */
  const renderX =
    playerX +
    (
      GAME_CONFIG.PLAYER_WIDTH -
      renderWidth
    ) / 2;

  const centerX =
    renderX +
    renderWidth / 2;

  const centerY =
    renderY +
    renderHeight / 2;

  return (
    <Group
      key={`player-theme-${themeKey}`}
    >
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

          x={Math.round(renderX)}

          y={Math.round(
            gravityFlipped
              ? renderY +
                renderHeight
              : renderY
          )}

          width={renderWidth}

          height={
            gravityFlipped
              ? -renderHeight
              : renderHeight
          }

          /*
           * contain keeps the sprite
           * aspect ratio correct.
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
              Math.round(renderX) - 18
            }

            y={
              Math.round(renderY) - 16
            }

            width={
              renderWidth + 36
            }

            height={
              renderHeight + 32
            }

            fit="contain"
          />
        )}
    </Group>
  );
}
