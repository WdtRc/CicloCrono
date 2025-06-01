
"use client";

import type { TimerStatus } from '@/types';
import { Button } from '@/components/ui/button';
import { Play, Pause, Square, RotateCcw } from 'lucide-react';

interface ControlButtonsProps {
  status: TimerStatus;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onStop: () => void;
}

export function ControlButtons({ status, onStart, onPause, onResume, onStop }: ControlButtonsProps) {
  return (
    <div className="flex justify-center space-x-4 mt-8">
      {status === 'IDLE' || status === 'FINISHED' ? (
        <Button onClick={onStart} size="lg" className="w-32 bg-primary hover:bg-primary/90 text-primary-foreground">
          <Play className="mr-2 h-5 w-5" /> Start
        </Button>
      ) : status === 'PAUSED' ? (
        <Button onClick={onResume} size="lg" className="w-32 bg-accent hover:bg-accent/90 text-accent-foreground">
          <Play className="mr-2 h-5 w-5" /> Resume
        </Button>
      ) : (
        <Button onClick={onPause} size="lg" className="w-32" variant="outline">
          <Pause className="mr-2 h-5 w-5" /> Pause
        </Button>
      )}
      <Button
        onClick={onStop}
        size="lg"
        variant="destructive"
        className="w-32"
        disabled={status === 'IDLE'}
      >
        {status === 'FINISHED' ? <RotateCcw className="mr-2 h-5 w-5" /> : <Square className="mr-2 h-5 w-5" />}
        {status === 'FINISHED' ? 'Reset' : 'Stop'}
      </Button>
    </div>
  );
}
