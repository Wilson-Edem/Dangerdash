import React, {
  useEffect,
  useRef,
  useState,
} from 'react';

import {
  StyleSheet,
  Text,
  View,
  Animated,
  Easing,
  Dimensions,
} from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';

import {
  Canvas,
  Circle,
  Group,
} from '@shopify/react-native-skia';

import * as Haptics from 'expo-haptics';

const { width: SCREEN_W, height: SCREEN_H } =
  Dimensions.get('window');

const PREVIEW_IMAGES = [
  require('../../assets/images/preview1.png'),
  require('../../assets/images/preview2.png'),
  require('../../assets/images/preview3.png'),
];

const PARTICLES = Array.from(
  { length: 42 },
  (_, index) => ({
    id: index,

    x: Math.random() * SCREEN_W,

    y: Math.random() * SCREEN_H,

    r: Math.random() * 1.8 + 0.4,

    opacity:
      Math.random() * 0.45 + 0.12,

    color:
      Math.random() < 0.55
        ? '#00F0FF'
        : Math.random() < 0.5
          ? '#A855F7'
          : '#FF007F',
  })
);

export default function LoadingScreen({
  onFinishLoading,
}) {
  const [stage, setStage] = useState(0);

  const [activePreviewIndex, setActivePreviewIndex] =
    useState(0);

  const [progressPercent, setProgressPercent] =
    useState(0);

  const currentPreviewRef =
    useRef(0);

  const titleFade =
    useRef(new Animated.Value(0)).current;

  const titleGlow =
    useRef(new Animated.Value(0.4)).current;

  const titleScale =
    useRef(new Animated.Value(0.94)).current;

  const stage2Fade =
    useRef(new Animated.Value(0)).current;

  const progressBarAnim =
    useRef(new Animated.Value(0)).current;

  const imageFade =
    useRef(new Animated.Value(1)).current;

  const gridShift =
    useRef(new Animated.Value(0)).current;

  const carouselScale =
    useRef(new Animated.Value(0.96)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(titleFade, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),

      Animated.timing(titleScale, {
        toValue: 1,
        duration: 800,
        easing: Easing.out(
          Easing.cubic
        ),
        useNativeDriver: true,
      }),
    ]).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(titleGlow, {
          toValue: 1,
          duration: 900,
          easing: Easing.inOut(
            Easing.ease
          ),
          useNativeDriver: true,
        }),

        Animated.timing(titleGlow, {
          toValue: 0.45,
          duration: 900,
          easing: Easing.inOut(
            Easing.ease
          ),
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.timing(gridShift, {
        toValue: 1,
        duration: 9000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    const timer = setTimeout(
      transitionToStage2,
      1800
    );

    return () => {
      clearTimeout(timer);
    };
  }, []);

  const transitionToStage2 = () => {
    setStage(1);

    Animated.parallel([
      Animated.timing(stage2Fade, {
        toValue: 1,
        duration: 700,
        useNativeDriver: true,
      }),

      Animated.spring(carouselScale, {
        toValue: 1,
        friction: 8,
        tension: 45,
        useNativeDriver: true,
      }),
    ]).start();

    const listenerId =
      progressBarAnim.addListener(
        ({ value }) => {
          const pct = Math.floor(
            value * 100
          );

          setProgressPercent(pct);

          let newIndex = 0;

          if (pct >= 67) {
            newIndex = 2;
          } else if (pct >= 34) {
            newIndex = 1;
          }

          if (
            newIndex !==
            currentPreviewRef.current
          ) {
            currentPreviewRef.current =
              newIndex;

            swapPreviewImage(newIndex);
          }
        }
      );

    Animated.timing(progressBarAnim, {
      toValue: 1,
      duration: 4200,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start(() => {
      progressBarAnim.removeListener(
        listenerId
      );

      Haptics.notificationAsync(
        Haptics.NotificationFeedbackType.Success
      ).catch(() => {});

      if (onFinishLoading) {
        onFinishLoading();
      }
    });
  };

  const swapPreviewImage = (
    newIndex
  ) => {
    Animated.timing(imageFade, {
      toValue: 0.15,
      duration: 220,
      useNativeDriver: true,
    }).start(() => {
      setActivePreviewIndex(newIndex);

      Animated.timing(imageFade, {
        toValue: 1,
        duration: 360,
        useNativeDriver: true,
      }).start();
    });
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[
          '#020008',
          '#090218',
          '#020005',
        ]}
        style={styles.background}
      >
        {/* Particles */}
        <Canvas
          style={StyleSheet.absoluteFill}
          pointerEvents="none"
        >
          <Group>
            {PARTICLES.map((particle) => (
              <Circle
                key={particle.id}
                cx={particle.x}
                cy={particle.y}
                r={particle.r}
                color={particle.color}
                opacity={particle.opacity}
              />
            ))}
          </Group>
        </Canvas>

        {/* Animated grid */}
        <Animated.View
          pointerEvents="none"
          style={[
            StyleSheet.absoluteFill,
            {
              opacity: 0.055,
              transform: [
                {
                  translateX:
                    gridShift.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, 70],
                    }),
                },
              ],
            },
          ]}
        >
          {Array.from(
            { length: 22 }
          ).map((_, index) => (
            <View
              key={index}
              style={[
                styles.gridLine,
                {
                  left: index * 58,
                },
              ]}
            />
          ))}
        </Animated.View>

        {/* =========================
            TITLE STAGE
        ========================== */}

        {stage === 0 && (
          <Animated.View
            style={[
              styles.titleStage,
              {
                opacity: titleFade,
                transform: [
                  {
                    scale: titleScale,
                  },
                ],
              },
            ]}
          >
            <Animated.Text
              style={[
                styles.mainTitle,
                {
                  opacity: titleGlow,
                },
              ]}
            >
              DANGER DASH
            </Animated.Text>

            <Text style={styles.subTitle}>
              MOBILE • BY VHITE
            </Text>

            <View
              style={styles.loadingDots}
            >
              <Animated.View
                style={[
                  styles.dot,
                  {
                    opacity: titleGlow,
                  },
                ]}
              />

              <Animated.View
                style={[
                  styles.dot,
                  {
                    opacity:
                      titleGlow.interpolate({
                        inputRange: [
                          0.4,
                          1,
                        ],
                        outputRange: [
                          1,
                          0.35,
                        ],
                      }),
                  },
                ]}
              />

              <Animated.View
                style={[
                  styles.dot,
                  {
                    opacity:
                      titleGlow.interpolate({
                        inputRange: [
                          0.4,
                          1,
                        ],
                        outputRange: [
                          0.35,
                          1,
                        ],
                      }),
                  },
                ]}
              />
            </View>
          </Animated.View>
        )}

        {/* =========================
            GAMEPLAY PREVIEW CAROUSEL
        ========================== */}

        {stage === 1 && (
          <Animated.View
            style={[
              styles.stage2,
              {
                opacity: stage2Fade,
                transform: [
                  {
                    scale: carouselScale,
                  },
                ],
              },
            ]}
          >
            <View style={styles.previewOuter}>
              <View
                style={
                  styles.previewGlow
                }
              />

              <View
                style={
                  styles.previewCard
                }
              >
                <Animated.Image
                  source={
                    PREVIEW_IMAGES[
                      activePreviewIndex
                    ]
                  }
                  style={[
                    styles.previewImage,
                    {
                      opacity: imageFade,
                    },
                  ]}
                  resizeMode="cover"
                />

                {/* Cinematic overlay */}
                <LinearGradient
                  colors={[
                    'rgba(0,0,0,0.02)',
                    'rgba(0,0,0,0.08)',
                    'rgba(2,0,8,0.82)',
                  ]}
                  style={
                    styles.previewOverlay
                  }
                />

                {/* Preview branding */}
                <View
                  style={
                    styles.previewBrand
                  }
                >
                  <Text
                    style={
                      styles.previewBrandTitle
                    }
                  >
                    DANGER DASH
                  </Text>

                  <Text
                    style={
                      styles.previewBrandSub
                    }
                  >
                    RUN • JUMP • SURVIVE
                  </Text>
                </View>

                {/* Carousel indicators */}
                <View
                  style={
                    styles.indicators
                  }
                >
                  {PREVIEW_IMAGES.map(
                    (_, index) => (
                      <View
                        key={index}
                        style={[
                          styles.indicator,
                          index ===
                            activePreviewIndex &&
                            styles.indicatorActive,
                        ]}
                      />
                    )
                  )}
                </View>
              </View>
            </View>

            {/* Loading information */}
            <View
              style={
                styles.progressSection
              }
            >
              <View
                style={styles.textRow}
              >
                <Text
                  style={
                    styles.loadingLabel
                  }
                >
                  LOADING ASSETS & AUDIO...
                </Text>

                <Text
                  style={styles.percent}
                >
                  {progressPercent}%
                </Text>
              </View>

              <View
                style={styles.track}
              >
                <Animated.View
                  style={[
                    styles.fill,
                    {
                      width:
                        progressBarAnim.interpolate(
                          {
                            inputRange: [
                              0,
                              1,
                            ],
                            outputRange: [
                              '0%',
                              '100%',
                            ],
                          }
                        ),
                    },
                  ]}
                />
              </View>

              <View
                style={styles.statusRow}
              >
                <Text
                  style={
                    styles.statusText
                  }
                >
                  INITIALIZING RUN SYSTEM
                </Text>

                <Text
                  style={
                    styles.statusText
                  }
                >
                  VH ITE // SYSTEM ONLINE
                </Text>
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
    backgroundColor: '#020005',
  },

  background: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },

  gridLine: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: '#00F0FF',
  },

  titleStage: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  mainTitle: {
    color: '#FFFFFF',
    fontSize: 52,
    fontWeight: '900',
    letterSpacing: 6,
    textShadowColor: '#00F0FF',
    textShadowOffset: {
      width: 0,
      height: 0,
    },
    textShadowRadius: 20,
    fontFamily: 'sans-serif-condensed',
  },

  subTitle: {
    marginTop: 12,
    color: '#A855F7',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 5,
  },

  loadingDots: {
    flexDirection: 'row',
    gap: 9,
    marginTop: 28,
  },

  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#00F0FF',
  },

  stage2: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },

  previewOuter: {
    width: '76%',
    height: '66%',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },

  previewGlow: {
    position: 'absolute',
    width: '98%',
    height: '96%',
    borderRadius: 18,
    backgroundColor: '#00F0FF',
    opacity: 0.14,
  },

  previewCard: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#00F0FF',
    backgroundColor: '#08020F',
    elevation: 12,
  },

  previewImage: {
    width: '100%',
    height: '100%',
  },

  previewOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },

  previewBrand: {
    position: 'absolute',
    left: 20,
    bottom: 24,
  },

  previewBrandTitle: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 3,
    textShadowColor: '#00F0FF',
    textShadowRadius: 8,
  },

  previewBrandSub: {
    color: '#A855F7',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 3,
    marginTop: 5,
  },

  indicators: {
    position: 'absolute',
    right: 18,
    bottom: 22,
    flexDirection: 'row',
    gap: 6,
  },

  indicator: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.35)',
  },

  indicatorActive: {
    width: 20,
    backgroundColor: '#00F0FF',
  },

  progressSection: {
    width: '76%',
    marginTop: 18,
  },

  textRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },

  loadingLabel: {
    color: '#A855F7',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 2,
  },

  percent: {
    color: '#00FFCC',
    fontSize: 13,
    fontWeight: '900',
    fontFamily: 'monospace',
  },

  track: {
    height: 7,
    width: '100%',
    overflow: 'hidden',
    borderRadius: 4,
    backgroundColor: '#181024',
    borderWidth: 1,
    borderColor: '#312047',
  },

  fill: {
    height: '100%',
    backgroundColor: '#00FFCC',
  },

  statusRow: {
    marginTop: 7,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  statusText: {
    color: '#5E5A70',
    fontSize: 8,
    fontWeight: '700',
    letterSpacing: 1.3,
  },
});