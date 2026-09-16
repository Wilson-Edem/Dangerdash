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

const TILE_SIZE = 64;

export default function Platform({
  platforms,
}) {
  const {
    themeKey,
  } = useTheme();

  /*
   * Mount BOTH platform textures.
   *
   * This makes switching between Cyberpunk and Wooden
   * deterministic and prevents Skia from retaining the
   * previous image when the theme changes.
   */
  const cyberPlatformTile =
    useImage(
      THEMES.cyberpunk.assets
        .platformTileset
    );

  const woodenPlatformTile =
    useImage(
      THEMES.wooden.assets
        .platformTileset
    );

  const platformTile =
    themeKey === 'wooden'
      ? woodenPlatformTile
      : cyberPlatformTile;

  /*
   * The two platform assets have different dimensions.
   * Use their actual tile dimensions rather than forcing
   * the wooden texture into the Cyberpunk tile size.
   */
  const tileWidth =
    themeKey === 'wooden'
      ? 127
      : TILE_SIZE;

  const tileHeight =
    themeKey === 'wooden'
      ? 46
      : TILE_SIZE;

  const activeTheme =
    THEMES[themeKey] ||
    THEMES.cyberpunk;

  return (
    <Group
      key={`platform-theme-${themeKey}`}
    >
      {platforms.map(
        (plat) => (
          <Group
            key={`${themeKey}-${plat.id}`}
          >
            {/* Platform base */}
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
                activeTheme.colors
                  .platformBase
              }
            />

            {/* Theme-specific texture */}
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
                      tileWidth,
                    height:
                      tileHeight,
                  }}
                  tx="repeat"
                  ty="repeat"
                />
              </Rect>
            )}

            {/* Green gradient surface */}
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
                  activeTheme
                    .colors
                    .platformTopEdgeStart,

                  activeTheme
                    .colors
                    .platformTopEdgeEnd,
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
                  activeTheme
                    .colors
                    .platformTopEdgeStart,

                  activeTheme
                    .colors
                    .platformTopEdgeEnd,
                ]}
              />
            </Rect>
          </Group>
        )
      )}
    </Group>
  );
}