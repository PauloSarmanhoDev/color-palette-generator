import {
  ColorItem,
  RGB,
  HSL,
  HarmonyType,
  BlindnessType,
  ColorPersonality,
  TonalScaleItem,
  SemanticColors
} from '../models/color.models';
import { POETIC_COLOR_NAMES } from './color-names';

// ==========================================
// 1. CONVERSÕES BÁSICAS DE CORES
// ==========================================

export function hexToRgb(hex: string): RGB {
  let clean = hex.replace('#', '').trim();
  if (clean.length === 3) {
    clean = clean.split('').map(c => c + c).join('');
  }
  const num = parseInt(clean, 16);
  if (isNaN(num)) {
    return { r: 128, g: 128, b: 128 };
  }
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255
  };
}

export function rgbToHex(r: number, g: number, b: number): string {
  const clamp = (val: number) => Math.max(0, Math.min(255, Math.round(val)));
  const toHex = (c: number) => {
    const hex = clamp(c).toString(16).toUpperCase();
    return hex.length === 1 ? '0' + hex : hex;
  };
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

export function rgbToHsl(r: number, g: number, b: number): HSL {
  const rNorm = r / 255;
  const gNorm = g / 255;
  const bNorm = b / 255;

  const max = Math.max(rNorm, gNorm, bNorm);
  const min = Math.min(rNorm, gNorm, bNorm);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case rNorm:
        h = (gNorm - bNorm) / d + (gNorm < bNorm ? 6 : 0);
        break;
      case gNorm:
        h = (bNorm - rNorm) / d + 2;
        break;
      case bNorm:
        h = (rNorm - gNorm) / d + 4;
        break;
    }
    h /= 6;
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100)
  };
}

export function hslToRgb(h: number, s: number, l: number): RGB {
  h = ((h % 360) + 360) % 360;
  s = Math.max(0, Math.min(100, s)) / 100;
  l = Math.max(0, Math.min(100, l)) / 100;

  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;

  let rPrime = 0;
  let gPrime = 0;
  let bPrime = 0;

  if (0 <= h && h < 60) {
    rPrime = c; gPrime = x; bPrime = 0;
  } else if (60 <= h && h < 120) {
    rPrime = x; gPrime = c; bPrime = 0;
  } else if (120 <= h && h < 180) {
    rPrime = 0; gPrime = c; bPrime = x;
  } else if (180 <= h && h < 240) {
    rPrime = 0; gPrime = x; bPrime = c;
  } else if (240 <= h && h < 300) {
    rPrime = x; gPrime = 0; bPrime = c;
  } else if (300 <= h && h < 360) {
    rPrime = c; gPrime = 0; bPrime = x;
  }

  return {
    r: Math.round((rPrime + m) * 255),
    g: Math.round((gPrime + m) * 255),
    b: Math.round((bPrime + m) * 255)
  };
}

export function hslToHex(h: number, s: number, l: number): string {
  const { r, g, b } = hslToRgb(h, s, l);
  return rgbToHex(r, g, b);
}

// ==========================================
// 2. ACESSIBILIDADE E CONTRASTE WCAG 2.1
// ==========================================

