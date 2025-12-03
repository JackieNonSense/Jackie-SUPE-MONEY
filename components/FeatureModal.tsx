import React, { useEffect, useState, useRef } from 'react';

interface Props {
  type: 'FREE_GAMES' | 'HOLD_AND_SPIN' | 'FEATURE_SUMMARY';
  winAmount?: number;
  onClose: () => void;
}

// Hook for counting up numbers smoothly
const useCountUp = (end: number, duration: number = 2000) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        let startTime: number;
        let animationFrame: number;

        const update = (now: number) => {
            if (!startTime) startTime = now;
            const progress = Math.min((now - startTime) / duration, 1);
            // Ease out quart
            const ease = 1 - Math.pow(1 - progress, 4);
            
            setCount(Math.floor(end * ease));

            if (progress < 1) {
                animationFrame = requestAnimationFrame(update);
            }
        };

        animationFrame = requestAnimationFrame(update);
        return () => cancelAnimationFrame(animationFrame);
    }, [end, duration]);

    return count;
};

export const FeatureModal: React.FC<Props> = ({ type, winAmount, onClose }) => {
  const [visible, setVisible] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const displayAmount = useCountUp(winAmount || 0, 4000); // Slower count up for big win
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    // Animation trigger
    setTimeout(() => setVisible(true), 100);
    if (type === 'FEATURE_SUMMARY') {
        setTimeout(() => setShowButton(true), 3000); // Show button later
    } else {
        setShowButton(true);
    }
  }, [type]);

  // Continuous Coin Fountain System
  useEffect(() => {
      if (type !== 'FEATURE_SUMMARY' || !canvasRef.current) return;

      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const resize = () => {
          canvas.width = window.innerWidth;
          canvas.height = window.innerHeight;
      };
      window.addEventListener('resize', resize);
      resize();

      const particles: any[] = [];
      const colors = ['#FFD700', '#FFA500', '#DAA520', '#F0E68C', '#B8860B']; // Rich Gold Palette

      const createParticle = () => {
          return {
              x: canvas.width / 2,
              y: canvas.height / 2 + 150, // Emit from slightly below center
              vx: (Math.random() - 0.5) * 12, // Spread width
              vy: -(Math.random() * 15 + 12), // High Upward velocity (Jet effect)
              size: Math.random() * 10 + 6,   // Big coins
              color: colors[Math.floor(Math.random() * colors.length)],
              gravity: 0.6,
              drag: 0.99, // Air resistance
              rotation: Math.random() * Math.PI * 2,
              rotationSpeed: (Math.random() - 0.5) * 0.3,
              type: Math.random() > 0.9 ? 'confetti' : 'coin' // 90% Coins, 10% Confetti
          };
      };

      let animationId: number;
      const animate = () => {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          
          // Emitter: Continuously spawn new particles
          // Spawn 3-5 coins per frame for dense effect
          for(let i=0; i<4; i++) {
              particles.push(createParticle());
          }
          
          for (let i = particles.length - 1; i >= 0; i--) {
              const p = particles[i];
              p.x += p.vx;
              p.y += p.vy;
              p.vy += p.gravity;
              p.vx *= p.drag;
              p.rotation += p.rotationSpeed;

              ctx.save();
              ctx.translate(p.x, p.y);
              ctx.rotate(p.rotation);
              ctx.fillStyle = p.color;
              
              if (p.type === 'coin') {
                  // Coin Body
                  ctx.beginPath();
                  ctx.arc(0, 0, p.size, 0, Math.PI * 2);
                  ctx.fill();
                  
                  // Coin Inner Ring (Detail)
                  ctx.strokeStyle = '#B8860B';
                  ctx.lineWidth = 1;
                  ctx.beginPath();
                  ctx.arc(0, 0, p.size * 0.7, 0, Math.PI * 2);
                  ctx.stroke();

                  // Shine/Glint
                  ctx.fillStyle = 'rgba(255,255,255,0.6)';
                  ctx.beginPath();
                  ctx.arc(-p.size*0.3, -p.size*0.3, p.size*0.25, 0, Math.PI * 2);
                  ctx.fill();
              } else {
                  // Neon Confetti
                  ctx.fillStyle = ['#00ffff', '#ff00ff', '#ccff00'][Math.floor(Math.abs(p.x) % 3)];
                  ctx.fillRect(-p.size/2, -p.size/2, p.size, p.size * 1.5);
              }
              ctx.restore();

              // Cleanup particles that fell off screen
              if (p.y > canvas.height + 50) {
                  particles.splice(i, 1);
              }
          }

          animationId = requestAnimationFrame(animate);
      };

      animate();

      return () => {
          cancelAnimationFrame(animationId);
          window.removeEventListener('resize', resize);
      };
  }, [type]);

  const handleClose = () => {
      setVisible(false);
      setTimeout(onClose, 500); // Wait for exit animation
  };

  const content = {
      'FREE_GAMES': {
          title: 'FREE GAMES WON!',
          subtitle: '6 Free Games Awarded',
          color: 'purple',
          icon: '⛩️',
          bgClass: 'border-purple-500 shadow-purple-500/50'
      },
      'HOLD_AND_SPIN': {
          title: 'HOLD & SPIN!',
          subtitle: 'Locked Orbs Triggered',
          color: 'cyan',
          icon: '🔮',
          bgClass: 'border-cyan-500 shadow-cyan-500/50'
      },
      'FEATURE_SUMMARY': {
          title: 'BIG WIN!',
          subtitle: 'FEATURE TOTAL',
          color: 'gold',
          icon: '🏆',
          bgClass: 'border-yellow-400 shadow-[0_0_100px_gold]'
      }
  }[type];

  if (!content) return null;

  const isBigWin = type === 'FEATURE_SUMMARY';

  return (
    <div className={`
        fixed inset-0 z-[100] flex items-center justify-center
        transition-opacity duration-500
        ${visible ? 'opacity-100' : 'opacity-0'}
    `}>
        {/* Dark Backdrop */}
        <div className="absolute inset-0 bg-black/90 backdrop-blur-md"></div>

        {/* Canvas for Explosion (Only for Summary) */}
        {isBigWin && <canvas ref={canvasRef} className="absolute inset-0 z-0 pointer-events-none" />}
        
        {/* Sunburst Rays Background */}
        {isBigWin && (
            <div className="absolute inset-0 flex items-center justify-center z-0 opacity-30">
                <div className="sunburst-ray"></div>
                <div className="sunburst-ray" style={{ animationDirection: 'reverse', animationDuration: '15s' }}></div>
            </div>
        )}

        <div className={`
            relative z-20 bg-black/80 border-4 rounded-3xl p-12 text-center
            transform transition-all duration-700 max-w-2xl w-full mx-4
            ${visible ? 'scale-100 translate-y-0' : 'scale-50 translate-y-20'}
            shadow-[0_0_50px_currentColor]
            ${content.bgClass}
        `}>
            {/* Inner Content */}
            <div className="relative">
                <div className="text-8xl mb-6 animate-bounce drop-shadow-[0_0_30px_rgba(255,255,255,0.8)]">
                    {content.icon}
                </div>
                
                <h2 className={`
                    text-5xl md:text-7xl font-western mb-2 tracking-wide uppercase drop-shadow-lg animate-text-pop
                    ${isBigWin ? 'text-transparent bg-clip-text bg-gradient-to-b from-yellow-100 via-yellow-400 to-yellow-600' : 'text-white'}
                `}>
                    {content.title}
                </h2>
                
                <p className="text-xl md:text-3xl font-serif-display uppercase tracking-widest opacity-90 mb-8 text-white">
                    {content.subtitle}
                </p>

                {winAmount !== undefined && (
                    <div className={`
                        font-mono font-black text-white mb-10 transition-all duration-100
                        ${isBigWin ? 'text-6xl md:text-8xl drop-shadow-[0_0_20px_gold] scale-110' : 'text-5xl md:text-7xl'}
                    `}>
                        {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(displayAmount / 100)}
                    </div>
                )}

                <div className={`transition-opacity duration-500 ${showButton ? 'opacity-100' : 'opacity-0'}`}>
                    <button 
                        onClick={handleClose}
                        className={`
                            px-12 py-4 rounded-full text-2xl font-black uppercase tracking-widest
                            transition-transform hover:scale-110 active:scale-95
                            text-white shadow-[0_0_20px_rgba(0,0,0,0.5)] border-2 border-white/20
                            ${content.color === 'purple' ? 'bg-gradient-to-r from-purple-700 to-purple-500' : ''}
                            ${content.color === 'cyan' ? 'bg-gradient-to-r from-cyan-700 to-cyan-500' : ''}
                            ${content.color === 'gold' ? 'bg-gradient-to-r from-yellow-700 to-yellow-500 animate-pulse' : ''}
                        `}
                    >
                        {type === 'FEATURE_SUMMARY' ? 'COLLECT WIN' : 'START FEATURE'}
                    </button>
                </div>
            </div>
        </div>
    </div>
  );
};