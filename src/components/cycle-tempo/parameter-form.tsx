
"use client";

import type { TimerParams, TimerStatus } from '@/types';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import type { UseFormReturn } from 'react-hook-form';

const formSchema = z.object({
  cycles: z.coerce.number().int().min(1, "Min 1 cycle").max(10, "Max 10 cycles"),
  workDuration: z.coerce.number().int().min(20, "Min 20s").max(99, "Max 99s"),
  restDuration: z.coerce.number().int().min(20, "Min 20s").max(99, "Max 99s"),
});

export type ParameterFormData = z.infer<typeof formSchema>;

interface ParameterFormProps {
  defaultValues: ParameterFormData;
  onSubmit: (data: ParameterFormData) => void;
  status: TimerStatus;
  form: UseFormReturn<ParameterFormData>; // Pass form instance
}

export function ParameterForm({ onSubmit, status, form }: ParameterFormProps) {
  const isFormDisabled = status !== 'IDLE' && status !== 'FINISHED';

  // Watch for form changes and submit them automatically
  // This is disabled for now as it may cause too many re-renders / hook updates.
  // Submit is now handled by the parent component observing form.watch()
  // useEffect(() => {
  //   const subscription = form.watch((values) => {
  //     form.handleSubmit(onSubmit)(); 
  //   });
  //   return () => subscription.unsubscribe();
  // }, [form, onSubmit]);


  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="cycles"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cycles</FormLabel>
              <FormControl>
                <Input type="number" placeholder="1-10" {...field} disabled={isFormDisabled} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="workDuration"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Work Duration (seconds)</FormLabel>
              <FormControl>
                <Input type="number" placeholder="20-99" {...field} disabled={isFormDisabled} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="restDuration"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Rest Duration (seconds)</FormLabel>
              <FormControl>
                <Input type="number" placeholder="20-99" {...field} disabled={isFormDisabled} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
         {/* Submit button is hidden, form values are watched by parent
         <Button type="submit" disabled={isFormDisabled} className="hidden">Set Parameters</Button> 
         */}
      </form>
    </Form>
  );
}
