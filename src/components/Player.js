import React, { useEffect, useRef } from 'react';

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

/*
 * ========================================
 * PLAYER ANIMATION ASSETS
 * ========================================
 *
 * The previous Player implementation used
 * the old player_spritesheet.png.
 *
 * That spritesheet is NOT the animation set.
 *
 * DangerDash now uses the supplied individual
 * animation images:
 *
 * RUN:
 *   run_01
 *   run_02
 *   run_03
 *   run_04
 *   run_05
 *
 * AIRBORNE:
 *   jump_01
 *   jump_02
 *   jump_03
 *   jump_04
 *   jump_05
 *
 * The jump set is also used for falling because
 * there is no separate falling asset set.
 */

const RUN_01 = require(
  '../../assets/images/player/animation/run/run_01.png'
);

const RUN_02 = require(
  '../../assets/images/player/animation/run/run_02.png'
);

const RUN_03 = require(
  '../../assets/images/player/animation/run/run_03.png'
);

const RUN_04 = require(
  '../../assets/images/player/animation/run/run_04.png'
);

const RUN_05 = require(
  '../../assets/images/player/animation/run/run_05.png'
);

const JUMP_01 = require(
  '../../assets/images/player/animation/jump/jump_01.png'
);

const JUMP_02 = require(
  '../../assets/images/player/animation/jump/jump_02.png'
);

const JUMP_03 = require(
  '../../assets/images/player/animation/jump/jump_03.png'
);

const JUMP_04 = require(
  '../../assets/images/player/animation/jump/jump_04.png'
);

