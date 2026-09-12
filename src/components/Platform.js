import React from 'react';
import { Group, Rect } from '@shopify/react-native-skia';
import { PALETTE } from '../constants/palette';

export default function Platform({ platforms }) {
  return (
    <Group>
      {platforms.map((plat) => (
        <Group key={plat.id}>
          <Rect
            x={plat.x}
            y={plat.y}
            width={plat.width}
            height={plat.height}
            color={PALETTE.PLATFORM_BASE}
          />
          <Rect
            x={plat.x + 4}
            y={plat.y + 6}
            width={plat.width - 8}
            height={plat.height - 10}
            color={PALETTE.PLATFORM_INNER_GLOW}
            opacity={0.15}
          />
          <Rect
            x={plat.x}
            y={plat.y}
            width={plat.width}
            height={5}
            color={PALETTE.PLATFORM_TOP_EDGE}
          />
          {/* LED accents — now spread across the taller body */}
          <Rect x={plat.x + 20} y={plat.y + 60} width={35} height={4} color={PALETTE.NEON_CYAN} />
          <Rect x={plat.x + 20} y={plat.y + 140} width={35} height={4} color={PALETTE.NEON_CYAN} />
          {plat.width > 260 && (
            <>
              <Rect x={plat.x + plat.width - 60} y={plat.y + 90} width={45} height={4} color={PALETTE.NEON_BLUE} />
              <Rect x={plat.x + plat.width - 60} y={plat.y + 170} width={45} height={4} color={PALETTE.NEON_BLUE} />
            </>
          )}
        </Group>
      ))}
    </Group>
  );
}