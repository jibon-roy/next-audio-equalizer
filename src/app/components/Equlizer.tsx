"use client";
import React, { useRef } from "react";

interface EqualizerProps {
  audioContext: AudioContext | null;
  audioElement: HTMLAudioElement | null;
}

const Equalizer: React.FC<EqualizerProps> = ({
  audioContext,
  audioElement,
}) => {
  const gainNodesRef = useRef<GainNode[]>([]);

  React.useEffect(() => {
    if (audioContext && audioElement && gainNodesRef.current.length === 0) {
      const audioSource = audioContext.createMediaElementSource(audioElement);

      const frequencies = [16, 160, 400, 1000, 2400, 15000];

      const filters = frequencies.map((frequency) => {
        const filter = audioContext.createBiquadFilter();
        filter.type = "peaking";
        filter.frequency.value = frequency;
        filter.Q.value = 1;
        filter.gain.value = 0;
        return filter;
      });

      filters.reduce((prev, current) => {
        prev.connect(current);
        return current;
      });

      filters[filters.length - 1].connect(audioContext.destination);
      audioSource.connect(filters[0]);

      gainNodesRef.current = filters;
    }
  }, [audioContext, audioElement]);

  const adjustGain = (index: number, value: number) => {
    if (gainNodesRef.current[index]) {
      gainNodesRef.current[index].gain.value = value;
    }
  };

  return (
    <div>
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
        {/* <label>15kHz: </label>
        <input
          type="range"
          min="-40"
          max="40"
          defaultValue="0"
          onChange={(e) => adjustGain(5, parseFloat(e.target.value))}
        /> */}
      </div>
    </div>
  );
};

export default Equalizer;
