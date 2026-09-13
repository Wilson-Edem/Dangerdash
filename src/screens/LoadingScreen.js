import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet, Text, View, Animated, Image, Easing, Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Canvas, Circle, Group } from '@shopify/react-native-skia';
import * as Haptics from 'expo-haptics';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');

const PREVIEW_IMAGES = [
  require('../../assets/images/preview1.png'),
  require('../../assets/images/preview2.png'),
  require('../../assets/images/preview3.png'),
];

const PARTICLES = Array.from({ length: 40 }, (_, i) => ({
  id: i,
  x: Math.random() * SCREEN_W,
  y: Math.random() * SCREEN_H,
  r: Math.random() * 1.8 + 0.4,
  opacity: Math.random() * 0.5 + 0.15,
  color: Math.random() < 0.6 ? '#00F0FF' : Math.random() < 0.5 ? '#A855F7' : '#FF007F',
}));

export default function LoadingScreen({ onFinishLoading }) {
  const [stage, setStage] = useState(0);
  const [activePreviewIndex, setActivePreviewIndex] = useState(0);
  const [progressPercent, setProgressPercent] = useState(0);

  const currentPreviewRef = useRef(0);

  const titleFade = useRef(new Animated.Value(0)).current;
  const titleGlow = useRef(new Animated.Value(0.3)).current;
  const titleScale = useRef(new Animated.Value(0.92)).current;
  const stage2Fade = useRef(new Animated.Value(0)).current;
  const progressBarAnim = useRef(new Animated.Value(0)).current;
  const imageFade = useRef(new Animated.Value(1)).current;
  const gridShift = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(titleFade, { toValue: 1, duration: 900, useNativeDriver: true }),
      Animated.timing(titleScale, { toValue: 1, duration: 900, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
    ]).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(titleGlow, { toValue: 1, duration: 900, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(titleGlow, { toValue: 0.4, duration: 900, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ])
    ).start();

    Animated.loop(
      Animated.timing(gridShift, { toValue: 1, duration: 8000, easing: Easing.linear, useNativeDriver: true })
    ).start();

    const timer = setTimeout(transitionToStage2, 2000);
    return () => clearTimeout(timer);
  }, []);

  const transitionToStage2 = () => {
    setStage(1);

    Animated.timing(stage2Fade, { toValue: 1, duration: 800, useNativeDriver: true }).start();

    const listenerId = progressBarAnim.addListener(({ value }) => {
      const pct = Math.floor(value * 100);
      setProgressPercent(pct);

      let newIndex = 0;
      if (pct >= 66) newIndex = 2;
      else if (pct >= 33) newIndex = 1;

      if (newIndex !== currentPreviewRef.current) {
        currentPreviewRef.current = newIndex;
        swapPreviewImage(newIndex);
      }
    });

    Animated.timing(progressBarAnim, {
      toValue: 1,
      duration: 3500,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start(() => {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      progressBarAnim.removeListener(listenerId);
      if (onFinishLoading) onFinishLoading();
    });

    return () => progressBarAnim.removeListener(listenerId);
  };

  const swapPreviewImage = (newIndex) => {
    Animated.timing(imageFade, { toValue: 0.2, duration: 250, useNativeDriver: true }).start(() => {
      setActivePreviewIndex(newIndex);
      Animated.timing(imageFade, { toValue: 1, duration: 350, useNativeDriver: true }).start();
    });
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#030108', '#0c0418', '#020005']} style={styles.background}>
        <Canvas style={StyleSheet.absoluteFill} pointerEvents="none">
          <Group>
            {PARTICLES.map((p) => (
              <Circle key={p.id} cx={p.x} cy={p.y} r={p.r} color={p.color} opacity={p.opacity} />
            ))}
          </Group>
        </Canvas>

        <Animated.View
          style={[
            StyleSheet.absoluteFill,
            {
              opacity: 0.06,
              transform: [
                {
                  translateX: gridShift.interpolate({ inputRange: [0, 1], outputRange: [0, 80] }),
                },
              ],
            },
          ]}
          pointerEvents="none"
        >
          {Array.from({ length: 20 }).map((_, i) => (
            <View key={i} style={[styles.gridLine, { left: i * 60 }]} />
          ))}
        </Animated.View>

        {stage === 0 && (
          <Animated.View
            style={[
              styles.titleStage,
              { opacity: titleFade, transform: [{ scale: titleScale }] },
            ]}
          >
            <Animated.Text
              style={[
                styles.mainTitle,
                { opacity: titleGlow },
              ]}
            >
              DANGER DASH
            </Animated.Text>
            <Text style={styles.subTitle}>MOBILE • BY VHITE</Text>

            <View style={styles.loadingDotsRow}>
              <Animated.View style={[styles.dot, { opacity: titleGlow }]} />
              <Animated.View style={[styles.dot, { opacity: titleGlow }]} />
              <Animated.View style={[styles.dot, { opacity: titleGlow }]} />
            </View>
          </Animated.View>
        )}

        {stage === 1 && (
          <Animated.View style={[styles.stage2Container, { opacity: stage2Fade }]}>
            <View style={styles.previewCardFrame}>
              <Animated.Image
                source={PREVIEW_IMAGES[activePreviewIndex]}
                style={[styles.previewImage, { opacity: imageFade }]}
                resizeMode="cover"
              />
              <LinearGradient
                colors={['transparent', 'rgba(3, 1, 8, 0.85)']}
                style={styles.imageOverlayGradient}
              />
            </View>

            <View style={styles.progressSection}>
              <View style={styles.textRow}>
                <Text style={styles.loadingLabel}>LOADING ASSETS & AUDIO...</Text>
                <Text style={styles.pctText}>{progressPercent}%</Text>
              </View>

              <View style={styles.track}>
                <Animated.View
                  style={[
                    styles.fill,
                    {
                      width: progressBarAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: ['0%', '100%'],
                      }),
                    },
                  ]}
                />
              </View>
            </View>
          </Animated.View>
        )}
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#030108' },
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  gridLine: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: '#00F0FF',
  },
  titleStage: { alignItems: 'center' },
  mainTitle: {
    fontSize: 52,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 6,
    textTransform: 'uppercase',
    textShadowColor: '#00F0FF',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 18, // Static value to avoid warning
    fontFamily: 'sans-serif-condensed',
  },
  subTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#A855F7',
    letterSpacing: 5,
    marginTop: 12,
    textTransform: 'uppercase',
  },
  loadingDotsRow: {
    flexDirection: 'row',
    marginTop: 30,
    gap: 10,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#00F0FF',
  },
  stage2Container: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewCardFrame: {
    width: '72%',
    height: '60%',
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#00F0FF',
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#090314',
    shadowColor: '#00F0FF',
    shadowOpacity: 0.5,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 0 },
    elevation: 10,
  },
  previewImage: { width: '100%', height: '100%' },
  imageOverlayGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '40%',
  },
  progressSection: { width: '72%', marginTop: 22 },
  textRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  loadingLabel: {
    color: '#A855F7',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 2,
  },
  pctText: {
    color: '#00FFCC',
    fontSize: 12,
    fontWeight: '800',
    fontFamily: 'monospace',
  },
  track: {
    width: '100%',
    height: 6,
    backgroundColor: '#1E152A',
    borderRadius: 3,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    backgroundColor: '#00FFCC',
    shadowColor: '#00FFCC',
    shadowRadius: 8,
    shadowOpacity: 1,
  },
});