import { Injectable, signal, computed } from '@angular/core';
import confetti from 'canvas-confetti';
import {
  ColorItem,
  HarmonyType,
  BlindnessType,
  ColorPersonality,
  PaletteHistoryItem,
  TonalScaleItem,
  SemanticColors
} from '../models/color.models';
import {
  createColorItem,
  generateHarmoniousPalette,
  applyPersonality,
  simulateColorBlindness,
  generateTonalScale,
  deriveSemanticColors,
  exportToCssVariables,
  exportToTailwindConfig,
  exportToJson,
  exportToSvg,
  getNearestColorName,
  hslToHex
} from '../utils/color-utils';
import { soundPlayer } from '../utils/sound-utils';

const STORAGE_KEY_FAVORITES = 'cromatica_favorites_v1';
const STORAGE_KEY_HISTORY = 'cromatica_history_v1';
const STORAGE_KEY_SOUND = 'cromatica_sound_v1';

@Injectable({
  providedIn: 'root'
})
export class PaletteService {
  // Estado principal reativo (Angular Signals)
  readonly colorCount = signal<3 | 5 | 8>(5);
  readonly harmony = signal<HarmonyType>('cozy');
  readonly currentColors = signal<ColorItem[]>([]);
  readonly blindnessFilter = signal<BlindnessType>('normal');
  readonly soundEnabled = signal<boolean>(true);

  // Controle de personalidade das cores
  readonly personality = signal<ColorPersonality>({
    saturation: 0,
    lightness: 0,
    temperature: 0,
    contrast: 0
  });

  // Histórico e Favoritos
  readonly history = signal<PaletteHistoryItem[]>([]);
  readonly favorites = signal<PaletteHistoryItem[]>([]);

  // Notificação Toast
  readonly toast = signal<{ message: string; type: 'success' | 'info' } | null>(null);
  private toastTimeout: any = null;

  // Cor em edição detalhada
  readonly activeColorIndex = signal<number | null>(null);

  // Computados
  readonly simulatedColors = computed(() => {
    const filter = this.blindnessFilter();
    const colors = this.currentColors();
    if (filter === 'normal') return colors;

    return colors.map(c => {
      const simHex = simulateColorBlindness(c.hex, filter);
      return {
        ...c,
        hex: simHex,
        name: `${c.name} (${filter})`,
      };
    });
  });

  readonly semanticColors = computed<SemanticColors>(() => {
    return deriveSemanticColors(this.currentColors());
  });

  readonly activeColor = computed<ColorItem | null>(() => {
    const idx = this.activeColorIndex();
    if (idx === null || idx < 0 || idx >= this.currentColors().length) return null;
    return this.currentColors()[idx];
  });

  readonly activeTonalScale = computed<TonalScaleItem[]>(() => {
    const active = this.activeColor();
    const baseHex = active ? active.hex : (this.currentColors()[0]?.hex || '#E07A5F');
    return generateTonalScale(baseHex);
  });

  constructor() {
    this.loadInitialStorage();
    this.initPalette();
  }

  private loadInitialStorage(): void {
    if (typeof window === 'undefined') return;

    try {
      const savedSound = localStorage.getItem(STORAGE_KEY_SOUND);
      if (savedSound !== null) {
        this.soundEnabled.set(savedSound === 'true');
      }

      const savedFavs = localStorage.getItem(STORAGE_KEY_FAVORITES);
      if (savedFavs) {
        this.favorites.set(JSON.parse(savedFavs));
      }

      const savedHist = localStorage.getItem(STORAGE_KEY_HISTORY);
      if (savedHist) {
        this.history.set(JSON.parse(savedHist));
      }
    } catch (e) {
      console.warn('Erro ao carregar dados locais:', e);
    }
  }

