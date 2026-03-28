import { useEffect, useRef, useCallback } from 'react';

interface Star {
  x: number;
  y: number;
  size: number;
  opacity: number;
  twinkleSpeed: number;
  twinkleOffset: number;
  color: string;
}

interface Sparkle {
  x: number;
  y: number;
  size: number;
  opacity: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  rotation: number;
  rotationSpeed: number;
}

const STAR_COLORS = ['#FFE066', '#FFF', '#FFD700', '#FFFACD', '#F0E68C', '#E8D5FF', '#FFB7D5'];
const SPARKLE_COLORS = ['#FFE066', '#FFD700', '#FF69B4', '#87CEEB', '#DDA0DD', '#98FB98', '#FFA07A'];

export default function StarryBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const starsRef = useRef<Star[]>([]);
  const sparklesRef = useRef<Sparkle[]>([]);
  const mouseRef = useRef({ x: -100, y: -100 });
  const animRef = useRef<number>(0);

  const initStars = useCallback((width: number, height: number) => {
    const count = Math.floor((width * height) / 4000);
    starsRef.current = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2.5 + 0.5,
      opacity: Math.random() * 0.7 + 0.3,
      twinkleSpeed: Math.random() * 2 + 1,
      twinkleOffset: Math.random() * Math.PI * 2,
      color: STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)],
    }));
  }, []);

  const drawStar = (ctx: CanvasRenderingContext2D, cx: number, cy: number, size: number, opacity: number, color: string, rotation: number = 0) => {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(rotation);
    ctx.globalAlpha = opacity;

    // Estrella de 4 puntas
    const outer = size;
    const inner = size * 0.4;
    ctx.beginPath();
    for (let i = 0; i < 8; i++) {
      const r = i % 2 === 0 ? outer : inner;
      const angle = (i * Math.PI) / 4 - Math.PI / 2;
      const x = Math.cos(angle) * r;
      const y = Math.sin(angle) * r;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.shadowColor = color;
    ctx.shadowBlur = size * 3;
    ctx.fill();
    ctx.restore();
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initStars(canvas.width, canvas.height);
    };
    resize();
    window.addEventListener('resize', resize);

    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
      // Generar sparkles
      for (let i = 0; i < 3; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 2 + 0.5;
        sparklesRef.current.push({
          x: e.clientX + (Math.random() - 0.5) * 10,
          y: e.clientY + (Math.random() - 0.5) * 10,
          size: Math.random() * 6 + 3,
          opacity: 1,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed + 0.5,
          life: 0,
          maxLife: Math.random() * 40 + 30,
          color: SPARKLE_COLORS[Math.floor(Math.random() * SPARKLE_COLORS.length)],
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() - 0.5) * 0.15,
        });
      }
    };
    window.addEventListener('mousemove', onMouseMove);

    const onTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0];
      if (!touch) return;
      mouseRef.current = { x: touch.clientX, y: touch.clientY };
      for (let i = 0; i < 2; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 2 + 0.5;
        sparklesRef.current.push({
          x: touch.clientX + (Math.random() - 0.5) * 10,
          y: touch.clientY + (Math.random() - 0.5) * 10,
          size: Math.random() * 6 + 3,
          opacity: 1,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed + 0.5,
          life: 0,
          maxLife: Math.random() * 40 + 30,
          color: SPARKLE_COLORS[Math.floor(Math.random() * SPARKLE_COLORS.length)],
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() - 0.5) * 0.15,
        });
      }
    };
    window.addEventListener('touchmove', onTouchMove);

    const animate = (time: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Dibujar estrellas de fondo con twinkle
      for (const star of starsRef.current) {
        const twinkle = Math.sin(time * 0.001 * star.twinkleSpeed + star.twinkleOffset);
        const opacity = star.opacity * (0.5 + twinkle * 0.5);
        drawStar(ctx, star.x, star.y, star.size, opacity, star.color);
      }

      // Dibujar y actualizar sparkles del cursor
      sparklesRef.current = sparklesRef.current.filter(s => s.life < s.maxLife);
      for (const s of sparklesRef.current) {
        s.x += s.vx;
        s.y += s.vy;
        s.vy += 0.03; // gravedad suave
        s.life++;
        s.rotation += s.rotationSpeed;
        const progress = s.life / s.maxLife;
        s.opacity = 1 - progress;
        const currentSize = s.size * (1 - progress * 0.5);
        drawStar(ctx, s.x, s.y, currentSize, s.opacity, s.color, s.rotation);
      }

      animRef.current = requestAnimationFrame(animate);
    };
    animRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('touchmove', onTouchMove);
    };
  }, [initStars]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    />
  );
}
