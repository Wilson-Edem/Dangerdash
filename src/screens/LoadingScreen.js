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
} from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';

import * as Haptics from 'expo-haptics';

const PREVIEW_IMAGES = [
  require('../../assets/images/preview1.png'),
  require('../../assets/images/preview2.png'),
  require('../../assets/images/preview3.png'),
];

export default function LoadingScreen({
  onFinishLoading,
}) {
  /*
   * 0 = title
   * 1 = gameplay preview + progress
   */
  const [stage, setStage] =
    useState(0);

  const [
    activePreviewIndex,
    setActivePreviewIndex,
  ] = useState(0);

  const [
    progressPercent,
    setProgressPercent,
  ] = useState(0);

  const currentPreviewRef =
    useRef(0);

  const titleFade =
    useRef(
      new Animated.Value(0)
    ).current;

  const titleGlow =
    useRef(
      new Animated.Value(0.4)
    ).current;

  const titleScale =
    useRef(
      new Animated.Value(0.94)
    ).current;

  const stage2Fade =
    useRef(
      new Animated.Value(0)
    ).current;

  const progressBarAnim =
    useRef(
      new Animated.Value(0)
    ).current;

  const imageFade =
    useRef(
      new Animated.Value(1)
    ).current;

  const carouselScale =
    useRef(
      new Animated.Value(0.96)
    ).current;

  const transitionTimerRef =
    useRef(null);

  const progressListenerRef =
    useRef(null);

  const progressAnimationRef =
    useRef(null);

  const imageAnimationRef =
    useRef(null);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(
        titleFade,
        {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }
      ),

      Animated.timing(
        titleScale,
        {
          toValue: 1,
          duration: 800,
          easing: Easing.out(
            Easing.cubic
          ),
          useNativeDriver: true,
        }
      ),
    ]).start();

    const glowLoop =
      Animated.loop(
        Animated.sequence([
          Animated.timing(
            titleGlow,
            {
              toValue: 1,
              duration: 900,
              easing:
                Easing.inOut(
                  Easing.ease
                ),
              useNativeDriver: true,
            }
          ),

          Animated.timing(
            titleGlow,
            {
              toValue: 0.45,
              duration: 900,
              easing:
                Easing.inOut(
                  Easing.ease
                ),
              useNativeDriver: true,
            }
          ),
        ])
      );

    glowLoop.start();

    transitionTimerRef.current =
      setTimeout(() => {
        setStage(1);

        Animated.parallel([
          Animated.timing(
            stage2Fade,
            {
              toValue: 1,
              duration: 700,
              useNativeDriver: true,
            }
          ),

          Animated.spring(
            carouselScale,
            {
              toValue: 1,
              friction: 8,
              tension: 45,
              useNativeDriver: true,
            }
          ),
        ]).start();

        /*
         * Progress controls both:
         *
         * 0-33%   = preview 1
         * 34-66%  = preview 2
         * 67-100% = preview 3
         */
        progressListenerRef.current =
          progressBarAnim.addListener(
            ({ value }) => {
              const pct =
                Math.floor(
                  value * 100
                );

              setProgressPercent(
                pct
              );

              let newIndex = 0;

              if (pct >= 67) {
                newIndex = 2;
              } else if (
                pct >= 34
              ) {
                newIndex = 1;
              }

              if (
                newIndex !==
                currentPreviewRef.current
              ) {
                currentPreviewRef.current =
                  newIndex;

                Animated.timing(
                  imageFade,
                  {
                    toValue: 0.15,
                    duration: 220,
                    useNativeDriver: true,
                  }
                ).start(() => {
                  setActivePreviewIndex(
                    newIndex
                  );

                  imageAnimationRef.current =
                    Animated.timing(
                      imageFade,
                      {
                        toValue: 1,
                        duration: 360,
                        useNativeDriver: true,
                      }
                    );

                  imageAnimationRef.current.start();
                });
              }
            }
          );

        progressAnimationRef.current =
          Animated.timing(
            progressBarAnim,
            {
              toValue: 1,
              duration: 4200,
              easing: Easing.linear,
              useNativeDriver: false,
            }
          );

        progressAnimationRef.current.start(
          () => {
            if (
              progressListenerRef.current
            ) {
              progressBarAnim.removeListener(
                progressListenerRef.current
              );

              progressListenerRef.current =
                null;
            }

            Haptics.notificationAsync(
              Haptics.NotificationFeedbackType
                .Success
            ).catch(() => {});

            if (
              onFinishLoading
            ) {
              onFinishLoading();
            }
          }
        );
      }, 1800);

    return () => {
      if (
        transitionTimerRef.current
      ) {
        clearTimeout(
          transitionTimerRef.current
        );
      }

      glowLoop.stop();

      if (
        progressAnimationRef.current
      ) {
        progressAnimationRef.current.stop();
      }

      if (
        imageAnimationRef.current
      ) {
        imageAnimationRef.current.stop();
      }

      if (
        progressListenerRef.current
      ) {
        progressBarAnim.removeListener(
          progressListenerRef.current
        );

        progressListenerRef.current =
          null;
      }
    };
  }, []);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[
          '#020107',
          '#020107',
          '#020107',
        ]}
        style={styles.background}
      >
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
                    scale:
                      titleScale,
                  },
                ],
              },
            ]}
          >
            <Animated.Text
              style={[
                styles.mainTitle,
                {
                  opacity:
                    titleGlow,
                },
              ]}
            >
              DANGER DASH
            </Animated.Text>

            <Text
              style={
                styles.subTitle
              }
            >
              MOBILE • BY VHITE
            </Text>

            <View
              style={
                styles.loadingDots
              }
            >
              <Animated.View
                style={[
                  styles.dot,
                  {
                    opacity:
                      titleGlow,
                  },
                ]}
              />

              <Animated.View
                style={[
                  styles.dot,
                  {
                    opacity:
                      titleGlow.interpolate(
                        {
                          inputRange: [
                            0.4,
                            1,
                          ],
                          outputRange: [
                            1,
                            0.35,
                          ],
                        }
                      ),
                  },
                ]}
              />

              <Animated.View
                style={[
                  styles.dot,
                  {
                    opacity:
                      titleGlow.interpolate(
                        {
                          inputRange: [
                            0.4,
                            1,
                          ],
                          outputRange: [
                            0.35,
                            1,
                          ],
                        }
                      ),
                  },
                ]}
              />
            </View>
          </Animated.View>
        )}

        {/* =========================
            GAMEPLAY PREVIEW
        ========================== */}

        {stage === 1 && (
          <Animated.View
            style={[
              styles.stage2,
              {
                opacity:
                  stage2Fade,

                transform: [
                  {
                    scale:
                      carouselScale,
                  },
                ],
              },
            ]}
          >
            <View
              style={
                styles.previewOuter
              }
            >
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
                      opacity:
                        imageFade,
                    },
                  ]}
                  resizeMode="cover"
                />
              </View>
            </View>

            {/* =========================
                PROGRESS
            ========================== */}

            <View
              style={
                styles.progressSection
              }
            >
              <View
                style={
                  styles.textRow
                }
              >
                <Text
                  style={
                    styles.loadingLabel
                  }
                >
                  LOADING ASSETS & AUDIO...
                </Text>

                <Text
                  style={
                    styles.percent
                  }
                >
                  {progressPercent}%
                </Text>
              </View>

              <View
                style={
                  styles.track
                }
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
    backgroundColor: '#020107',
  },

  background: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
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

    fontFamily:
      'sans-serif-condensed',
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

  /*
   * Reference screenshot:
   *
   * approximately 75% width
   * approximately 52% height
   *
   * This keeps the large gameplay preview while
   * matching the supplied loading layout.
   */
  previewOuter: {
    width: '75%',
    height: '52%',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },

  previewGlow: {
    position: 'absolute',

    width: '98%',
    height: '96%',

    borderRadius: 18,

    backgroundColor:
      '#7C2BCB',

    opacity: 0.10,
  },

  previewCard: {
    width: '100%',
    height: '100%',

    borderRadius: 16,

    overflow: 'hidden',

    borderWidth: 2,

    borderColor:
      '#5B1AA8',

    backgroundColor:
      '#08020F',

    elevation: 12,
  },

  previewImage: {
    width: '100%',
    height: '100%',
  },

  progressSection: {
    width: '75%',
    marginTop: 18,
  },

  textRow: {
    flexDirection: 'row',
    justifyContent:
      'space-between',
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

    backgroundColor:
      '#181024',

    borderWidth: 1,

    borderColor:
      '#312047',
  },

  fill: {
    height: '100%',
    backgroundColor:
      '#00FFCC',
  },
});