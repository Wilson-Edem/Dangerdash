import React from 'react';
import { Group, Rect, useImage, ImageShader } from '@shopify/react-native-skia';
import { PALETTE } from '../constants/palette';

export default function Platform({ platforms }) {
  const platformTile = useImage(require('../../assets/images/environment/platform_tileset.png'));

  return (
    <Group>
      {platforms.map((plat) => (
        <Group key={plat.id}>
          {/* Base Rock Structure with Tiled Texture */}
          <Rect
            x={plat.x}
            y={plat.y}
            width={plat.width}
            height={plat.height}
            color={PALETTE.PLATFORM_BASE}
          >
            {platformTile && (
              // 🔧 FIX: `fit` controls scaling, `tx`/`ty` control tiling
              // The tile rect is 64x64; tx/ty="repeat" tiles infinitely.
              <ImageShader
                image={platformTile}
                fit="none"
                rect={{ x: 0, y: 0, width: 64, height: 64 }}
                tx="repeat"
                ty="repeat"
              />
            )}
          </Rect>

          {/* Neon Top Running Ledge */}
          <Rect
            x={plat.x}
            y={plat.y}
            width={plat.width}
            height={6}
            color={PALETTE.PLATFORM_TOP_EDGE}
          />

          {/* Under-Edge Ambient Glow Bar */}
          <Rect
            x={plat.x}
            y={plat.y + 6}
            width={plat.width}
            height={2}
            color={PALETTE.NEON_PINK}
          />

          {/* Embedded Neon Strip Decors */}
          <Rect
            x={plat.x + 20}
            y={plat.y + 35}
            width={35}
            height={4}
            color={PALETTE.NEON_CYAN}
          />
          {plat.width > 220 && (
            <Rect
              x={plat.x + 130}
              y={plat.y + 55}
              width={45}
              height={4}
              color={PALETTE.NEON_BLUE}
            />
          )}
        </Group>
      ))}
    </Group>
  );
}