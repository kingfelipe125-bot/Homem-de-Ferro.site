/* =========================================================
   VALE PERDIDO — Terminal de Contenção
   GSAP + ScrollTrigger + Lenis + Web Audio (sintetizado)
   ========================================================= */

(() => {
  "use strict";

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouch = window.matchMedia('(max-width:900px)').matches;

  /* ---------------------------------------------------------
     0. AUDIO ENGINE — synthesized ambient jungle / rain / roar
     (no external audio files: everything generated via WebAudio,
     avoiding any licensing dependency)
  --------------------------------------------------------- */
  const AudioEngine = (() => {
    let ctx = null;
    let master, jungleGain, rainGain;
    let started = false;
    let enabled = false;

    function init() {
      if (ctx) return;
      ctx = new (window.AudioContext || window.webkitAudioContext)();
      master = ctx.createGain();
      master.gain.value = 0.0;
      master.connect(ctx.destination);

      jungleGain = ctx.createGain();
      jungleGain.gain.value = 0.5;
      jungleGain.connect(master);

      rainGain = ctx.createGain();
      rainGain.gain.value = 0.0;
      rainGain.connect(master);

      buildJungleDrone();
      buildRainBed();
      scheduleBirdChirps();
    }

    function noiseBuffer(seconds = 2) {
      const bufferSize = ctx.sampleRate * seconds;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
      return buffer;
    }

    function buildJungleDrone() {
      const src = ctx.createBufferSource();
      src.buffer = noiseBuffer(4);
      src.loop = true;
      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 220;
      filter.Q.value = 0.6;
      const lfo = ctx.createOscillator();
      lfo.frequency.value = 0.07;
      const lfoGain = ctx.createGain();
      lfoGain.gain.value = 60;
      lfo.connect(lfoGain);
      lfoGain.connect(filter.frequency);
      lfo.start();
      src.connect(filter);
      filter.connect(jungleGain);
      src.start();

      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = 55;
      const oscGain = ctx.createGain();
      oscGain.gain.value = 0.04;
      osc.connect(oscGain);
      oscGain.connect(jungleGain);
      osc.start();
    }

    function buildRainBed() {
      const src = ctx.createBufferSource();
      src.buffer = noiseBuffer(3);
      src.loop = true;
      const filter = ctx.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.value = 2200;
      src.connect(filter);
      filter.connect(rainGain);
      src.start();
    }

    function scheduleBirdChirp() {
      if (!ctx || !enabled) return;
      const t = ctx.currentTime;
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      const g = ctx.createGain();
      const base = 1200 + Math.random() * 900;
      osc.frequency.setValueAtTime(base, t);
      osc.frequency.exponentialRampToValueAtTime(base * (Math.random() > .5 ? 1.4 : 0.7), t + 0.12);
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(0.06, t + 0.02);
      g.gain.linearRampToValueAtTime(0, t + 0.18);
      osc.connect(g);
      g.connect(jungleGain);
      osc.start(t);
      osc.stop(t + 0.2);
    }

    function scheduleBirdChirps() {
      const next = () => {
        if (enabled && Math.random() > 0.3) scheduleBirdChirp();
        setTimeout(next, 2200 + Math.random() * 4000);
      };
      setTimeout(next, 3000);
    }

    function roar(intensity = 1) {
      if (!ctx) return;
      const t = ctx.currentTime;
      const osc = ctx.createOscillator();
      osc.type = 'sawtooth';
      const g = ctx.createGain();
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(180, t);
      filter.frequency.linearRampToValueAtTime(700, t + 0.5);
      filter.frequency.linearRampToValueAtTime(90, t + 2.2);
      osc.frequency.setValueAtTime(50, t);
      osc.frequency.linearRampToValueAtTime(85, t + 0.4);
      osc.frequency.linearRampToValueAtTime(40, t + 2.3);
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(0.35 * intensity, t + 0.35);
      g.gain.linearRampToValueAtTime(0, t + 2.4);
      osc.connect(filter);
      filter.connect(g);
      g.connect(master);
      osc.start(t);
      osc.stop(t + 2.5);

      const sub = ctx.createOscillator();
      sub.type = 'sine';
      sub.frequency.value = 38;
      const subG = ctx.createGain();
      subG.gain.setValueAtTime(0, t);
      subG.gain.linearRampToValueAtTime(0.5 * intensity, t + 0.08);
      subG.gain.exponentialRampToValueAtTime(0.001, t + 1.4);
      sub.connect(subG);
      subG.connect(master);
      sub.start(t);
      sub.stop(t + 1.5);
    }

    function setEnabled(v) {
      enabled = v;
      init();
      if (ctx.state === 'suspended') ctx.resume();
      if (master) {
        gsap.to(master.gain, { value: v ? 0.55 : 0.0, duration: 1.2, ease: 'power2.out' });
      }
    }

    function setRain(v) {
      if (!ctx) return;
      gsap.to(rainGain.gain, { value: v ? 0.7 : 0.0, duration: 1.5 });
    }

    function unlock() {
      init();
      if (ctx.state === 'suspended') ctx.resume();
      started = true;
    }

    return { init, unlock, setEnabled, setRain, roar, get enabled() { return enabled; } };
  })();

  /* ---------------------------------------------------------
     1. CUSTOM CURSOR
  --------------------------------------------------------- */
  if (!isTouch) {
    const dot = document.getElementById('cursor-dot');
    const ring = document.getElementById('cursor-ring');
    let mx = window.innerWidth / 2, my = window.innerHeight / 2;
    let rx = mx, ry = my;
    window.addEventListener('mousemove', (e) => {
      mx = e.clientX; my = e.clientY;
      dot.style.transform = `translate(${mx}px,${my}px) translate(-50%,-50%)`;
    });
    (function tick() {
      rx += (mx - rx) * 0.16;
      ry += (my - ry) * 0.16;
      ring.style.transform = `translate(${rx}px,${ry}px) translate(-50%,-50%)`;
      requestAnimationFrame(tick);
    })();
    document.addEventListener('mouseover', (e) => {
      if (e.target.closest('a, button, .specimen-card, .map-node')) ring.classList.add('hover');
    });
    document.addEventListener('mouseout', (e) => {
      if (e.target.closest('a, button, .specimen-card, .map-node')) ring.classList.remove('hover');
    });
  }

  /* ---------------------------------------------------------
     2. LENIS SMOOTH SCROLL
  --------------------------------------------------------- */
  let lenis = null;
  if (window.Lenis && !reduceMotion) {
    lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => { lenis.raf(time * 1000); });
    gsap.ticker.lagSmoothing(0);
  }

  gsap.registerPlugin(ScrollTrigger);

  /* ---------------------------------------------------------
     3. PROGRESS BAR
  --------------------------------------------------------- */
  const progressBar = document.getElementById('expedition-progress');
  ScrollTrigger.create({
    start: 0,
    end: 'max',
    onUpdate: (self) => {
      progressBar.style.width = (self.progress * 100).toFixed(2) + '%';
    }
  });

  /* ---------------------------------------------------------
     4. NAV REVEAL + MOBILE MENU
  --------------------------------------------------------- */
  const nav = document.getElementById('nav');
  ScrollTrigger.create({
    trigger: '#hero',
    start: 'top top',
    end: 'bottom top',
    onLeave: () => nav.classList.add('visible'),
    onEnterBack: () => nav.classList.add('visible'),
  });

  const navBurger = document.getElementById('nav-burger');
  const navLinks = document.querySelector('.nav-links');
  navBurger.addEventListener('click', () => {
    navBurger.classList.toggle('open');
    navLinks.classList.toggle('open');
  });
  navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    navBurger.classList.remove('open');
    navLinks.classList.remove('open');
  }));

  /* ---------------------------------------------------------
     5. INTRO SEQUENCE (system boot)
  --------------------------------------------------------- */
  const intro = document.getElementById('intro');
  const startBtn = document.getElementById('start-expedition');
  const portal = document.getElementById('portal');
  const roarFlash = document.querySelector('.roar-flash');
  const soundToggle = document.getElementById('sound-toggle');

  const introTl = gsap.timeline({ delay: 0.2 });
  introTl
    .to('.intro-fog span', { opacity: 1, duration: 0.1 })
    .to('.boot-log .line', { opacity: 1, duration: 0.35, stagger: 0.45 }, 0.2)
    .call(() => { AudioEngine.init(); AudioEngine.roar(0.35); }, null, 1.8)
    .to(roarFlash, { opacity: 1, duration: 0.15, yoyo: true, repeat: 1 }, 1.8)
    .to('.intro-title', { opacity: 1, duration: 1.1 }, 2.4)
    .to('.intro-sub', { opacity: 1, duration: 0.9 }, 2.9)
    .to('.intro-start', { opacity: 1, duration: 0.9 }, 3.1)
    .to('.intro-hint', { opacity: 1, duration: 0.9 }, 3.3);

  startBtn.addEventListener('click', () => {
    AudioEngine.unlock();
    AudioEngine.setEnabled(true);
    AudioEngine.roar(1);

    portal.classList.add('opening');
    gsap.to(intro, { opacity: 0, duration: 1.2, delay: 0.3, onComplete: () => {
      intro.classList.add('hidden');
    }});
    soundToggle.classList.add('active');
    updateSoundIcon(true);
  });

  /* ---------------------------------------------------------
     6. HERO ENTRANCE
  --------------------------------------------------------- */
  gsap.from('#hero .eyebrow', { opacity: 0, y: 20, duration: 1, delay: 0.2 });
  gsap.from('.hero-title', { opacity: 0, y: 50, duration: 1.3, delay: 0.3, ease: 'power3.out' });
  gsap.from('.hero-desc', { opacity: 0, y: 30, duration: 1.2, delay: 0.6 });
  gsap.from('.hero-metrics', { opacity: 0, y: 30, duration: 1.2, delay: 0.75 });
  gsap.from('.hero-ctas', { opacity: 0, y: 30, duration: 1.2, delay: 0.9 });

  /* ---------------------------------------------------------
     7. SECTION REVEALS
  --------------------------------------------------------- */
  document.querySelectorAll('#intro-blurb, #specimens, #containment-map, #finale').forEach((section) => {
    const items = section.querySelectorAll('.reveal, .reveal-scale');
    gsap.to(items, {
      scrollTrigger: { trigger: section, start: 'top 75%' },
      opacity: 1, y: 0, scale: 1, duration: 1, stagger: 0.1, ease: 'power3.out'
    });
  });

  /* ---------------------------------------------------------
     8. SPECIMEN CARDS — reveal, tilt, scan sweep, threat bars
  --------------------------------------------------------- */
  if (!isTouch) {
    document.querySelectorAll('.specimen-card').forEach(card => {
      const inner = card.querySelector('.specimen-inner');
      card.addEventListener('mousemove', (e) => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        gsap.to(inner, { rotateY: px * 10, rotateX: -py * 10, duration: 0.4, ease: 'power2.out' });
      });
      card.addEventListener('mouseleave', () => {
        gsap.to(inner, { rotateY: 0, rotateX: 0, duration: 0.6, ease: 'power3.out' });
      });
    });
  }

  gsap.utils.toArray('.specimen-card').forEach((card, i) => {
    ScrollTrigger.create({
      trigger: card,
      start: 'top 88%',
      once: true,
      onEnter: () => {
        gsap.fromTo(card, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.9, delay: (i % 3) * 0.08, ease: 'power3.out' });
        setTimeout(() => card.classList.add('scanned'), (i % 3) * 80 + 300);
        const bar = card.querySelector('.threat-meter .bar > span');
        if (bar) gsap.to(bar, { width: bar.dataset.threat + '%', duration: 1.2, delay: 0.3, ease: 'power2.out' });
      }
    });
  });

  // T-Rex specimen: dramatic reveal (camera shake + roar) the first time it scrolls in
  const trexCard = document.querySelector('.specimen-card[data-specimen-card="trex"]');
  if (trexCard) {
    ScrollTrigger.create({
      trigger: trexCard,
      start: 'top 70%',
      once: true,
      onEnter: () => {
        document.body.classList.add('shake-active');
        AudioEngine.roar(0.8);
        setTimeout(() => document.body.classList.remove('shake-active'), 550);
      }
    });
  }

  /* ---------------------------------------------------------
     9. CONTAINMENT MAP — node stagger reveal
  --------------------------------------------------------- */
  const mapNodes = document.querySelectorAll('.map-node');
  gsap.set(mapNodes, { opacity: 0 });
  ScrollTrigger.create({
    trigger: '#containment-map',
    start: 'top 65%',
    once: true,
    onEnter: () => {
      gsap.to(mapNodes, { opacity: 1, duration: 0.6, stagger: 0.08, ease: 'power2.out' });
    }
  });

  /* ---------------------------------------------------------
     10. RAIN + LIGHTNING TOGGLE
  --------------------------------------------------------- */
  const rainCanvas = document.getElementById('rain-canvas');
  const rainCtx = rainCanvas.getContext('2d');
  let rainOn = false;
  let raindrops = [];
  function resizeRain() {
    rainCanvas.width = window.innerWidth;
    rainCanvas.height = window.innerHeight;
  }
  resizeRain();
  window.addEventListener('resize', resizeRain);

  function initRain() {
    raindrops = Array.from({ length: 220 }, () => ({
      x: Math.random() * rainCanvas.width,
      y: Math.random() * rainCanvas.height,
      len: 10 + Math.random() * 20,
      speed: 8 + Math.random() * 10,
      opacity: 0.15 + Math.random() * 0.25
    }));
  }
  initRain();

  function animateRain() {
    rainCtx.clearRect(0, 0, rainCanvas.width, rainCanvas.height);
    if (rainOn) {
      rainCtx.strokeStyle = 'rgba(180,220,200,0.5)';
      rainCtx.lineWidth = 1;
      raindrops.forEach(d => {
        rainCtx.globalAlpha = d.opacity;
        rainCtx.beginPath();
        rainCtx.moveTo(d.x, d.y);
        rainCtx.lineTo(d.x - 2, d.y + d.len);
        rainCtx.stroke();
        d.y += d.speed;
        d.x -= 0.6;
        if (d.y > rainCanvas.height) { d.y = -20; d.x = Math.random() * rainCanvas.width; }
      });
      rainCtx.globalAlpha = 1;
    }
    requestAnimationFrame(animateRain);
  }
  animateRain();

  const lightningEl = document.querySelector('.lightning-flash');
  let lightningTimer = null;
  function scheduleLightning() {
    if (!rainOn) return;
    const delay = 4000 + Math.random() * 9000;
    lightningTimer = setTimeout(() => {
      gsap.timeline()
        .to(lightningEl, { opacity: 0.85, duration: 0.06 })
        .to(lightningEl, { opacity: 0, duration: 0.12 })
        .to(lightningEl, { opacity: 0.5, duration: 0.05 }, '+=0.1')
        .to(lightningEl, { opacity: 0, duration: 0.3 });
      AudioEngine.roar(0.15);
      scheduleLightning();
    }, delay);
  }

  const rainToggle = document.getElementById('rain-toggle');
  rainToggle.addEventListener('click', () => {
    rainOn = !rainOn;
    rainCanvas.classList.toggle('on', rainOn);
    rainToggle.classList.toggle('active', rainOn);
    AudioEngine.setRain(rainOn);
    if (rainOn) scheduleLightning(); else clearTimeout(lightningTimer);
  });

  /* ---------------------------------------------------------
     11. SOUND TOGGLE
  --------------------------------------------------------- */
  const soundIconOn = document.getElementById('icon-sound-on');
  const soundIconOff = document.getElementById('icon-sound-off');
  function updateSoundIcon(on) {
    soundIconOn.style.display = on ? 'block' : 'none';
    soundIconOff.style.display = on ? 'none' : 'block';
  }
  updateSoundIcon(false);
  soundToggle.addEventListener('click', () => {
    AudioEngine.unlock();
    const next = !AudioEngine.enabled;
    AudioEngine.setEnabled(next);
    soundToggle.classList.toggle('active', next);
    updateSoundIcon(next);
  });

  /* ---------------------------------------------------------
     12. MOBILE ADJUSTMENTS
  --------------------------------------------------------- */
  if (isTouch) {
    document.body.style.cursor = 'auto';
  }
})();
