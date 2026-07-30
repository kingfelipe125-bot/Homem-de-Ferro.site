/* =====================================================================
   NEXOSAUR — Sistema de Análise Paleontológica — lógica da aplicação
   ===================================================================== */
(function(){
"use strict";

const DB = (typeof DINO_DATABASE !== "undefined") ? DINO_DATABASE : [];

const ACCENT = {
  carnivoro:"#ff5470", herbivoro:"#3dffab", onivoro:"#ffd23e", voador:"#7d8bff", aquatico:"#3ee9ff"
};
const GRUPO_LABEL = {
  carnivoro:"Carnívoro", herbivoro:"Herbívoro", onivoro:"Onívoro", voador:"Voador", aquatico:"Aquático"
};
const PERIODO_LABEL = { triassico:"Triássico", jurassico:"Jurássico", cretaceo:"Cretáceo" };

/* ---------------------------------------------------------------------
   Ícones (schemas SVG abstratos por grupo — estética de scanner/HUD)
--------------------------------------------------------------------- */
function icon(grupo){
  const c = "currentColor";
  switch(grupo){
    case "carnivoro":
      return `<svg viewBox="0 0 64 64" fill="none" stroke="${c}" stroke-width="2"><path d="M6 40 L26 18 L34 22 L46 12 L58 26 L44 30 L50 44 L36 38 L28 52 Z"/><path d="M20 30 L26 34 M28 26 L34 30" stroke-width="1.4"/></svg>`;
    case "herbivoro":
      return `<svg viewBox="0 0 64 64" fill="none" stroke="${c}" stroke-width="2"><path d="M8 44 Q8 24 28 20 Q40 18 46 28 L58 24 L54 36 L46 34 Q44 46 28 46 Q8 46 8 44Z"/><circle cx="20" cy="30" r="2" fill="${c}" stroke="none"/></svg>`;
    case "onivoro":
      return `<svg viewBox="0 0 64 64" fill="none" stroke="${c}" stroke-width="2"><path d="M8 38 Q14 18 32 20 Q48 22 50 34 L60 30 L56 42 L48 40 Q44 50 28 48 Q10 46 8 38Z"/><path d="M20 30 L24 34" stroke-width="1.4"/></svg>`;
    case "voador":
      return `<svg viewBox="0 0 64 64" fill="none" stroke="${c}" stroke-width="2"><path d="M32 14 L32 50 M32 24 L4 14 L10 30 L32 30 M32 24 L60 14 L54 30 L32 30" stroke-linejoin="round"/></svg>`;
    case "aquatico":
      return `<svg viewBox="0 0 64 64" fill="none" stroke="${c}" stroke-width="2"><path d="M6 34 Q20 18 34 34 Q48 50 58 32" /><path d="M34 34 L44 18 L40 32 Z" fill="${c}" stroke="none"/></svg>`;
    default:
      return `<svg viewBox="0 0 64 64" fill="none" stroke="${c}" stroke-width="2"><circle cx="32" cy="32" r="20"/></svg>`;
  }
}

/* ---------------------------------------------------------------------
   Utilidades
--------------------------------------------------------------------- */
function tamanhoBucket(comprimento){
  if(comprimento < 3) return "pequeno";
  if(comprimento < 8) return "medio";
  if(comprimento < 15) return "grande";
  return "gigante";
}
const TAMANHO_LABEL = { pequeno:"Pequeno (<3m)", medio:"Médio (3–8m)", grande:"Grande (8–15m)", gigante:"Gigante (>15m)" };

function normalize(str){
  return (str||"").toString().normalize("NFD").replace(/[̀-ͯ]/g,"").toLowerCase();
}
function debounce(fn, ms){
  let t; return function(...a){ clearTimeout(t); t = setTimeout(()=>fn.apply(this,a), ms); };
}

/* ---------------------------------------------------------------------
   Cursor futurista
--------------------------------------------------------------------- */
(function initCursor(){
  const dot = document.getElementById("cursor-dot");
  const ring = document.getElementById("cursor-ring");
  if(!dot || !ring) return;
  let mx=innerWidth/2, my=innerHeight/2, rx=mx, ry=my;
  window.addEventListener("mousemove", e=>{ mx=e.clientX; my=e.clientY; dot.style.left=mx+"px"; dot.style.top=my+"px"; });
  document.addEventListener("mouseover", e=>{
    if(e.target.closest("button,a,.card,input,.chip")) ring.classList.add("active");
  });
  document.addEventListener("mouseout", e=>{
    if(e.target.closest("button,a,.card,input,.chip")) ring.classList.remove("active");
  });
  (function loop(){ rx += (mx-rx)*.18; ry += (my-ry)*.18; ring.style.left=rx+"px"; ring.style.top=ry+"px"; requestAnimationFrame(loop); })();
})();

/* ---------------------------------------------------------------------
   Relógio do sistema
--------------------------------------------------------------------- */
(function clock(){
  const el = document.getElementById("clock");
  if(!el) return;
  function tick(){
    const d = new Date();
    el.textContent = d.toLocaleTimeString("pt-BR",{hour12:false}) + " · SYS-OK";
  }
  tick(); setInterval(tick, 1000);
})();

/* ---------------------------------------------------------------------
   Boot sequence
--------------------------------------------------------------------- */
(function boot(){
  const logs = [
    "Inicializando núcleo NEXOSAUR...",
    "Carregando base genômica paleontológica...",
    "Sincronizando sensores holográficos...",
    "Calibrando reconstrução volumétrica...",
    "Compilando registros de "+DB.length+" espécimes...",
    "Sistema pronto."
  ];
  const logEl = document.getElementById("boot-log");
  const bar = document.getElementById("boot-bar");
  const pct = document.getElementById("boot-pct");
  const bootEl = document.getElementById("boot");
  let i = 0;
  function addLine(){
    if(i >= logs.length){ finish(); return; }
    const p = document.createElement("div");
    p.className = "line";
    p.style.animationDelay = "0s";
    p.innerHTML = "<b>&gt;</b> " + logs[i];
    logEl.appendChild(p);
    i++;
    const progress = Math.round((i/logs.length)*100);
    bar.style.width = progress + "%";
    pct.textContent = "CARREGANDO // " + progress + "%";
    setTimeout(addLine, 340 + Math.random()*220);
  }
  function finish(){
    setTimeout(()=>{
      bootEl.classList.add("hidden");
      document.body.classList.add("booted");
      initRevealObservers();
    }, 500);
  }
  setTimeout(addLine, 300);
})();

/* ---------------------------------------------------------------------
   Fundo three.js (partículas + grade flutuante)
--------------------------------------------------------------------- */
(function bg3d(){
  const canvas = document.getElementById("bg-canvas");
  if(!canvas || typeof THREE === "undefined") return;
  const renderer = new THREE.WebGLRenderer({ canvas, alpha:true, antialias:true });
  renderer.setPixelRatio(Math.min(devicePixelRatio,1.6));
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, innerWidth/innerHeight, 0.1, 100);
  camera.position.set(0,1.4,7);

  const geo = new THREE.BufferGeometry();
  const N = 420;
  const pos = new Float32Array(N*3);
  for(let i=0;i<N;i++){
    pos[i*3]   = (Math.random()-0.5)*22;
    pos[i*3+1] = (Math.random()-0.5)*12;
    pos[i*3+2] = (Math.random()-0.5)*14;
  }
  geo.setAttribute("position", new THREE.BufferAttribute(pos,3));
  const mat = new THREE.PointsMaterial({ color:0x3ee9ff, size:0.035, transparent:true, opacity:.75 });
  const points = new THREE.Points(geo, mat);
  scene.add(points);

  const grid = new THREE.GridHelper(30, 30, 0x1c4d5c, 0x0d2530);
  grid.position.y = -3;
  scene.add(grid);

  function resize(){
    const w = innerWidth, h = innerHeight;
    renderer.setSize(w,h,false);
    camera.aspect = w/h; camera.updateProjectionMatrix();
  }
  resize();
  window.addEventListener("resize", resize);

  let mx=0,my=0;
  window.addEventListener("mousemove", e=>{
    mx = (e.clientX/innerWidth - .5); my = (e.clientY/innerHeight - .5);
  });

  function animate(){
    points.rotation.y += 0.0006;
    points.rotation.x += 0.0002;
    grid.rotation.z += 0.00025;
    camera.position.x += (mx*1.2 - camera.position.x)*0.02;
    camera.position.y += (1.4 - my*1.0 - camera.position.y)*0.02;
    camera.lookAt(0,0,0);
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }
  animate();
})();

/* ---------------------------------------------------------------------
   Reveal on scroll
--------------------------------------------------------------------- */
let revealObserver;
function initRevealObservers(){
  revealObserver = new IntersectionObserver((entries)=>{
    entries.forEach(en=>{
      if(en.isIntersecting){ en.target.classList.add("in"); revealObserver.unobserve(en.target); }
    });
  }, { threshold:.12 });
  document.querySelectorAll(".reveal").forEach(el=>revealObserver.observe(el));
}
function observeCards(){
  document.querySelectorAll(".card:not(.in)").forEach((el,idx)=>{
    el.style.animationDelay = Math.min(idx%18,18)*40 + "ms";
    const io = new IntersectionObserver((entries)=>{
      entries.forEach(en=>{ if(en.isIntersecting){ en.target.classList.add("in"); io.unobserve(en.target); } });
    }, { threshold:.05 });
    io.observe(el);
  });
}

/* ---------------------------------------------------------------------
   Estado de filtros / busca
--------------------------------------------------------------------- */
const state = { q:"", dieta:"todos", periodo:"todos", continente:"todos", grupo:"todos", tamanho:"todos" };

function matches(d){
  if(state.q){
    const hay = normalize(d.nomePopular + " " + d.nomeCientifico);
    if(!hay.includes(normalize(state.q))) return false;
  }
  if(state.dieta !== "todos" && d.dieta !== state.dieta) return false;
  if(state.periodo !== "todos" && d.periodo !== state.periodo) return false;
  if(state.continente !== "todos" && d.continente !== state.continente) return false;
  if(state.grupo !== "todos" && d.grupo !== state.grupo) return false;
  if(state.tamanho !== "todos" && tamanhoBucket(d.comprimento) !== state.tamanho) return false;
  return true;
}

function cardHTML(d){
  const accent = ACCENT[d.grupo] || "#3ee9ff";
  return `
  <article class="card glass corner-frame" style="--accent:${accent}; --accent-fade:${accent}33" data-id="${d.id}" tabindex="0" role="button" aria-label="Analisar ${d.nomePopular}">
    <div class="card-top" style="color:${accent}">
      <span class="card-status"><i></i>SCAN</span>
      <span class="card-badge">${GRUPO_LABEL[d.grupo]||""}</span>
      ${icon(d.grupo)}
    </div>
    <div class="card-body">
      <h3>${d.nomePopular}</h3>
      <span class="sci">${d.nomeCientifico}</span>
      <div class="card-tags">
        <span class="tag">${PERIODO_LABEL[d.periodo]||d.periodo}</span>
        <span class="tag">${d.continente}</span>
        <span class="tag">${TAMANHO_LABEL[tamanhoBucket(d.comprimento)]}</span>
      </div>
      <div class="card-mini-label"><span>Comprimento</span><span>${d.comprimento} m</span></div>
      <div class="card-mini-bar"><i style="width:${Math.min(100,(d.comprimento/40)*100)}%; --accent:${accent}"></i></div>
    </div>
  </article>`;
}

function render(){
  const grid = document.getElementById("grid");
  const list = DB.filter(matches);
  const countEl = document.getElementById("result-count");
  if(countEl) countEl.textContent = list.length + " / " + DB.length + " ESPÉCIMES";
  grid.innerHTML = list.map(cardHTML).join("");
  document.getElementById("empty-state").classList.toggle("show", list.length===0);
  observeCards();
}

function buildFilterChips(){
  const continentes = Array.from(new Set(DB.map(d=>d.continente))).sort();
  const wrap = document.getElementById("filter-continente");
  wrap.innerHTML = `<button class="chip active" data-val="todos">Todos</button>` +
    continentes.map(c=>`<button class="chip" data-val="${c}">${c}</button>`).join("");
}

function wireFilters(){
  document.querySelectorAll("[data-filter]").forEach(group=>{
    group.addEventListener("click", (e)=>{
      const btn = e.target.closest(".chip");
      if(!btn) return;
      const key = group.getAttribute("data-filter");
      group.querySelectorAll(".chip").forEach(c=>c.classList.remove("active"));
      btn.classList.add("active");
      state[key] = btn.getAttribute("data-val");
      render();
    });
  });
  const search = document.getElementById("search-input");
  search.addEventListener("input", debounce(()=>{ state.q = search.value; render(); }, 160));

  document.getElementById("reset-filters").addEventListener("click", ()=>{
    Object.keys(state).forEach(k=> state[k] = (k==="q") ? "" : "todos");
    search.value = "";
    document.querySelectorAll(".chip").forEach(c=>c.classList.toggle("active", c.getAttribute("data-val")==="todos"));
    render();
  });
}

/* ---------------------------------------------------------------------
   Painel de detalhe / scanner holográfico
--------------------------------------------------------------------- */
let scannerRenderer, scannerScene, scannerCamera, scannerGroup, scannerRAF;

function classificaGrupoVisual(d){
  const c = normalize(d.classificacao);
  if(c.includes("stegosaur") || c.includes("ankylosaur") || c.includes("ceratops") || c.includes("nodosaur") || c.includes("pachycephalo")) return "armored";
  if(d.grupo === "voador") return "flying";
  if(d.grupo === "aquatico") return "aquatic";
  if(c.includes("sauropoda") || c.includes("titanosaur")) return "sauropod";
  return "generic";
}

function buildScanModel(d){
  const group = new THREE.Group();
  const accent = new THREE.Color(ACCENT[d.grupo] || "#3ee9ff");
  const mat = new THREE.MeshBasicMaterial({ color: accent, wireframe:true, transparent:true, opacity:.85 });
  const kind = classificaGrupoVisual(d);

  const lengthRatio = Math.max(0.6, Math.min(3.2, d.comprimento / Math.max(1,d.altura*2)));

  const body = new THREE.Mesh(new THREE.SphereGeometry(1,14,10), mat);
  body.scale.set(lengthRatio*1.15, 0.68, 0.62);
  group.add(body);

  const head = new THREE.Mesh(new THREE.SphereGeometry(0.32,10,8), mat);
  head.position.set(lengthRatio*1.15 + 0.28, 0.18, 0);
  group.add(head);

  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.14,0.24,0.6,8), mat);
  neck.position.set(lengthRatio*1.0, 0.12, 0);
  neck.rotation.z = Math.PI/2.4;
  group.add(neck);

  const tail = new THREE.Mesh(new THREE.ConeGeometry(0.28,1.1,8), mat);
  tail.position.set(-lengthRatio*1.25, 0.0, 0);
  tail.rotation.z = Math.PI/2;
  group.add(tail);

  if(kind !== "flying" && kind !== "aquatic"){
    const legGeo = new THREE.CylinderGeometry(0.07,0.07,0.5,6);
    [[-0.5,0.4],[-0.5,-0.4],[0.5,0.4],[0.5,-0.4]].forEach(([x,z])=>{
      const leg = new THREE.Mesh(legGeo, mat);
      leg.position.set(x, -0.55, z);
      group.add(leg);
    });
  }

  if(kind === "armored"){
    const spikeGeo = new THREE.ConeGeometry(0.12,0.4,6);
    for(let i=-1; i<=1; i++){
      const spike = new THREE.Mesh(spikeGeo, mat);
      spike.position.set(i*0.5, 0.55, 0);
      group.add(spike);
    }
  }
  if(kind === "flying"){
    const wingGeo = new THREE.ConeGeometry(1.3, 0.05, 3);
    const wingL = new THREE.Mesh(wingGeo, mat);
    wingL.rotation.z = Math.PI/2; wingL.position.set(0,0.1,0.9); wingL.scale.set(1,1,1);
    const wingR = wingL.clone(); wingR.position.z = -0.9;
    group.add(wingL, wingR);
  }
  if(kind === "aquatic"){
    body.scale.set(lengthRatio*1.3, 0.5, 0.5);
    const fin = new THREE.Mesh(new THREE.ConeGeometry(0.3,0.5,4), mat);
    fin.position.set(-0.2,0.5,0);
    group.add(fin);
  }
  if(kind === "sauropod"){
    neck.scale.set(1,2.2,1);
    neck.position.set(lengthRatio*1.25, 0.55, 0);
    head.position.set(lengthRatio*1.45, 1.0, 0);
  }

  const scale = 1.6 / Math.max(1, lengthRatio);
  group.scale.setScalar(scale);
  return group;
}

