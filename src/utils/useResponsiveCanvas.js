import { useWindowDimensions } from 'react-native';

export const VIRTUAL_WIDTH = 800;
export const VIRTUAL_HEIGHT = 450;

export function useResponsiveCanvas() {
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();

  // "Cover" scaling — fills the entire screen, no letterboxing.
  // The game world is slightly cropped on edges, but UI anchors to safe edges.
  const scale = Math.max(
    windowWidth / VIRTUAL_WIDTH,
    windowHeight / VIRTUAL_HEIGHT
  );

  const translateX = (windowWidth - VIRTUAL_WIDTH * scale) / 2;
  const translateY = (windowHeight - VIRTUAL_HEIGHT * scale) / 2;

  return {
    windowWidth,
    windowHeight,
    virtualWidth: VIRTUAL_WIDTH,
    virtualHeight: VIRTUAL_HEIGHT,
    scale,
    translateX,
    translateY,
  };
}