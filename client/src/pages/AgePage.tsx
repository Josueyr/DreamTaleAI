import { useState, useRef } from 'react';
import DrawingCanvas from '../components/DrawingCanvas';
import type { DrawingCanvasHandle } from '../components/DrawingCanvas';
import { useStory } from '../context/StoryContext';
import { recognizeAge } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

export default function AgePage() {
  const { setAge, setStep } = useStory();
  const canvasRef = useRef<DrawingCanvasHandle>(null);
  const [loading, setLoading] = useState(false);
  const [detected, setDetected] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [warning, setWarning] = useState('');

  const handleDrawingSave = async (imageBase64: string) => {
    setLoading(true);
    setError('');
    setWarning('');
    try {
      const result = await recognizeAge(imageBase64);
      if (result.inappropriate) {
        setWarning(result.moderationMessage || 'Dibujo no apropiado. Intenta con otro dibujo.');
      } else if (result.success) {
        const age = parseInt(result.detectedValue);
        if (isNaN(age) || age < 0 || age > 12) {
          setError('La edad debe estar entre 0 y 12 años. Intenta de nuevo.');
          canvasRef.current?.clear();
        } else {
          setDetected(age);
          setAge(age);
        }
      } else {
        setError('No pude entender el numero. Intenta de nuevo.');
      }
    } catch {
      setError('Hubo un error. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page age-page">
      <button className="btn-back" onClick={() => setStep('home')}>
        &#x2190; Volver
      </button>

      <h2>&#x00BF;Cuantos a&#x00F1;os tienes?</h2>
      <p className="page-hint">Dibuja un numero con tu dedo o el raton</p>

      <DrawingCanvas
        ref={canvasRef}
        instruction="Dibuja tu edad aqui (ejemplo: 7)"
        onSave={handleDrawingSave}
        lineColor="#FF6B6B"
        lineWidth={8}
      />

      {loading && <LoadingSpinner message="Reconociendo tu dibujo" submessage="Nuestra IA esta analizando los trazos..." />}
      {warning && <div className="moderation-warning"><span className="moderation-icon">&#x1F6AB;</span><p>{warning}</p></div>}
      {error && <p className="error">{error}</p>}

      {detected !== null && (
        <div className="detected-result">
          <p>&#x00BF;Tienes <strong>{detected} a&#x00F1;os</strong>?</p>
          <div className="result-buttons">
            <button className="btn btn-primary" onClick={() => setStep('character')}>
              Si, correcto!
            </button>
            <button className="btn btn-secondary" onClick={() => { setDetected(null); canvasRef.current?.clear(); }}>
              No, dibujar de nuevo
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
