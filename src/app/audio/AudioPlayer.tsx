"use client";
import React, { useEffect, useRef, useState } from "react";

interface AudioPlayerProps {
  onAudioContextReady: (
    audioContext: AudioContext,
    audioElement: HTMLAudioElement
  ) => void;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ onAudioContextReady }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    const handleInteraction = () => {
      if (!audioContextRef.current) {
        const audioContext = new (window.AudioContext ||
          (window as any).webkitAudioContext)();
        audioContextRef.current = audioContext;
        onAudioContextReady(audioContext, audioRef.current as HTMLAudioElement);
      } else if (audioContextRef.current.state === "suspended") {
        audioContextRef.current.resume();
      }
    };

    // Listen for a user interaction
    document.addEventListener("click", handleInteraction);

    // Cleanup event listener
    return () => {
      document.removeEventListener("click", handleInteraction);
    };
  }, [onAudioContextReady]);

  const [currentTime, setCurrentTime] = useState(0);

  const handlePause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
  };

  const handlePlay = () => {
    if (audioRef.current) {
      audioRef.current.play();
    }
  };

  const handleNext = () => {
    // Logic for next track (can be extended to handle multiple tracks)
    console.log("Next button clicked");
  };

  const handlePrevious = () => {
    // Logic for previous track (can be extended to handle multiple tracks)
    console.log("Previous button clicked");
  };

  const handleSeek = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (audioRef.current) {
      const seekTime = parseFloat(event.target.value);
      audioRef.current.currentTime = seekTime;
      setCurrentTime(seekTime);
    }
  };

  return (
    <div className="audio-controls">
      <audio
        ref={audioRef}
        onTimeUpdate={() => setCurrentTime(audioRef.current?.currentTime || 0)}
      >
        <source src="/aud.mp3" type="audio/mpeg" />
      </audio>

      {/* Custom controls */}
      <div className="controls">
        <button onClick={handlePrevious}>Previous</button>
        <button onClick={handlePlay}>Play</button>
        <button onClick={handlePause}>Pause</button>
        <button onClick={handleNext}>Next</button>
      </div>

      {/* Seek bar */}
      <input
        type="range"
        min="0"
        max={audioRef.current?.duration || 0}
        value={currentTime}
        onChange={handleSeek}
        className="seek-bar"
      />
    </div>
  );
};

export default AudioPlayer;
