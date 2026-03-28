import { StoryProvider, useStory } from './context/StoryContext';
import StarryBackground from './components/StarryBackground';
import HomePage from './pages/HomePage';
import AgePage from './pages/AgePage';
import CharacterPage from './pages/CharacterPage';
import EmotionPage from './pages/EmotionPage';
import StoryPage from './pages/StoryPage';
import './App.css';

function AppContent() {
  const { step } = useStory();

  return (
    <div className="app">
      {step === 'home' && <HomePage />}
      {step === 'age' && <AgePage />}
      {step === 'character' && <CharacterPage />}
      {step === 'emotion' && <EmotionPage />}
      {step === 'story' && <StoryPage />}
    </div>
  );
}

function App() {
  return (
    <StoryProvider>
      <StarryBackground />
      <AppContent />
    </StoryProvider>
  );
}

export default App;
