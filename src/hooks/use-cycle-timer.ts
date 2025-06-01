
"use client";

import type { TimerParams, TimerStatus, CycleTimerState } from '@/types';
import { useState, useEffect, useRef, useCallback } from 'react';
import { playStartSound, playHalfwaySound, playEndSound, playCountdownTickSound } from '@/lib/audio';

const INITIAL_COUNTDOWN_SECONDS = 3;

const initialTimerState: CycleTimerState = {
  cycles: 1,
  workDuration: 30,
  restDuration: 30,
  status: 'IDLE',
  timeLeft: 0,
  currentCycle: 0,
  currentPhase: 'IDLE',
  initialCountdown: INITIAL_COUNTDOWN_SECONDS,
};

export function useCycleTimer(initialParams: TimerParams) {
  const [timerState, setTimerState] = useState<CycleTimerState>({
    ...initialTimerState,
    ...initialParams,
    timeLeft: INITIAL_COUNTDOWN_SECONDS,
  });
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const halfwaySoundPlayedRef = useRef<boolean>(false);

  const stopInterval = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    setTimerState(prev => ({ ...prev, ...initialParams, status: 'IDLE', timeLeft: INITIAL_COUNTDOWN_SECONDS, currentCycle: 0, currentPhase: 'IDLE' }));
  }, [initialParams]);


  useEffect(() => {
    if (timerState.status === 'WORKING' || timerState.status === 'RESTING' || timerState.status === 'COUNTDOWN') {
      intervalRef.current = setInterval(() => {
        setTimerState(prev => {
          if (prev.timeLeft <= 1) {
            stopInterval();
            // Transition to next state in the main effect logic below
            return { ...prev, timeLeft: 0 };
          }
          return { ...prev, timeLeft: prev.timeLeft - 1 };
        });
      }, 1000);
    } else {
      stopInterval();
    }
    return stopInterval;
  }, [timerState.status, stopInterval]);


  useEffect(() => {
    // Handle state transitions when timeLeft reaches 0
    if (timerState.timeLeft === 0) {
      if (timerState.status === 'COUNTDOWN') {
        void playStartSound();
        halfwaySoundPlayedRef.current = false;
        setTimerState(prev => ({
          ...prev,
          status: 'WORKING',
          currentPhase: 'WORK',
          currentCycle: 1,
          timeLeft: prev.workDuration,
        }));
      } else if (timerState.status === 'WORKING') {
        void playEndSound();
        if (timerState.currentCycle < timerState.cycles) {
          setTimerState(prev => ({
            ...prev,
            status: 'RESTING',
            currentPhase: 'REST',
            timeLeft: prev.restDuration,
          }));
        } else {
          setTimerState(prev => ({ ...prev, status: 'FINISHED', currentPhase: 'FINISHED_PHASE' }));
        }
      } else if (timerState.status === 'RESTING') {
        if (timerState.currentCycle < timerState.cycles) {
          void playStartSound();
          halfwaySoundPlayedRef.current = false;
          setTimerState(prev => ({
            ...prev,
            status: 'WORKING',
            currentPhase: 'WORK',
            currentCycle: prev.currentCycle + 1,
            timeLeft: prev.workDuration,
          }));
        } else {
           // Should not happen if logic is correct, but as a fallback:
          setTimerState(prev => ({ ...prev, status: 'FINISHED', currentPhase: 'FINISHED_PHASE' }));
        }
      }
    }

    // Handle halfway sound for WORK phase
    if (timerState.status === 'WORKING' && timerState.workDuration > 0) {
      const halfwayPoint = Math.ceil(timerState.workDuration / 2);
      if (timerState.timeLeft === halfwayPoint && !halfwaySoundPlayedRef.current) {
        void playHalfwaySound();
        halfwaySoundPlayedRef.current = true;
      }
    }
    
    // Countdown tick sound
    if (timerState.status === 'COUNTDOWN' && timerState.timeLeft > 0 && timerState.timeLeft <= INITIAL_COUNTDOWN_SECONDS) {
        // void playCountdownTickSound(); // This can be too much, user can enable if desired
    }

  }, [timerState.timeLeft, timerState.status, timerState.workDuration, timerState.cycles, timerState.currentCycle, timerState.restDuration]);


  const startTimer = useCallback(() => {
    setTimerState(prev => ({
      ...prev,
      ...initialParams, // Ensure latest params are used
      status: 'COUNTDOWN',
      currentPhase: 'COUNTDOWN',
      currentCycle: 0,
      timeLeft: INITIAL_COUNTDOWN_SECONDS,
    }));
    halfwaySoundPlayedRef.current = false;
  }, [initialParams]);

  const pauseTimer = useCallback(() => {
    if (timerState.status === 'WORKING' || timerState.status === 'RESTING' || timerState.status === 'COUNTDOWN') {
      setTimerState(prev => ({ ...prev, status: 'PAUSED' }));
    }
  }, [timerState.status]);

  const resumeTimer = useCallback(() => {
    if (timerState.status === 'PAUSED') {
      setTimerState(prev => {
        let resumedStatus: TimerStatus = 'IDLE';
        if (prev.currentPhase === 'WORK') resumedStatus = 'WORKING';
        else if (prev.currentPhase === 'REST') resumedStatus = 'RESTING';
        else if (prev.currentPhase === 'COUNTDOWN') resumedStatus = 'COUNTDOWN';
        return { ...prev, status: resumedStatus };
      });
    }
  }, [timerState.status]);

  const stopTimer = useCallback(() => {
    setTimerState(prev => ({
      ...prev,
      ...initialParams,
      status: 'IDLE',
      currentPhase: 'IDLE',
      currentCycle: 0,
      timeLeft: INITIAL_COUNTDOWN_SECONDS,
    }));
    halfwaySoundPlayedRef.current = false;
  }, [initialParams]);
  
  const updateParams = useCallback((newParams: TimerParams) => {
    setTimerState(prev => ({
        ...prev,
        ...newParams,
        // Reset if timer is not running, or keep current state if it is?
        // For now, let's assume params are updated when IDLE.
        // If timer is running, this might lead to unexpected behavior if not handled carefully.
        // The form should be disabled when timer is running.
        timeLeft: prev.status === 'IDLE' ? INITIAL_COUNTDOWN_SECONDS : prev.timeLeft
    }));
  }, []);


  return {
    ...timerState,
    startTimer,
    pauseTimer,
    resumeTimer,
    stopTimer,
    updateParams,
  };
}
