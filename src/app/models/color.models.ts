export interface RGB {
  r: number;
  g: number;
  b: number;
}

export interface HSL {
  h: number;
  s: number;
  l: number;
}

export interface ColorItem {
  hex: string;
  rgb: RGB;
  hsl: HSL;
  name: string;
  locked: boolean;
  contrastWithWhite: number;
  contrastWithBlack: number;
  textColor: string; // '#ffffff' or '#1c1917'
}

export type HarmonyType =
  | 'random'
  | 'complementary'
  | 'analogous'
  | 'monochromatic'
  | 'triadic'
  | 'tetradic'
  | 'cozy'
  | 'pastel'
  | 'vibrant';

export type BlindnessType = 'normal' | 'protanopia' | 'deuteranopia' | 'tritanopia' | 'achromatopsia';

export interface PaletteHistoryItem {
  id: string;
  name: string;
  colors: string[];
  createdAt: number;
  harmony?: string;
}

export interface ColorPersonality {
  saturation: number; // -100 to 100
  lightness: number;  // -50 to 50
  temperature: number;// -100 (cool) to 100 (warm)
  contrast: number;   // -50 to 50
}

export interface SemanticColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  success: string;
  warning: string;
  danger: string;
  info: string;
}

export interface TonalScaleItem {
  shade: number;
  hex: string;
  contrastWhite: number;
  contrastBlack: number;
}

export interface ColorChallenge {
  title: string;
  description: string;
  category: 'Branding' | 'Web' | 'Poster' | 'Ilustração' | 'Produto';
  difficulty: 'Fácil' | 'Médio' | 'Inspiração';
}
