/* =========================================================
   VALE PERDIDO — Terminal de Contenção
   Esquemas técnicos (blueprint/wireframe) dos espécimes,
   gerados em SVG por código — sem fotos, sem modelos 3D,
   sem assets de terceiros. Estética de scanner de laboratório.
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
  function dot(x, y) { return `<circle class="joint" cx="${x}" cy="${y}" r="2.2"/>`; }

  const SPECIES = [
    {
      id: 'trex', name: 'Tiranossauro', latin: 'Tyrannus Colossus', group: 'Predador', threat: 96, status: 'ALERTA MÁXIMO',
      facts: { 'Comprimento': '12,5 m', 'Peso': '8,4 t', 'Dieta': 'Carnívoro', 'Era': 'Cretáceo Final' },
      desc: 'O maior caçador terrestre catalogado — mordida capaz de esmagar ossos.',
      body() {
        return `
          <path d="${taper(80,150,10,120,90,44,4)}"/>
          <ellipse cx="150" cy="98" rx="52" ry="34"/>
          <path d="${taper(150,80,30,246,72,26,-6)}"/>
          <ellipse cx="258" cy="70" rx="46" ry="26"/>
          <path d="${poly([[292,52],[318,58],[296,72]])}"/>
          <path d="${taper(150,120,22,66,150,10,10)}"/>
          <path d="${taper(190,105,10,205,128,6,2)}"/>
          <path d="${taper(140,120,30,120,178,16)}"/>
          <path d="${taper(178,124,32,196,178,16)}"/>
          ${dot(150,98)}${dot(258,70)}${dot(140,120)}${dot(178,124)}${dot(80,150)}
        `;
      }
    },
    {
      id: 'raptor', name: 'Velocirraptor', latin: 'Velox Raptor', group: 'Predador', threat: 78, status: 'MONITORAMENTO ATIVO',
      facts: { 'Comprimento': '2,1 m', 'Peso': '18 kg', 'Dieta': 'Carnívoro', 'Era': 'Cretáceo' },
      desc: 'Caçador em bando — a garra em foice é sua assinatura letal.',
      body() {
        return `
          <path d="${taper(70,142,6,110,110,22,3)}"/>
          <ellipse cx="140" cy="100" rx="30" ry="18"/>
          <path d="${taper(140,88,16,206,78,10,-4)}"/>
          <ellipse cx="214" cy="76" rx="24" ry="12"/>
          <path d="${poly([[232,66],[248,68],[234,78]])}"/>
          <path d="${taper(130,112,16,118,158,7)}"/>
          <path d="${taper(152,114,17,168,160,7)}"/>
          ${dot(140,100)}${dot(214,76)}${dot(130,112)}
        `;
      }
    },
    {
      id: 'spino', name: 'Espinossauro', latin: 'Spina Fluvialis', group: 'Predador', threat: 90, status: 'MONITORAMENTO ATIVO',
      facts: { 'Comprimento': '15 m', 'Peso': '7,5 t', 'Dieta': 'Piscívoro', 'Era': 'Cretáceo' },
      desc: 'Semiaquático, coberto por uma vela dorsal imponente.',
      body() {
        return `
          <path d="${taper(80,150,8,130,100,40,4)}"/>
          <ellipse cx="160" cy="102" rx="50" ry="30"/>
          <path d="${poly([[130,74],[140,18],[150,72]])}"/>
          <path d="${poly([[150,72],[160,14],[170,74]])}"/>
          <path d="${poly([[170,74],[180,20],[190,76]])}"/>
          <path d="${poly([[190,76],[200,26],[208,78]])}"/>
          <path d="${taper(158,84,26,244,66,14,-8)}"/>
          <ellipse cx="256" cy="64" rx="40" ry="16"/>
          <path d="${poly([[292,54],[320,58],[294,68]])}"/>
          <path d="${taper(150,124,28,134,172,15)}"/>
          <path d="${taper(184,126,26,200,174,14)}"/>
          ${dot(160,102)}${dot(256,64)}
        `;
      }
    },
    {
      id: 'triceratops', name: 'Tricerátopo', latin: 'Tricornis Scutum', group: 'Herbívoro', threat: 42, status: 'ESTÁVEL',
      facts: { 'Comprimento': '9 m', 'Peso': '9 t', 'Dieta': 'Herbívoro', 'Era': 'Cretáceo Final' },
      desc: 'Blindado por escudo ósseo e três chifres — vive em manadas.',
      body() {
        return `
          <path d="${taper(90,150,10,130,110,34,4)}"/>
          <ellipse cx="170" cy="118" rx="60" ry="32"/>
          <path d="${poly([[220,72],[268,50],[276,86],[248,110]])}"/>
          <ellipse cx="236" cy="104" rx="30" ry="24"/>
          <path d="${taper(236,86,6,232,52,4)}"/>
          <path d="${taper(222,90,6,204,64,3)}"/>
          <path d="${taper(250,90,6,262,60,3)}"/>
          <path d="${taper(150,140,30,138,178,16)}"/>
          <path d="${taper(210,142,28,214,180,15)}"/>
          ${dot(170,118)}${dot(236,104)}
        `;
      }
    },
    {
      id: 'brachio', name: 'Braquiossauro', latin: 'Longicollum Giganteus', group: 'Herbívoro', threat: 18, status: 'ESTÁVEL',
      facts: { 'Comprimento': '26 m', 'Peso': '35 t', 'Dieta': 'Herbívoro', 'Era': 'Jurássico' },
      desc: 'O gigante gentil — alcança o topo das copas mais altas.',
      body() {
        return `
          <path d="${taper(60,140,10,110,96,50,6)}"/>
          <ellipse cx="180" cy="104" rx="70" ry="38"/>
          <path d="${taper(190,80,30,232,10,14,10)}"/>
          <ellipse cx="238" cy="6" rx="18" ry="11"/>
          <path d="${taper(140,132,34,126,180,18)}"/>
          <path d="${taper(220,134,32,232,180,17)}"/>
          ${dot(180,104)}${dot(238,6)}
        `;
      }
    },
    {
      id: 'stego', name: 'Estegossauro', latin: 'Placodorsum Armatus', group: 'Herbívoro', threat: 30, status: 'ESTÁVEL',
      facts: { 'Comprimento': '9 m', 'Peso': '5 t', 'Dieta': 'Herbívoro', 'Era': 'Jurássico' },
      desc: 'Placas dorsais regulam sua temperatura; cauda com espinhos.',
      body() {
        return `
          <path d="${taper(78,148,8,124,116,36,4)}"/>
          <ellipse cx="180" cy="120" rx="62" ry="30"/>
          <path d="${taper(180,96,20,244,104,12,-6)}"/>
          <ellipse cx="252" cy="102" rx="24" ry="14"/>
          <path d="${poly([[112,96],[128,54],[140,100]])}"/>
          <path d="${poly([[140,92],[158,40],[172,96]])}"/>
          <path d="${poly([[172,94],[190,44],[202,98]])}"/>
          <path d="${poly([[202,98],[216,56],[226,102]])}"/>
          <path d="${poly([[100,140],[86,120],[100,146]])}"/>
          <path d="${poly([[96,150],[78,134],[92,156]])}"/>
          <path d="${taper(150,138,30,140,176,16)}"/>
          <path d="${taper(220,140,26,228,178,14)}"/>
          ${dot(180,120)}
        `;
      }
    },
    {
      id: 'anky', name: 'Anquilossauro', latin: 'Clava Corporis', group: 'Herbívoro', threat: 34, status: 'ESTÁVEL',
      facts: { 'Comprimento': '7 m', 'Peso': '6,5 t', 'Dieta': 'Herbívoro', 'Era': 'Cretáceo Final' },
      desc: 'Couraça óssea e uma maça na cauda — um tanque vivo.',
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
          <path d="${taper(130,148,24,124,176,20)}"/>
          <path d="${taper(214,150,24,220,178,20)}"/>
          ${dot(170,128)}${dot(248,120)}
        `;
      }
    },
    {
      id: 'carno', name: 'Carnotauro', latin: 'Cornu Veloc', group: 'Predador', threat: 74, status: 'MONITORAMENTO ATIVO',
      facts: { 'Comprimento': '8 m', 'Peso': '2,1 t', 'Dieta': 'Carnívoro', 'Era': 'Cretáceo' },
      desc: 'Corpo esguio e veloz — pequenos chifres acima dos olhos.',
      body() {
        return `
          <path d="${taper(76,148,8,116,102,30,4)}"/>
          <ellipse cx="150" cy="100" rx="38" ry="26"/>
          <path d="${taper(150,84,20,214,78,20,-4)}"/>
          <ellipse cx="228" cy="76" rx="30" ry="20"/>
          <path d="${poly([[220,58],[228,44],[236,60]])}"/>
          <path d="${poly([[236,60],[244,46],[250,62]])}"/>
          <path d="${taper(140,116,26,124,166,14)}"/>
          <path d="${taper(180,120,24,192,168,13)}"/>
          ${dot(150,100)}${dot(228,76)}
        `;
      }
    },
    {
      id: 'para', name: 'Parassaurolofo', latin: 'Cristatus Sonorus', group: 'Herbívoro', threat: 22, status: 'ESTÁVEL',
      facts: { 'Comprimento': '10 m', 'Peso': '2,5 t', 'Dieta': 'Herbívoro', 'Era': 'Cretáceo' },
      desc: 'Crista curva que ressoa como uma câmara sonora.',
      body() {
        return `
          <path d="${taper(84,146,8,126,108,32,4)}"/>
          <ellipse cx="160" cy="104" rx="46" ry="28"/>
          <path d="${taper(168,84,20,220,64,14,-6)}"/>
          <ellipse cx="230" cy="60" rx="26" ry="14"/>
          <path d="${taper(238,54,10,270,26,6,4)}"/>
          <path d="${taper(146,128,26,132,172,14)}"/>
          <path d="${taper(196,130,24,206,174,13)}"/>
          ${dot(160,104)}${dot(230,60)}
        `;
      }
    },
    {
      id: 'ptero', name: 'Pterodáctilo', latin: 'Membranaptera Magna', group: 'Voador', threat: 46, status: 'MONITORAMENTO ATIVO',
      facts: { 'Envergadura': '9 m', 'Peso': '90 kg', 'Dieta': 'Piscívoro', 'Era': 'Cretáceo' },
      desc: 'Plana sobre as cachoeiras em busca de peixes.',
      body() {
        return `
          <ellipse cx="168" cy="100" rx="24" ry="14"/>
          <path d="${taper(168,90,10,200,58,7,-3)}"/>
          <ellipse cx="210" cy="54" rx="16" ry="9"/>
          <path d="${poly([[222,48],[252,34],[226,58]])}"/>
          <path d="${poly([[168,96],[70,40],[64,72],[110,92],[86,96],[150,116]])}"/>
          <path d="${poly([[178,96],[276,42],[282,74],[236,94],[260,98],[196,116]])}"/>
          ${dot(168,100)}${dot(210,54)}
        `;
      }
    }
  ];

  function svg(inner) {
    return `<svg viewBox="0 0 340 200" class="blueprint-svg" preserveAspectRatio="xMidYMid meet">
      <g class="blueprint-shape">${inner}</g>
      <line class="baseline" x1="20" y1="188" x2="320" y2="188"/>
      <line class="baseline-tick" x1="20" y1="184" x2="20" y2="192"/>
      <line class="baseline-tick" x1="320" y1="184" x2="320" y2="192"/>
    </svg>`;
  }

  function groupClass(group) {
    return group === 'Predador' ? 'group-predator' : group === 'Voador' ? 'group-flyer' : 'group-herbivore';
  }
  function statusClass(status) {
    if (status === 'ALERTA MÁXIMO') return 'status-danger';
    if (status === 'MONITORAMENTO ATIVO') return 'status-watch';
    return 'status-stable';
  }

  function cardHTML(sp, index) {
    const num = String(index + 1).padStart(2, '0');
    const statsHTML = Object.entries(sp.facts).map(([k, v]) => `<span>${k}: <b>${v}</b></span>`).join('');
    return `
      <article class="specimen-card ${groupClass(sp.group)}" data-specimen-card="${sp.id}">
        <div class="specimen-inner">
          <span class="bracket-tr"></span><span class="bracket-bl"></span>
          <div class="scan-sweep"></div>
          <div class="specimen-id">
            <span>ESPÉCIME #${num}</span>
            <span class="status ${statusClass(sp.status)}">${sp.status}</span>
          </div>
          <div class="specimen-stage">${svg(sp.body())}</div>
          <span class="latin">${sp.latin}</span>
          <h3>${sp.name}</h3>
          <p class="desc">${sp.desc}</p>
          <div class="threat-meter">
            <div class="label"><span>Nível de ameaça</span><span>${sp.threat}%</span></div>
            <div class="bar"><span data-threat="${sp.threat}"></span></div>
          </div>
          <div class="specimen-stats">${statsHTML}</div>
        </div>
      </article>
    `;
  }

  function renderAll() {
    const grid = document.getElementById('specimen-grid');
    if (!grid) return;
    grid.innerHTML = SPECIES.map((sp, i) => cardHTML(sp, i)).join('');
  }

  window.SPECIMENS = SPECIES;
  window.renderSpecimens = renderAll;
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderAll);
  } else {
    renderAll();
  }
})();
