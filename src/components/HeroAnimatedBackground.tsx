import { useEffect, useRef } from "react";

export default function HeroAnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let width = 0;
    let height = 0;
    const container = canvas.parentElement;

    const updateSize = () => {
      if (!canvas || !container) return;
      width = canvas.width = container.offsetWidth || window.innerWidth;
      height = canvas.height = container.offsetHeight || window.innerHeight;
    };

    updateSize();

    const ro = new ResizeObserver(updateSize);
    if (container) ro.observe(container);
    window.addEventListener("resize", updateSize);

    // Particle system (warm amber & orange particles drifting up gently)
    const particleCount = Math.min(Math.floor((width * height) / 22000), 45);
    const colors = ["#FF7F00", "#FBB222", "#E45301", "#ffffff"];

    const particles = Array.from({ length: Math.max(particleCount, 25) }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2.2 + 0.8,
      speedY: Math.random() * 0.4 + 0.15,
      speedX: (Math.random() - 0.5) * 0.25,
      opacity: Math.random() * 0.6 + 0.2,
      pulseSpeed: Math.random() * 0.02 + 0.01,
      color: colors[Math.floor(Math.random() * colors.length)],
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.y -= p.speedY;
        p.x += p.speedX;
        p.opacity += Math.sin(Date.now() * p.pulseSpeed) * 0.005;
        if (p.opacity < 0.1) p.opacity = 0.1;
        if (p.opacity > 0.85) p.opacity = 0.85;

        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;

        ctx.save();
        ctx.globalAlpha = p.opacity;
        ctx.fillStyle = p.color;
        ctx.shadowBlur = 8;
        ctx.shadowColor = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", updateSize);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <div
      className="hero-animated-bg"
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        backgroundColor: "#07070f",
        zIndex: 0,
        pointerEvents: "none",
      }}
      aria-hidden="true"
    >
      <style>{`
        .hero-animated-bg::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image: linear-gradient(rgba(255, 127, 0, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 127, 0, 0.05) 1px, transparent 1px);
          background-size: 60px 60px;
          z-index: 1;
          pointer-events: none;
        }

        .hero-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(100px);
          opacity: 0.18;
          pointer-events: none;
          z-index: 1;
          animation: hero-orb-drift 12s ease-in-out infinite alternate;
        }

        .hero-orb-1 {
          width: 600px;
          height: 600px;
          background: #E45301;
          top: -150px;
          left: -150px;
          animation-delay: 0s;
        }

        .hero-orb-2 {
          width: 500px;
          height: 500px;
          background: #FF7F00;
          bottom: -100px;
          right: -100px;
          animation-delay: -4s;
        }

        .hero-orb-3 {
          width: 400px;
          height: 400px;
          background: #FBB222;
          top: 40%;
          left: 60%;
          animation-delay: -8s;
        }

        @keyframes hero-orb-drift {
          from {
            transform: translate(0, 0) scale(1);
          }
          to {
            transform: translate(40px, 30px) scale(1.08);
          }
        }
      `}</style>

      {/* Ambient glowing orbs */}
      <div className="hero-orb hero-orb-1" aria-hidden="true" />
      <div className="hero-orb hero-orb-2" aria-hidden="true" />
      <div className="hero-orb hero-orb-3" aria-hidden="true" />

      {/* Particle Canvas */}
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          zIndex: 2,
          pointerEvents: "none",
        }}
        aria-hidden="true"
      />
    </div>
  );
}
