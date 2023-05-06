import React, { useEffect, useRef } from 'react';

const ParticleAnimation = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const ParticleCanvas = canvasRef.current;
    const context = ParticleCanvas.getContext('2d');

    ParticleCanvas.width = window.innerWidth - 20;
    ParticleCanvas.height = window.innerHeight - 10;

    const handleResize = () => {
        ParticleCanvas.width = window.innerWidth - 20;
        ParticleCanvas.height = window.innerHeight - 10;
    };

    window.addEventListener('resize', handleResize);

    let particles = {},
      particleIndex = 0,
      settings = {
        density: 20,
        particleSize: 2,
        startingX: ParticleCanvas.width / 2,
        startingY: ParticleCanvas.height,
        gravity: -0.01,
      };

    class Particle {
      constructor() {
        this.x = settings.startingX * (Math.random() * 10);
        this.y = settings.startingY;

        this.vx = (Math.random() * 2) / 3 - (Math.random() * 3) / 3;
        this.vy = -(Math.random() * 5) / 3;

        particleIndex++;
        particles[particleIndex] = this;
        this.id = particleIndex;
        this.life = 0;
        this.maxLife = 200;
        this.alpha = 1;
        this.red = 0;
        this.green = 255;
        this.blue = 255;
      }
      draw() {
        this.x += this.vx;
        this.y += this.vy;

        this.vy += settings.gravity;

        this.life++;

        this.red += 2;

        this.alpha -= 0.005;

        if (this.life >= this.maxLife) {
          delete particles[this.id];
        }

        context.clearRect(settings.leftWall, settings.groundLevel, ParticleCanvas.width, ParticleCanvas.height);
        context.beginPath();
        context.fillStyle = `rgba(${this.red}, ${this.green}, ${this.blue}, ${this.alpha})`;
        context.arc(this.x, this.y, settings.particleSize, 0, Math.PI * 2, true);
        context.closePath();
        context.fill();
      }
    }


    const animateDust = () => {
      context.clearRect(0, 0, ParticleCanvas.width, ParticleCanvas.height);

      for (let i = 0; i < settings.density; i++) {
        if (Math.random() > 0.97) {
          new Particle();
        }
      }

      for (let i in particles) {
        particles[i].draw();
      }
      requestAnimationFrame(animateDust);
    };

    animateDust();

    return () => {
        window.removeEventListener('resize', handleResize);
      };
  }, []);

  return <canvas ref={canvasRef} />;
};

export default ParticleAnimation;