  private initPalette(): void {
    if (typeof window !== 'undefined' && window.location.hash) {
      const loaded = this.loadFromHash(window.location.hash);
      if (loaded) return;
    }

    // Paleta padrão inicial muito acolhedora (Cozy & Earthy)
    const initialHexes = ['#E07A5F', '#3D5A80', '#F4A261', '#81B29A', '#F4F1DE'];
    const colors = initialHexes.map(hex => createColorItem(hex, false));
    this.currentColors.set(colors);
    this.addToHistory(colors, 'Aconchego Inicial');
  }

  // Gera nova paleta mantendo cores travadas
  generatePalette(overrideHarmony?: HarmonyType): void {
    const h = overrideHarmony || this.harmony();
    if (overrideHarmony) {
      this.harmony.set(overrideHarmony);
    }

    const newColors = generateHarmoniousPalette(
      this.colorCount(),
      h,
      this.currentColors()
    );

    // Se houver ajustes de personalidade ativos, aplica
    const adjusted = this.hasActivePersonality()
      ? applyPersonality(newColors, this.personality())
      : newColors;

    this.currentColors.set(adjusted);

    if (this.soundEnabled()) {
      soundPlayer.playChime();
    }

    this.addToHistory(adjusted);
    this.updateUrlHash();
  }

  // Alterna o bloqueio de uma cor
  toggleLock(index: number): void {
    const list = [...this.currentColors()];
    if (!list[index]) return;

    list[index] = {
      ...list[index],
      locked: !list[index].locked
    };
    this.currentColors.set(list);

    if (this.soundEnabled()) {
      soundPlayer.playLock();
    }
  }

  // Atualiza uma cor específica (editor manual)
  updateColor(index: number, newHex: string): void {
    const list = [...this.currentColors()];
    if (!list[index]) return;

    list[index] = createColorItem(newHex, list[index].locked);
    this.currentColors.set(list);
    this.updateUrlHash();
  }

  // Define quantidade de cores: 3, 5 ou 8
  setCount(count: 3 | 5 | 8): void {
    if (this.colorCount() === count) return;
    this.colorCount.set(count);
    this.generatePalette();
  }

  // Aplica variações rápidas de estilo
  applyVariation(type: 'lighter' | 'darker' | 'pastel' | 'vibrant' | 'warm'): void {
    const current = this.currentColors();
    const updated = current.map(item => {
      if (item.locked) return item;

      let { h, s, l } = item.hsl;
      switch (type) {
        case 'lighter':
          l = Math.min(94, l + 14);
          break;
        case 'darker':
          l = Math.max(12, l - 14);
          break;
        case 'pastel':
          s = Math.max(25, Math.min(65, s - 25));
          l = Math.min(90, Math.max(75, l + 20));
          break;
        case 'vibrant':
          s = Math.min(100, s + 35);
          l = Math.min(65, Math.max(40, l));
          break;
        case 'warm': {
          const diff = 30 - h;
          h = Math.round((h + diff * 0.35 + 360) % 360);
          s = Math.min(85, s + 10);
          break;
        }
      }
      return createColorItem(hslToHex(h, s, l), false);
    });

    this.currentColors.set(updated);
    if (this.soundEnabled()) soundPlayer.playChime();
    this.showToast(`Variação "${type}" aplicada com sucesso!`, 'success');
    this.updateUrlHash();
  }

  // Personalidade das cores em tempo real
  updatePersonality(field: keyof ColorPersonality, value: number): void {
    this.personality.update(p => ({ ...p, [field]: value }));
    const base = generateHarmoniousPalette(this.colorCount(), this.harmony(), this.currentColors());
    const adjusted = applyPersonality(base, this.personality());
    this.currentColors.set(adjusted);
  }

  resetPersonality(): void {
    this.personality.set({
      saturation: 0,
      lightness: 0,
      temperature: 0,
      contrast: 0
    });
    this.generatePalette();
    this.showToast('Controles de personalidade restaurados!', 'info');
  }

  private hasActivePersonality(): boolean {
    const p = this.personality();
    return p.saturation !== 0 || p.lightness !== 0 || p.temperature !== 0 || p.contrast !== 0;
  }

