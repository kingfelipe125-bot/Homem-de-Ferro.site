# Vale Perdido — Terminal de Contenção

Site 100% original de alta tecnologia que simula um terminal de
monitoramento de campo para um vale onde dinossauros ainda existem.
Nenhum nome, personagem, logotipo ou elemento de qualquer franquia é
utilizado — a inspiração é apenas a estética de "central de controle /
scanner genético" e a sensação de descoberta científica.

## Destaques

- Tela de abertura estilo boot de sistema (log de inicialização digitado,
  áudio ambiente e rugido sintetizados via Web Audio API — sem arquivos de
  terceiros).
- Hero com radar animado (SVG + CSS), grade técnica de fundo, scanlines e
  métricas em tempo real.
- Dez espécimes (dinossauros/pterossauro) documentados como esquemas
  técnicos "blueprint" (SVG wireframe gerado por código em
  `js/specimens.js`) — sem fotos, sem modelos 3D, sem assets de terceiros.
  Cada card tem nível de ameaça, status de contenção, varredura de scanner
  animada e tilt 3D ao passar o mouse.
- Mapa de contenção tático (SVG) com grade, radar giratório e nós de
  rastreamento coloridos por grupo (herbívoro / predador / voador).
- Chuva/raios opcionais, tremor de câmera na revelação do Tiranossauro,
  barra de progresso, menu com versão mobile (drawer) e cursor
  personalizado em formato de mira.

## Stack

HTML5, CSS3, JavaScript, GSAP + ScrollTrigger, Lenis (smooth scroll). As
bibliotecas de terceiros ficam vendorizadas em `js/vendor/` para o site
funcionar de forma autônoma e sem dependência de CDNs externas.

## Estrutura

```
index.html          # marcação e conteúdo de todas as seções
css/style.css        # design system (tema de terminal técnico), layout e animações
js/specimens.js       # geração procedural dos esquemas "blueprint" dos espécimes
js/main.js             # GSAP/ScrollTrigger, Lenis, áudio, interações, cursor
js/vendor/              # gsap, ScrollTrigger, lenis (self-hosted)
arquivo/                 # site anterior (Homem de Ferro), preservado como histórico
```

## Rodando localmente

Basta servir a pasta como arquivos estáticos, por exemplo:

```
python3 -m http.server 8080
```

e abrir `http://localhost:8080`.
