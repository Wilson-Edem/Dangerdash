import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';

const CHANNEL_ID = 'daily-challenges';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function initializeNotifications() {
  try {
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync(
        CHANNEL_ID,
        {
          name: 'Daily Challenges',
          description: 'Danger Dash daily challenge completions',
          importance: Notifications.AndroidImportance.HIGH,
          vibrationPattern: [0, 180, 120, 180],
          lightColor: '#FF1744',
        }
      );
    }

    const permissions =
      await Notifications.getPermissionsAsync();

    if (permissions.granted) {
      return true;
    }

    const requested =
      await Notifications.requestPermissionsAsync();

    return requested.granted;
  } catch (error) {
    console.warn(
      'Notification setup failed:',
      error
    );

    return false;
  }
}

export async function notifyChallengeCompleted(
  challenge
) {
  try {
    const granted =
      await initializeNotifications();

    if (!granted) return false;

    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'DAILY CHALLENGE COMPLETE! 🏆',
        body: `${challenge.text} — reward ready: 🪙 ${challenge.reward}`,
        data: {
          type: 'daily_challenge',
          challengeId: challenge.id,
        },
        color: '#FF1744',
        sound: 'default',
      },
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

export async function setNotificationBadgeCount(
  count
) {
  try {
    await Notifications.setBadgeCountAsync(
      Math.max(0, Number(count) || 0)
    );
  } catch (error) {
    // Badge APIs are platform/device dependent.
  }
}
