import React from 'react';
import { Group, Rect, useImage, ImageShader } from '@shopify/react-native-skia';
import { useTheme } from '../context/ThemeContext';
import { GAME_CONFIG } from '../constants/gameConfig';

const TILE_SIZE = 64;

export default function Platform({ platforms }) {
  const { theme } = useTheme();
  const platformTile = useImage(theme.assets.platformTileset);

  return (
    <Group>
      {platforms.map((plat) => (
        <Group key={plat.id}>
          {/* Base dark body */}
          <Rect
            x={plat.x}
            y={plat.y}
            width={plat.width}
            height={plat.height}
            color={theme.colors.platformBase}
          />

          {/* Tiled texture — repeat across the platform */}
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
                rect={{ x: 0, y: 0, width: TILE_SIZE, height: TILE_SIZE }}
                tx="repeat"
                ty="repeat"
              />
            </Rect>
          )}

          {/* Bright top edge — the "surface" the player lands on */}
          <Rect
            x={plat.x}
            y={plat.y}
            width={plat.width}
            height={6}
            color={theme.colors.platformTopEdge}
          />

          {/* Thin highlight line below the top edge */}
          <Rect
            x={plat.x}
            y={plat.y + 6}
            width={plat.width}
            height={2}
            color={theme.colors.platformTopEdge}
            opacity={0.5}
          />
        </Group>
      ))}
    </Group>
  );
}