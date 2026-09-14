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

const TILE_SIZE = 64;

export default function Platform({
  platforms,
}) {
  const {
    theme,
    themeKey,
  } = useTheme();

  const platformTile =
    useImage(
      theme.assets
        .platformTileset
    );

  return (
    <Group
      key={`platform-theme-${themeKey}`}
    >
      {platforms.map(
        (plat) => (
          <Group
            key={`${themeKey}-${plat.id}`}
          >
            <Rect
              x={plat.x}
              y={plat.y}
              width={
                plat.width
              }
              height={
                plat.height
              }
              color={
                theme.colors
                  .platformBase
              }
            />

            {platformTile && (
              <Rect
                x={plat.x}
                y={plat.y}
                width={
                  plat.width
                }
                height={
                  plat.height
                }
              >
                <ImageShader
                  image={
                    platformTile
                  }
                  fit="none"
                  rect={{
                    x: 0,
                    y: 0,
                    width:
                      TILE_SIZE,
                    height:
                      TILE_SIZE,
                  }}
                  tx="repeat"
                  ty="repeat"
                />
              </Rect>
            )}

            {/* Green gradient platform surface */}
            <Rect
              x={plat.x}
              y={plat.y}
              width={
                plat.width
              }
              height={6}
            >
              <LinearGradient
                start={vec(0, 0)}
                end={vec(
                  plat.width,
                  0
                )}
                colors={[
                  theme.colors
                    .platformTopEdgeStart ||
                    '#7CFF7A',

                  theme.colors
                    .platformTopEdgeEnd ||
                    '#16C172',
                ]}
              />
            </Rect>

            <Rect
              x={plat.x}
              y={
                plat.y + 6
              }
              width={
                plat.width
              }
              height={2}
            >
              <LinearGradient
                start={vec(0, 0)}
                end={vec(
                  plat.width,
                  0
                )}
                colors={[
                  theme.colors
                    .platformTopEdgeStart ||
                    '#7CFF7A',

                  theme.colors
                    .platformTopEdgeEnd ||
                    '#16C172',
                ]}
              />
            </Rect>
          </Group>
        )
      )}
    </Group>
  );
}