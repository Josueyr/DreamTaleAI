import { useState, useRef } from 'react';
import DrawingCanvas from '../components/DrawingCanvas';
import type { DrawingCanvasHandle } from '../components/DrawingCanvas';
import { useStory } from '../context/StoryContext';
import { recognizeCharacter } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

export default function CharacterPage() {
  const { setCharacter, setStep } = useStory();
  const canvasRef = useRef<DrawingCanvasHandle>(null);
  const [loading, setLoading] = useState(false);
  const [detected, setDetected] = useState('');
  const [error, setError] = useState('');
  const [warning, setWarning] = useState('');

  const handleDrawingSave = async (imageBase64: string) => {
    setLoading(true);
    setError('');
    setWarning('');
    try {
      const result = await recognizeCharacter(imageBase64);
      if (result.inappropriate) {
        setWarning(result.moderationMessage || 'Dibujo no apropiado. Intenta con otro dibujo.');
      } else if (result.success) {
        setDetected(result.detectedValue);
        setCharacter(result.detectedValue);
      } else {
        setError('No pude ver que dibujaste. Intenta de nuevo.');
      }
    } catch {
      setError('Hubo un error. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page character-page">
      <button className="btn-back" onClick={() => setStep('age')}>
        &#x2190; Volver
      </button>

      <h2>Dibuja un personaje!</h2>
      <p className="page-hint">Puede ser un animal, un robot, un dragon... lo que quieras!</p>

      <DrawingCanvas
        ref={canvasRef}
        instruction="Dibuja tu personaje favorito aqui"
        onSave={handleDrawingSave}
        lineColor="#4ECDC4"
        lineWidth={6}
      />

      {loading && <LoadingSpinner message="Adivinando tu personaje" submessage="La IA esta observando tu obra de arte..." />}
      {warning && <div className="moderation-warning"><span className="moderation-icon">&#x1F6AB;</span><p>{warning}</p></div>}
      {error && <p className="error">{error}</p>}

      {detected && (
        <div className="detected-result">
          <p>Veo un <strong>{detected}</strong>! Es correcto?</p>
          <div className="result-buttons">
            <button className="btn btn-primary" onClick={() => setStep('emotion')}>
              Si, es eso!
            </button>
            <button className="btn btn-secondary" onClick={() => { setDetected(''); canvasRef.current?.clear(); }}>
              No, dibujar de nuevo
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
