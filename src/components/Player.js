import React, { useMemo } from 'react';
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

const RUN_SOURCES = [
  require('../../assets/images/player/animation/run/run_01.png'),
  require('../../assets/images/player/animation/run/run_02.png'),
  require('../../assets/images/player/animation/run/run_03.png'),
  require('../../assets/images/player/animation/run/run_04.png'),
  require('../../assets/images/player/animation/run/run_05.png'),
];

const JUMP_SOURCES = [
  require('../../assets/images/player/animation/jump/jump_01.png'),
  require('../../assets/images/player/animation/jump/jump_02.png'),
  require('../../assets/images/player/animation/jump/jump_03.png'),
  require('../../assets/images/player/animation/jump/jump_04.png'),
  require('../../assets/images/player/animation/jump/jump_05.png'),
];

/*
 * The animation PNGs contain different amounts of transparent
 * padding. These anchors compensate for that padding so the
 * visible character stays centered and planted on the same
 * 50x66 gameplay hitbox instead of appearing to vibrate.
 */
const FRAME_ANCHORS = [
  // run_01 ... run_05
  { x: 0.73, y: 9.221 },
  { x: 0.112, y: 10.191 },
  { x: 2.303, y: 7.926 },
  { x: 0.393, y: 13.588 },
  { x: -0.169, y: 6.147 },

  // jump_01 ... jump_05
  { x: -0.281, y: 8.25 },
  { x: 0.169, y: 5.985 },
  { x: -0.169, y: 6.471 },
  { x: 2.978, y: 11.324 },
  { x: 0.225, y: 7.118 },
];

function useAnimationImages(sources) {
  return sources.map((source) => useImage(source));
}

export default function Player({
  playerX,
  playerY,
  playerVelocityY = 0,
  airborneFrame = 0,
  powerJumpFlash,
  isGrounded,
  hasShield,
  animFrame,
  activePower,
  gravityFlipped,
  skinColors,
}) {
  const { theme } = useTheme();

  const runFrames = useAnimationImages(RUN_SOURCES);
  const jumpFrames = useAnimationImages(JUMP_SOURCES);

  const shieldAuraImage = useImage(
    theme.assets.shieldAura
  );

  /*
   * The physics loop owns the vertical movement state.
   *
   * Normal gravity:
   *   velocity < 0 = rising
   *   velocity > 0 = falling
   *
   * Gravity flip reverses that relationship.
   */
  const verticalDirection = useMemo(() => {
    const gravitySign = gravityFlipped ? -1 : 1;
    const signedVelocity =
      playerVelocityY * gravitySign;

    if (signedVelocity < -0.05) {
      return 'rising';
    }

    if (signedVelocity > 0.05) {
      return 'falling';
    }

    return 'apex';
  }, [
    playerVelocityY,
    gravityFlipped,
  ]);

  /*
   * Running:
   *   run_01 -> run_02 -> run_03 -> run_04 -> run_05
   */
  const runFrameIndex =
    Math.floor(animFrame) %
    RUN_SOURCES.length;

  /*
   * Jumping:
   *   jump_01 -> jump_02 -> jump_03
   *
   * Falling:
   *   jump_04 -> jump_05
   */
  let jumpFrameIndex = 2;

  if (verticalDirection === 'rising') {
    jumpFrameIndex = Math.min(
      2,
      Math.floor(
        Math.max(0, airborneFrame) / 4
      )
    );
  } else if (
    verticalDirection === 'falling'
  ) {
    const fallTick = Math.max(
      0,
      Math.floor(airborneFrame) - 8
    );

    jumpFrameIndex =
      3 +
      Math.min(
        1,
        Math.floor(fallTick / 4)
      );
  }

  const currentImage = isGrounded
    ? runFrames[runFrameIndex]
    : jumpFrames[jumpFrameIndex];

  const imageIndex = isGrounded
    ? runFrameIndex
    : RUN_SOURCES.length +
      jumpFrameIndex;

  const anchor =
    FRAME_ANCHORS[imageIndex];

  const renderWidth =
    GAME_CONFIG.PLAYER_WIDTH;

  const renderHeight =
    GAME_CONFIG.PLAYER_HEIGHT;

  /*
   * playerX/playerY remain the actual physics
   * hitbox coordinates.
   *
   * These offsets only compensate for transparent
   * pixels inside the animation PNG.
   */
  const imageX =
    playerX + anchor.x;

  const imageY =
    playerY + anchor.y;

  const centerX =
    playerX +
    renderWidth / 2;

  const centerY =
    playerY +
    renderHeight / 2;

  const skinColor =
    (skinColors && skinColors[0]) ||
    theme.colors.hudBorder;

  const auraColor =
    (activePower &&
      PALETTE.POWER_COLORS[
        activePower
      ]) ||
    skinColor ||
    theme.colors.comboText;

  /*
   * Flip only the player sprite.
   *
   * Do not use a negative Image height.
   */
  const playerTransform =
    gravityFlipped
      ? [{ scaleY: -1 }]
      : undefined;

  return (
    <Group>
      {/* PLAYER BASE GLOW */}
      <Circle
        cx={centerX}
        cy={centerY}
        r={renderHeight * 0.58}
        color={skinColor}
        opacity={0.16}
      >
        <BlurMask
          blur={10}
          style="solid"
        />
      </Circle>

      {/* ACTIVE POWER AURA */}
      {activePower && (
        <Circle
          cx={centerX}
          cy={centerY}
          r={renderHeight * 0.88}
          color={auraColor}
          opacity={0.38}
        >
          <BlurMask
            blur={18}
            style="solid"
          />
        </Circle>
      )}

      {/* POWER JUMP FLASH */}
      {powerJumpFlash > 0 && (
        <Circle
          cx={centerX}
          cy={centerY}
          r={renderHeight * 0.78}
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

      {/* RUN / JUMP / FALL SPRITE */}
      {currentImage && (
        <Group
          origin={{
            x: centerX,
            y: centerY,
          }}
          transform={playerTransform}
        >
          <Image
            image={currentImage}
            x={Math.round(imageX)}
            y={Math.round(imageY)}
            width={renderWidth}
            height={renderHeight}
            fit="fill"
          />
        </Group>
      )}

      {/* SHIELD */}
      {hasShield &&
        shieldAuraImage && (
          <Image
            image={shieldAuraImage}
            x={
              Math.round(playerX) - 18
            }
            y={
              Math.round(playerY) - 16
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
