import React, {
  useEffect,
  useState,
} from 'react';

import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';

import { useTheme } from '../context/ThemeContext';

import {
  getDailyChallenges,
} from '../constants/challenges';

import {
  loadSave,
  writeSave,
} from '../utils/saveManager';

import {
  setNotificationBadgeCount,
} from '../utils/notificationManager';

function todaySeed() {
  const d =
    new Date();

  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}

export default function ChallengesScreen({
  onBack,
}) {
  const { theme } =
    useTheme();

  const [
    save,
    setSave,
  ] = useState(null);

  const challenges =
    getDailyChallenges(
      todaySeed()
    );

  useEffect(() => {
    loadSave().then(
      setSave
    );
  }, []);

  const claim =
    async (ch) => {
      if (
        save.challengeCompletedIds.includes(
          ch.id
        )
      ) {
        return;
      }

      const updatedNotificationIds =
        (
          save.challengeNotificationIds ||
          []
        ).filter(
          (id) =>
            id !== ch.id
        );

      await writeSave({
        totalCoins:
          save.totalCoins +
          ch.reward,

        challengeCompletedIds:
          [
            ...save.challengeCompletedIds,
            ch.id,
          ],

        challengeNotificationIds:
          updatedNotificationIds,
      });

      await setNotificationBadgeCount(
        updatedNotificationIds.length
      );

      setSave(
        await loadSave()
      );
    };

  if (!save) {
    return null;
  }

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor:
            theme.colors
              .screenBg,
        },
      ]}
    >
      <View
        style={styles.header}
      >
        <TouchableOpacity
          onPress={onBack}
        >
          <Text
            style={[
              styles.back,
              {
                color:
                  theme.colors
                    .buttonText,
              },
            ]}
          >
            ← BACK
          </Text>
        </TouchableOpacity>

        <Text
          style={[
            styles.coins,
            {
              color:
                theme.colors
                  .coinGold,
            },
          ]}
        >
          🪙{' '}
          {save.totalCoins}
        </Text>
      </View>

      <Text
        style={[
          styles.title,
          {
            color:
              theme.colors
                .titleText,
          },
        ]}
      >
        DAILY CHALLENGES
      </Text>

      <Text
        style={[
          styles.subtitle,
          {
            color:
              theme.colors
                .subtitleText,
          },
        ]}
      >
        Reset every 24 hours
      </Text>

      <ScrollView
        contentContainerStyle={
          styles.list
        }
      >
        {challenges.map(
          (ch) => {
            const claimed =
              save.challengeCompletedIds.includes(
                ch.id
              );

            const progress =
              (
                save.challengeProgress &&
                save.challengeProgress[
                  ch.id
                ]
              ) || 0;

            const done =
              progress >=
              ch.target;

            return (
              <View
                key={ch.id}
                style={[
                  styles.card,
                  {
                    borderColor:
                      done
                        ? theme
                            .colors
                            .buttonBorder
                        : '#333',
                  },
                ]}
              >
                <Text
                  style={[
                    styles.cardTitle,
                    {
                      color:
                        theme
                          .colors
                          .hudText,
                    },
                  ]}
                >
                  {ch.text}
                </Text>

                <Text
                  style={[
                    styles.cardProgress,
                    {
                      color:
                        theme
                          .colors
                          .subtitleText,
                    },
                  ]}
                >
                  {Math.min(
                    progress,
                    ch.target
                  )}{' '}
                  /{' '}
                  {ch.target}
                </Text>

                <TouchableOpacity
                  style={[
                    styles.claimBtn,
                    {
                      backgroundColor:
                        claimed ||
                        !done
                          ? '#333'
                          : theme
                              .colors
                              .buttonBorder,
                    },
                  ]}
                  disabled={
                    claimed ||
                    !done
                  }
                  onPress={() =>
                    claim(ch)
                  }
                >
                  <Text
                    style={[
                      styles.claimText,
                      {
                        color:
                          claimed ||
                          !done
                            ? '#888'
                            : theme
                                .colors
                                .screenBg,
                      },
                    ]}
                  >
                    {claimed
                      ? '✓ CLAIMED'
                      : done
                      ? `CLAIM 🪙 ${ch.reward}`
                      : `🪙 ${ch.reward}`}
                  </Text>
                </TouchableOpacity>
              </View>
            );
          }
        )}
      </ScrollView>
    </View>
  );
}

const styles =
  StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
    },

    header: {
      flexDirection:
        'row',

      justifyContent:
        'space-between',

      alignItems:
        'center',

      marginBottom: 16,
    },

    back: {
      fontSize: 16,

      fontWeight:
        'bold',

      fontFamily:
        'monospace',
    },

    coins: {
      fontSize: 18,

      fontWeight:
        'bold',

      fontFamily:
        'monospace',
    },

    title: {
      fontSize: 24,

      fontWeight:
        '900',

      fontFamily:
        'monospace',

      letterSpacing: 3,
    },

    subtitle: {
      fontSize: 12,

      fontFamily:
        'monospace',

      marginBottom: 16,
    },

    list: {
      paddingBottom: 40,
    },

    card: {
      borderWidth: 2,

      borderRadius: 10,

      padding: 14,

      marginBottom: 12,
    },

    cardTitle: {
      fontSize: 15,

      fontWeight:
        'bold',

      fontFamily:
        'monospace',
    },

    cardProgress: {
      fontSize: 13,

      fontFamily:
        'monospace',

      marginTop: 6,
    },

    claimBtn: {
      marginTop: 10,

      borderRadius: 6,

      padding: 10,

      alignItems:
        'center',
    },

    claimText: {
      fontWeight:
        'bold',

      fontFamily:
        'monospace',
    },
  });