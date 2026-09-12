import { useState, useRef, useCallback, useEffect } from 'react';
import * as Haptics from 'expo-haptics';
import { GAME_CONFIG } from '../constants/gameConfig';
import { playSFX, playMusic, stopMusic, setMusicSpeedSync } from './audioManager';
import { speakQuip } from './ttsManager';
import { getRandomQuip } from '../constants/quips';

const POWER_TYPES = GAME_CONFIG.POWER_TYPES;
const ITEM_TYPES = GAME_CONFIG.ITEM_TYPES;
const POWER_KEYS = Object.values(POWER_TYPES);

export function useGameLoop() {
  // === Render State ===
  const [gameState, setGameState] = useState(GAME_CONFIG.STATE.MENU);
  const [score, setScore] = useState(0);
  const [coins, setCoins] = useState(0);
  const [health, setHealth] = useState(GAME_CONFIG.MAX_HEALTH);
  const [hasShield, setHasShield] = useState(false);
  const [isGrounded, setIsGrounded] = useState(false);
  const [animFrame, setAnimFrame] = useState(0);
  const [playerX, setPlayerX] = useState(GAME_CONFIG.PLAYER_START_X);
  const [playerY, setPlayerY] = useState(GAME_CONFIG.PLAYER_START_Y);
  const [powerJumpFlash, setPowerJumpFlash] = useState(0);
  const [platforms, setPlatforms] = useState([]);
  const [items, setItems] = useState([]);
  const [activePower, setActivePower] = useState(null);
  const [powerTimer, setPowerTimer] = useState(0);
  const [combo, setCombo] = useState(0);
  const [gravityFlipped, setGravityFlipped] = useState(false);
  const [deathFadeAlpha, setDeathFadeAlpha] = useState(0);
  const [highScore, setHighScore] = useState(0);

  // === Engine Refs ===
  const playerYRef = useRef(GAME_CONFIG.PLAYER_START_Y);
  const playerVelocityYRef = useRef(0);
  const isGroundedRef = useRef(false);
  const jumpCountRef = useRef(0);
  const currentSpeedRef = useRef(GAME_CONFIG.BASE_SPEED);
  const invincibilityTimerRef = useRef(0);
  const hasShieldRef = useRef(false);
  const healthRef = useRef(GAME_CONFIG.MAX_HEALTH);
  const coinsRef = useRef(0);
  const frameTickRef = useRef(0);
  const activePowerRef = useRef(null);
  const powerTimerRef = useRef(0);
  const comboRef = useRef(0);
  const comboTimerRef = useRef(0);
  const gravityFlippedRef = useRef(false);
  const longAirStartRef = useRef(0);
  const lastSpeedQuipAtRef = useRef(0);
  const highScoreRef = useRef(0);

  const lastTapTimestampRef = useRef(0);
  const lastPowerJumpTimestampRef = useRef(0);
  const distanceTraveledRef = useRef(0);
  const lastReportedScoreRef = useRef(-1);
  const platformsRef = useRef([]);
  const itemsRef = useRef([]);
  const powerJumpFlashRef = useRef(0);
  const gameStateRef = useRef(gameState);
  const rafIdRef = useRef(null);
  const deathFadeRef = useRef(0);

  useEffect(() => {
    gameStateRef.current = gameState;
  }, [gameState]);

  const pickRandomPower = () => POWER_KEYS[Math.floor(Math.random() * POWER_KEYS.length)];

  // === Item spawner ===
  const spawnItemsForPlatform = (plat) => {
    const spawned = [];
    const hazardRoll = Math.random();
    let hasHazard = false;

    // Spikes (35% on wide platforms)
    if (plat.width > 220 && hazardRoll < 0.35) {
      spawned.push({
        id: `spike_${plat.id}`,
        type: ITEM_TYPES.SPIKE,
        x: plat.x + plat.width / 2 - GAME_CONFIG.SPIKE_WIDTH / 2,
        y: plat.y - GAME_CONFIG.SPIKE_HEIGHT,
        width: GAME_CONFIG.SPIKE_WIDTH,
        height: GAME_CONFIG.SPIKE_HEIGHT,
      });
      hasHazard = true;
    }
    // Boost pad (20% on long platforms)
    else if (plat.width > 260 && hazardRoll >= 0.35 && hazardRoll < 0.55) {
      spawned.push({
        id: `boost_${plat.id}`,
        type: ITEM_TYPES.BOOST_PAD,
        x: plat.x + 40,
        y: plat.y - GAME_CONFIG.BOOST_PAD_HEIGHT,
        width: GAME_CONFIG.BOOST_PAD_WIDTH,
        height: GAME_CONFIG.BOOST_PAD_HEIGHT,
      });
      hasHazard = true;
    }

    // Power orb (14% — only if no hazard)
    if (!hasHazard && Math.random() < 0.14) {
      spawned.push({
        id: `orb_${plat.id}`,
        type: ITEM_TYPES.POWER_ORB,
        powerType: pickRandomPower(),
        x: plat.x + plat.width / 2 - GAME_CONFIG.POWER_ORB_SIZE / 2,
        y: plat.y - 65,
        width: GAME_CONFIG.POWER_ORB_SIZE,
        height: GAME_CONFIG.POWER_ORB_SIZE,
      });
    }

    // Coin arc (60%)
    if (Math.random() < 0.6) {
      const coinCount = Math.floor(Math.random() * 3) + 2;
      const startX = hasHazard ? plat.x + plat.width - 90 : plat.x + 30;
      for (let i = 0; i < coinCount; i++) {
        spawned.push({
          id: `coin_${plat.id}_${i}`,
          type: ITEM_TYPES.COIN,
          x: startX + i * 32,
          y: plat.y - 40 - Math.sin((i / coinCount) * Math.PI) * 20,
          width: GAME_CONFIG.COIN_SIZE,
          height: GAME_CONFIG.COIN_SIZE,
        });
      }
    }

    return spawned;
  };

  // === Start Game ===
  const startGame = useCallback(() => {
    playerYRef.current = GAME_CONFIG.PLAYER_START_Y;
    playerVelocityYRef.current = 0;
    isGroundedRef.current = false;
    jumpCountRef.current = 0;
    currentSpeedRef.current = GAME_CONFIG.BASE_SPEED;
    invincibilityTimerRef.current = 0;
    hasShieldRef.current = false;
    healthRef.current = GAME_CONFIG.MAX_HEALTH;
    coinsRef.current = 0;
    frameTickRef.current = 0;
    activePowerRef.current = null;
    powerTimerRef.current = 0;
    comboRef.current = 0;
    comboTimerRef.current = 0;
    gravityFlippedRef.current = false;
    distanceTraveledRef.current = 0;
    lastReportedScoreRef.current = -1;
    lastTapTimestampRef.current = 0;
    lastPowerJumpTimestampRef.current = 0;
    powerJumpFlashRef.current = 0;
    deathFadeRef.current = 0;

    const initialPlatforms = [
      { id: Date.now(), x: 0, y: GAME_CONFIG.GROUND_Y, width: 520, height: GAME_CONFIG.PLATFORM_HEIGHT },
      { id: Date.now() + 1, x: 660, y: GAME_CONFIG.GROUND_Y, width: 380, height: GAME_CONFIG.PLATFORM_HEIGHT },
    ];
    platformsRef.current = initialPlatforms;
    itemsRef.current = [];

    setPlayerX(GAME_CONFIG.PLAYER_START_X);
    setPlayerY(GAME_CONFIG.PLAYER_START_Y);
    setPowerJumpFlash(0);
    setPlatforms(initialPlatforms);
    setItems([]);
    setScore(0);
    setCoins(0);
    setHealth(GAME_CONFIG.MAX_HEALTH);
    setHasShield(false);
    setIsGrounded(false);
    setAnimFrame(0);
    setActivePower(null);
    setPowerTimer(0);
    setCombo(0);
    setGravityFlipped(false);
    setDeathFadeAlpha(0);
    setGameState(GAME_CONFIG.STATE.PLAYING);

    playMusic('gameplay_track_1');
    speakQuip('Run!', { force: true });
  }, []);

  // === Game Over ===
  const triggerGameOver = useCallback((isNewHigh) => {
    setGameState(GAME_CONFIG.STATE.GAMEOVER);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    playSFX('water_splash');
    stopMusic();
    setTimeout(() => playSFX('game_over'), 250);
    const quip = isNewHigh ? getRandomQuip('HIGH_SCORE') : getRandomQuip('DEATH');
    speakQuip(quip, { force: true });
    if (isNewHigh) {
      highScoreRef.current = distanceTraveledRef.current;
      setHighScore(Math.floor(distanceTraveledRef.current));
    }
  }, []);

  // === Handle Tap ===
  const handleScreenTap = useCallback(() => {
    const currentState = gameStateRef.current;

    if (currentState === GAME_CONFIG.STATE.MENU || currentState === GAME_CONFIG.STATE.GAMEOVER) {
      playSFX('ui_click');
      startGame();
      return;
    }

    if (currentState !== GAME_CONFIG.STATE.PLAYING) return;

    const now = Date.now();
    const timeSinceLastTap = now - lastTapTimestampRef.current;
    const timeSinceLastPowerJump = now - lastPowerJumpTimestampRef.current;

    // Double tap → Power Jump
    if (
      timeSinceLastTap <= GAME_CONFIG.DOUBLE_TAP_WINDOW &&
      timeSinceLastPowerJump >= GAME_CONFIG.POWER_JUMP_COOLDOWN
    ) {
      const sign = gravityFlippedRef.current ? -1 : 1;
      playerVelocityYRef.current = GAME_CONFIG.POWER_JUMP_FORCE * sign;
      isGroundedRef.current = false;
      jumpCountRef.current = GAME_CONFIG.MAX_MIDAIR_JUMPS + 1;
      lastPowerJumpTimestampRef.current = now;
      powerJumpFlashRef.current = 1.0;
      setPowerJumpFlash(1.0);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      playSFX('power_jump');
    }
    // Single tap → Jump
    else if (isGroundedRef.current || jumpCountRef.current < GAME_CONFIG.MAX_MIDAIR_JUMPS) {
      const sign = gravityFlippedRef.current ? -1 : 1;
      const jumpForce =
        activePowerRef.current === POWER_TYPES.FLOAT
          ? GAME_CONFIG.JUMP_FORCE * GAME_CONFIG.FLOAT_JUMP_MULT
          : GAME_CONFIG.JUMP_FORCE;
      playerVelocityYRef.current = jumpForce * sign;
      isGroundedRef.current = false;
      jumpCountRef.current += 1;
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      playSFX('jump');
    }

    lastTapTimestampRef.current = now;
  }, [startGame]);

  // === Activate power ===
  const activatePower = (powerType) => {
    activePowerRef.current = powerType;
    powerTimerRef.current = GAME_CONFIG.POWER_DURATION[powerType] || 300;
    setActivePower(powerType);
    setPowerTimer(powerTimerRef.current);

    if (powerType === POWER_TYPES.SHIELD) {
      hasShieldRef.current = true;
      setHasShield(true);
    }
    if (powerType === POWER_TYPES.GRAVITY_FLIP) {
      gravityFlippedRef.current = true;
      setGravityFlipped(true);
    }

    playSFX('powerup');
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    speakQuip(`${powerType.replace('_', ' ')} activated`);
  };

  // === Main Game Loop ===
  useEffect(() => {
    if (gameState !== GAME_CONFIG.STATE.PLAYING) return;

    let cancelled = false;

    const updateFrame = () => {
      if (cancelled) return;

      frameTickRef.current += 1;
      const now = Date.now();

      // Speed ramp
      if (currentSpeedRef.current < GAME_CONFIG.MAX_SPEED) {
        currentSpeedRef.current += GAME_CONFIG.SPEED_ACCELERATION;
      }

      // Coin speed bonus
      currentSpeedRef.current = Math.min(
        GAME_CONFIG.MAX_SPEED + (activePowerRef.current === POWER_TYPES.SPEED ? GAME_CONFIG.SPEED_POWER_BOOST : 0),
        GAME_CONFIG.BASE_SPEED + coinsRef.current * GAME_CONFIG.COIN_SPEED_BONUS + 
          (activePowerRef.current === POWER_TYPES.SPEED ? GAME_CONFIG.SPEED_POWER_BOOST : 0) +
          (frameTickRef.current * GAME_CONFIG.SPEED_ACCELERATION)
      );

      // Music speed sync
      setMusicSpeedSync(currentSpeedRef.current);

      // Invincibility
      if (invincibilityTimerRef.current > 0) invincibilityTimerRef.current -= 1;

      // Power timer
      if (activePowerRef.current && activePowerRef.current !== POWER_TYPES.SHIELD) {
        powerTimerRef.current -= 1;
        setPowerTimer(Math.max(0, powerTimerRef.current));
        if (powerTimerRef.current <= 0) {
          if (activePowerRef.current === POWER_TYPES.GRAVITY_FLIP) {
            gravityFlippedRef.current = false;
            setGravityFlipped(false);
          }
          activePowerRef.current = null;
          setActivePower(null);
        }
      }

      // Combo decay (frame-based = exactly 5s)
      if (comboTimerRef.current > 0) {
        comboTimerRef.current -= 1;
        if (comboTimerRef.current <= 0) {
          comboRef.current = 0;
          setCombo(0);
        }
      }

      // Gravity
      const gravitySign = gravityFlippedRef.current ? -1 : 1;
      let appliedGravity = GAME_CONFIG.GRAVITY * gravitySign;

      if (activePowerRef.current === POWER_TYPES.FLOAT) {
        appliedGravity *= GAME_CONFIG.FLOAT_GRAVITY_MULT;
      }
      if (playerVelocityYRef.current * gravitySign > 0) {
        appliedGravity *= GAME_CONFIG.FALL_GRAVITY_MULTIPLIER;
      }

      playerVelocityYRef.current = Math.max(
        -GAME_CONFIG.MAX_FALL_SPEED,
        Math.min(GAME_CONFIG.MAX_FALL_SPEED, playerVelocityYRef.current + appliedGravity)
      );
      playerYRef.current += playerVelocityYRef.current;

      // Long-air quip
      if (!isGroundedRef.current) {
        if (longAirStartRef.current === 0) longAirStartRef.current = now;
        else if (now - longAirStartRef.current > 1500) {
          speakQuip(getRandomQuip('LONG_AIR'));
          longAirStartRef.current = now;
        }
      } else {
        longAirStartRef.current = 0;
      }

      // High speed quip
      if (currentSpeedRef.current > GAME_CONFIG.MAX_SPEED * 0.85) {
        if (now - lastSpeedQuipAtRef.current > 12000) {
          lastSpeedQuipAtRef.current = now;
          speakQuip(getRandomQuip('HIGH_SPEED'));
        }
      }

      // Platforms
      let updatedPlatforms = platformsRef.current.map((p) => ({
        ...p,
        x: p.x - currentSpeedRef.current,
      }));

      if (updatedPlatforms.length > 0 && updatedPlatforms[0].x + updatedPlatforms[0].width < -100) {
        updatedPlatforms.shift();
      }

      const lastPlatform = updatedPlatforms[updatedPlatforms.length - 1];
      if (lastPlatform && lastPlatform.x + lastPlatform.width < GAME_CONFIG.VIRTUAL_WIDTH + 200) {
        const gap = GAME_CONFIG.STANDARD_GAP + Math.random() * (GAME_CONFIG.MAX_GAP - GAME_CONFIG.STANDARD_GAP);
        const newWidth = GAME_CONFIG.MIN_PLATFORM_WIDTH + Math.random() * (GAME_CONFIG.MAX_PLATFORM_WIDTH - GAME_CONFIG.MIN_PLATFORM_WIDTH);

        const newPlat = {
          id: Date.now() + Math.random(),
          x: lastPlatform.x + lastPlatform.width + gap,
          y: GAME_CONFIG.GROUND_Y,
          width: newWidth,
          height: GAME_CONFIG.PLATFORM_HEIGHT,
        };

        updatedPlatforms.push(newPlat);
        const newItems = spawnItemsForPlatform(newPlat);
        itemsRef.current = [...itemsRef.current, ...newItems];
      }

      platformsRef.current = updatedPlatforms;

      // Scroll items
      const updatedItems = itemsRef.current
        .map((it) => ({ ...it, x: it.x - currentSpeedRef.current }))
        .filter((it) => it.x + it.width > -50);

      // Collisions
      const pX = GAME_CONFIG.PLAYER_START_X;
      const pW = GAME_CONFIG.PLAYER_WIDTH;
      const pH = GAME_CONFIG.PLAYER_HEIGHT;
      const currentBottom = playerYRef.current + pH;
      const prevBottom = currentBottom - playerVelocityYRef.current;

      let landed = false;

      for (let i = 0; i < updatedPlatforms.length; i++) {
        const plat = updatedPlatforms[i];
        const horizontalOverlap = pX + pW > plat.x && pX < plat.x + plat.width;

        if (!gravityFlippedRef.current) {
          const verticalCross = currentBottom >= plat.y && prevBottom <= plat.y + 12;
          const falling = playerVelocityYRef.current >= 0;
          if (horizontalOverlap && verticalCross && falling) {
            playerYRef.current = plat.y - pH;
            playerVelocityYRef.current = 0;
            isGroundedRef.current = true;
            jumpCountRef.current = 0;
            landed = true;
            break;
          }
        } else {
          const playerTop = playerYRef.current;
          const prevTop = playerTop - playerVelocityYRef.current;
          if (horizontalOverlap && playerTop <= plat.y + plat.height && prevTop >= plat.y + plat.height - 12) {
            playerYRef.current = plat.y + plat.height;
            playerVelocityYRef.current = 0;
            isGroundedRef.current = true;
            jumpCountRef.current = 0;
            landed = true;
            break;
          }
        }
      }

      if (!landed) isGroundedRef.current = false;

      // Item collisions
      const remainingItems = [];
      const pY = playerYRef.current;

      for (let i = 0; i < updatedItems.length; i++) {
        const item = updatedItems[i];
        const collides =
          pX + pW > item.x &&
          pX < item.x + item.width &&
          pY + pH > item.y &&
          pY < item.y + item.height;

        if (collides) {
          if (item.type === ITEM_TYPES.COIN) {
            const mult = activePowerRef.current === POWER_TYPES.SCORE_DOUBLER ? 2 : 1;
            coinsRef.current += 1 * mult;
            setCoins(coinsRef.current);
            playSFX('coin_pickup');
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

            comboRef.current += 1;
            comboTimerRef.current = GAME_CONFIG.COMBO_TIMEOUT_FRAMES;
            setCombo(comboRef.current);

            if (comboRef.current === 5) speakQuip(getRandomQuip('COMBO_5'));
            else if (comboRef.current === 10) speakQuip(getRandomQuip('COMBO_10'));
            else if (comboRef.current === 15) speakQuip(getRandomQuip('COMBO_15'));
            continue;
          }

          if (item.type === ITEM_TYPES.POWER_ORB) {
            activatePower(item.powerType);
            comboRef.current += 1;
            comboTimerRef.current = GAME_CONFIG.COMBO_TIMEOUT_FRAMES;
            setCombo(comboRef.current);
            continue;
          }

          if (item.type === ITEM_TYPES.BOOST_PAD) {
            const sign = gravityFlippedRef.current ? -1 : 1;
            playerVelocityYRef.current = GAME_CONFIG.JUMP_FORCE * 1.1 * sign;
            currentSpeedRef.current = Math.min(
              GAME_CONFIG.MAX_SPEED,
              currentSpeedRef.current * GAME_CONFIG.BOOST_SPEED_MULTIPLIER
            );
            playSFX('boost_pad');
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            continue;
          }

          if (item.type === ITEM_TYPES.SPIKE) {
            if (invincibilityTimerRef.current === 0) {
              if (hasShieldRef.current) {
                hasShieldRef.current = false;
                setHasShield(false);
                playSFX('shield_hit');
                invincibilityTimerRef.current = GAME_CONFIG.INVINCIBILITY_FRAMES;
                speakQuip(getRandomQuip('SHIELD_SAVE'));
              } else {
                healthRef.current = Math.max(0, healthRef.current - 1);
                setHealth(healthRef.current);
                playSFX('heart_lost');
                invincibilityTimerRef.current = GAME_CONFIG.INVINCIBILITY_FRAMES;
                speakQuip(getRandomQuip('HEART_LOST'));

                if (healthRef.current <= 0) {
                  const isNewHigh = distanceTraveledRef.current > highScoreRef.current;
                  triggerGameOver(isNewHigh);
                  return;
                }
              }
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
            }
          }
        }

        remainingItems.push(item);
      }

      itemsRef.current = remainingItems;

      // Flash decay
      if (powerJumpFlashRef.current > 0) {
        powerJumpFlashRef.current = Math.max(0, powerJumpFlashRef.current - 0.08);
      }

      // Score (with combo bonus)
      const scoreMult =
        (activePowerRef.current === POWER_TYPES.SCORE_DOUBLER ? 2 : 1) *
        (1 + comboRef.current * GAME_CONFIG.COMBO_SCORE_BONUS);
      distanceTraveledRef.current += currentSpeedRef.current * 0.2 * scoreMult;
      const newScore = Math.floor(distanceTraveledRef.current);
      if (newScore !== lastReportedScoreRef.current) {
        lastReportedScoreRef.current = newScore;
        setScore(newScore);
      }

      // Sync
      setPlayerX(pX);
      setPlayerY(playerYRef.current);
      setIsGrounded(isGroundedRef.current);
      setAnimFrame(Math.floor(frameTickRef.current / 4));
      setPlatforms(updatedPlatforms);
      setItems(remainingItems);
      setPowerJumpFlash(powerJumpFlashRef.current);

      // Fall death
      if (playerYRef.current + pH >= GAME_CONFIG.FALL_DEATH_Y || playerYRef.current < -100) {
        const isNewHigh = distanceTraveledRef.current > highScoreRef.current;
        triggerGameOver(isNewHigh);
        return;
      }

      rafIdRef.current = requestAnimationFrame(updateFrame);
    };

    rafIdRef.current = requestAnimationFrame(updateFrame);

    return () => {
      cancelled = true;
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    };
  }, [gameState, triggerGameOver]);

  // Death fade animation
  useEffect(() => {
    if (gameState !== GAME_CONFIG.STATE.GAMEOVER) return;
    deathFadeRef.current = 0;
    setDeathFadeAlpha(0);
    const interval = setInterval(() => {
      deathFadeRef.current = Math.min(1, deathFadeRef.current + 0.05);
      setDeathFadeAlpha(deathFadeRef.current);
      if (deathFadeRef.current >= 1) clearInterval(interval);
    }, 30);
    return () => clearInterval(interval);
  }, [gameState]);

  return {
    gameState,
    score,
    coins,
    health,
    hasShield,
    isGrounded,
    animFrame,
    playerX,
    playerY,
    powerJumpFlash,
    platforms,
    items,
    activePower,
    powerTimer,
    combo,
    gravityFlipped,
    deathFadeAlpha,
    highScore,
    handleScreenTap,
    startGame,
  };
}