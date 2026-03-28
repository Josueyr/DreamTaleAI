import { useStory } from '../context/StoryContext';

export default function HomePage() {
  const { reset, setStep } = useStory();

  const handleStart = () => {
    reset();
    setStep('age');
  };

  return (
    <div className="page home-page">
      <div className="home-content">
        <h1 className="home-title">DreamTale AI</h1>
        <p className="home-subtitle">Donde tus dibujos cobran vida en cuentos magicos</p>

        <div className="home-features">
          <div className="feature-card">
            <span className="feature-icon">&#x270D;&#xFE0F;</span>
            <span className="feature-text">Dibuja</span>
          </div>
          <div className="feature-arrow">&#x27A4;</div>
          <div className="feature-card">
            <span className="feature-icon">&#x1F9E0;</span>
            <span className="feature-text">IA crea</span>
          </div>
          <div className="feature-arrow">&#x27A4;</div>
          <div className="feature-card">
            <span className="feature-icon">&#x1F4D6;</span>
            <span className="feature-text">Lee tu cuento</span>
          </div>
        </div>

        <button className="btn btn-large btn-primary btn-glow" onClick={handleStart}>
          <span className="btn-sparkle">&#x2728;</span> Comenzar aventura
        </button>

        <p className="home-footer">Cuentos personalizados con inteligencia artificial</p>
      </div>
    </div>
  );
}