function initScanner(){
  const canvasWrap = document.getElementById("scanner-canvas");
  if(typeof THREE === "undefined" || !canvasWrap) return;
  scannerRenderer = new THREE.WebGLRenderer({ canvas:canvasWrap, alpha:true, antialias:true });
  scannerRenderer.setPixelRatio(Math.min(devicePixelRatio,1.8));
  scannerScene = new THREE.Scene();
  scannerCamera = new THREE.PerspectiveCamera(45,1,0.1,50);
  scannerCamera.position.set(0,0.6,4.2);
}

function setScanModel(d){
  if(!scannerScene) return;
  if(scannerGroup) scannerScene.remove(scannerGroup);
  scannerGroup = buildScanModel(d);
  scannerScene.add(scannerGroup);
  resizeScanner();
  if(scannerRAF) cancelAnimationFrame(scannerRAF);
  (function loop(){
    scannerGroup.rotation.y += 0.008;
    scannerGroup.rotation.x = Math.sin(Date.now()*0.0003)*0.08;
    scannerRenderer.render(scannerScene, scannerCamera);
    scannerRAF = requestAnimationFrame(loop);
  })();
}
function resizeScanner(){
  const el = document.getElementById("scanner-canvas");
  if(!el || !scannerRenderer) return;
  const w = el.clientWidth || 400, h = el.clientHeight || 320;
  scannerRenderer.setSize(w,h,false);
  scannerCamera.aspect = w/h; scannerCamera.updateProjectionMatrix();
}
window.addEventListener("resize", debounce(resizeScanner, 200));