const JUMP_05 = require(
  '../../assets/images/player/animation/jump/jump_05.png'
);

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

  // ========================================
  // LOAD PLAYER ANIMATION
  // ========================================

  const run01 = useImage(RUN_01);
  const run02 = useImage(RUN_02);
  const run03 = useImage(RUN_03);
  const run04 = useImage(RUN_04);
  const run05 = useImage(RUN_05);

  const jump01 = useImage(JUMP_01);
  const jump02 = useImage(JUMP_02);
  const jump03 = useImage(JUMP_03);
  const jump04 = useImage(JUMP_04);
  const jump05 = useImage(JUMP_05);

  const shieldAuraImage = useImage(
    theme.assets.shieldAura
  );

  const runFrames = [
    run01,
    run02,
    run03,
    run04,
    run05,
  ];

  const jumpFrames = [
    jump01,
    jump02,
    jump03,
    jump04,
    jump05,
  ];

  // ========================================
  // JUMP ANIMATION TRACKING
  // ========================================

  const wasGroundedRef =
    useRef(isGrounded);

  const jumpStartFrameRef =
    useRef(animFrame);

  const previousYRef =
    useRef(playerY);

  /*
   * Detect the exact frame on which the
   * player leaves or returns to a platform.
   *
   * This resets the airborne animation so
   * every jump starts from jump_01.
   */
  useEffect(() => {
    if (
      !isGrounded &&
      wasGroundedRef.current
    ) {
      jumpStartFrameRef.current =
        animFrame;
    }

    if (
      isGrounded &&
      !wasGroundedRef.current
    ) {
      jumpStartFrameRef.current =
        animFrame;
    }

    wasGroundedRef.current =
      isGrounded;
  }, [
    isGrounded,
    animFrame,
  ]);

  // ========================================
  // DETECT RISING / FALLING
  // ========================================

  /*
   * We determine the movement direction
   * from the actual physics Y position.
   *
   * Normal gravity:
   *
   *   Y decreasing = rising
   *   Y increasing = falling
   *
   * Gravity flip:
   *
   *   Y increasing = rising
   *   Y decreasing = falling
   *
   * This means the animation follows the
   * actual player movement instead of simply
   * assuming every airborne frame is a jump.
   */

  const previousY =
    previousYRef.current;

  const yDelta =
    playerY - previousY;

  previousYRef.current =
    playerY;

  let movementPhase =
    'rising';

  if (
    Math.abs(yDelta) < 0.01
  ) {
    /*
     * When movement is extremely small,
     * keep the current airborne sequence
     * moving rather than switching randomly.
     */
    movementPhase = 'rising';
  } else if (!gravityFlipped) {
    movementPhase =
      yDelta > 0
        ? 'falling'
        : 'rising';
  } else {
    movementPhase =
      yDelta < 0
        ? 'falling'
        : 'rising';
  }

  // ========================================
  // RUNNING ANIMATION
  // ========================================

  /*
   * The game loop already increments
   * animFrame.
   *
   * Five frames gives us a complete running
   * cycle.
   */
  const runFrameIndex =
    Math.floor(animFrame) %
    runFrames.length;

  // ========================================
  // AIRBORNE ANIMATION
  // ========================================

  const jumpTick =
    Math.max(
      0,
      Math.floor(animFrame) -
        Math.floor(
          jumpStartFrameRef.current
        )
    );

  let jumpFrameIndex;

  /*
   * ASCENDING
   *
   * 01 -> 02 -> 03
   */
  if (
    movementPhase === 'rising'
  ) {
    jumpFrameIndex =
      Math.min(
        2,
        Math.floor(
          jumpTick / 3
        )
      );
  }

  /*
   * FALLING
   *
   * 04 -> 05
   *
   * We intentionally skip back to
   * jump_01 while descending.
   */
  else {
    jumpFrameIndex =
      Math.min(
        4,
        3 +
          Math.floor(
            jumpTick / 3
          )
      );
  }

  /*
   * Grounded:
   *     RUN animation
   *
   * Airborne:
   *     JUMP/FALL animation
   */
  const currentImage =
    isGrounded
      ? runFrames[
          runFrameIndex
        ]
      : jumpFrames[
          jumpFrameIndex
        ];

  // ========================================
  // COLORS
  // ========================================

  const skinColor =
    (skinColors &&
      skinColors[0]) ||
    theme.colors.hudBorder;

  const auraColor =
    (activePower &&
      PALETTE.POWER_COLORS[
        activePower
      ]) ||
    skinColor ||
    theme.colors.comboText;

  // ========================================
  // PLAYER RENDER SIZE
  // ========================================

  /*
   * IMPORTANT:
   *
   * Do NOT use the old PLAYER_RENDER_SCALE
   * here.
   *
   * The supplied animation implementation
   * uses the same 50x66 player box as the
   * physics hitbox.
   *
   * This keeps the visual player and physics
   * player synchronized.
   */

  const renderWidth =
    GAME_CONFIG.PLAYER_WIDTH;

  const renderHeight =
    GAME_CONFIG.PLAYER_HEIGHT;

  /*
   * The supplied animation implementation
   * uses SPRITE_OFFSET_Y = 10.
   *
   * This compensates for transparent padding
   * inside the animation PNGs.
   */
  const offsetY =
    GAME_CONFIG.SPRITE_OFFSET_Y ||
    0;

  const renderX =
    playerX;

  const renderY =
    playerY + offsetY;

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

      {/* =================================
          PLAYER BASE GLOW
      ================================== */}

      <Circle
        cx={centerX}
        cy={centerY}
        r={
          renderHeight * 0.58
        }
        color={skinColor}
        opacity={0.16}
      >
        <BlurMask
          blur={10}
          style="solid"
        />
      </Circle>

      {/* =================================
          ACTIVE POWER AURA
      ================================== */}

      {activePower && (
        <Circle
          cx={centerX}
          cy={centerY}
          r={
            renderHeight * 0.88
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

      {/* =================================
          POWER JUMP FLASH
      ================================== */}

      {powerJumpFlash > 0 && (
        <Circle
          cx={centerX}
          cy={centerY}
          r={
            renderHeight * 0.78
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

      {/* =================================
          RUN / JUMP / FALL PLAYER
      ================================== */}

      {currentImage && (
        <Image
          image={currentImage}

          x={Math.round(
            renderX
          )}

          y={Math.round(
            gravityFlipped
              ? renderY +
                renderHeight
              : renderY
          )}

          width={
            renderWidth
          }

          height={
            gravityFlipped
              ? -renderHeight
              : renderHeight
          }

          /*
           * The supplied animation PNGs
           * contain transparent padding.
           *
           * contain preserves their original
           * proportions.
           */
          fit="contain"
        />
      )}

      {/* =================================
          SHIELD
      ================================== */}

      {hasShield &&
        shieldAuraImage && (
          <Image
            image={
              shieldAuraImage
            }

            x={
              Math.round(
                renderX
              ) - 18
            }

            y={
              Math.round(
                renderY
              ) - 16
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
