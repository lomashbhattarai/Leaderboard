import React, { useEffect, useRef } from "react";
import { SpaceTheme } from "../themes/spaceThemes";

interface SpaceBackgroundProps {
  theme: SpaceTheme;
}

const SpaceBackground: React.FC<SpaceBackgroundProps> = ({ theme }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (theme.name === "Default Theme") return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const stars: { x: number; y: number; size: number; speed: number }[] = [];

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const createStars = () => {
      stars.length = 0;
      for (let i = 0; i < theme.stars.density; i++) {
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 2,
          speed: Math.random() * 0.5 + 0.1,
        });
      }
    };

    const animate = () => {
      ctx.fillStyle = theme.background.primary;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      stars.forEach((star) => {
        ctx.fillStyle = theme.stars.color;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();

        star.y += star.speed;
        if (star.y > canvas.height) {
          star.y = 0;
          star.x = Math.random() * canvas.width;
        }
      });

      requestAnimationFrame(animate);
    };

    resizeCanvas();
    createStars();
    animate();

    window.addEventListener("resize", () => {
      resizeCanvas();
      createStars();
    });

    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [theme]);

  if (theme.name === "Default Theme") {
    return null; // Don't render canvas for default theme
  }

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: -1,
        background: `linear-gradient(to bottom, ${theme.background.primary}, ${theme.background.secondary})`,
      }}
    />
  );
};

export default SpaceBackground;
