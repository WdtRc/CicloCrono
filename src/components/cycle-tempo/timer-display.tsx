
"use client";

import type { CycleTimerState } from '@/types';
import { Progress } from '@/components/ui/progress';

interface TimerDisplayProps {
  timerState: CycleTimerState;
}

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
};

export function TimerDisplay({ timerState }: TimerDisplayProps) {
  const { timeLeft, status, currentPhase, currentCycle, cycles, workDuration, restDuration, initialCountdown } = timerState;

  let phaseText = "GET READY!";
  let totalDurationForProgress = initialCountdown;

  if (status === 'WORKING') {
    phaseText = "WORK";
    totalDurationForProgress = workDuration;
  } else if (status === 'RESTING') {
    phaseText = "REST";
    totalDurationForProgress = restDuration;
  } else if (status === 'COUNTDOWN') {
    phaseText = "GET READY!";
    totalDurationForProgress = initialCountdown;
  } else if (status === 'PAUSED') {
    if (currentPhase === 'WORK') phaseText = "WORK (PAUSED)";
    else if (currentPhase === 'REST') phaseText = "REST (PAUSED)";
    else if (currentPhase === 'COUNTDOWN') phaseText = "GET READY! (PAUSED)";
    else phaseText = "PAUSED";
    // For progress bar when paused:
    if (currentPhase === 'WORK') totalDurationForProgress = workDuration;
    else if (currentPhase === 'REST') totalDurationForProgress = restDuration;
    else if (currentPhase === 'COUNTDOWN') totalDurationForProgress = initialCountdown;

  } else if (status === 'FINISHED') {
    phaseText = "FINISHED!";
    totalDurationForProgress = 0; // Progress is full or not shown
  } else if (status === 'IDLE') {
    phaseText = "SET PARAMETERS";
    totalDurationForProgress = 0;
  }
  
  const progressPercentage = (totalDurationForProgress > 0 && (status !== 'IDLE' && status !== 'FINISHED'))
    ? ((totalDurationForProgress - timeLeft) / totalDurationForProgress) * 100
    : (status === 'FINISHED' ? 100 : 0);

  return (
    <div className="text-center space-y-2">
      <div className="font-headline text-5xl md:text-6xl text-primary tabular-nums">
        {formatTime(timeLeft)}
      </div>
      <div className="text-lg font-semibold text-accent-foreground uppercase tracking-wider">
        {phaseText}
      </div>
      {status !== 'IDLE' && status !== 'COUNTDOWN' && status !== 'FINISHED' && (
        <div className="text-lg text-muted-foreground">
          Cycle {currentCycle} / {cycles}
        </div>
      )}
      <Progress value={progressPercentage} className="w-full h-4 bg-accent [&>div]:bg-primary" />
    </div>
  );
}
