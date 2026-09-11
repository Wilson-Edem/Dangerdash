import { useState, useRef, useCallback, useEffect } from 'react';
import * as Haptics from 'expo-haptics';
import { GAME_CONFIG } from '../constants/gameConfig';
import { playSFX, playMusic, stopMusic } from './audioManager';

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

  const lastTapTimestampRef = useRef(0);
  const lastPowerJumpTimestampRef = useRef(0);
  const distanceTraveledRef = useRef(0);
  const lastReportedScoreRef = useRef(-1);
  const platformsRef = useRef([]);
  const itemsRef = useRef([]);
  const powerJumpFlashRef = useRef(0);
  const gameStateRef = useRef(gameState);
  const rafIdRef = useRef(null);

  useEffect(() => {
    gameStateRef.current = gameState;
  }, [gameState]);

  const spawnItemsForPlatform = (plat) => {
    const spawned = [];
    const hazardRoll = Math.random();
    let hasHazard = false;

    if (plat.width > 220 && hazardRoll < 0.35) {
      spawned.push({
        id: `spike_${plat.id}`,
        type: GAME_CONFIG.ITEM_TYPES.SPIKE,
        x: plat.x + plat.width / 2 - GAME_CONFIG.SPIKE_WIDTH / 2,
        y: plat.y - GAME_CONFIG.SPIKE_HEIGHT,
        width: GAME_CONFIG.SPIKE_WIDTH,
        height: GAME_CONFIG.SPIKE_HEIGHT,
      });
      hasHazard = true;
    } else if (plat.width > 260 && hazardRoll >= 0.35 && hazardRoll < 0.55) {
      spawned.push({
        id: `boost_${plat.id}`,
        type: GAME_CONFIG.ITEM_TYPES.BOOST_PAD,
        x: plat.x + 40,
        y: plat.y - GAME_CONFIG.BOOST_PAD_HEIGHT,
        width: GAME_CONFIG.BOOST_PAD_WIDTH,
        height: GAME_CONFIG.BOOST_PAD_HEIGHT,
      });
      hasHazard = true;
    }

    const itemRoll = Math.random();
    if (!hasHazard && itemRoll < 0.15) {
      spawned.push({
        id: `shield_${plat.id}`,
        type: GAME_CONFIG.ITEM_TYPES.SHIELD,
        x: plat.x + plat.width / 2,
        y: plat.y - 50,
        width: GAME_CONFIG.SHIELD_ITEM_SIZE,
        height: GAME_CONFIG.SHIELD_ITEM_SIZE,
      });
    } else if (itemRoll >= 0.15 && itemRoll < 0.75) {
      const coinCount = Math.floor(Math.random() * 3) + 2;
      const startX = hasHazard ? plat.x + plat.width - 90 : plat.x + 30;
      for (let i = 0; i < coinCount; i++) {
        spawned.push({
          id: `coin_${plat.id}_${i}`,
          type: GAME_CONFIG.ITEM_TYPES.COIN,
          x: startX + i * 28,
          y: plat.y - 40 - Math.sin((i / coinCount) * Math.PI) * 20,
          width: GAME_CONFIG.COIN_SIZE,
          height: GAME_CONFIG.COIN_SIZE,
        });
      }
    }

    return spawned;
  };

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

    distanceTraveledRef.current = 0;
    lastReportedScoreRef.current = -1;
    lastTapTimestampRef.current = 0;
    lastPowerJumpTimestampRef.current = 0;
    powerJumpFlashRef.current = 0;

    const initialPlatforms = [
      { id: Date.now(), x: 0, y: GAME_CONFIG.GROUND_Y, width: 500, height: GAME_CONFIG.PLATFORM_HEIGHT },
      { id: Date.now() + 1, x: 620, y: GAME_CONFIG.GROUND_Y, width: 400, height: GAME_CONFIG.PLATFORM_HEIGHT },
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
    setGameState(GAME_CONFIG.STATE.PLAYING);

    playMusic('gameplay_track_1');
  }, []);

  const triggerGameOver = useCallback(() => {
    setGameState(GAME_CONFIG.STATE.GAMEOVER);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    playSFX('water_splash');
    playSFX('game_over');
    stopMusic();
  }, []);

  const handleScreenTap = useCallback(() => {
    const currentState = gameStateRef.current;

    if (currentState === GAME_CONFIG.STATE.MENU || currentState === GAME_CONFIG.STATE.GAMEOVER) {
      startGame();
      return;
    }

    if (currentState !== GAME_CONFIG.STATE.PLAYING) return;

    const now = Date.now();
    const timeSinceLastTap = now - lastTapTimestampRef.current;
    const timeSinceLastPowerJump = now - lastPowerJumpTimestampRef.current;

    if (
      timeSinceLastTap <= GAME_CONFIG.DOUBLE_TAP_WINDOW &&
      timeSinceLastPowerJump >= GAME_CONFIG.POWER_JUMP_COOLDOWN
    ) {
      playerVelocityYRef.current = GAME_CONFIG.POWER_JUMP_FORCE;
      isGroundedRef.current = false;
      jumpCountRef.current = GAME_CONFIG.MAX_MIDAIR_JUMPS + 1;
      lastPowerJumpTimestampRef.current = now;
      powerJumpFlashRef.current = 1.0;
      setPowerJumpFlash(1.0);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      playSFX('power_jump');
    } else if (isGroundedRef.current || jumpCountRef.current < GAME_CONFIG.MAX_MIDAIR_JUMPS) {
      playerVelocityYRef.current = GAME_CONFIG.JUMP_FORCE;
      isGroundedRef.current = false;
      jumpCountRef.current += 1;
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      playSFX('jump');
    }

    lastTapTimestampRef.current = now;
  }, [startGame]);

  useEffect(() => {
    if (gameState !== GAME_CONFIG.STATE.PLAYING) return;

    let cancelled = false;

    const updateFrame = () => {
      if (cancelled) return;

      frameTickRef.current += 1;

      if (currentSpeedRef.current < GAME_CONFIG.MAX_SPEED) {
        currentSpeedRef.current += GAME_CONFIG.SPEED_ACCELERATION;
      }

      if (invincibilityTimerRef.current > 0) {
        invincibilityTimerRef.current -= 1;
      }

      playerVelocityYRef.current += GAME_CONFIG.GRAVITY;
      playerYRef.current += playerVelocityYRef.current;

      let updatedPlatforms = platformsRef.current.map((p) => ({
        ...p,
        x: p.x - currentSpeedRef.current,
      }));

      if (updatedPlatforms.length > 0 && updatedPlatforms[0].x + updatedPlatforms[0].width < -100) {
        updatedPlatforms.shift();
      }

      const lastPlatform = updatedPlatforms[updatedPlatforms.length - 1];
      if (lastPlatform && lastPlatform.x + lastPlatform.width < GAME_CONFIG.VIRTUAL_WIDTH + 200) {
        const gap =
          GAME_CONFIG.STANDARD_GAP +
          Math.random() * (GAME_CONFIG.MAX_GAP - GAME_CONFIG.STANDARD_GAP);
        const newWidth =
          GAME_CONFIG.MIN_PLATFORM_WIDTH +
          Math.random() * (GAME_CONFIG.MAX_PLATFORM_WIDTH - GAME_CONFIG.MIN_PLATFORM_WIDTH);

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

      let updatedItems = itemsRef.current
        .map((it) => ({ ...it, x: it.x - currentSpeedRef.current }))
        .filter((it) => it.x + it.width > -50);

      const pX = GAME_CONFIG.PLAYER_START_X;
      const pW = GAME_CONFIG.PLAYER_WIDTH;
      const pH = GAME_CONFIG.PLAYER_HEIGHT;
      const currentBottom = playerYRef.current + pH;
      const prevBottom = currentBottom - playerVelocityYRef.current;

      let landed = false;

      for (let i = 0; i < updatedPlatforms.length; i++) {
        const plat = updatedPlatforms[i];
        const horizontalOverlap = pX + pW > plat.x && pX < plat.x + plat.width;
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
      }

      if (!landed) {
        isGroundedRef.current = false;
      }

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
          if (item.type === GAME_CONFIG.ITEM_TYPES.COIN) {
            coinsRef.current += 1;
            setCoins(coinsRef.current);
            playSFX('coin_pickup');
            continue;
          }

          if (item.type === GAME_CONFIG.ITEM_TYPES.SHIELD) {
            hasShieldRef.current = true;
            setHasShield(true);
            playSFX('powerup');
            continue;
          }

          if (item.type === GAME_CONFIG.ITEM_TYPES.BOOST_PAD) {
            playerVelocityYRef.current = GAME_CONFIG.JUMP_FORCE * 1.1;
            currentSpeedRef.current = Math.min(
              GAME_CONFIG.MAX_SPEED,
              currentSpeedRef.current * GAME_CONFIG.BOOST_SPEED_MULTIPLIER
            );
            playSFX('boost_pad');
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            continue;
          }

          if (item.type === GAME_CONFIG.ITEM_TYPES.SPIKE) {
            if (invincibilityTimerRef.current === 0) {
              if (hasShieldRef.current) {
                hasShieldRef.current = false;
                setHasShield(false);
                playSFX('shield_hit');
                invincibilityTimerRef.current = GAME_CONFIG.INVINCIBILITY_FRAMES;
              } else {
                healthRef.current = Math.max(0, healthRef.current - 1);
                setHealth(healthRef.current);
                playSFX('heart_lost');
                invincibilityTimerRef.current = GAME_CONFIG.INVINCIBILITY_FRAMES;

                if (healthRef.current <= 0) {
                  triggerGameOver();
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

      if (powerJumpFlashRef.current > 0) {
        powerJumpFlashRef.current = Math.max(0, powerJumpFlashRef.current - 0.08);
      }

      distanceTraveledRef.current += currentSpeedRef.current * 0.1;
      const newScore = Math.floor(distanceTraveledRef.current);
      if (newScore !== lastReportedScoreRef.current) {
        lastReportedScoreRef.current = newScore;
        setScore(newScore);
      }

      setPlayerX(pX);
      setPlayerY(playerYRef.current);
      setIsGrounded(isGroundedRef.current);
      setAnimFrame(Math.floor(frameTickRef.current / 6));
      setPlatforms(updatedPlatforms);
      setItems(remainingItems);
      setPowerJumpFlash(powerJumpFlashRef.current);

      if (playerYRef.current + pH >= GAME_CONFIG.FALL_DEATH_Y) {
        triggerGameOver();
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
    handleScreenTap,
    startGame,
  };
}