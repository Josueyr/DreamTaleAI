import { useState } from 'react';
import { useStory } from '../context/StoryContext';
import { generateStory } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const emotions = [
  { id: 'feliz', label: 'Feliz', icon: '\u{1F60A}', color: '#facc15', bg: 'rgba(250, 204, 21, 0.12)' },
  { id: 'triste', label: 'Triste', icon: '\u{1F622}', color: '#60a5fa', bg: 'rgba(96, 165, 250, 0.12)' },
  { id: 'valiente', label: 'Valiente', icon: '\u{1F9B8}', color: '#f87171', bg: 'rgba(248, 113, 113, 0.12)' },
  { id: 'miedo', label: 'Con miedo', icon: '\u{1F47B}', color: '#c084fc', bg: 'rgba(192, 132, 252, 0.12)' },
  { id: 'curioso', label: 'Curioso', icon: '\u{1F52D}', color: '#2dd4bf', bg: 'rgba(45, 212, 191, 0.12)' },
  { id: 'enojado', label: 'Enojado', icon: '\u{1F525}', color: '#fb923c', bg: 'rgba(251, 146, 60, 0.12)' },
];

export default function EmotionPage() {
  const { age, character, setEmotion, setStory, setStep } = useStory();
  const [selected, setSelected] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSelect = (emotionId: string) => {
    setSelected(emotionId);
    setEmotion(emotionId);
  };

  const handleGenerate = async () => {
    if (!selected || !age || !character) return;
    setLoading(true);
    try {
      const story = await generateStory(age, character, selected);
      setStory(story);
      setStep('story');
    } catch (err) {
      console.error('Error al generar cuento:', err);
      alert('Error al crear el cuento. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page emotion-page">
      <button className="btn-back" onClick={() => setStep('character')}>
        &#x2190; Volver
      </button>

      <h2>&#x00BF;Como se siente tu {character}?</h2>
      <p className="page-hint">Elige una emocion para tu cuento</p>

      <div className="emotions-grid">
        {emotions.map((em) => (
          <button
            key={em.id}
            className={`emotion-btn ${selected === em.id ? 'selected' : ''}`}
            style={{
              borderColor: selected === em.id ? em.color : 'rgba(255,255,255,0.06)',
              backgroundColor: selected === em.id ? em.bg : 'rgba(255, 255, 255, 0.04)',
            }}
            onClick={() => handleSelect(em.id)}
          >
            <span className="emotion-icon">{em.icon}</span>
            <span className="emotion-label" style={{ color: em.color }}>{em.label}</span>
          </button>
        ))}
      </div>

      {loading ? (
        <LoadingSpinner message="Escribiendo tu cuento magico" submessage="La IA esta imaginando una historia increible para ti..." />
      ) : (
        <button
          className="btn btn-large btn-primary btn-glow"
          disabled={!selected}
          onClick={handleGenerate}
        >
          &#x2728; Crear mi cuento!
        </button>
      )}
    </div>
  );
}
