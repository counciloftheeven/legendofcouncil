import React, { useEffect, useRef } from 'react';

export type WeatherType = 'none' | 'embers' | 'fog' | 'rain' | 'storm';

interface AmbientWeatherCanvasProps {
  weather: WeatherType;
  opacity?: number;
}

export const AmbientWeatherCanvas: React.FC<AmbientWeatherCanvasProps> = ({
  weather,
  opacity = 0.65,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (weather === 'none') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Particle setups
    const count = weather === 'rain' || weather === 'storm' ? 120 : weather === 'embers' ? 50 : 25;
    const particles = Array.from({ length: count }, () => {
      if (weather === 'embers') {
        return {
          x: Math.random() * width,
          y: height + Math.random() * 50,
          size: Math.random() * 2.5 + 1,
          speedY: -(Math.random() * 1.5 + 0.5),
          speedX: (Math.random() - 0.5) * 0.8,
          alpha: Math.random() * 0.8 + 0.2,
          hue: Math.random() > 0.3 ? 28 : 12, // orange/red
        };
      } else if (weather === 'rain' || weather === 'storm') {
        return {
          x: Math.random() * width,
          y: Math.random() * height,
          length: Math.random() * 20 + 10,
          speedY: Math.random() * 14 + 10,
          speedX: -2.5,
          alpha: Math.random() * 0.4 + 0.2,
        };
      } else {
        // Fog
        return {
          x: Math.random() * width,
          y: Math.random() * height,
          radius: Math.random() * 120 + 60,
          speedX: (Math.random() - 0.5) * 0.3,
          speedY: (Math.random() - 0.5) * 0.1,
          alpha: Math.random() * 0.12 + 0.04,
        };
      }
    });

    let lightningTimer = 0;
    let lightningFlash = 0;

    let isRunning = true;

    const render = () => {
      if (!isRunning) return;
      ctx.clearRect(0, 0, width, height);

      // Thunderstorm Lightning Flash
      if (weather === 'storm') {
        lightningTimer++;
        if (lightningTimer > 280 && Math.random() < 0.04) {
          lightningFlash = 0.45;
          lightningTimer = 0;
        }
        if (lightningFlash > 0) {
          ctx.fillStyle = `rgba(230, 240, 255, ${lightningFlash})`;
          ctx.fillRect(0, 0, width, height);
          lightningFlash *= 0.85;
          if (lightningFlash < 0.02) lightningFlash = 0;
        }
      }

      // Draw particles
      particles.forEach((p: any) => {
        if (weather === 'embers') {
          p.x += p.speedX;
          p.y += p.speedY;
          p.alpha -= 0.002;
          if (p.y < -10 || p.alpha <= 0) {
            p.y = height + 10;
            p.x = Math.random() * width;
            p.alpha = Math.random() * 0.8 + 0.2;
          }

          ctx.save();
          ctx.fillStyle = `hsla(${p.hue}, 90%, 55%, ${p.alpha * opacity})`;
          ctx.shadowBlur = 8;
          ctx.shadowColor = `hsl(${p.hue}, 100%, 50%)`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        } else if (weather === 'rain' || weather === 'storm') {
          p.x += p.speedX;
          p.y += p.speedY;
          if (p.y > height) {
            p.y = -p.length;
            p.x = Math.random() * (width + 100);
          }

          ctx.save();
          ctx.strokeStyle = `rgba(180, 210, 240, ${p.alpha * opacity})`;
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x + p.speedX * 1.5, p.y + p.length);
          ctx.stroke();
          ctx.restore();
        } else if (weather === 'fog') {
          p.x += p.speedX;
          p.y += p.speedY;
          if (p.x < -p.radius) p.x = width + p.radius;
          if (p.x > width + p.radius) p.x = -p.radius;

          ctx.save();
          const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius);
          grad.addColorStop(0, `rgba(160, 150, 140, ${p.alpha * opacity})`);
          grad.addColorStop(1, 'rgba(160, 150, 140, 0)');
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      });

      animId = requestAnimationFrame(render);
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        isRunning = false;
        cancelAnimationFrame(animId);
      } else {
        if (!isRunning) {
          isRunning = true;
          animId = requestAnimationFrame(render);
        }
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    render();

    return () => {
      isRunning = false;
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [weather, opacity]);

  if (weather === 'none') return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-30"
      style={{ mixBlendMode: weather === 'embers' ? 'screen' : 'normal' }}
    />
  );
};
