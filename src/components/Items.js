import React from 'react';

import {
  Group,
  Circle,
  Image,
  useImage,
  BlurMask,
} from '@shopify/react-native-skia';

import { useTheme } from '../context/ThemeContext';
import { THEMES } from '../constants/themes';
import { GAME_CONFIG } from '../constants/gameConfig';
import { PALETTE } from '../constants/palette';

export default function Items({
  items,
}) {
  const {
    theme,
    themeKey,
  } = useTheme();

  /*
   * Keep both theme versions mounted.
   * This prevents Skia from retaining the previous
   * theme's image after a theme switch.
   */

  const cyberCoinSprite =
    useImage(
      THEMES.cyberpunk.assets
        .coinSprite
    );

  const woodenCoinSprite =
    useImage(
      THEMES.wooden.assets
        .coinSprite
    );

  const cyberSpikeSprite =
    useImage(
      THEMES.cyberpunk.assets
        .spikeHazard
    );

  const woodenSpikeSprite =
    useImage(
      THEMES.wooden.assets
        .spikeHazard
    );

  const cyberBoostSprite =
    useImage(
      THEMES.cyberpunk.assets
        .boostPad
    );

  const woodenBoostSprite =
    useImage(
      THEMES.wooden.assets
        .boostPad
    );

  const cyberShieldSprite =
    useImage(
      THEMES.cyberpunk.assets
        .shieldAura
    );

  const woodenShieldSprite =
    useImage(
      THEMES.wooden.assets
        .shieldAura
    );

  const coinSprite =
    themeKey === 'wooden'
      ? woodenCoinSprite
      : cyberCoinSprite;

  const spikeSprite =
    themeKey === 'wooden'
      ? woodenSpikeSprite
      : cyberSpikeSprite;

  const boostSprite =
    themeKey === 'wooden'
      ? woodenBoostSprite
      : cyberBoostSprite;

  const shieldSprite =
    themeKey === 'wooden'
      ? woodenShieldSprite
      : cyberShieldSprite;

  return (
    <Group
      key={`items-theme-${themeKey}`}
    >
      {items.map(
        (item) => {
          // =========================
          // COIN
          // =========================

          if (
            item.type ===
            GAME_CONFIG.ITEM_TYPES.COIN
          ) {
            return coinSprite ? (
              <Image
                key={`${themeKey}-${item.id}`}
                image={
                  coinSprite
                }
                x={item.x}
                y={item.y}
                width={
                  item.width
                }
                height={
                  item.height
                }
                fit="contain"
              />
            ) : null;
          }

          // =========================
          // SPIKE
          // =========================

          if (
            item.type ===
            GAME_CONFIG.ITEM_TYPES.SPIKE
          ) {
            return spikeSprite ? (
              <Image
                key={`${themeKey}-${item.id}`}
                image={
                  spikeSprite
                }
                x={item.x}
                y={item.y}
                width={
                  item.width
                }
                height={
                  item.height
                }
                fit="fill"
              />
            ) : null;
          }

          // =========================
          // BOOST PAD
          // =========================

          if (
            item.type ===
            GAME_CONFIG.ITEM_TYPES
              .BOOST_PAD
          ) {
            return boostSprite ? (
              <Image
                key={`${themeKey}-${item.id}`}
                image={
                  boostSprite
                }
                x={item.x}
                y={item.y}
                width={
                  item.width
                }
                height={
                  item.height
                }
                fit="fill"
              />
            ) : null;
          }

          // =========================
          // POWER ORB
          // =========================

          if (
            item.type ===
            GAME_CONFIG.ITEM_TYPES
              .POWER_ORB
          ) {
            const isShield =
              item.powerType ===
              GAME_CONFIG
                .POWER_TYPES
                .SHIELD;

            const cx =
              item.x +
              item.width / 2;

            const cy =
              item.y +
              item.height / 2;

            const r =
              item.width / 2;

            if (
              isShield &&
              shieldSprite
            ) {
              return (
                <Image
                  key={`${themeKey}-${item.id}`}
                  image={
                    shieldSprite
                  }
                  x={item.x}
                  y={item.y}
                  width={
                    item.width
                  }
                  height={
                    item.height
                  }
                  fit="contain"
                />
              );
            }

            const color =
              PALETTE
                .POWER_COLORS[
                item.powerType
              ] ||
              theme.colors
                .hudBorder;

            return (
              <Group
                key={`${themeKey}-${item.id}`}
              >
                <Circle
                  cx={cx}
                  cy={cy}
                  r={r + 8}
                  color={color}
                  opacity={0.4}
                >
                  <BlurMask
                    blur={10}
                    style="solid"
                  />
                </Circle>

                <Circle
                  cx={cx}
                  cy={cy}
                  r={r}
                  color={color}
                />

                <Circle
                  cx={
                    cx -
                    r * 0.3
                  }
                  cy={
                    cy -
                    r * 0.3
                  }
                  r={
                    r * 0.4
                  }
                  color="#FFFFFF"
                  opacity={0.9}
                />
              </Group>
            );
          }

          return null;
        }
      )}
    </Group>
  );
}