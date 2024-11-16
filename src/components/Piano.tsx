import React, { useState, useEffect, useRef } from 'react';
import { Note, NOTES } from '../types/types';

const pianoNotes: Note[] = [
  // 第三個八度
  { id: 'C3', note: 'C3', frequency: NOTES['C3'], key: 'z', label: 'C3' },
  { id: 'C#3', note: 'C#3', frequency: NOTES['C#3'], key: 's', color: 'black' },
  { id: 'D3', note: 'D3', frequency: NOTES['D3'], key: 'x', label: 'D3' },
  { id: 'D#3', note: 'D#3', frequency: NOTES['D#3'], key: 'd', color: 'black' },
  { id: 'E3', note: 'E3', frequency: NOTES['E3'], key: 'c', label: 'E3' },
  { id: 'F3', note: 'F3', frequency: NOTES['F3'], key: 'v', label: 'F3' },
  { id: 'F#3', note: 'F#3', frequency: NOTES['F#3'], key: 'g', color: 'black' },
  { id: 'G3', note: 'G3', frequency: NOTES['G3'], key: 'b', label: 'G3' },
  { id: 'G#3', note: 'G#3', frequency: NOTES['G#3'], key: 'h', color: 'black' },
  { id: 'A3', note: 'A3', frequency: NOTES['A3'], key: 'n', label: 'A3' },
  { id: 'A#3', note: 'A#3', frequency: NOTES['A#3'], key: 'j', color: 'black' },
  { id: 'B3', note: 'B3', frequency: NOTES['B3'], key: 'm', label: 'B3' },
  // 第四個八度
  { id: 'C4', note: 'C4', frequency: NOTES['C4'], key: 'q', label: 'C4' },
  { id: 'C#4', note: 'C#4', frequency: NOTES['C#4'], key: '2', color: 'black' },
  { id: 'D4', note: 'D4', frequency: NOTES['D4'], key: 'w', label: 'D4' },
  { id: 'D#4', note: 'D#4', frequency: NOTES['D#4'], key: '3', color: 'black' },
  { id: 'E4', note: 'E4', frequency: NOTES['E4'], key: 'e', label: 'E4' },
  { id: 'F4', note: 'F4', frequency: NOTES['F4'], key: 'r', label: 'F4' },
  { id: 'F#4', note: 'F#4', frequency: NOTES['F#4'], key: '5', color: 'black' },
  { id: 'G4', note: 'G4', frequency: NOTES['G4'], key: 't', label: 'G4' },
  { id: 'G#4', note: 'G#4', frequency: NOTES['G#4'], key: '6', color: 'black' },
  { id: 'A4', note: 'A4', frequency: NOTES['A4'], key: 'y', label: 'A4' },
  { id: 'A#4', note: 'A#4', frequency: NOTES['A#4'], key: '7', color: 'black' },
  { id: 'B4', note: 'B4', frequency: NOTES['B4'], key: 'u', label: 'B4' },
  { id: 'C5', note: 'C5', frequency: NOTES['C5'], key: 'i', label: 'C5' },
];

const Piano: React.FC = () => {
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
      gainNode.gain.setValueAtTime(volume, audioContext.currentTime);
      
      oscillator.start();
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1);
      oscillator.stop(audioContext.currentTime + 1);
    } catch (error) {
      console.error('Audio playback error:', error);
    }
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      if (!activeKeys.includes(key)) {
        const note = pianoNotes.find(n => n.key.toLowerCase() === key);
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
    <div className="piano-container">
      <h2 style={{color: '#646cff'}}>鋼琴</h2>
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
      <div className="piano-keys">
        {pianoNotes.map((note) => (
          <button
            key={note.id}
            className={`piano-key ${note.color === 'black' ? 'black-key' : 'white-key'} 
                      ${activeKeys.includes(note.key.toLowerCase()) ? 'active' : ''}`}
            onClick={() => playNote(note.frequency)}
            data-note={note.label}
          >
            <span className="key-label">{note.key}</span>
          </button>
        ))}
      </div>
      <div className="keyboard-hint" style={{color: '#646cff'}}>
        使用鍵盤上對應的按鍵來演奏
      </div>
    </div>
  );
};

export default Piano; 