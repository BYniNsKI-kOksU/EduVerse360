// Liquid Glass effect for home tiles (vanilla JS)
// Dodaje SVG z gradientem i blendem do kafelków .tile

function createLiquidGlassSVG(width, height, borderRadius = 20, brightness = 50, opacity = 0.93, blur = 11) {
  const svgContent = `
    <svg viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%;position:absolute;top:0;left:0;pointer-events:none;z-index:0;">
      <defs>
        <linearGradient id="redGrad" x1="100%" y1="0%" x2="0%" y2="0%">
          <stop offset="0%" stop-color="#0000"/>
          <stop offset="100%" stop-color="red"/>
        </linearGradient>
        <linearGradient id="blueGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#0000"/>
          <stop offset="100%" stop-color="blue"/>
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="${width}" height="${height}" fill="black"/>
      <rect x="0" y="0" width="${width}" height="${height}" rx="${borderRadius}" fill="url(#redGrad)" />
      <rect x="0" y="0" width="${width}" height="${height}" rx="${borderRadius}" fill="url(#blueGrad)" style="mix-blend-mode:difference" />
      <rect x="0" y="0" width="${width}" height="${height}" rx="${borderRadius}" fill="hsl(0 0% ${brightness}% / ${opacity})" style="filter:blur(${blur}px)" />
    </svg>
  `;
  return svgContent;
}

function applyLiquidGlassToTiles() {
  document.querySelectorAll('.tile').forEach(tile => {
    // Usuń stare SVG jeśli istnieje
    const oldSVG = tile.querySelector('.liquid-glass-svg');
    if (oldSVG) oldSVG.remove();
    // Pobierz rozmiar kafelka
    const rect = tile.getBoundingClientRect();
    const width = Math.round(rect.width);
    const height = Math.round(rect.height);
    // Utwórz SVG
    const svg = document.createElement('div');
    svg.className = 'liquid-glass-svg';
    svg.style.position = 'absolute';
    svg.style.top = '0';
    svg.style.left = '0';
    svg.style.width = '100%';
    svg.style.height = '100%';
    svg.style.pointerEvents = 'none';
    svg.style.zIndex = '0';
    svg.innerHTML = createLiquidGlassSVG(width, height);
    // Dodaj SVG do kafelka
    tile.style.position = 'relative';
    tile.prepend(svg);
  });
}

window.addEventListener('DOMContentLoaded', applyLiquidGlassToTiles);
window.addEventListener('resize', applyLiquidGlassToTiles);
