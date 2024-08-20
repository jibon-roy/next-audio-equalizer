"use client";
import React, { useState } from "react";
import AudioPlayer from "./AudioPlayer";
import Equalizer from "../components/Equlizer";

const AudioEqualizer: React.FC = () => {
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(
    null
  );

  const handleAudioContextReady = (
    audioContext: AudioContext,
    audioElement: HTMLAudioElement
  ) => {
    setAudioContext(audioContext);
    setAudioElement(audioElement);
  };

  return (
    <div>
      {/* <AudioPlayer onAudioContextReady={handleAudioContextReady} /> */}
      <Equalizer audioContext={audioContext} audioElement={audioElement} />
    </div>
  );
};

export default AudioEqualizer;
