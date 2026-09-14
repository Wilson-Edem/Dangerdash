import { useWindowDimensions } from 'react-native';

export const VIRTUAL_WIDTH = 800;
export const VIRTUAL_HEIGHT = 450;

export function useResponsiveCanvas() {
  const {
    width: windowWidth,
    height: windowHeight,
  } = useWindowDimensions();

  /*
   * Contain scaling:
   *
   * - Preserves the complete 800x450 game world.
   * - Never rotates the game.
   * - Never stretches the game.
   * - Prevents important HUD/gameplay elements from
   *   being cropped off-screen.
   */
  const scale = Math.min(
    windowWidth / VIRTUAL_WIDTH,
    windowHeight / VIRTUAL_HEIGHT
  );

  const renderedWidth =
    VIRTUAL_WIDTH * scale;

  const renderedHeight =
    VIRTUAL_HEIGHT * scale;

  const translateX =
    (windowWidth - renderedWidth) / 2;

  const translateY =
    (windowHeight - renderedHeight) / 2;

  return {
    windowWidth,
    windowHeight,

    virtualWidth: VIRTUAL_WIDTH,
    virtualHeight: VIRTUAL_HEIGHT,

    scale,

    translateX,
    translateY,

    renderedWidth,
    renderedHeight,
  };
}