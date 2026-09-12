import React from 'react';
import { Group, Rect, Circle, Image, useImage, Oval } from '@shopify/react-native-skia';
import { GAME_CONFIG } from '../constants/gameConfig';
import { PALETTE } from '../constants/palette';

export default function Items({ items }) {
  const coinSprite = useImage(require('../../assets/images/items/coin_spritesheet.png'));
  const spikeSprite = useImage(require('../../assets/images/environment/spike_hazard.png'));
  const boostSprite = useImage(require('../../assets/images/items/boost_pad.png'));
  const shieldSprite = useImage(require('../../assets/images/items/shield_aura.png'));

  return (
    <Group>
      {items.map((item) => {
        switch (item.type) {
          case GAME_CONFIG.ITEM_TYPES.COIN:
            return (
              <Group key={item.id}>
                {coinSprite ? (
                  <Image
                    image={coinSprite}
                    x={item.x}
                    y={item.y}
                    width={item.width}
                    height={item.height}
                    fit="contain"
                  />
                ) : (
                  <Circle
                    cx={item.x + item.width / 2}
                    cy={item.y + item.height / 2}
                    r={item.width / 2}
                    color={PALETTE.NEON_YELLOW}
                  />
                )}
              </Group>
            );

          case GAME_CONFIG.ITEM_TYPES.SPIKE:
            return (
              <Group key={item.id}>
                {spikeSprite ? (
                  <Image
                    image={spikeSprite}
                    x={item.x}
                    y={item.y}
                    width={item.width}
                    height={item.height}
                    fit="fill"
                  />
                ) : (
                  <Rect
                    x={item.x}
                    y={item.y}
                    width={item.width}
                    height={item.height}
                    color={PALETTE.NEON_PINK}
                  />
                )}
              </Group>
            );

          case GAME_CONFIG.ITEM_TYPES.BOOST_PAD:
            return (
              <Group key={item.id}>
                {boostSprite ? (
                  <Image
                    image={boostSprite}
                    x={item.x}
                    y={item.y}
                    width={item.width}
                    height={item.height}
                    fit="fill"
                  />
                ) : (
                  <Rect
                    x={item.x}
                    y={item.y}
                    width={item.width}
                    height={item.height}
                    color={PALETTE.NEON_CYAN}
                  />
                )}
              </Group>
            );

          case GAME_CONFIG.ITEM_TYPES.SHIELD:
            return (
              <Group key={item.id}>
                {shieldSprite ? (
                  <Image
                    image={shieldSprite}
                    x={item.x}
                    y={item.y}
                    width={item.width}
                    height={item.height}
                    fit="contain"
                  />
                ) : (
                  <Oval
                    x={item.x}
                    y={item.y}
                    width={item.width}
                    height={item.height}
                    color={PALETTE.NEON_BLUE}
                  />
                )}
              </Group>
            );

          default:
            return null;
        }
      })}
    </Group>
  );
                      }
