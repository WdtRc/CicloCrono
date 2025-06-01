
export type TimerStatus = 'IDLE' | 'COUNTDOWN' | 'WORKING' | 'RESTING' | 'PAUSED' | 'FINISHED';

export interface TimerParams {
  cycles: number;
  workDuration: number;
  restDuration: number;
}

export interface CycleTimerState extends TimerParams {
  status: TimerStatus;
  timeLeft: number;
  currentCycle: number;
  currentPhase: 'WORK' | 'REST' | 'COUNTDOWN' | 'IDLE' | 'FINISHED_PHASE';
  initialCountdown: number;
}
