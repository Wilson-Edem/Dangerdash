import * as NavigationBar from 'expo-navigation-bar';
import { Platform } from 'react-native';

// Defensive wrapper — silently skip if function doesn't exist in this SDK version
async function safeCall(fn, ...args) {
  if (typeof fn !== 'function') return false;
  try {
    await fn(...args);
    return true;
  } catch (e) {
    return false;
  }
}

export async function enableImmersiveMode() {
  if (Platform.OS !== 'android') return;

  // Try the modern API first (SDK 54+)
  await safeCall(NavigationBar.setVisibilityAsync, 'hidden');
  await safeCall(NavigationBar.setBehaviorAsync, 'overlay-swipe');

  // Try alternate function names in case the API changed
  await safeCall(NavigationBar.setBackgroundColorAsync, '#000000');
  await safeCall(NavigationBar.setButtonStyleAsync, 'light');
}

export async function disableImmersiveMode() {
  if (Platform.OS !== 'android') return;
  await safeCall(NavigationBar.setVisibilityAsync, 'visible');
}

export async function reassertImmersiveMode() {
  if (Platform.OS !== 'android') return;
  await safeCall(NavigationBar.setVisibilityAsync, 'hidden');
  await safeCall(NavigationBar.setBehaviorAsync, 'overlay-swipe');
}