interface LoadingSpinnerProps {
  message: string;
  submessage?: string;
}

const steps = ['Analizando', 'Procesando', 'Casi listo'];

export default function LoadingSpinner({ message, submessage }: LoadingSpinnerProps) {
  return (
    <div className="loading-spinner-container">
      <div className="loading-orb">
        <div className="loading-orb-ring" />
        <div className="loading-orb-ring loading-orb-ring-2" />
        <div className="loading-orb-core" />
      </div>
      <p className="loading-message">{message}</p>
      {submessage && <p className="loading-submessage">{submessage}</p>}
      <div className="loading-progress">
        <div className="loading-progress-bar" />
      </div>
      <div className="loading-steps">
        {steps.map((step, i) => (
          <span key={step} className="loading-step" style={{ animationDelay: `${i * 1.2}s` }}>
            {step}...
          </span>
        ))}
      </div>
    </div>
  );
}
