import React from 'react';
import {
  Group,
  Rect,
  useImage,
  ImageShader,
  LinearGradient,
  vec,
} from '@shopify/react-native-skia';
import { useTheme } from '../context/ThemeContext';
import { THEMES } from '../constants/themes';
import { GAME_CONFIG } from '../constants/gameConfig';

const CYBER_TILE = 64;
const WOOD_TILE_W = 127;
const WOOD_TILE_H = 46;

export default function Platform({ platforms }) {
  const { theme, themeKey } = useTheme();

  const cyberTile = useImage(
    THEMES.cyberpunk.assets.platformTileset
  );

  const woodenTile = useImage(
    THEMES.wooden.assets.platformTileset
  );

  const platformTile =
    themeKey === 'wooden' ? woodenTile : cyberTile;

  const tileW =
    themeKey === 'wooden' ? WOOD_TILE_W : CYBER_TILE;

  const tileH =
    themeKey === 'wooden' ? WOOD_TILE_H : CYBER_TILE;

  return (
    <Group key={`platform-theme-${themeKey}`}>
      {platforms.map((plat) => {
        /*
         * Level 1-2 platforms are always HIGH.
         * From Level 3, useGameLoop assigns HIGH/MEDIUM/LOW.
         *
         * The tier changes the visual treatment slightly so the
         * vertical variation is easy to read during fast gameplay.
         */
        const tier = plat.heightTier || 'HIGH';

        const topEdgeHeight =
          tier === 'LOW'
            ? 12
            : tier === 'MEDIUM'
              ? 10
              : 8;

        const underGlowHeight =
          tier === 'LOW'
            ? 5
            : tier === 'MEDIUM'
              ? 3
              : 0;

        const visibleHeight =
          Math.max(
            0,
            Math.min(
              plat.height,
              GAME_CONFIG.WATER_LEVEL_Y -
                plat.y
            )
          );

        if (visibleHeight <= 0) {
          return null;
        }

        return (
          <Group key={`${themeKey}-${plat.id}`}>
            <Rect
              x={plat.x}
              y={plat.y}
              width={plat.width}
              height={visibleHeight}
              color={theme.colors.platformBase}
            />

            {platformTile && (
              <Rect
                x={plat.x}
                y={plat.y}
                width={plat.width}
                height={visibleHeight}
              >
                <ImageShader
                  image={platformTile}
                  fit="none"
                  rect={{
                    x: 0,
                    y: 0,
                    width: tileW,
                    height: tileH,
                  }}
                  tx="repeat"
                  ty="repeat"
                />
              </Rect>
            )}

            {underGlowHeight > 0 && (
              <Rect
                x={plat.x}
                y={plat.y + topEdgeHeight}
                width={plat.width}
                height={underGlowHeight}
                color={
                  theme.colors.platformTopEdgeEnd ||
                  '#16C172'
                }
                opacity={0.28}
              />
            )}

            <Rect
              x={plat.x}
              y={plat.y}
              width={plat.width}
              height={topEdgeHeight}
            >
              <LinearGradient
                start={vec(0, 0)}
                end={vec(plat.width, 0)}
                colors={[
                  theme.colors.platformTopEdgeStart || '#7CFF7A',
                  theme.colors.platformTopEdgeEnd || '#16C172',
                ]}
              />
            </Rect>
          </Group>
        );
      })}
    </Group>
  );
}
