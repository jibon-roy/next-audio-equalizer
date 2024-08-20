"use client";
import React, { useEffect, useRef } from 'react';

interface AudioPlayerProps {
  onAudioContextReady: (audioContext: AudioContext, audioElement: HTMLAudioElement) => void;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ onAudioContextReady }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    const handleInteraction = () => {
      if (!audioContextRef.current) {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        audioContextRef.current = audioContext;
        onAudioContextReady(audioContext, audioRef.current as HTMLAudioElement);
      } else if (audioContextRef.current.state === 'suspended') {
        audioContextRef.current.resume();
      }
    };

    // Listen for a user interaction
    document.addEventListener('click', handleInteraction);

    // Cleanup event listener
    return () => {
      document.removeEventListener('click', handleInteraction);
    };
  }, [onAudioContextReady]);

  return (
    <audio ref={audioRef} controls>
      <source src="/aud.mp3" type="audio/mpeg" />
    </audio>
  );
};

export default AudioPlayer;
