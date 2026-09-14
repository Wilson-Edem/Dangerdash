import { Platform } from 'react-native';
import Constants from 'expo-constants';

const CHANNEL_ID = 'daily-challenges';

let Notifications = null;
let notificationHandlerConfigured = false;

/*
 * Expo Go on Android does not support remote push notifications.
 *
 * We deliberately DO NOT import expo-notifications at module startup.
 * Importing it immediately can cause Expo Go to initialize the
 * push-token path and throw the SDK 53+ Expo Go error.
 *
 * Local notifications will work in a development/standalone build.
 */

function isExpoGo() {
  /*
   * appOwnership is deprecated but remains useful for identifying
   * Expo Go specifically.
   */
  return Constants.appOwnership === 'expo';
}

async function loadNotifications() {
  /*
   * Never load expo-notifications inside Expo Go.
   *
   * This prevents:
   * warnOfExpoGoPushUsage
   * addPushTokenListener
   */
  if (isExpoGo()) {
    return null;
  }

  if (Notifications) {
    return Notifications;
  }

  try {
    const module = await import('expo-notifications');

    Notifications = module;

    if (!notificationHandlerConfigured) {
      Notifications.setNotificationHandler({
        handleNotification: async () => ({
          shouldPlaySound: true,
          shouldSetBadge: true,
          shouldShowBanner: true,
          shouldShowList: true,
        }),
      });

      notificationHandlerConfigured = true;
    }

    return Notifications;
  } catch (error) {
    console.warn(
      'expo-notifications could not be loaded:',
      error
    );

    return null;
  }
}

/*
 * Optional initialization.
 *
 * We no longer call this during app startup.
 * It can safely be called later by a development/standalone build.
 */
export async function initializeNotifications() {
  const NotificationsModule = await loadNotifications();

  if (!NotificationsModule) {
    return false;
  }

  try {
    if (Platform.OS === 'android') {
      await NotificationsModule.setNotificationChannelAsync(
        CHANNEL_ID,
        {
          name: 'Daily Challenges',
          description:
            'Danger Dash daily challenge completions',

          importance:
            NotificationsModule.AndroidImportance.HIGH,

          vibrationPattern: [
            0,
            180,
            120,
            180,
          ],

          lightColor: '#FF1744',
        }
      );
    }

    const permissions =
      await NotificationsModule.getPermissionsAsync();

    if (permissions.granted) {
      return true;
    }

    const requested =
      await NotificationsModule.requestPermissionsAsync();

    return requested.granted;
  } catch (error) {
    console.warn(
      'Notification permission setup failed:',
      error
    );

    return false;
  }
}

/*
 * Sends a LOCAL notification when a daily challenge is completed.
 *
 * This does NOT use:
 * - getExpoPushTokenAsync()
 * - getDevicePushTokenAsync()
 * - addPushTokenListener()
 *
 * Therefore this feature is local notification functionality,
 * not remote push notification functionality.
 */
export async function notifyChallengeCompleted(
  challenge
) {
  const NotificationsModule =
    await loadNotifications();

  /*
   * When running inside Expo Go, simply skip the system
   * notification instead of crashing the application.
   */
  if (!NotificationsModule) {
    console.log(
      'Daily challenge notification skipped: Expo Go does not support this notification path.'
    );

    return false;
  }

  try {
    const granted =
      await initializeNotifications();

    if (!granted) {
      return false;
    }

    await NotificationsModule.scheduleNotificationAsync({
      content: {
        title:
          'DAILY CHALLENGE COMPLETE! 🏆',

        body:
          `${challenge.text} — reward ready: 🪙 ${challenge.reward}`,

        data: {
          type: 'daily_challenge',
          challengeId: challenge.id,
        },

        sound: 'default',

        color: '#FF1744',
      },

      /*
       * null means deliver immediately.
       */
      trigger: null,
    });

    return true;
  } catch (error) {
    console.warn(
      'Challenge notification failed:',
      error
    );

    return false;
  }
}

/*
 * Updates the Android app notification badge.
 */
export async function setNotificationBadgeCount(
  count
) {
  const NotificationsModule =
    await loadNotifications();

  if (!NotificationsModule) {
    return false;
  }

  try {
    await NotificationsModule.setBadgeCountAsync(
      Math.max(
        0,
        Number(count) || 0
      )
    );

    return true;
  } catch (error) {
    console.warn(
      'Notification badge update failed:',
      error
    );

    return false;
  }
}