export function getLuminance(r: number, g: number, b: number): number {
  const a = [r, g, b].map(v => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

export function getContrastRatio(hex1: string, hex2: string): number {
  const rgb1 = hexToRgb(hex1);
  const rgb2 = hexToRgb(hex2);
  const lum1 = getLuminance(rgb1.r, rgb1.g, rgb1.b);
  const lum2 = getLuminance(rgb2.r, rgb2.g, rgb2.b);
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  const ratio = (brightest + 0.05) / (darkest + 0.05);
  return Math.round(ratio * 10) / 10;
}

export function getBestTextColor(bgHex: string): string {
  const contrastWithBlack = getContrastRatio(bgHex, '#1C1917');
  const contrastWithWhite = getContrastRatio(bgHex, '#FFFFFF');
  return contrastWithWhite >= contrastWithBlack ? '#FFFFFF' : '#1C1917';
}

// ==========================================
// 3. NOMES CRIATIVOS E POÉTICOS
// ==========================================

export function getNearestColorName(hex: string): string {
  const targetRgb = hexToRgb(hex);
  let closestName = 'Cor Harmoniosa';
  let minDistance = Infinity;

  for (const entry of POETIC_COLOR_NAMES) {
    const entryRgb = hexToRgb(entry.hex);
    // Weighted Euclidean distance for human perception (redweight = 0.3, green = 0.59, blue = 0.11)
    const dr = targetRgb.r - entryRgb.r;
    const dg = targetRgb.g - entryRgb.g;
    const db = targetRgb.b - entryRgb.b;
    const distance = Math.sqrt(dr * dr * 0.3 + dg * dg * 0.59 + db * db * 0.11);

    if (distance < minDistance) {
      minDistance = distance;
      closestName = entry.name;
    }
  }

  return closestName;
}

// ==========================================
// 4. CRIAÇÃO DE ITEM DE COR
// ==========================================

export function createColorItem(hex: string, locked = false): ColorItem {
  const rgb = hexToRgb(hex);
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  const contrastWithWhite = getContrastRatio(hex, '#FFFFFF');
  const contrastWithBlack = getContrastRatio(hex, '#1C1917');
  const textColor = getBestTextColor(hex);
  const name = getNearestColorName(hex);

  return {
    hex: hex.toUpperCase(),
    rgb,
    hsl,
    name,
    locked,
    contrastWithWhite,
    contrastWithBlack,
    textColor
  };
}

// ==========================================
// 5. GERAÇÃO INTELIGENTE DE PALETAS
// ==========================================

export function generateHarmoniousPalette(
  count: 3 | 5 | 8,
  harmony: HarmonyType,
  currentColors?: ColorItem[]
): ColorItem[] {
  // Find anchor hue from locked color if available
  let anchorHue: number | null = null;
  let anchorSaturation = 65;
  let anchorLightness = 55;

  if (currentColors && currentColors.length > 0) {
    const firstLocked = currentColors.find(c => c.locked);
    if (firstLocked) {
      anchorHue = firstLocked.hsl.h;
      anchorSaturation = firstLocked.hsl.s;
      anchorLightness = firstLocked.hsl.l;
    }
  }

  if (anchorHue === null) {
    anchorHue = Math.floor(Math.random() * 360);
    // Cozy preferences: moderate saturation, pleasant warmth
    anchorSaturation = Math.floor(45 + Math.random() * 35); // 45-80%
    anchorLightness = Math.floor(40 + Math.random() * 30);  // 40-70%
  }

  const generatedHexes: string[] = [];

  switch (harmony) {
    case 'complementary': {
      // Base + complement (opposite 180) + nuances
      const compHue = (anchorHue + 180) % 360;
      const hues = [anchorHue, compHue];
      if (count === 3) {
        hues.push((anchorHue + 30) % 360);
      } else if (count === 5) {
        hues.push((anchorHue + 25) % 360, (compHue - 25 + 360) % 360, (anchorHue - 30 + 360) % 360);
      } else {
        hues.push(
          (anchorHue + 20) % 360, (anchorHue - 20 + 360) % 360,
          (compHue + 20) % 360, (compHue - 20 + 360) % 360,
          (anchorHue + 40) % 360, (compHue - 40 + 360) % 360
        );
      }
      for (let i = 0; i < count; i++) {
        const h = hues[i % hues.length];
        const s = Math.min(85, Math.max(35, anchorSaturation + (i % 2 === 0 ? 5 : -10)));
        const l = Math.min(82, Math.max(25, 30 + (i * 12) % 55));
        generatedHexes.push(hslToHex(h, s, l));
      }
      break;
    }

    case 'analogous': {
      // Neighbors within 30-60 degrees
      const step = count === 8 ? 15 : 25;
      const startHue = (anchorHue - (Math.floor(count / 2) * step) + 360) % 360;
      for (let i = 0; i < count; i++) {
        const h = (startHue + i * step) % 360;
        const s = Math.min(85, Math.max(35, anchorSaturation + ((i % 3) * 6 - 6)));
        const l = Math.min(82, Math.max(28, 35 + ((i * 14) % 48)));
        generatedHexes.push(hslToHex(h, s, l));
      }
      break;
    }

    case 'monochromatic': {
      // Same hue, varying lightness and saturation
      const lSteps = count === 3 ? [30, 55, 82] : count === 5 ? [22, 38, 56, 74, 90] : [18, 28, 40, 52, 64, 76, 86, 94];
      for (let i = 0; i < count; i++) {
        const s = Math.min(90, Math.max(20, anchorSaturation + (i % 2 === 0 ? -12 : 8)));
        const l = lSteps[i];
        generatedHexes.push(hslToHex(anchorHue, s, l));
      }
      break;
    }

    case 'triadic': {
      // 3 equilateral hues: anchor, anchor+120, anchor+240
      const triHues = [anchorHue, (anchorHue + 120) % 360, (anchorHue + 240) % 360];
      for (let i = 0; i < count; i++) {
        const h = triHues[i % 3];
        const s = Math.min(85, Math.max(35, anchorSaturation - ((i % 3) * 8)));
        const l = Math.min(84, Math.max(26, 32 + ((i * 15) % 52)));
        generatedHexes.push(hslToHex(h, s, l));
      }
      break;
    }

    case 'tetradic': {
      // 4 rectangle points: anchor, anchor+60, anchor+180, anchor+240
      const tetHues = [anchorHue, (anchorHue + 60) % 360, (anchorHue + 180) % 360, (anchorHue + 240) % 360];
      for (let i = 0; i < count; i++) {
        const h = tetHues[i % 4];
        const s = Math.min(85, Math.max(35, anchorSaturation + (i % 2 === 0 ? 5 : -5)));
        const l = Math.min(82, Math.max(25, 32 + ((i * 13) % 50)));
        generatedHexes.push(hslToHex(h, s, l));
      }
      break;
    }

    case 'cozy': {
      // Warm, earth-toned, welcoming hues (terracotta, warm gold, sage, dark mocha, cream)
      const cozyHues = [25, 38, 160, 18, 45, 140, 15, 80]; // Warm range + sage greens
      for (let i = 0; i < count; i++) {
        const h = (anchorHue + cozyHues[i % cozyHues.length]) % 360;
        const s = Math.floor(35 + (i * 7) % 35); // 35-70% earthy saturation
        const l = Math.floor(32 + (i * 12) % 52); // Soft balanced lighting
        generatedHexes.push(hslToHex(h, s, l));
      }
      break;
    }

    case 'pastel': {
      // High lightness, gentle soft saturation
      const step = 360 / count;
      for (let i = 0; i < count; i++) {
        const h = (anchorHue + i * step + (Math.random() * 20 - 10)) % 360;
        const s = Math.floor(45 + Math.random() * 25); // 45-70%
        const l = Math.floor(75 + Math.random() * 15); // 75-90%
        generatedHexes.push(hslToHex(h, s, l));
      }
      break;
    }

    case 'vibrant': {
      // High saturation, punchy contrast
      const step = 360 / count;
      for (let i = 0; i < count; i++) {
        const h = (anchorHue + i * step + (Math.random() * 15 - 7)) % 360;
        const s = Math.floor(78 + Math.random() * 20); // 78-98%
        const l = Math.floor(45 + (i % 2 === 0 ? 8 : -8)); // 40-55%
        generatedHexes.push(hslToHex(h, s, l));
      }
      break;
    }

    case 'random':
    default: {
      // Curated organic random with pleasant distribution
      const goldenRatio = 0.618033988749895;
      let h = anchorHue;
      for (let i = 0; i < count; i++) {
        h = (h + goldenRatio * 360) % 360;
        const s = Math.floor(40 + Math.random() * 45); // 40-85%
        const l = Math.floor(30 + (i * (50 / count))); // nicely distributed dark to light
        generatedHexes.push(hslToHex(h, s, l));
      }
      break;
    }
  }

  // Assemble result maintaining locked colors
  const finalColors: ColorItem[] = [];
  for (let i = 0; i < count; i++) {
    if (currentColors && currentColors[i] && currentColors[i].locked) {
      finalColors.push(currentColors[i]);
    } else {
      const hex = generatedHexes[i] || hslToHex((anchorHue + i * 40) % 360, 60, 50);
      finalColors.push(createColorItem(hex, false));
    }
  }

  return finalColors;
}

// ==========================================
// 6. CONTROLE DE PERSONALIDADE DE CORES
// ==========================================

export function applyPersonality(colors: ColorItem[], personality: ColorPersonality): ColorItem[] {
  return colors.map(item => {
    if (item.locked) return item;

    let { h, s, l } = item.hsl;

    // 1. Saturação (-100 a +100%)
    if (personality.saturation !== 0) {
      const factor = 1 + personality.saturation / 100;
      s = Math.max(0, Math.min(100, Math.round(s * factor)));
    }

    // 2. Luminosidade (-50 a +50)
    if (personality.lightness !== 0) {
      l = Math.max(5, Math.min(95, Math.round(l + personality.lightness)));
    }

    // 3. Temperatura (-100 cool a +100 warm)
    if (personality.temperature !== 0) {
      // Warm shifts towards orange/amber (30 deg); Cool shifts towards cyan/blue (210 deg)
      const targetHue = personality.temperature > 0 ? 30 : 210;
      const weight = Math.abs(personality.temperature) / 100 * 0.45; // Max 45% shift
      // Circular interpolation of hue
      let diff = targetHue - h;
      if (diff > 180) diff -= 360;
      if (diff < -180) diff += 360;
      h = Math.round((h + diff * weight + 360) % 360);
    }

    // 4. Contraste (-50 a +50)
    if (personality.contrast !== 0) {
      // Pushes lightness towards extremes (darker darks, lighter lights)
      const diffFromMid = l - 50;
      const factor = 1 + personality.contrast / 100;
      l = Math.max(8, Math.min(92, Math.round(50 + diffFromMid * factor)));
    }

    const newHex = hslToHex(h, s, l);
    return createColorItem(newHex, false);
  });
}

// ==========================================
// 7. SIMULADOR DE DALTONISMO
// ==========================================

export function simulateColorBlindness(hex: string, type: BlindnessType): string {
  if (type === 'normal') return hex;

  const { r, g, b } = hexToRgb(hex);

  // Linearize sRGB
  const toLinear = (c: number) => {
    const v = c / 255;
    return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  };

  const lr = toLinear(r);
  const lg = toLinear(g);
  const lb = toLinear(b);

  let sr = lr;
  let sg = lg;
  let sb = lb;

  switch (type) {
    case 'protanopia': // Red-blind
      sr = 0.56667 * lr + 0.43333 * lg;
      sg = 0.55833 * lr + 0.44167 * lg;
      sb = 0.24167 * lg + 0.75833 * lb;
      break;
    case 'deuteranopia': // Green-blind
      sr = 0.625 * lr + 0.375 * lg;
      sg = 0.7 * lr + 0.3 * lg;
      sb = 0.3 * lg + 0.7 * lb;
      break;
    case 'tritanopia': // Blue-blind
      sr = 0.95 * lr + 0.05 * lg;
      sg = 0.43333 * lg + 0.56667 * lb;
      sb = 0.475 * lg + 0.525 * lb;
      break;
    case 'achromatopsia': // Monochromacy
      const gray = 0.299 * lr + 0.587 * lg + 0.114 * lb;
      sr = gray;
      sg = gray;
      sb = gray;
      break;
  }

  // De-linearize to sRGB
  const toSrgb = (v: number) => {
    const clamped = Math.max(0, Math.min(1, v));
    const c = clamped <= 0.0031308 ? clamped * 12.92 : 1.055 * Math.pow(clamped, 1 / 2.4) - 0.055;
    return Math.round(c * 255);
  };

  return rgbToHex(toSrgb(sr), toSrgb(sg), toSrgb(sb));
}

// ==========================================
// 8. ESCALA TONAL (50 a 950 - ESTILO TAILWIND)
// ==========================================

export function generateTonalScale(baseHex: string): TonalScaleItem[] {
  const { h, s } = rgbToHsl(hexToRgb(baseHex).r, hexToRgb(baseHex).g, hexToRgb(baseHex).b);

  // Curadoria perceptual de luminosidade e saturação de 50 a 950
  const steps = [
    { shade: 50,  l: 96, sOffset: -20 },
    { shade: 100, l: 91, sOffset: -12 },
    { shade: 200, l: 82, sOffset: -6 },
    { shade: 300, l: 72, sOffset: 0 },
    { shade: 400, l: 60, sOffset: 4 },
    { shade: 500, l: 48, sOffset: 6 },
    { shade: 600, l: 40, sOffset: 8 },
    { shade: 700, l: 32, sOffset: 6 },
    { shade: 800, l: 24, sOffset: 2 },
    { shade: 900, l: 16, sOffset: -2 },
    { shade: 950, l: 10, sOffset: -6 },
  ];

  return steps.map(({ shade, l, sOffset }) => {
    const adjustedS = Math.max(10, Math.min(95, s + sOffset));
    const hex = hslToHex(h, adjustedS, l);
    return {
      shade,
      hex,
      contrastWhite: getContrastRatio(hex, '#FFFFFF'),
      contrastBlack: getContrastRatio(hex, '#1C1917'),
    };
  });
}

// ==========================================
// 9. CORES SEMÂNTICAS SUGERIDAS
// ==========================================

export function deriveSemanticColors(colors: ColorItem[]): SemanticColors {
  const primary = colors[0]?.hex || '#E07A5F';
  const secondary = colors[1]?.hex || '#3D5A80';
  const accent = colors[2]?.hex || '#F4A261';

  // Find lightest color for background or fall back to cozy cream
  const sortedByLight = [...colors].sort((a, b) => b.hsl.l - a.hsl.l);
  const background = sortedByLight[0]?.hsl.l > 80 ? sortedByLight[0].hex : '#FAF7F2';
  const surface = sortedByLight[0]?.hsl.l > 70 ? sortedByLight[1]?.hex || '#FFFFFF' : '#FFFFFF';

  return {
    primary,
    secondary,
    accent,
    background,
    surface,
    success: '#2A9D8F',
    warning: '#E9C46A',
    danger: '#E76F51',
    info: '#457B9D'
  };
}

// ==========================================
// 10. PALETAS POR DESCRIÇÃO / CONCEITO
// ==========================================

interface ConceptTheme {
  keywords: string[];
  colors: string[];
  name: string;
}

export const CONCEPT_THEMES: ConceptTheme[] = [
  {
    keywords: ['pôr do sol', 'sunset', 'tropical', 'verão', 'praia', 'calor', 'tarde'],
    colors: ['#F97316', '#F43F5E', '#FB923C', '#FCD34D', '#831843', '#0284C7', '#FEF08A', '#4338CA'],
    name: 'Pôr do Sol Tropical'
  },
  {
    keywords: ['tecnologia', 'futurista', 'cyber', 'neon', 'ia', 'inteligência', 'futuro'],
    colors: ['#6366F1', '#06B6D4', '#8B5CF6', '#1E1B4B', '#10B981', '#EC4899', '#3B82F6', '#0F172A'],
    name: 'Tecnologia Futurista'
  },
  {
    keywords: ['floresta', 'mágica', 'natureza', 'musgo', 'mata', 'árvore', 'encantada', 'verde'],
    colors: ['#166534', '#15803D', '#84CC16', '#22C55E', '#14532D', '#D97706', '#E9D5FF', '#3F6212'],
    name: 'Floresta Mágica'
  },
  {
    keywords: ['luxo', 'minimalista', 'elegância', 'sofisticado', 'ouro', 'preto', 'monocromático'],
    colors: ['#1C1917', '#78716C', '#D4AF37', '#E7E5E4', '#44403C', '#CA8A04', '#FAFAF9', '#292524'],
    name: 'Luxo Minimalista'
  },
  {
    keywords: ['café', 'aconchegante', 'cozy', 'livro', 'outono', 'lareira', 'quentinho', 'canela'],
    colors: ['#3E2723', '#795548', '#D7CCC8', '#E07A5F', '#D4A373', '#F4EFEA', '#BC6C25', '#8D6E63'],
    name: 'Café Aconchegante'
  },
  {
    keywords: ['oceano', 'profundo', 'mar', 'abismo', 'água', 'polar', 'náutico'],
    colors: ['#0C4A6E', '#0369A1', '#38BDF8', '#BAE6FD', '#164E63', '#0E7490', '#67E8F9', '#082F49'],
    name: 'Oceano Profundo'
  },
  {
    keywords: ['doce', 'algodão doce', 'infantil', 'confeitaria', 'pastel', 'fofo', 'kawaii'],
    colors: ['#F472B6', '#FBCFE8', '#BAE6FD', '#DDD6FE', '#FEF08A', '#A7F3D0', '#FDE047', '#C4B5FD'],
    name: 'Confeitaria Doce'
  },
  {
    keywords: ['vaporwave', 'synthwave', 'anos 80', 'retro', 'glitch', 'magenta'],
    colors: ['#FF007F', '#00F0FF', '#7928CA', '#2B0938', '#FFE600', '#FF4D00', '#50007A', '#00FFA3'],
    name: 'Vaporwave Sunset'
  },
  {
    keywords: ['cottagecore', 'jardim', 'floral', 'chá', 'lavanda', 'camponês', 'primavera'],
    colors: ['#81B29A', '#E07A5F', '#F4F1DE', '#3D405B', '#F2CC8F', '#B56576', '#6D597A', '#CCD5AE'],
    name: 'Cottagecore Serena'
  },
  {
    keywords: ['aurora', 'boreal', 'nórdico', 'inverno', 'gelo', 'neve', 'alpino'],
    colors: ['#0D9488', '#2DD4BF', '#065F46', '#38BDF8', '#818CF8', '#E0F2FE', '#0F172A', '#5EEAD4'],
    name: 'Aurora Boreal'
  }
];

export function generatePaletteFromPrompt(prompt: string, count: 3 | 5 | 8): ColorItem[] {
  const cleanPrompt = prompt.toLowerCase().trim();

  // 1. Direct match with theme keywords
  for (const theme of CONCEPT_THEMES) {
    if (theme.keywords.some(k => cleanPrompt.includes(k))) {
      const selected = theme.colors.slice(0, count);
      return selected.map(hex => createColorItem(hex, false));
    }
  }

  // 2. Algorithmic semantic hash based on text string
  let hash = 0;
  for (let i = 0; i < prompt.length; i++) {
    hash = (hash << 5) - hash + prompt.charCodeAt(i);
    hash |= 0;
  }
  const baseHue = Math.abs(hash) % 360;
  const colors: ColorItem[] = [];

  for (let i = 0; i < count; i++) {
    const h = (baseHue + i * (360 / count) + ((i * 17) % 30)) % 360;
    const s = 45 + ((Math.abs(hash * (i + 1)) % 40));
    const l = 30 + ((i * (50 / count)) % 55);
    colors.push(createColorItem(hslToHex(h, s, l), false));
  }

  return colors;
}

// ==========================================
// 11. EXTRAIR CORES DE UMA IMAGEM (CANVAS CLUSTERING)
// ==========================================

export function extractPaletteFromImage(img: HTMLImageElement, count: 3 | 5 | 8): string[] {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return ['#E07A5F', '#3D5A80', '#F4A261', '#81B29A', '#F4F1DE'];

  // Scale down for speed and smoothing
  const maxSize = 120;
  const scale = Math.min(maxSize / img.naturalWidth, maxSize / img.naturalHeight, 1);
  canvas.width = Math.max(1, Math.floor(img.naturalWidth * scale));
  canvas.height = Math.max(1, Math.floor(img.naturalHeight * scale));

  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

  // Simple and effective color binning/clustering
  const colorBuckets = new Map<string, { r: number, g: number, b: number, count: number }>();
  const step = 4; // Sample every 4th pixel for speed

  for (let i = 0; i < imageData.length; i += 4 * step) {
    const a = imageData[i + 3];
    if (a < 128) continue; // Ignore transparency

    const r = imageData[i];
    const g = imageData[i + 1];
    const b = imageData[i + 2];

    // Quantize to 32 steps per channel
    const qr = Math.round(r / 32) * 32;
    const qg = Math.round(g / 32) * 32;
    const qb = Math.round(b / 32) * 32;
    const key = `${qr},${qg},${qb}`;

    const existing = colorBuckets.get(key);
    if (existing) {
      existing.count++;
      existing.r = (existing.r + r) / 2;
      existing.g = (existing.g + g) / 2;
      existing.b = (existing.b + b) / 2;
    } else {
      colorBuckets.set(key, { r, g, b, count: 1 });
    }
  }

  // Sort by frequency
  const sorted = Array.from(colorBuckets.values()).sort((a, b) => b.count - a.count);

  const selectedHexes: string[] = [];

  for (const bucket of sorted) {
    const hex = rgbToHex(bucket.r, bucket.g, bucket.b);
    // Ensure distinctiveness: check color distance against already chosen
    const isDistinct = selectedHexes.every(existingHex => {
      const eRgb = hexToRgb(existingHex);
      const dist = Math.sqrt(
        Math.pow(bucket.r - eRgb.r, 2) +
        Math.pow(bucket.g - eRgb.g, 2) +
        Math.pow(bucket.b - eRgb.b, 2)
      );
      return dist > 45; // Must be visually distinguishable
    });

    if (isDistinct) {
      selectedHexes.push(hex);
      if (selectedHexes.length >= count) break;
    }
  }

  // Fill up if needed
  while (selectedHexes.length < count) {
    const h = (selectedHexes.length * (360 / count)) % 360;
    selectedHexes.push(hslToHex(h, 60, 50));
  }

  return selectedHexes.slice(0, count);
}

// ==========================================
// 12. EXPORTADORES (CSS, TAILWIND, JSON, SVG)
// ==========================================

export function exportToCssVariables(colors: ColorItem[]): string {
  const vars = colors
    .map((c, i) => `  --color-${i + 1}: ${c.hex}; /* ${c.name} */`)
    .join('\n');
  return `:root {\n${vars}\n}`;
}

export function exportToTailwindConfig(colors: ColorItem[]): string {
  const paletteObj: Record<string, string> = {};
  colors.forEach((c, i) => {
    // Generate clean slug from name or color index
    const key = `palette-${i + 1}`;
    paletteObj[key] = c.hex;
  });

  return `// tailwind.config.js\nmodule.exports = {\n  theme: {\n    extend: {\n      colors: ${JSON.stringify(paletteObj, null, 8)}\n    }\n  }\n};`;
}

export function exportToJson(colors: ColorItem[]): string {
  const data = colors.map((c, i) => ({
    index: i + 1,
    name: c.name,
    hex: c.hex,
    rgb: `rgb(${c.rgb.r}, ${c.rgb.g}, ${c.rgb.b})`,
    hsl: `hsl(${c.hsl.h}, ${c.hsl.s}%, ${c.hsl.l}%)`,
    contrastOnWhite: c.contrastWithWhite,
    contrastOnBlack: c.contrastWithBlack
  }));
  return JSON.stringify(data, null, 2);
}

export function exportToSvg(colors: ColorItem[], title = 'Cromática Cozy Palette'): string {
  const width = 1200;
  const height = 630;
  const colWidth = width / colors.length;

  let rects = '';
  let labels = '';

  colors.forEach((c, i) => {
    const x = i * colWidth;
    rects += `  <rect x="${x}" y="0" width="${colWidth}" height="${height}" fill="${c.hex}" />\n`;
    labels += `
    <g transform="translate(${x + colWidth / 2}, ${height - 60})">
      <text text-anchor="middle" font-family="Plus Jakarta Sans, sans-serif" font-weight="700" font-size="20" fill="${c.textColor}">${c.hex}</text>
      <text y="24" text-anchor="middle" font-family="Plus Jakarta Sans, sans-serif" font-size="14" fill="${c.textColor}" opacity="0.85">${c.name}</text>
    </g>\n`;
  });

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
${rects}
${labels}
</svg>`;
}
