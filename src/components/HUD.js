import React from 'react';
import { Group, Text, RoundedRect, matchFont } from '@shopify/react-native-skia';
import { PALETTE } from '../constants/palette';

const fontFamily = 'monospace';
const fontStyle = { fontFamily, fontSize: 15, fontWeight: 'bold' };
const font = matchFont(fontStyle);

export default function HUD({ score, coins, health }) {
  return (
    <Group>
      {/* Top-Left Health HUD Box */}
      <RoundedRect x={15} y={15} width={170} height={48} r={6} color={PALETTE.HUD_SURFACE} />
      <RoundedRect
        x={15}
        y={15}
        width={170}
        height={48}
        r={6}
        color={PALETTE.HUD_BORDER}
        style="stroke"
        strokeWidth={1.5}
      />
      <Text
        x={28}
        y={45}
        text={`HP: ${'❤️ '.repeat(health)}`}
        font={font}
        color={PALETTE.NEON_PINK}
      />

      {/* Top-Right Score & Economy Box */}
      <RoundedRect x={585} y={15} width={200} height={50} r={6} color={PALETTE.HUD_SURFACE} />
      <RoundedRect
        x={585}
        y={15}
        width={200}
        height={50}
        r={6}
        color={PALETTE.HUD_BORDER}
        style="stroke"
        strokeWidth={1.5}
      />
      <Text
        x={600}
        y={35}
        text={`SCORE: ${String(score).padStart(6, '0')}`}
        font={font}
        color={PALETTE.WHITE}
      />
      <Text
        x={600}
        y={54}
        text={`COINS:  x ${coins}`}
        font={font}
        color={PALETTE.NEON_YELLOW}
      />
    </Group>
  );
}