  // Substitui a paleta inteira (usado por Imagem, Prompt, Presets ou Histórico)
  setFullPalette(hexes: string[], name?: string): void {
    const count = (hexes.length >= 8 ? 8 : hexes.length >= 5 ? 5 : 3) as 3 | 5 | 8;
    this.colorCount.set(count);

    const colors = hexes.slice(0, count).map(h => createColorItem(h, false));
    this.currentColors.set(colors);

    if (this.soundEnabled()) soundPlayer.playChime();
    this.addToHistory(colors, name);
    this.updateUrlHash();
    this.showToast(name ? `Paleta "${name}" carregada!` : 'Paleta aplicada com sucesso!', 'success');
  }

  // Salvar nos Favoritos com celebração de confetes
  saveToFavorites(name?: string): void {
    const hexes = this.currentColors().map(c => c.hex);
    const paletteName = name || `Harmonia ${this.getSuggestedPaletteName()}`;

    const newFav: PaletteHistoryItem = {
      id: Date.now().toString(),
      name: paletteName,
      colors: hexes,
      createdAt: Date.now(),
      harmony: this.harmony()
    };

    const updated = [newFav, ...this.favorites()];
    this.favorites.set(updated);
    this.saveFavoritesToStorage(updated);

    if (this.soundEnabled()) soundPlayer.playCopy();
    this.triggerCelebration();
    this.showToast(`"${paletteName}" salva nos favoritos! ❤️`, 'success');
  }

  removeFavorite(id: string): void {
    const updated = this.favorites().filter(f => f.id !== id);
    this.favorites.set(updated);
    this.saveFavoritesToStorage(updated);
    this.showToast('Paleta removida dos favoritos.', 'info');
  }

  private saveFavoritesToStorage(favs: PaletteHistoryItem[]): void {
    try {
      localStorage.setItem(STORAGE_KEY_FAVORITES, JSON.stringify(favs));
    } catch (e) {
      console.warn('Erro ao salvar favoritos:', e);
    }
  }

