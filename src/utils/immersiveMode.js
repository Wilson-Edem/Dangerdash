import * as NavigationBar from 'expo-navigation-bar';
import { Platform } from 'react-native';

export async function enableImmersiveMode() {
  if (Platform.OS !== 'android') return;
  try {
    await NavigationBar.setVisibilityAsync('hidden');
    await NavigationBar.setBehaviorAsync('overlay-swipe');
    await NavigationBar.setBackgroundColorAsync('#000000');
    await NavigationBar.setButtonStyleAsync('light');
  } catch (e) {
    console.warn('Immersive mode enable failed:', e);
  }
}

export async function disableImmersiveMode() {
  if (Platform.OS !== 'android') return;
  try {
    await NavigationBar.setVisibilityAsync('visible');
  } catch (e) {}
}

export async function reassertImmersiveMode() {
  if (Platform.OS !== 'android') return;
  try {
    await NavigationBar.setVisibilityAsync('hidden');
    await NavigationBar.setBehaviorAsync('overlay-swipe');
  } catch (e) {}
}