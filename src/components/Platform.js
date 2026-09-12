import React from 'react';
import { Group, Rect, useImage, ImageShader } from '@shopify/react-native-skia';
import { PALETTE } from '../constants/palette';

export default function Platform({ platforms }) {
  const platformTile = useImage(require('../../assets/images/environment/platform_tileset.png'));

  // Tile texture size — will repeat across the platform body
  const TILE_SIZE = 64;

  return (
    <Group>
      {platforms.map((plat) => (
        <Group key={plat.id}>
          {/* Base dark body (behind the texture) */}
          <Rect
            x={plat.x}
            y={plat.y}
            width={plat.width}
            height={plat.height}
            color={PALETTE.PLATFORM_BASE}
          />

          {/* Tiled texture on top of the base */}
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

          {/* Bright neon top strip */}
          <Rect
            x={plat.x}
            y={plat.y}
            width={plat.width}
            height={5}
            color={PALETTE.PLATFORM_TOP_EDGE}
          />
        </Group>
      ))}
    </Group>
  );
}