  // Histórico
  private addToHistory(colors: ColorItem[], name?: string): void {
    const hexes = colors.map(c => c.hex);
    const item: PaletteHistoryItem = {
      id: Date.now().toString(),
      name: name || `Paleta ${colors[0]?.name || 'Cozy'}`,
      colors: hexes,
      createdAt: Date.now(),
      harmony: this.harmony()
    };

    const updated = [item, ...this.history().slice(0, 19)]; // Mantém até 20 itens
    this.history.set(updated);

    try {
      localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(updated));
    } catch (e) {
      console.warn('Erro ao salvar histórico:', e);
    }
  }

  // Toggle Som
  toggleSound(): void {
    const val = !this.soundEnabled();
    this.soundEnabled.set(val);
    try {
      localStorage.setItem(STORAGE_KEY_SOUND, val ? 'true' : 'false');
    } catch {}
    this.showToast(val ? 'Sons ativados 🔊' : 'Sons silenciados 🔇', 'info');
  }

  // Copiar para a área de transferência
  async copyText(text: string, label = 'Copiado'): Promise<void> {
    try {
      await navigator.clipboard.writeText(text);
      if (this.soundEnabled()) soundPlayer.playCopy();
      this.showToast(`${label}: ${text}`, 'success');
    } catch {
      // Fallback simples
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      if (this.soundEnabled()) soundPlayer.playCopy();
      this.showToast(`${label}: ${text}`, 'success');
    }
  }

  // Toast
  showToast(message: string, type: 'success' | 'info' = 'success'): void {
    if (this.toastTimeout) clearTimeout(this.toastTimeout);
    this.toast.set({ message, type });
    this.toastTimeout = setTimeout(() => {
      this.toast.set(null);
    }, 2800);
  }

  // Confetes festivos
  triggerCelebration(): void {
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
        colors: this.currentColors().map(c => c.hex)
      });
    } catch {}
  }

  // URL Hash Sync
  private updateUrlHash(): void {
    if (typeof window === 'undefined') return;
    const codes = this.currentColors().map(c => c.hex.replace('#', '')).join('-');
    window.location.hash = `palette=${codes}`;
  }

  private loadFromHash(hash: string): boolean {
    try {
      const match = hash.match(/palette=([0-9a-fA-F-]+)/);
      if (match && match[1]) {
        const hexes = match[1].split('-').map(code => `#${code}`);
        if (hexes.length >= 3) {
          const count = (hexes.length >= 8 ? 8 : hexes.length >= 5 ? 5 : 3) as 3 | 5 | 8;
          this.colorCount.set(count);
          const colors = hexes.slice(0, count).map(h => createColorItem(h, false));
          this.currentColors.set(colors);
          return true;
        }
      }
    } catch {}
    return false;
  }

  getShareUrl(): string {
    if (typeof window === 'undefined') return '';
    const codes = this.currentColors().map(c => c.hex.replace('#', '')).join('-');
    const base = window.location.origin + window.location.pathname;
    return `${base}#palette=${codes}`;
  }

  // Nome sugerido para a paleta
  getSuggestedPaletteName(): string {
    const first = this.currentColors()[0]?.name || 'Harmonia';
    const last = this.currentColors()[this.currentColors().length - 1]?.name || 'Cozy';
    return `${first} & ${last}`;
  }

  // Download PNG de alta qualidade
  downloadPalettePng(): void {
    const colors = this.currentColors();
    const canvas = document.createElement('canvas');
    canvas.width = 1600;
    canvas.height = 900;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Fundo
    ctx.fillStyle = '#FAF7F2';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Faixas de cores
    const colWidth = (canvas.width - 120) / colors.length;
    const startX = 60;
    const startY = 140;
    const colHeight = 620;
    const radius = 24;

    colors.forEach((c, idx) => {
      const x = startX + idx * colWidth;

      // Card com cantos arredondados
      ctx.save();
      ctx.beginPath();
      ctx.roundRect(x + 6, startY, colWidth - 12, colHeight, [radius, radius, radius, radius]);
      ctx.fillStyle = c.hex;
      ctx.fill();

      // Sombras internas sutis
      ctx.clip();
      ctx.fillStyle = c.textColor;
      ctx.font = 'bold 28px "Plus Jakarta Sans", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(c.hex, x + colWidth / 2, startY + colHeight - 75);

      ctx.font = '500 20px "Plus Jakarta Sans", sans-serif';
      ctx.globalAlpha = 0.85;
      ctx.fillText(c.name, x + colWidth / 2, startY + colHeight - 35);

      // Código RGB sutil
      ctx.font = '400 15px "Plus Jakarta Sans", sans-serif';
      ctx.globalAlpha = 0.65;
      ctx.fillText(`rgb(${c.rgb.r}, ${c.rgb.g}, ${c.rgb.b})`, x + colWidth / 2, startY + 50);

      ctx.restore();
    });

    // Cabeçalho da imagem
    ctx.fillStyle = '#292524';
    ctx.font = 'bold 36px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('Cromática • Gerador de Paletas', 60, 80);

    ctx.font = '400 20px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#78716C';
    ctx.fillText(`Paleta: ${this.getSuggestedPaletteName()}  •  ${colors.length} Cores`, 60, 115);

    // Rodapé
    ctx.textAlign = 'right';
    ctx.font = '500 18px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#A8A29E';
    ctx.fillText('Feito por Paulo Sarmanho  •  paulo-sarmanho-dev.netlify.app', canvas.width - 60, canvas.height - 40);

    // Download
    const link = document.createElement('a');
    link.download = `cromatica-paleta-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();

    this.showToast('Imagem PNG baixada com sucesso!', 'success');
  }

  // Download SVG
  downloadPaletteSvg(): void {
    const svgContent = exportToSvg(this.currentColors(), this.getSuggestedPaletteName());
    const blob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = `cromatica-paleta-${Date.now()}.svg`;
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
    this.showToast('Arquivo SVG exportado!', 'success');
  }
}
