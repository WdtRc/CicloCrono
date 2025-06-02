
"use client";

import { useEffect, useMemo } from 'react';
import { useCycleTimer } from '@/hooks/use-cycle-timer';
import { ParameterForm, type ParameterFormData } from '@/components/cycle-tempo/parameter-form';
import { TimerDisplay } from '@/components/cycle-tempo/timer-display';
import { ControlButtons } from '@/components/cycle-tempo/control-buttons';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const formSchema = z.object({
  cycles: z.coerce.number().int().min(1).max(10),
  workDuration: z.coerce.number().int().min(20).max(99),
  restDuration: z.coerce.number().int().min(20).max(99),
});

const defaultValues: ParameterFormData = {
  cycles: 1,
  workDuration: 30,
  restDuration: 30,
};

export default function CycleTempoPage() {
  const form = useForm<ParameterFormData>({
    resolver: zodResolver(formSchema),
    defaultValues,
    mode: 'onChange', // Validate on change
  });

  const watchedParams = form.watch();

  // Memoize initialParams to prevent unnecessary re-creation for useCycleTimer
  const initialParams = useMemo(() => ({
    cycles: watchedParams.cycles || defaultValues.cycles,
    workDuration: watchedParams.workDuration || defaultValues.workDuration,
    restDuration: watchedParams.restDuration || defaultValues.restDuration,
  }), [watchedParams.cycles, watchedParams.workDuration, watchedParams.restDuration]);

  const {
    status,
    timeLeft,
    currentCycle,
    cycles,
    workDuration,
    restDuration,
    currentPhase,
    initialCountdown,
    startTimer,
    pauseTimer,
    resumeTimer,
    stopTimer,
    updateParams, // from useCycleTimer
  } = useCycleTimer(initialParams);

  // Update timer hook's internal params when form values change and are valid
  useEffect(() => {
    const subscription = form.watch(async (values) => {
      const result = formSchema.safeParse(values);
      if (result.success) {
        updateParams(result.data);
      }
    });
    return () => subscription.unsubscribe();
  }, [form, updateParams]);


  const handleFormSubmit = (data: ParameterFormData) => {
    // This function is primarily for explicit submission if needed,
    // but parameters are updated via watch effect now.
    // console.log("Form submitted with data:", data);
    // updateParams(data); // updateParams is already called by watch
  };
  
  const timerStateForDisplay = useMemo(() => ({
    status,
    timeLeft,
    currentCycle,
    cycles,
    workDuration,
    restDuration,
    currentPhase,
    initialCountdown,
  }), [status, timeLeft, currentCycle, cycles, workDuration, restDuration, currentPhase, initialCountdown]);


  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-md shadow-2xl h-[80vh] flex flex-col">
        <CardHeader>
          <CardTitle className="text-3xl font-headline text-center text-primary">
            Cycle Tempo
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 overflow-y-auto flex-1">
          <ParameterForm
            defaultValues={defaultValues}
            onSubmit={handleFormSubmit}
            status={status}
            form={form}
          />
          <TimerDisplay timerState={timerStateForDisplay} />
          <ControlButtons
            status={status}
            onStart={startTimer}
            onPause={pauseTimer}
            onResume={resumeTimer}
            onStop={stopTimer}
          />
        </CardContent>
      </Card>
    </main>
  );
}
