import React, { useState, useEffect, useRef } from 'react';
import { Note, NOTES } from '../types/types';

const kalimbaNotes: Note[] = [
  { id: 'C4', note: 'C4', frequency: NOTES['C4'], key: 'q', label: 'C4' },
  { id: 'D4', note: 'D4', frequency: NOTES['D4'], key: 'w', label: 'D4' },
  { id: 'E4', note: 'E4', frequency: NOTES['E4'], key: 'e', label: 'E4' },
  { id: 'F4', note: 'F4', frequency: NOTES['F4'], key: 'r', label: 'F4' },
  { id: 'G4', note: 'G4', frequency: NOTES['G4'], key: 't', label: 'G4' },
  { id: 'A4', note: 'A4', frequency: NOTES['A4'], key: 'y', label: 'A4' },
  { id: 'B4', note: 'B4', frequency: NOTES['B4'], key: 'u', label: 'B4' },
  { id: 'C5', note: 'C5', frequency: NOTES['C5'], key: 'i', label: 'C5' },
  // 低音部分
  { id: 'G3', note: 'G3', frequency: NOTES['G3'], key: 'v', label: 'G3' },
  { id: 'A3', note: 'A3', frequency: NOTES['A3'], key: 'b', label: 'A3' },
  { id: 'B3', note: 'B3', frequency: NOTES['B3'], key: 'n', label: 'B3' },
];

const Kalimba: React.FC = () => {
  const [volume, setVolume] = useState(0.5);
  const [activeKeys, setActiveKeys] = useState<string[]>([]);
  const audioContextRef = useRef<AudioContext | null>(null);

  const initializeAudioContext = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioContextRef.current;
  };

  const playNote = (frequency: number) => {
    try {
      const audioContext = initializeAudioContext();
      if (audioContext.state === 'suspended') {
        audioContext.resume();
      }

      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = frequency;
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(volume, audioContext.currentTime);
      
      oscillator.start();
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 3);
      oscillator.stop(audioContext.currentTime + 3);
    } catch (error) {
      console.error('Audio playback error:', error);
    }
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      if (!activeKeys.includes(key)) {
        const note = kalimbaNotes.find(n => n.key.toLowerCase() === key);
        if (note) {
          setActiveKeys(prev => [...prev, key]);
          playNote(note.frequency);
        }
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      setActiveKeys(prev => prev.filter(k => k !== key));
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [activeKeys, volume]);

  return (
    <div className="kalimba-container">
      <h2 style={{color: '#646cff'}}>卡林巴琴</h2>
      <div className="volume-control">
        <label>音量: </label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={volume}
          onChange={(e) => setVolume(Number(e.target.value))}
        />
      </div>
      <div className="kalimba-tines">
        {kalimbaNotes.map((note) => (
          <button
            key={note.id}
            className={`kalimba-tine ${activeKeys.includes(note.key.toLowerCase()) ? 'active' : ''}`}
            onClick={() => playNote(note.frequency)}
          >
            <span className="tine-label">{note.label}</span>
            <span className="key-hint">{note.key}</span>
          </button>
        ))}
      </div>
      <div className="keyboard-hint" style={{color: '#646cff'}}>
        使用鍵盤上對應的按鍵來演奏
      </div>
    </div>
  );
};

export default Kalimba; 