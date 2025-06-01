
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
  synth?.triggerAttackRelease("C5", "8n", Tone.now());
};

export const playHalfwaySound = async () => {
  await ensureAudioContextStarted();
  synth?.triggerAttackRelease("E5", "8n", Tone.now());
};

export const playEndSound = async () => {
  await ensureAudioContextStarted();
  synth?.triggerAttackRelease("G5", "8n", Tone.now());
};

export const playCountdownTickSound = async () => {
  await ensureAudioContextStarted();
  synth?.triggerAttackRelease("A4", "16n", Tone.now());
};