function stopScanner(){
  if(scannerRAF) cancelAnimationFrame(scannerRAF);
}

/* ---------- Radar chart (canvas 2D) ---------- */
function drawRadar(d){
  const canvas = document.getElementById("radar-canvas");
  if(!canvas) return;
  const ctx = canvas.getContext("2d");
  const W = canvas.width = canvas.clientWidth * 2;
  const H = canvas.height = canvas.clientHeight * 2;
  ctx.clearRect(0,0,W,H);
  const cx = W/2, cy = H/2, R = Math.min(W,H)/2 - 24*2;

  const axes = [
    { label:"Altura", v: Math.min(1, d.altura/20) },
    { label:"Compr.", v: Math.min(1, d.comprimento/40) },
    { label:"Peso", v: Math.min(1, Math.log10(d.peso+1)/Math.log10(80000)) },
    { label:"Veloc.", v: Math.min(1, d.velocidade/120) },
    { label:"Força", v: Math.min(1, d.forca/100) },
  ];
  const n = axes.length;

  ctx.strokeStyle = "rgba(120,220,255,.18)";
  ctx.lineWidth = 2;
  for(let ring=1; ring<=4; ring++){
    ctx.beginPath();
    for(let i=0;i<=n;i++){
      const a = -Math.PI/2 + i*(2*Math.PI/n);
      const r = R*(ring/4);
      const x = cx + Math.cos(a)*r, y = cy + Math.sin(a)*r;
      if(i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
    }
    ctx.stroke();
  }
  ctx.strokeStyle = "rgba(120,220,255,.28)";
  for(let i=0;i<n;i++){
    const a = -Math.PI/2 + i*(2*Math.PI/n);
    ctx.beginPath(); ctx.moveTo(cx,cy); ctx.lineTo(cx+Math.cos(a)*R, cy+Math.sin(a)*R); ctx.stroke();
  }

  ctx.beginPath();
  axes.forEach((ax,i)=>{
    const a = -Math.PI/2 + i*(2*Math.PI/n);
    const r = R*ax.v;
    const x = cx + Math.cos(a)*r, y = cy + Math.sin(a)*r;
    if(i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
  });
  ctx.closePath();
  const accent = ACCENT[d.grupo] || "#3ee9ff";
  ctx.fillStyle = accent + "33";
  ctx.strokeStyle = accent;
  ctx.lineWidth = 3;
  ctx.fill(); ctx.stroke();

  ctx.fillStyle = "#d7e6f2";
  ctx.font = (22)+"px JetBrains Mono, monospace";
  ctx.textAlign = "center"; ctx.textBaseline="middle";
  axes.forEach((ax,i)=>{
    const a = -Math.PI/2 + i*(2*Math.PI/n);
    const x = cx + Math.cos(a)*(R+34), y = cy + Math.sin(a)*(R+34);
    ctx.fillText(ax.label, x, y);
  });
}

/* ---------- Timeline ---------- */
function drawTimeline(d){
  const marker = document.getElementById("timeline-marker");
  const map = { triassico: 10, jurassico: 33.5, cretaceo: 67 };
  const pct = map[d.periodo] ?? 50;
  marker.style.left = pct + "%";
  marker.setAttribute("data-label", d.periodoDetalhe || PERIODO_LABEL[d.periodo]);
}

/* ---------- Abertura do painel ---------- */
function openDetail(d){
  const detail = document.getElementById("detail");
  document.getElementById("detail-title").textContent = d.nomePopular;
  document.getElementById("detail-sci").textContent = d.nomeCientifico;
  document.getElementById("detail-class").textContent = d.classificacao + " · " + d.estado;
  document.getElementById("detail-breadcrumb-id").textContent = d.id.toUpperCase();
  document.getElementById("detail-desc").textContent = d.descricao;
  document.getElementById("curio-list").innerHTML = (d.curiosidades||[]).map(c=>`<li>${c}</li>`).join("");
  document.getElementById("scan-caption").textContent =
    `RECONSTRUÇÃO HOLOGRÁFICA ESTIMADA · ${d.comprimento} m · ${d.peso.toLocaleString("pt-BR")} kg`;

  const bio = document.getElementById("bio-grid");
  bio.innerHTML = [
    ["Dieta", GRUPO_LABEL[d.dieta] || d.dieta],
    ["Categoria", GRUPO_LABEL[d.grupo] || d.grupo],
    ["Período", d.periodoDetalhe],
    ["Continente", d.continente],
    ["Habitat", d.habitat],
    ["Descoberta", d.descoberta],
    ["Classificação", d.classificacao],
    ["Estado", d.estado],
  ].map(([l,v])=>`<div class="bio-item"><div class="lbl">${l}</div><div class="val">${v}</div></div>`).join("");

  const stats = [
    ["Altura", d.altura+" m", Math.min(100, (d.altura/20)*100)],
    ["Comprimento", d.comprimento+" m", Math.min(100, (d.comprimento/40)*100)],
    ["Peso", d.peso.toLocaleString("pt-BR")+" kg", Math.min(100, (Math.log10(d.peso+1)/Math.log10(80000))*100)],
    ["Velocidade estimada", d.velocidade+" km/h", Math.min(100, (d.velocidade/120)*100)],
    ["Força estimada", d.forca+"/100", d.forca],
  ];
  const statsWrap = document.getElementById("stats-wrap");
  statsWrap.innerHTML = stats.map(([l,v,pctv])=>`
    <div class="stat-row">
      <div class="lbl"><span>${l}</span><b>${v}</b></div>
      <div class="stat-track"><div class="stat-fill" data-w="${pctv}"></div></div>
    </div>`).join("") + `<div class="force-note">${d.forcaLabel||""}</div>`;

  detail.classList.add("open");
  detail.setAttribute("aria-hidden","false");
  document.body.style.overflow = "hidden";

  requestAnimationFrame(()=>{
    statsWrap.querySelectorAll(".stat-fill").forEach(el=>{ el.style.width = el.getAttribute("data-w")+"%"; });
    drawRadar(d);
    drawTimeline(d);
  });

  setScanModel(d);
  switchTab("overview");
  document.getElementById("detail-close").focus();
}

function closeDetail(){
  const detail = document.getElementById("detail");
  detail.classList.remove("open");
  detail.setAttribute("aria-hidden","true");
  document.body.style.overflow = "";
  stopScanner();
}

function switchTab(name){
  document.querySelectorAll(".tabbtn").forEach(b=>b.classList.toggle("active", b.dataset.tab===name));
  document.querySelectorAll(".tabpane").forEach(p=>p.classList.toggle("active", p.dataset.pane===name));
  if(name==="stats"){ setTimeout(()=>{ const d = DB.find(x=>x.id===currentId); if(d) drawRadar(d); }, 50); }
}

let currentId = null;
function wireDetailEvents(){
  document.getElementById("grid").addEventListener("click", (e)=>{
    const card = e.target.closest(".card");
    if(!card) return;
    currentId = card.dataset.id;
    const d = DB.find(x=>x.id===currentId);
    if(d) openDetail(d);
  });
  document.getElementById("grid").addEventListener("keypress", (e)=>{
    if(e.key !== "Enter") return;
    const card = e.target.closest(".card");
    if(!card) return;
    currentId = card.dataset.id;
    const d = DB.find(x=>x.id===currentId);
    if(d) openDetail(d);
  });
  document.getElementById("detail-close").addEventListener("click", closeDetail);
  document.getElementById("detail").addEventListener("click", (e)=>{
    if(e.target.id === "detail") closeDetail();
  });
  document.addEventListener("keydown", (e)=>{
    if(e.key === "Escape") closeDetail();
  });
  document.querySelectorAll(".tabbtn").forEach(b=>{
    b.addEventListener("click", ()=>switchTab(b.dataset.tab));
  });
}

/* ---------------------------------------------------------------------
   Menu mobile
--------------------------------------------------------------------- */
function wireMobileNav(){
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector("nav");
  if(!toggle || !nav) return;
  toggle.addEventListener("click", ()=>{
    const open = nav.classList.toggle("open-mobile");
    toggle.setAttribute("aria-expanded", open ? "true":"false");
  });
}

/* ---------------------------------------------------------------------
   Init
--------------------------------------------------------------------- */
document.addEventListener("DOMContentLoaded", ()=>{
  buildFilterChips();
  wireFilters();
  wireDetailEvents();
  wireMobileNav();
  initScanner();
  render();

  document.querySelectorAll("[data-scroll-to]").forEach(btn=>{
    btn.addEventListener("click", ()=>{
      document.getElementById(btn.getAttribute("data-scroll-to"))?.scrollIntoView({ behavior:"smooth" });
    });
  });
});
})();
