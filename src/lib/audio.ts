
"use client";
import * as Tone from 'tone';

let synth: Tone.Synth | null = null;

const initializeSynth = () => {
  if (!synth) {
    synth = new Tone.Synth().toDestination();
  }
};

const ensureAudioContextStarted = async () => {
  if (Tone.context.state !== 'running') {
    await Tone.start();
  }
  initializeSynth(); // Ensure synth is initialized after context starts
};

export const playStartSound = async () => {
  await ensureAudioContextStarted();
  // Changed from C5 to E5 for a higher pitch, and duration to "4n"
  synth?.triggerAttackRelease("E5", "4n", Tone.now());
};

export const playHalfwaySound = async () => {
  await ensureAudioContextStarted();
  synth?.triggerAttackRelease("E5", "8n", Tone.now());
};

export const playEndSound = async () => {
  await ensureAudioContextStarted();
  // Changed from G5 to C4 for a lower pitch and repeat 3 times
  const now = Tone.now();
  synth?.triggerAttackRelease("C4", "8n", now);
  synth?.triggerAttackRelease("C4", "8n", now + 0.3);
  synth?.triggerAttackRelease("C4", "8n", now + 0.6);
};

export const playCountdownTickSound = async () => {
  await ensureAudioContextStarted();
  synth?.triggerAttackRelease("A4", "16n", Tone.now());
};

