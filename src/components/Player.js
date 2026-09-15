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
 * ============================================================
 * PLAYER ANIMATION ASSETS
 * ============================================================
 *
 * 5 running frames
 * 5 jumping frames
 *
 * All images are transparent PNG files.
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

  /*
   * ============================================================
   * LOAD SHIELD
   * ============================================================
   */

  const shieldAuraImage = useImage(
    theme.assets.shieldAura
  );

  /*
   * ============================================================
   * LOAD RUNNING FRAMES
   * ============================================================
   */

  const run01 = useImage(RUN_01);
  const run02 = useImage(RUN_02);
  const run03 = useImage(RUN_03);
  const run04 = useImage(RUN_04);
  const run05 = useImage(RUN_05);

  /*
   * ============================================================
   * LOAD JUMPING FRAMES
   * ============================================================
   */

  const jump01 = useImage(JUMP_01);
  const jump02 = useImage(JUMP_02);
  const jump03 = useImage(JUMP_03);
  const jump04 = useImage(JUMP_04);
  const jump05 = useImage(JUMP_05);

  /*
   * ============================================================
   * JUMP ANIMATION STATE
   * ============================================================
   *
   * Every time the player leaves the platform, the jump
   * animation starts again from frame 1.
   */

  const wasGroundedRef =
    useRef(isGrounded);

  const jumpStartFrameRef =
    useRef(animFrame);

  useEffect(() => {
    /*
     * Player just left the platform.
     */
    if (
      !isGrounded &&
      wasGroundedRef.current
    ) {
      jumpStartFrameRef.current =
        animFrame;
    }

    /*
     * Player just landed.
     */
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

  /*
   * ============================================================
   * FRAME ARRAYS
   * ============================================================
   */

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

  /*
   * ============================================================
   * RUN ANIMATION
   * ============================================================
   *
   * animFrame is advanced by the game loop.
   *
   * Five frames continuously loop:
   *
   * 1 -> 2 -> 3 -> 4 -> 5 -> 1...
   */

  const runFrameIndex =
    animFrame % 5;

  /*
   * ============================================================
   * JUMP ANIMATION
   * ============================================================
   *
   * The jump animation progresses rather than looping:
   *
   * jump_01
   *      ↓
   * jump_02
   *      ↓
   * jump_03
   *      ↓
   * jump_04
   *      ↓
   * jump_05
   *
   * Each frame stays visible for approximately two animation
   * ticks, giving a fast but readable pixel-art animation.
   */

  const jumpTick = Math.max(
    0,
    animFrame -
      jumpStartFrameRef.current
  );

  const jumpFrameIndex =
    Math.min(
      4,
      Math.floor(
        jumpTick / 2
      )
    );

  /*
   * ============================================================
   * SELECT CURRENT IMAGE
   * ============================================================
   */

  const currentImage =
    isGrounded
      ? runFrames[
          runFrameIndex
        ]
      : jumpFrames[
          jumpFrameIndex
        ];

  /*
   * ============================================================
   * SKIN / POWER COLORS
   * ============================================================
   */

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

  /*
   * ============================================================
   * PLAYER POSITION
   * ============================================================
   */

  const offsetY =
    GAME_CONFIG.SPRITE_OFFSET_Y ||
    0;

  const renderY =
    playerY + offsetY;

  const centerX =
    playerX +
    GAME_CONFIG.PLAYER_WIDTH / 2;

  const centerY =
    renderY +
    GAME_CONFIG.PLAYER_HEIGHT / 2;

  /*
   * ============================================================
   * RENDER
   * ============================================================
   */

  return (
    <Group
      key={`player-theme-${themeKey}`}
    >
      {/* ======================================================
          EQUIPPED SKIN GLOW
          ====================================================== */}

      <Circle
        cx={centerX}
        cy={centerY}
        r={
          GAME_CONFIG.PLAYER_HEIGHT *
          0.58
        }
        color={skinColor}
        opacity={0.16}
      >
        <BlurMask
          blur={10}
          style="solid"
        />
      </Circle>

      {/* ======================================================
          ACTIVE POWER AURA
          ====================================================== */}

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

      {/* ======================================================
          POWER JUMP FLASH
          ====================================================== */}

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

      {/* ======================================================
          PLAYER ANIMATION
          ====================================================== */}

      {currentImage && (
        <Image
          image={currentImage}

          x={Math.round(playerX)}

          /*
           * Normal gravity:
           * draw from top to bottom.
           *
           * Gravity flip:
           * draw the same sprite vertically inverted.
           */
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

          fit="contain"
        />
      )}

      {/* ======================================================
          SHIELD
          ====================================================== */}

      {hasShield &&
        shieldAuraImage && (
          <Image
            image={
              shieldAuraImage
            }

            x={
              Math.round(playerX) -
              18
            }

            y={
              Math.round(renderY) -
              16
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