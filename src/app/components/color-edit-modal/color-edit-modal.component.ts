import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PaletteService } from '../../services/palette.service';
import { rgbToHex, hslToHex, hexToRgb, rgbToHsl, createColorItem } from '../../utils/color-utils';

@Component({
  selector: 'app-color-edit-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    @if (paletteService.activeColor(); as color) {
      <div class="modal-backdrop" (click)="close()">
        <div class="modal-card card-cozy animate-scale-in" (click)="$event.stopPropagation()">
          <button class="close-btn" (click)="close()" title="Fechar">✕</button>

          <!-- Topo do Editor -->
          <div class="editor-header">
            <div class="color-big-preview" [style.background-color]="color.hex">
              <span class="preview-hex" [style.color]="color.textColor">{{ color.hex }}</span>
            </div>
            <div class="editor-titles">
              <h3 class="color-title">{{ color.name }}</h3>
              <p class="color-pos">Cor #{{ (paletteService.activeColorIndex() ?? 0) + 1 }} da paleta</p>
              <button
                class="lock-toggle-btn"
                [class.locked]="color.locked"
                (click)="paletteService.toggleLock(paletteService.activeColorIndex()!)"
              >
                {{ color.locked ? '🔒 Bloqueada (Fixada)' : '🔓 Desbloqueada' }}
              </button>
            </div>
          </div>

          <!-- Color Picker Nativo + HEX -->
          <div class="picker-section">
            <div class="native-picker-row">
              <label class="picker-label">Escolher Visualmente:</label>
              <div class="picker-input-wrap">
                <input
                  type="color"
                  [ngModel]="color.hex"
                  (ngModelChange)="onHexChange($event)"
                  class="native-color-input"
                />
                <input
                  type="text"
                  [ngModel]="color.hex"
                  (ngModelChange)="onHexChange($event)"
                  class="hex-text-input font-mono"
                  maxlength="7"
                />
              </div>
            </div>
          </div>

          <!-- Sliders de RGB -->
          <div class="channels-section">
            <h4 class="channels-title">Canais RGB (0 - 255):</h4>
            <div class="channel-row">
              <span class="chan-label red">R:</span>
              <input
                type="range"
                min="0"
                max="255"
                [ngModel]="color.rgb.r"
                (ngModelChange)="onRgbChange('r', $event)"
                class="range-slider"
              />
              <span class="chan-val font-mono">{{ color.rgb.r }}</span>
            </div>
            <div class="channel-row">
              <span class="chan-label green">G:</span>
              <input
                type="range"
                min="0"
                max="255"
                [ngModel]="color.rgb.g"
                (ngModelChange)="onRgbChange('g', $event)"
                class="range-slider"
              />
              <span class="chan-val font-mono">{{ color.rgb.g }}</span>
            </div>
            <div class="channel-row">
              <span class="chan-label blue">B:</span>
              <input
                type="range"
                min="0"
                max="255"
                [ngModel]="color.rgb.b"
                (ngModelChange)="onRgbChange('b', $event)"
                class="range-slider"
              />
              <span class="chan-val font-mono">{{ color.rgb.b }}</span>
            </div>
          </div>

          <!-- Sliders de HSL -->
          <div class="channels-section">
            <h4 class="channels-title">Canais HSL:</h4>
            <div class="channel-row">
              <span class="chan-label">Matiz (H):</span>
              <input
                type="range"
                min="0"
                max="360"
                [ngModel]="color.hsl.h"
                (ngModelChange)="onHslChange('h', $event)"
                class="range-slider slider-hue"
              />
              <span class="chan-val font-mono">{{ color.hsl.h }}°</span>
            </div>
            <div class="channel-row">
              <span class="chan-label">Saturação (S):</span>
              <input
                type="range"
                min="0"
                max="100"
                [ngModel]="color.hsl.s"
                (ngModelChange)="onHslChange('s', $event)"
                class="range-slider"
              />
              <span class="chan-val font-mono">{{ color.hsl.s }}%</span>
            </div>
            <div class="channel-row">
              <span class="chan-label">Luz (L):</span>
              <input
                type="range"
                min="5"
                max="95"
                [ngModel]="color.hsl.l"
                (ngModelChange)="onHslChange('l', $event)"
                class="range-slider"
              />
              <span class="chan-val font-mono">{{ color.hsl.l }}%</span>
            </div>
          </div>

          <!-- Conclusão -->
          <div class="modal-footer">
            <button class="done-btn" (click)="close()">
              Concluir Edição
            </button>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .modal-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(41, 37, 36, 0.55);
      backdrop-filter: blur(8px);
      z-index: 9999;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1.25rem;
    }

    .modal-card {
      width: 100%;
      max-width: 480px;
      padding: 1.75rem;
      position: relative;
      background: var(--bg-surface);
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-lg);
      max-height: 90vh;
      overflow-y: auto;
    }

    .close-btn {
      position: absolute;
      top: 1.25rem;
      right: 1.25rem;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: var(--bg-secondary);
      color: var(--text-muted);
      font-weight: 700;
    }

    .editor-header {
      display: flex;
      align-items: center;
      gap: 1.25rem;
      margin-bottom: 1.5rem;
    }

    .color-big-preview {
      width: 80px;
      height: 80px;
      border-radius: var(--radius-md);
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: var(--shadow-md);
      flex-shrink: 0;
      border: 1px solid var(--border-light);
    }

    .preview-hex {
      font-family: var(--font-mono);
      font-size: 0.82rem;
      font-weight: 800;
      background: rgba(0, 0, 0, 0.35);
      padding: 0.15rem 0.35rem;
      border-radius: var(--radius-xs);
    }

    .color-title {
      font-size: 1.25rem;
      line-height: 1.2;
    }

    .color-pos {
      font-size: 0.78rem;
      color: var(--text-muted);
      margin-top: 0.15rem;
    }

    .lock-toggle-btn {
      margin-top: 0.5rem;
      font-size: 0.75rem;
      font-weight: 700;
      padding: 0.25rem 0.65rem;
      border-radius: var(--radius-pill);
      background: var(--bg-secondary);
      border: 1px solid var(--border-light);
      color: var(--text-secondary);
    }

    .lock-toggle-btn.locked {
      background: var(--text-primary);
      color: #FFFFFF;
      border-color: var(--text-primary);
    }

    .picker-section {
      background: var(--bg-secondary);
      padding: 0.85rem 1rem;
      border-radius: var(--radius-sm);
      margin-bottom: 1.25rem;
    }

    .native-picker-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .picker-label {
      font-size: 0.85rem;
      font-weight: 700;
    }

    .picker-input-wrap {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .native-color-input {
      width: 40px;
      height: 40px;
      padding: 0;
      border: none;
      border-radius: var(--radius-xs);
      cursor: pointer;
      background: none;
    }

    .hex-text-input {
      width: 110px;
      text-transform: uppercase;
      font-weight: 700;
    }

    .channels-section {
      margin-bottom: 1.25rem;
      background: var(--bg-secondary);
      padding: 0.85rem 1rem;
      border-radius: var(--radius-sm);
    }

    .channels-title {
      font-size: 0.82rem;
      font-weight: 700;
      color: var(--text-secondary);
      margin-bottom: 0.6rem;
      text-transform: uppercase;
      letter-spacing: 0.03em;
    }

    .channel-row {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-bottom: 0.45rem;
    }

    .chan-label {
      font-size: 0.78rem;
      font-weight: 700;
      width: 85px;
    }

    .chan-val {
      font-size: 0.78rem;
      font-weight: 700;
      width: 45px;
      text-align: right;
    }

    .range-slider {
      flex: 1;
      height: 6px;
      -webkit-appearance: none;
      background: var(--border-medium);
      border-radius: var(--radius-pill);
      outline: none;
      cursor: pointer;
    }

    .range-slider::-webkit-slider-thumb {
      -webkit-appearance: none;
      width: 16px;
      height: 16px;
      border-radius: 50%;
      background: var(--cozy-terracotta);
      border: 2px solid #FFFFFF;
      box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
    }

    .slider-hue {
      background: linear-gradient(to right, #ff0000 0%, #ffff00 17%, #00ff00 33%, #00ffff 50%, #0000ff 67%, #ff00ff 83%, #ff0000 100%);
    }

    .modal-footer {
      text-align: right;
      margin-top: 1.25rem;
    }

    .done-btn {
      background: linear-gradient(135deg, #E07A5F 0%, #D48B6E 100%);
      color: #FFFFFF;
      font-weight: 700;
      font-size: 0.9rem;
      padding: 0.65rem 1.4rem;
      border-radius: var(--radius-pill);
      box-shadow: 0 4px 12px rgba(224, 122, 95, 0.3);
    }

    .done-btn:hover {
      background: #E76F51;
    }
  `]
})
export class ColorEditModalComponent {
  readonly paletteService = inject(PaletteService);

  close(): void {
    this.paletteService.activeColorIndex.set(null);
  }

  onHexChange(val: string): void {
    if (!val) return;
    let hex = val.trim();
    if (!hex.startsWith('#')) hex = '#' + hex;
    if (/^#[0-9A-Fa-f]{6}$/.test(hex)) {
      const idx = this.paletteService.activeColorIndex();
      if (idx !== null) {
        this.paletteService.updateColor(idx, hex);
      }
    }
  }

  onRgbChange(channel: 'r' | 'g' | 'b', val: any): void {
    const color = this.paletteService.activeColor();
    const idx = this.paletteService.activeColorIndex();
    if (!color || idx === null) return;

    const rgb = { ...color.rgb, [channel]: Number(val) };
    const newHex = rgbToHex(rgb.r, rgb.g, rgb.b);
    this.paletteService.updateColor(idx, newHex);
  }

  onHslChange(channel: 'h' | 's' | 'l', val: any): void {
    const color = this.paletteService.activeColor();
    const idx = this.paletteService.activeColorIndex();
    if (!color || idx === null) return;

    const hsl = { ...color.hsl, [channel]: Number(val) };
    const newHex = hslToHex(hsl.h, hsl.s, hsl.l);
    this.paletteService.updateColor(idx, newHex);
  }
}
