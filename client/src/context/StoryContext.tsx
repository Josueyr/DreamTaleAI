import { createContext, useContext, useState, ReactNode } from 'react';
import type { Story } from '../services/api';

export type Step = 'home' | 'age' | 'character' | 'emotion' | 'story';

interface StoryState {
  age: number | null;
  character: string;
  emotion: string;
  story: Story | null;
  step: Step;
  setAge: (age: number) => void;
  setCharacter: (character: string) => void;
  setEmotion: (emotion: string) => void;
  setStory: (story: Story) => void;
  setStep: (step: Step) => void;
  reset: () => void;
}

const StoryContext = createContext<StoryState | undefined>(undefined);

export function StoryProvider({ children }: { children: ReactNode }) {
  const [age, setAge] = useState<number | null>(null);
  const [character, setCharacter] = useState('');
  const [emotion, setEmotion] = useState('');
  const [story, setStory] = useState<Story | null>(null);
  const [step, setStep] = useState<Step>('home');

  const reset = () => {
    setAge(null);
    setCharacter('');
    setEmotion('');
    setStory(null);
    setStep('home');
  };

  return (
    <StoryContext.Provider value={{ age, character, emotion, story, step, setAge, setCharacter, setEmotion, setStory, setStep, reset }}>
      {children}
    </StoryContext.Provider>
  );
}

export function useStory() {
  const context = useContext(StoryContext);
  if (!context) throw new Error('useStory must be used within StoryProvider');
  return context;
}
