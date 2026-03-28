import { useRef, useState, useEffect, useImperativeHandle, forwardRef, MouseEvent, TouchEvent } from 'react';

export interface DrawingCanvasHandle {
  clear: () => void;
}

interface DrawingCanvasProps {
  width?: number;
  height?: number;
  lineColor?: string;
  lineWidth?: number;
  onSave: (imageBase64: string) => void;
  instruction: string;
}

const DrawingCanvas = forwardRef<DrawingCanvasHandle, DrawingCanvasProps>(function DrawingCanvas({
  width = 400,
  height = 400,
  lineColor = '#333',
  lineWidth = 6,
  onSave,
  instruction,
}, ref) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, width, height);
  }, [width, height]);

  const getPos = (e: MouseEvent | TouchEvent) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    if ('touches' in e) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
      };
    }
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const startDrawing = (e: MouseEvent | TouchEvent) => {
    e.preventDefault();
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    const { x, y } = getPos(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
    setHasDrawn(true);
  };

  const draw = (e: MouseEvent | TouchEvent) => {
    e.preventDefault();
    if (!isDrawing) return;
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    const { x, y } = getPos(e);
    ctx.lineWidth = lineWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = lineColor;
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => setIsDrawing(false);

  const clearCanvas = () => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, width, height);
    setHasDrawn(false);
  };

  useImperativeHandle(ref, () => ({ clear: clearCanvas }));

  const saveDrawing = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const base64 = canvas.toDataURL('image/png').split(',')[1];
    onSave(base64);
  };

  return (
    <div className="canvas-container">
      <p className="canvas-instruction">{instruction}</p>
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="drawing-canvas"
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={stopDrawing}
      />
      <div className="canvas-buttons">
        <button className="btn btn-secondary" onClick={clearCanvas}>
          Borrar
        </button>
        <button className="btn btn-primary" onClick={saveDrawing} disabled={!hasDrawn}>
          Listo
        </button>
      </div>
    </div>
  );
});

export default DrawingCanvas;
