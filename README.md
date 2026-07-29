# Vale Perdido — Expedição Cinematográfica

Site 100% original e imersivo que simula uma expedição a um mundo onde
dinossauros ainda existem. Nenhum nome, personagem ou elemento de qualquer
franquia é utilizado — apenas a sensação de aventura, exploração e
grandiosidade de um "mundo perdido" fictício.

## Destaques

- Tela de abertura cinematográfica com neblina, pegadas e rugido (áudio
  sintetizado via Web Audio API, sem arquivos de terceiros).
- Hero com parallax 3D reagindo ao mouse (Three.js: partículas, neblina
  volumétrica, raios de luz).
- Rolagem narrativa em 8 capítulos (entrada na floresta → vale dos
  gigantes), cada um com cenário, tags e uma criatura própria.
- Dez espécies de dinossauros/pterossauros ilustradas em SVG original,
  geradas por código (`js/dinosaurs.js`) com animação de caminhada,
  respiração e voo — sem modelos 3D ou assets de terceiros.
- Catálogo interativo (cards com tilt 3D), mapa ilustrado da expedição com
  progresso de rolagem, chuva/raios opcionais, tremor de câmera nos
  capítulos de predadores/gigantes e barra de progresso da expedição.
- Menu transparente com versão mobile (drawer), cursor customizado,
  totalmente responsivo (desktop → mobile).

## Stack

HTML5, CSS3 (glassmorphism, animações), JavaScript, Three.js, GSAP +
ScrollTrigger, Lenis (smooth scroll). As bibliotecas de terceiros ficam
vendorizadas em `js/vendor/` para o site funcionar de forma autônoma,
rápida e sem dependência de CDNs externas.

## Estrutura

```
index.html        # marcação e conteúdo de todas as seções
css/style.css      # design system, layout e animações
js/dinosaurs.js     # geração procedural das ilustrações de dinossauros
js/main.js          # Three.js, GSAP/ScrollTrigger, Lenis, áudio, interações
js/vendor/          # three.js, gsap, ScrollTrigger, lenis (self-hosted)
arquivo/             # site anterior (Homem de Ferro), preservado como histórico
```

## Rodando localmente

Basta servir a pasta como arquivos estáticos, por exemplo:

```
python3 -m http.server 8080
```

e abrir `http://localhost:8080`.
