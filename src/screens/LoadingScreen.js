import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Animated, Image, Easing } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';

// Static asset mapping for APK preloader
const PREVIEW_IMAGES = [
  require('../../assets/images/preview1.png'),
  require('../../assets/images/preview2.png'),
  require('../../assets/images/preview3.png'),
];

export default function LoadingScreen({ onFinishLoading }) {
  // 0 = Stage 1 (Title Card), 1 = Stage 2 (Gameplay Preview Carousel)
  const [stage, setStage] = useState(0);
  const [activePreviewIndex, setActivePreviewIndex] = useState(0);
  const [progressPercent, setProgressPercent] = useState(0);

  // 🔧 Fix: Ref to track current preview index without stale closure
  const currentPreviewRef = useRef(0);

  // Animation values
  const titleFade = useRef(new Animated.Value(0)).current;
  const titleGlow = useRef(new Animated.Value(0.3)).current;
  const stage2Fade = useRef(new Animated.Value(0)).current;
  const progressBarAnim = useRef(new Animated.Value(0)).current;
  const imageFade = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Stage 1: Fade in title card & start text glow pulse
    Animated.timing(titleFade, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();

       // Title glow pulse loop (opacity only — textShadowRadius can't be animated natively)
    Animated.loop(
      Animated.sequence([
        Animated.timing(titleGlow, { toValue: 1, duration: 900, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(titleGlow, { toValue: 0.4, duration: 900, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ])
    ).start();

    // Transition from Stage 1 -> Stage 2 after 2 seconds
    const stageTimer = setTimeout(() => {
      transitionToStage2();
    }, 2000);

    return () => clearTimeout(stageTimer);
  }, []);

  const transitionToStage2 = () => {
    setStage(1);

    // Smooth fade into Stage 2
    Animated.timing(stage2Fade, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();

    // 🔧 Fix: Store listener reference for proper cleanup
    const listenerId = progressBarAnim.addListener(({ value }) => {
      const currentPct = Math.floor(value * 100);
      setProgressPercent(currentPct);

      // Determine new preview index based on progress
      let newIndex = 0;
      if (currentPct >= 66) newIndex = 2;
      else if (currentPct >= 33) newIndex = 1;

      // 🔧 Fix: Compare against the ref (not stale state)
      if (newIndex !== currentPreviewRef.current) {
        currentPreviewRef.current = newIndex;
        swapPreviewImage(newIndex);
      }
    });

    // Drive progress bar from 0% to 100% over 3.5 seconds
    Animated.timing(progressBarAnim, {
      toValue: 1,
      duration: 3500,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start(() => {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      // 🔧 Fix: Clean up listener when done
      progressBarAnim.removeListener(listenerId);
      if (onFinishLoading) {
        onFinishLoading();
      }
    });

    // 🔧 Fix: Also clean up if unmounted mid-animation
    return () => {
      progressBarAnim.removeListener(listenerId);
    };
  };

  const swapPreviewImage = (newIndex) => {
    Animated.timing(imageFade, {
      toValue: 0.2,
      duration: 250,
      useNativeDriver: true,
    }).start(() => {
      setActivePreviewIndex(newIndex);
      Animated.timing(imageFade, {
        toValue: 1,
        duration: 350,
        useNativeDriver: true,
      }).start();
    });
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#030108', '#0c0418', '#020005']} style={styles.background}>

        {/* STAGE 1: BRANDED TITLE CARD */}
        {stage === 0 && (
          <Animated.View style={[styles.titleStage, { opacity: titleFade }]}>
            <Animated.Text
  style={[
    styles.mainTitle,
    { opacity: titleGlow },
  ]}
>
              DANGERDASH MOBILE
            </Animated.Text>
            <Text style={styles.subTitle}>by Vhite</Text>
          </Animated.View>
        )}

        {/* STAGE 2: GAMEPLAY PREVIEW CAROUSEL & PROGRESS BAR */}
        {stage === 1 && (
          <Animated.View style={[styles.stage2Container, { opacity: stage2Fade }]}>

            {/* Background Image Preview Card */}
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

            {/* Bottom Progress Controls */}
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
  container: {
    flex: 1,
    backgroundColor: '#030108',
  },
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  titleStage: {
    alignItems: 'center',
  },
  mainTitle: {
  fontSize: 52,
  fontWeight: '900',
  color: '#FFFFFF',
  letterSpacing: 6,
  textTransform: 'uppercase',
  textShadowColor: '#00F0FF',
  textShadowOffset: { width: 0, height: 0 },
  textShadowRadius: 18,
  fontFamily: 'sans-serif-condensed',
},
  subTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#D8B4FE',
    letterSpacing: 5,
    marginTop: 10,
    textTransform: 'lowercase',
  },
  stage2Container: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewCardFrame: {
    width: '100%',
    height: '100%',
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#3B0764',
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#090314',
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  imageOverlayGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '40%',
  },
  progressSection: {
    width: '75%',
    marginTop: 18,
  },
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
  },
});
