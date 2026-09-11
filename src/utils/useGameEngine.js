import { useState, useRef, useCallback, useEffect } from 'react';
import * as Haptics from 'expo-haptics';
import { GAME_CONFIG } from '../constants/gameConfig';
import { playSFX, playMusic, stopMusic } from './audioManager';

export function useGameEngine() {
  // === Render State ===
  const [gameState, setGameState] = useState(GAME_CONFIG.STATE.MENU);
  const [score, setScore] = useState(0);
  const [coins, setCoins] = useState(0);
  const [health, setHealth] = useState(GAME_CONFIG.MAX_HEALTH);
  const [playerX, setPlayerX] = useState(GAME_CONFIG.PLAYER_START_X);
  const [playerY, setPlayerY] = useState(GAME_CONFIG.PLAYER_START_Y);
  const [powerJumpFlash, setPowerJumpFlash] = useState(0);
  const [platforms, setPlatforms] = useState([
    { id: 1, x: 0, y: GAME_CONFIG.GROUND_Y, width: 450, height: GAME_CONFIG.PLATFORM_HEIGHT },
    { id: 2, x: 570, y: GAME_CONFIG.GROUND_Y, width: 350, height: GAME_CONFIG.PLATFORM_HEIGHT },
  ]);

  // === Engine Refs (mutable, no re-render) ===
  const playerYRef = useRef(GAME_CONFIG.PLAYER_START_Y);
  const playerVelocityYRef = useRef(0);
  const isGroundedRef = useRef(false);
  const jumpCountRef = useRef(0);
  const currentSpeedRef = useRef(GAME_CONFIG.BASE_SPEED);
  const lastTapTimestampRef = useRef(0);
  const lastPowerJumpTimestampRef = useRef(0);
  const distanceTraveledRef = useRef(0);
  const lastReportedScoreRef = useRef(-1);
  const platformsRef = useRef(platforms);
  const powerJumpFlashRef = useRef(0);
  const gameStateRef = useRef(gameState);
  const rafIdRef = useRef(null);

  useEffect(() => {
    gameStateRef.current = gameState;
  }, [gameState]);

  // === Start / Restart ===
  const startGame = useCallback(() => {
    playerYRef.current = GAME_CONFIG.PLAYER_START_Y;
    playerVelocityYRef.current = 0;
    isGroundedRef.current = false;
    jumpCountRef.current = 0;
    currentSpeedRef.current = GAME_CONFIG.BASE_SPEED;
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

    setPlayerX(GAME_CONFIG.PLAYER_START_X);
    setPlayerY(GAME_CONFIG.PLAYER_START_Y);
    setPowerJumpFlash(0);
    setPlatforms(initialPlatforms);
    setScore(0);
    setCoins(0);
    setHealth(GAME_CONFIG.MAX_HEALTH);
    setGameState(GAME_CONFIG.STATE.PLAYING);

    playMusic('gameplay_track_1');
  }, []);

  // === Game Over ===
  const triggerGameOver = useCallback(() => {
    setGameState(GAME_CONFIG.STATE.GAMEOVER);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    playSFX('water_splash');
    playSFX('game_over');
    stopMusic();
  }, []);

  // === Input Handler (Subway Surfers) ===
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

    // Double-Tap → Power Jump
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
    }
    // Single Tap → Standard / Double Jump
    else if (isGroundedRef.current || jumpCountRef.current < GAME_CONFIG.MAX_MIDAIR_JUMPS) {
      playerVelocityYRef.current = GAME_CONFIG.JUMP_FORCE;
      isGroundedRef.current = false;
      jumpCountRef.current += 1;
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      playSFX('jump');
    }

    lastTapTimestampRef.current = now;
  }, [startGame]);

  // === Main Game Loop (JS thread, rAF-driven) ===
  useEffect(() => {
    if (gameState !== GAME_CONFIG.STATE.PLAYING) return;

    let cancelled = false;

    const updateFrame = () => {
      if (cancelled) return;

      // 1) Speed ramp
      if (currentSpeedRef.current < GAME_CONFIG.MAX_SPEED) {
        currentSpeedRef.current += GAME_CONFIG.SPEED_ACCELERATION;
      }

      // 2) Gravity
      playerVelocityYRef.current += GAME_CONFIG.GRAVITY;
      playerYRef.current += playerVelocityYRef.current;

      // 3) Scroll + spawn platforms
      let updatedPlatforms = platformsRef.current.map((p) => ({
        ...p,
        x: p.x - currentSpeedRef.current,
      }));

      if (
        updatedPlatforms.length > 0 &&
        updatedPlatforms[0].x + updatedPlatforms[0].width < -100
      ) {
        updatedPlatforms = updatedPlatforms.slice(1);
      }

      const lastPlatform = updatedPlatforms[updatedPlatforms.length - 1];
      if (
        lastPlatform &&
        lastPlatform.x + lastPlatform.width < GAME_CONFIG.VIRTUAL_WIDTH + 200
      ) {
        const gap =
          GAME_CONFIG.STANDARD_GAP +
          Math.random() * (GAME_CONFIG.MAX_GAP - GAME_CONFIG.STANDARD_GAP);
        const newWidth =
          GAME_CONFIG.MIN_PLATFORM_WIDTH +
          Math.random() * (GAME_CONFIG.MAX_PLATFORM_WIDTH - GAME_CONFIG.MIN_PLATFORM_WIDTH);

        updatedPlatforms.push({
          id: Date.now() + Math.random(),
          x: lastPlatform.x + lastPlatform.width + gap,
          y: GAME_CONFIG.GROUND_Y,
          width: newWidth,
          height: GAME_CONFIG.PLATFORM_HEIGHT,
        });
      }

      platformsRef.current = updatedPlatforms;

      // 4) AABB Swept Collision
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

      // 5) Decay Power Jump flash
      if (powerJumpFlashRef.current > 0) {
        powerJumpFlashRef.current = Math.max(0, powerJumpFlashRef.current - 0.08);
      }

      // 6) Score (only when integer changes)
      distanceTraveledRef.current += currentSpeedRef.current * 0.1;
      const newScore = Math.floor(distanceTraveledRef.current);
      if (newScore !== lastReportedScoreRef.current) {
        lastReportedScoreRef.current = newScore;
        setScore(newScore);
      }

      // 7) Sync render state
      setPlayerX(pX);
      setPlayerY(playerYRef.current);
      setPlatforms(updatedPlatforms);
      setPowerJumpFlash(powerJumpFlashRef.current);

      // 8) Fall death
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
    playerX,
    playerY,
    powerJumpFlash,
    platforms,
    handleScreenTap,
    startGame,
  };
}