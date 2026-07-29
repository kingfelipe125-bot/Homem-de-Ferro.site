/* =========================================================
   Original stylized dinosaur silhouettes — procedurally built
   inline SVG (no external 3D models/assets, no copyrighted
   character designs — generic paleontological silhouettes only).

   Markup is injected inline (not via <symbol>/<use>) so that
   descendant CSS selectors (walk-cycle / wing-flap animations)
   can target the internal parts directly.
   ========================================================= */

(() => {
  "use strict";

  function taper(x1, y1, w1, x2, y2, w2, bulge = 0) {
    const dx = x2 - x1, dy = y2 - y1;
    const len = Math.hypot(dx, dy) || 1;
    const nx = -dy / len, ny = dx / len;
    const mx = (x1 + x2) / 2 + nx * bulge, my = (y1 + y2) / 2 + ny * bulge;
    const w = (w1 + w2) / 2;
    return `M ${x1 + nx * w1 / 2} ${y1 + ny * w1 / 2} ` +
           `Q ${mx + nx * w} ${my + ny * w} ${x2 + nx * w2 / 2} ${y2 + ny * w2 / 2} ` +
           `L ${x2 - nx * w2 / 2} ${y2 - ny * w2 / 2} ` +
           `Q ${mx - nx * w} ${my - ny * w} ${x1 - nx * w1 / 2} ${y1 - ny * w1 / 2} Z`;
  }
  function poly(pts) { return 'M ' + pts.map(p => p.join(',')).join(' L ') + ' Z'; }

  const SPECIES = [
    {
      id: 'trex', name: 'Tiranossauro', latin: 'Tyrannus Colossus', group: 'Predador',
      facts: { 'Comprimento': '12,5 m', 'Peso': '8,4 t', 'Dieta': 'Carnívoro', 'Era': 'Cretáceo Final' },
      desc: 'O maior caçador terrestre da expedição — mordida capaz de esmagar ossos e um faro que localiza presas a quilômetros.',
      body() {
        return `
          <path class="tail-sway" d="${taper(80,150,10,120,90,44,4)}"/>
          <ellipse cx="150" cy="98" rx="52" ry="34"/>
          <path d="${taper(150,80,30,246,72,26,-6)}"/>
          <ellipse cx="258" cy="70" rx="46" ry="26"/>
          <path d="${poly([[292,52],[318,58],[296,72]])}"/>
          <path d="${taper(150,120,22,66,150,10,10)}"/>
          <path class="arm" d="${taper(190,105,10,205,128,6,2)}"/>
          <path class="leg leg-b" d="${taper(140,120,30,120,178,16)}"/>
          <path class="leg leg-f" d="${taper(178,124,32,196,178,16)}"/>
        `;
      }
    },
    {
      id: 'raptor', name: 'Velocirraptor', latin: 'Velox Raptor', group: 'Predador',
      facts: { 'Comprimento': '2,1 m', 'Peso': '18 kg', 'Dieta': 'Carnívoro', 'Era': 'Cretáceo' },
      desc: 'Caçador em bando, rápido e coordenado — a garra em foice é a assinatura letal desta espécie.',
      body() {
        return `
          <path class="tail-sway" d="${taper(70,142,6,110,110,22,3)}"/>
          <ellipse cx="140" cy="100" rx="30" ry="18"/>
          <path d="${taper(140,88,16,206,78,10,-4)}"/>
          <ellipse cx="214" cy="76" rx="24" ry="12"/>
          <path d="${poly([[232,66],[248,68],[234,78]])}"/>
          <path class="leg leg-b" d="${taper(130,112,16,118,158,7)}"/>
          <path class="leg leg-f" d="${taper(152,114,17,168,160,7)}"/>
        `;
      }
    },
    {
      id: 'spino', name: 'Espinossauro', latin: 'Spina Fluvialis', group: 'Predador',
      facts: { 'Comprimento': '15 m', 'Peso': '7,5 t', 'Dieta': 'Piscívoro', 'Era': 'Cretáceo' },
      desc: 'Semiaquático e coberto por uma vela dorsal imponente — domina os rios da região dos predadores.',
      body() {
        return `
          <path class="tail-sway" d="${taper(80,150,8,130,100,40,4)}"/>
          <ellipse cx="160" cy="102" rx="50" ry="30"/>
          <path d="${poly([[130,74],[140,18],[150,72]])}"/>
          <path d="${poly([[150,72],[160,14],[170,74]])}"/>
          <path d="${poly([[170,74],[180,20],[190,76]])}"/>
          <path d="${poly([[190,76],[200,26],[208,78]])}"/>
          <path d="${taper(158,84,26,244,66,14,-8)}"/>
          <ellipse cx="256" cy="64" rx="40" ry="16"/>
          <path d="${poly([[292,54],[320,58],[294,68]])}"/>
          <path class="leg leg-b" d="${taper(150,124,28,134,172,15)}"/>
          <path class="leg leg-f" d="${taper(184,126,26,200,174,14)}"/>
        `;
      }
    },
    {
      id: 'triceratops', name: 'Tricerátopo', latin: 'Tricornis Scutum', group: 'Herbívoro',
      facts: { 'Comprimento': '9 m', 'Peso': '9 t', 'Dieta': 'Herbívoro', 'Era': 'Cretáceo Final' },
      desc: 'Blindado por um escudo ósseo e três chifres — os rebanhos pastam em manadas nas planícies abertas.',
      body() {
        return `
          <path class="tail-sway" d="${taper(90,150,10,130,110,34,4)}"/>
          <ellipse cx="170" cy="118" rx="60" ry="32"/>
          <path d="${poly([[220,72],[268,50],[276,86],[248,110]])}"/>
          <ellipse cx="236" cy="104" rx="30" ry="24"/>
          <path d="${taper(236,86,6,232,52,4)}"/>
          <path d="${taper(222,90,6,204,64,3)}"/>
          <path d="${taper(250,90,6,262,60,3)}"/>
          <path class="leg leg-b" d="${taper(150,140,30,138,178,16)}"/>
          <path class="leg leg-f" d="${taper(210,142,28,214,180,15)}"/>
        `;
      }
    },
    {
      id: 'brachio', name: 'Braquiossauro', latin: 'Longicollum Giganteus', group: 'Herbívoro',
      facts: { 'Comprimento': '26 m', 'Peso': '35 t', 'Dieta': 'Herbívoro', 'Era': 'Jurássico' },
      desc: 'O gigante gentil do vale — alcança o topo das copas das árvores mais altas com seu pescoço monumental.',
      body() {
        return `
          <path class="tail-sway" d="${taper(60,140,10,110,96,50,6)}"/>
          <ellipse cx="180" cy="104" rx="70" ry="38"/>
          <path d="${taper(190,80,30,232,10,14,10)}"/>
          <ellipse cx="238" cy="6" rx="18" ry="11"/>
          <path class="leg leg-b" d="${taper(140,132,34,126,180,18)}"/>
          <path class="leg leg-f" d="${taper(220,134,32,232,180,17)}"/>
        `;
      }
    },
    {
      id: 'stego', name: 'Estegossauro', latin: 'Placodorsum Armatus', group: 'Herbívoro',
      facts: { 'Comprimento': '9 m', 'Peso': '5 t', 'Dieta': 'Herbívoro', 'Era': 'Jurássico' },
      desc: 'Placas dorsais regulam sua temperatura e intimidam predadores; a cauda com espinhos é uma arma silenciosa.',
      body() {
        return `
          <path class="tail-sway" d="${taper(78,148,8,124,116,36,4)}"/>
          <ellipse cx="180" cy="120" rx="62" ry="30"/>
          <path d="${taper(180,96,20,244,104,12,-6)}"/>
          <ellipse cx="252" cy="102" rx="24" ry="14"/>
          <path d="${poly([[112,96],[128,54],[140,100]])}"/>
          <path d="${poly([[140,92],[158,40],[172,96]])}"/>
          <path d="${poly([[172,94],[190,44],[202,98]])}"/>
          <path d="${poly([[202,98],[216,56],[226,102]])}"/>
          <path d="${poly([[100,140],[86,120],[100,146]])}"/>
          <path d="${poly([[96,150],[78,134],[92,156]])}"/>
          <path class="leg leg-b" d="${taper(150,138,30,140,176,16)}"/>
          <path class="leg leg-f" d="${taper(220,140,26,228,178,14)}"/>
        `;
      }
    },
    {
      id: 'anky', name: 'Anquilossauro', latin: 'Clava Corporis', group: 'Herbívoro',
      facts: { 'Comprimento': '7 m', 'Peso': '6,5 t', 'Dieta': 'Herbívoro', 'Era': 'Cretáceo Final' },
      desc: 'Um tanque vivo — couraça óssea nas costas e uma maça na ponta da cauda para repelir qualquer ataque.',
      body() {
        return `
          <ellipse cx="170" cy="128" rx="86" ry="30"/>
          <ellipse cx="248" cy="120" rx="26" ry="18"/>
          <path d="${taper(150,150,10,96,158,20,4)}"/>
          <path d="${poly([[92,150],[76,140],[70,158],[86,168]])}"/>
          <path d="${poly([[110,100],[124,86],[136,104]])}"/>
          <path d="${poly([[150,96],[164,80],[176,100]])}"/>
          <path d="${poly([[190,98],[204,84],[214,102]])}"/>
          <path d="${poly([[218,104],[230,92],[240,108]])}"/>
          <path class="leg leg-b" d="${taper(130,148,24,124,176,20)}"/>
          <path class="leg leg-f" d="${taper(214,150,24,220,178,20)}"/>
        `;
      }
    },
    {
      id: 'carno', name: 'Carnotauro', latin: 'Cornu Veloc', group: 'Predador',
      facts: { 'Comprimento': '8 m', 'Peso': '2,1 t', 'Dieta': 'Carnívoro', 'Era': 'Cretáceo' },
      desc: 'Corpo esguio e veloz, com pequenos chifres acima dos olhos — um perseguidor implacável em campo aberto.',
      body() {
        return `
          <path class="tail-sway" d="${taper(76,148,8,116,102,30,4)}"/>
          <ellipse cx="150" cy="100" rx="38" ry="26"/>
          <path d="${taper(150,84,20,214,78,20,-4)}"/>
          <ellipse cx="228" cy="76" rx="30" ry="20"/>
          <path d="${poly([[220,58],[228,44],[236,60]])}"/>
          <path d="${poly([[236,60],[244,46],[250,62]])}"/>
          <path class="leg leg-b" d="${taper(140,116,26,124,166,14)}"/>
          <path class="leg leg-f" d="${taper(180,120,24,192,168,13)}"/>
        `;
      }
    },
    {
      id: 'para', name: 'Parassaurolofo', latin: 'Cristatus Sonorus', group: 'Herbívoro',
      facts: { 'Comprimento': '10 m', 'Peso': '2,5 t', 'Dieta': 'Herbívoro', 'Era': 'Cretáceo' },
      desc: 'Sua crista curva funciona como uma câmara de ressonância — o som grave de seu chamado atravessa o vale.',
      body() {
        return `
          <path class="tail-sway" d="${taper(84,146,8,126,108,32,4)}"/>
          <ellipse cx="160" cy="104" rx="46" ry="28"/>
          <path d="${taper(168,84,20,220,64,14,-6)}"/>
          <ellipse cx="230" cy="60" rx="26" ry="14"/>
          <path d="${taper(238,54,10,270,26,6,4)}"/>
          <path class="leg leg-b" d="${taper(146,128,26,132,172,14)}"/>
          <path class="leg leg-f" d="${taper(196,130,24,206,174,13)}"/>
        `;
      }
    },
    {
      id: 'ptero', name: 'Pterodáctilo', latin: 'Membranaptera Magna', group: 'Voador',
      facts: { 'Envergadura': '9 m', 'Peso': '90 kg', 'Dieta': 'Piscívoro', 'Era': 'Cretáceo' },
      desc: 'Senhor dos ventos do vale — plana sobre as cachoeiras em busca de peixes com seu bico afiado.',
      body() {
        return `
          <ellipse cx="168" cy="100" rx="24" ry="14"/>
          <path d="${taper(168,90,10,200,58,7,-3)}"/>
          <ellipse cx="210" cy="54" rx="16" ry="9"/>
          <path d="${poly([[222,48],[252,34],[226,58]])}"/>
          <path class="wing-flap-l" d="${poly([[168,96],[70,40],[64,72],[110,92],[86,96],[150,116]])}"/>
          <path class="wing-flap" d="${poly([[178,96],[276,42],[282,74],[236,94],[260,98],[196,116]])}"/>
        `;
      }
    }
  ];

  function svg(inner, extraClass = '') {
    return `<svg viewBox="0 0 340 200" class="dino-icon ${extraClass}" preserveAspectRatio="xMidYMid meet"><g class="dino-shape">${inner}</g></svg>`;
  }

  function renderAll() {
    document.querySelectorAll('[data-dino]').forEach(el => {
      const id = el.getAttribute('data-dino');
      const sp = SPECIES.find(s => s.id === id);
      if (!sp) return;
      const animClass = el.getAttribute('data-anim') || '';
      el.innerHTML = svg(sp.body(), animClass);
      if (el.hasAttribute('data-fill-card')) {
        el.closest('.dino-card')?.querySelectorAll('[data-field]').forEach(f => {
          const key = f.getAttribute('data-field');
          if (key === 'name') f.textContent = sp.name;
          if (key === 'latin') f.textContent = sp.latin;
          if (key === 'desc') f.textContent = sp.desc;
          if (key === 'group') f.textContent = sp.group;
        });
        const statsEl = el.closest('.dino-card')?.querySelector('[data-stats]');
        if (statsEl) {
          statsEl.innerHTML = Object.entries(sp.facts).map(([k, v]) => `<span>${k}: <b>${v}</b></span>`).join('');
        }
      }
    });
  }

  window.DINO_SPECIES = SPECIES;
  window.renderDinosaurs = renderAll;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderAll);
  } else {
    renderAll();
  }
})();
