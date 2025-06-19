import React, { useEffect, useRef } from "react";
import './WaveAnimation.css';

const WaveAnimation = ({ isRecording }) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const wavesRef = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = 200;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    wavesRef.current = Array.from({ length: 4 }, (_, i) => ({
      amp: 20 + i * 10,
      freq: 0.002 + i * 0.001,
      phase: Math.random() * 1000,
      speed: 0.03 + Math.random() * 0.02
    }));

    const draw = () => {
      const width = canvas.width;
      const height = canvas.height;

      ctx.clearRect(0, 0, width, height);
      ctx.lineWidth = 1.5;

      wavesRef.current.forEach(wave => {
        ctx.beginPath();
        for (let x = 0; x < width; x++) {
          const y = Math.sin((x + wave.phase) * wave.freq) * wave.amp + height / 2;
          ctx.lineTo(x, y);
        }
        ctx.strokeStyle = "rgba(255, 0, 255, 0.9)";

        ctx.stroke();
        wave.phase += wave.speed * 100;
      });

      animationRef.current = requestAnimationFrame(draw);
    };

    if (isRecording) {
      draw();
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      cancelAnimationFrame(animationRef.current);
    }

    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [isRecording]);

  return <canvas ref={canvasRef} className="wave-canvas" />;
};

export default WaveAnimation;
