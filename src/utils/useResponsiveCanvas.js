import { useWindowDimensions } from 'react-native';

export const VIRTUAL_WIDTH = 800;
export const VIRTUAL_HEIGHT = 450;

/*
 * Keep the 800x450 game world aspect-ratio correct on every
 * screen. We intentionally use CONTAIN rather than COVER so
 * the top/bottom of the virtual canvas can never be cropped.
 *
 * On a 1600x720 display this becomes:
 *   scale = 1.6
 *   rendered game = 1280x720
 *
 * The unused horizontal space is letterboxed instead of
 * hiding gameplay/HUD controls.
 */
export function useResponsiveCanvas() {
  const {
    width: windowWidth,
    height: windowHeight,
  } = useWindowDimensions();

  const safeWidth = Math.max(1, windowWidth);
  const safeHeight = Math.max(1, windowHeight);

  const scale = Math.min(
    safeWidth / VIRTUAL_WIDTH,
    safeHeight / VIRTUAL_HEIGHT
  );

  const renderedWidth =
    VIRTUAL_WIDTH * scale;

  const renderedHeight =
    VIRTUAL_HEIGHT * scale;

  const translateX =
    (safeWidth - renderedWidth) / 2;

  const translateY =
    (safeHeight - renderedHeight) / 2;

  return {
    windowWidth: safeWidth,
    windowHeight: safeHeight,
    virtualWidth: VIRTUAL_WIDTH,
    virtualHeight: VIRTUAL_HEIGHT,
    scale,
    translateX,
    translateY,
    renderedWidth,
    renderedHeight,
  };
}
