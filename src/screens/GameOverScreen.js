import React from 'react';

import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';

import Svg, {
  Polyline,
  Line,
} from 'react-native-svg';

import { useTheme } from '../context/ThemeContext';

const SCREEN_WIDTH =
  Dimensions.get('window').width;

export default function GameOverScreen({
  score,
  coins,
  isNewHigh,
  runLog,
  onRetry,
  onMenu,
}) {
  const { theme } =
    useTheme();

  const chartWidth = Math.min(
    SCREEN_WIDTH - 80,
    320
  );

  const chartHeight = 100;

  const safeLog =
    runLog &&
    runLog.length > 0
      ? runLog
      : [
          {
            score: 1,
            coins: 0,
          },
        ];

  const maxScore = Math.max(
    ...safeLog.map(
      (r) => r.score || 0
    ),
    100
  );

  const points = safeLog
    .slice()
    .reverse()
    .map((r, i, arr) => {
      const x =
        arr.length === 1
          ? chartWidth / 2
          : (i /
              (arr.length - 1)) *
            chartWidth;

      const y =
        chartHeight -
        ((r.score || 0) /
          maxScore) *
          chartHeight;

      return `${x},${y}`;
    })
    .join(' ');

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor:
            theme.colors.screenBg,
        },
      ]}
    >
      <Text
        style={[
          styles.gameOver,
          {
            color:
              theme.colors
                .gameOverText,
          },
        ]}
      >
        GAME OVER
      </Text>

      <Text
        style={[
          styles.score,
          {
            color:
              theme.colors
                .hudText,
          },
        ]}
      >
        SCORE: {score}
      </Text>

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
        🪙 +{coins}
      </Text>

      {isNewHigh && (
        <Text
          style={[
            styles.newHigh,
            {
              color:
                theme.colors
                  .coinGold,
            },
          ]}
        >
          ★ NEW HIGH SCORE ★
        </Text>
      )}

      <Text
        style={[
          styles.chartTitle,
          {
            color:
              theme.colors
                .subtitleText,
          },
        ]}
      >
        LAST 10 RUNS
      </Text>

      <View
        style={[
          styles.chartBox,
          {
            borderColor:
              theme.colors
                .buttonBorder,
          },
        ]}
      >
        <Svg
          width={chartWidth}
          height={chartHeight}
        >
          <Line
            x1="0"
            y1={
              chartHeight - 1
            }
            x2={chartWidth}
            y2={
              chartHeight - 1
            }
            stroke="#333"
            strokeWidth="1"
          />

          {points ? (
            <Polyline
              points={points}
              fill="none"
              stroke={
                theme.colors
                  .buttonBorder
              }
              strokeWidth="2"
            />
          ) : null}
        </Svg>
      </View>

      {/*
       * IMPORTANT:
       * This button deliberately returns to the
       * main menu instead of starting another game.
       *
       * Previously Retry called startPlaying(),
       * which bypassed the menu and immediately
       * restarted gameplay.
       */}
      <TouchableOpacity
        style={[
          styles.btn,
          {
            borderColor:
              theme.colors
                .buttonBorder,
            backgroundColor:
              theme.colors
                .buttonBg,
          },
        ]}
        onPress={onRetry}
      >
        <Text
          style={[
            styles.btnText,
            {
              color:
                theme.colors
                  .buttonText,
            },
          ]}
        >
          ← BACK TO MENU
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.btn,
          {
            borderColor:
              theme.colors
                .subtitleText,
            backgroundColor:
              theme.colors
                .buttonBg,
          },
        ]}
        onPress={onMenu}
      >
        <Text
          style={[
            styles.btnText,
            {
              color:
                theme.colors
                  .buttonText,
            },
          ]}
        >
          MAIN MENU
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },

  gameOver: {
    fontSize: 44,
    fontWeight: '900',
    fontFamily: 'monospace',
    letterSpacing: 4,
  },

  score: {
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: 'monospace',
    marginTop: 20,
  },

  coins: {
    fontSize: 20,
    fontFamily: 'monospace',
    marginTop: 8,
  },

  newHigh: {
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'monospace',
    marginTop: 12,
    letterSpacing: 2,
  },

  chartTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    fontFamily: 'monospace',
    marginTop: 30,
    marginBottom: 10,
    letterSpacing: 2,
  },

  chartBox: {
    borderWidth: 1,
    borderRadius: 6,
    padding: 8,
    marginBottom: 30,
  },

  btn: {
    borderWidth: 2,
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 40,
    marginBottom: 10,
    minWidth: 240,
    alignItems: 'center',
  },

  btnText: {
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'monospace',
    letterSpacing: 2,
  },
});