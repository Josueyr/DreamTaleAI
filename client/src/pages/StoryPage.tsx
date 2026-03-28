import { useState, useEffect, useRef } from 'react';
import { useStory } from '../context/StoryContext';

export default function StoryPage() {
  const { story, character, reset, setStep } = useStory();
  const [currentPage, setCurrentPage] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    setImageLoaded(false);
    setImageError(false);
    // Para data: URLs el onLoad puede dispararse antes de que React lo adjunte
    // Verificamos si ya está cargada después del render
    const timer = setTimeout(() => {
      if (imgRef.current?.complete && !imgRef.current.naturalWidth) {
        setImageError(true);
      } else if (imgRef.current?.complete) {
        setImageLoaded(true);
      }
    }, 0);
    return () => clearTimeout(timer);
  }, [currentPage]);

  if (!story) {
    setStep('home');
    return null;
  }

  const page = story.pages[currentPage];
  const totalPages = story.pages.length;
  const isFirst = currentPage === 0;
  const isLast = currentPage === totalPages - 1;

  const goNext = () => {
    if (!isLast) setCurrentPage((p) => p + 1);
  };

  const goPrev = () => {
    if (!isFirst) setCurrentPage((p) => p - 1);
  };

  const handleNewStory = () => {
    reset();
  };

  const handleBack = () => {
    setStep('emotion');
  };

  const hasImage = page.imageUrl && page.imageUrl.length > 0;

  return (
    <div className="page story-page">
      <button className="btn-back" onClick={handleBack}>
        &#x2190; Volver
      </button>
      <h2 className="story-title">{story.title}</h2>

      <div className="book">
        {/* Imagen */}
        <div className="book-image">
          {hasImage && !imageError ? (
            <>
              {!imageLoaded && (
                <div className="image-placeholder">
                  <div className="image-orb-mini">
                    <div className="loading-orb-ring" />
                    <div className="loading-orb-core" />
                  </div>
                  <span>Ilustrando esta pagina...</span>
                  <div className="loading-progress" style={{ width: '120px' }}>
                    <div className="loading-progress-bar" />
                  </div>
                </div>
              )}
              <img
                ref={imgRef}
                src={page.imageUrl}
                alt={`Pagina ${page.pageNumber} - ${character}`}
                onLoad={() => setImageLoaded(true)}
                onError={() => setImageError(true)}
                style={{ display: imageLoaded ? 'block' : 'none' }}
              />
            </>
          ) : (
            <div className="image-placeholder image-fallback">
              <span className="image-fallback-icon">&#x1F3A8;</span>
              <span>Ilustracion no disponible</span>
            </div>
          )}
        </div>

        {/* Texto */}
        <div className="book-text">
          <p>{page.text}</p>
        </div>

        {/* Navegacion */}
        <div className="book-nav">
          <button className="btn btn-nav" onClick={goPrev} disabled={isFirst}>
            &#x2B05; Anterior
          </button>
          <span className="page-indicator">
            {currentPage + 1} / {totalPages}
          </span>
          <button className="btn btn-nav" onClick={goNext} disabled={isLast}>
            Siguiente &#x27A1;
          </button>
        </div>
      </div>

      {isLast && (
        <div className="story-end">
          <p className="end-text">Fin del cuento &#x2728;</p>
          <button className="btn btn-large btn-primary btn-glow" onClick={handleNewStory}>
            &#x2728; Crear otro cuento!
          </button>
        </div>
      )}
    </div>
  );
}
