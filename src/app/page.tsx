"use client"
import React, { useEffect, useRef } from 'react';

const Equalizer: React.FC = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const gainNodesRef = useRef<GainNode[]>([]);

  useEffect(() => {
    const handleInteraction = () => {
      if (audioContextRef.current?.state === 'suspended') {
        audioContextRef.current.resume();
      }
    };

    document.addEventListener('click', handleInteraction);

    if (audioRef.current && !audioContextRef.current) {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioContextRef.current = audioContext;

      const audioSource = audioContext.createMediaElementSource(audioRef.current);

      // Frequencies for the equalizer
      const frequencies = [16, 160, 400, 1000, 2400, 15000];

      // Create filters for each frequency
      const filters = frequencies.map((frequency) => {
        const filter = audioContext.createBiquadFilter();
        filter.type = 'peaking';
        filter.frequency.value = frequency;
        filter.Q.value = 1; // Adjust as needed for the width of the frequency band
        filter.gain.value = 0; // Set initial gain
        return filter;
      });

      // Connect the filters in series
      filters.reduce((prev, current) => {
        prev.connect(current);
        return current;
      });

      // Connect the last filter to the destination (speakers)
      filters[filters.length - 1].connect(audioContext.destination);

      // Connect the source to the first filter
      audioSource.connect(filters[0]);

      // Store gain nodes for later use
      gainNodesRef.current = filters;
    }

    return () => {
      document.removeEventListener('click', handleInteraction);
    };
  }, []);

  const adjustGain = (index: number, value: number) => {
    if (gainNodesRef.current[index]) {
      gainNodesRef.current[index].gain.value = value;
    }
  };

  return (
    <div>
      <audio ref={audioRef} controls>
        <source src="/aud.mp3" type="audio/mpeg" />
      </audio>
      <div>
        <label>16Hz: </label>
        <input
          type="range"
          min="-40"
          max="40"
          defaultValue="0"
          onChange={(e) => adjustGain(0, parseFloat(e.target.value))}
        />
      </div>
      <div>
        <label>160Hz: </label>
        <input
          type="range"
          min="-40"
          max="40"
          defaultValue="0"
          onChange={(e) => adjustGain(1, parseFloat(e.target.value))}
        />
      </div>
      <div>
        <label>400Hz: </label>
        <input
          type="range"
          min="-40"
          max="40"
          defaultValue="0"
          onChange={(e) => adjustGain(2, parseFloat(e.target.value))}
        />
      </div>
      <div>
        <label>1kHz: </label>
        <input
          type="range"
          min="-40"
          max="40"
          defaultValue="0"
          onChange={(e) => adjustGain(3, parseFloat(e.target.value))}
        />
      </div>
      <div>
        <label>2.4kHz: </label>
        <input
          type="range"
          min="-40"
          max="40"
          defaultValue="0"
          onChange={(e) => adjustGain(4, parseFloat(e.target.value))}
        />
      </div>
      <div>
        <label>15kHz: </label>
        <input
          type="range"
          min="-40"
          max="40"
          defaultValue="0"
          onChange={(e) => adjustGain(5, parseFloat(e.target.value))}
        />
      </div>
    </div>
  );
};

export default Equalizer;
