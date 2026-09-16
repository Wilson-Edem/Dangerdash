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
      {platforms.map((plat) => (
        <Group key={`${themeKey}-${plat.id}`}>
          <Rect
            x={plat.x}
            y={plat.y}
            width={plat.width}
            height={plat.height}
            color={theme.colors.platformBase}
          />

          {platformTile && (
            <Rect
              x={plat.x}
              y={plat.y}
              width={plat.width}
              height={plat.height}
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

          <Rect
            x={plat.x}
            y={plat.y}
            width={plat.width}
            height={8}
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
      ))}
    </Group>
  );
}
