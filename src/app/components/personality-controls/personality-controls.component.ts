import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PaletteService } from '../../services/palette.service';
import { BlindnessType } from '../../models/color.models';

@Component({
  selector: 'app-personality-controls',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="personality-card card-cozy">
      <div class="card-header">
        <div class="header-titles">
          <span class="badge-tag">🎛️ Personalidade & Acessibilidade</span>
          <h2 class="section-title">Ajuste Fino da Atmosfera Visual</h2>
          <p class="section-desc">
            Altere saturação, calor térmico, luminosidade e teste percepção para pessoas com daltonismo em tempo real.
          </p>
        </div>
        <button class="reset-btn" (click)="paletteService.resetPersonality()">
          ↺ Restaurar
        </button>
      </div>

      <!-- Sliders de Personalidade -->
      <div class="sliders-grid">
        <!-- 1. Saturação -->
        <div class="slider-item">
          <div class="slider-top">
            <span class="slider-name">💧 Saturação</span>
            <span class="slider-val">{{ paletteService.personality().saturation > 0 ? '+' : '' }}{{ paletteService.personality().saturation }}%</span>
          </div>
          <input
            type="range"
            min="-100"
            max="100"
            step="5"
            [ngModel]="paletteService.personality().saturation"
            (ngModelChange)="onSliderChange('saturation', $event)"
            class="range-slider"
          />
          <div class="slider-hints">
            <span>Dessaturado</span>
            <span>Ultra Vivo</span>
          </div>
        </div>

        <!-- 2. Luminosidade -->
        <div class="slider-item">
          <div class="slider-top">
            <span class="slider-name">💡 Luminosidade</span>
            <span class="slider-val">{{ paletteService.personality().lightness > 0 ? '+' : '' }}{{ paletteService.personality().lightness }}%</span>
          </div>
          <input
            type="range"
            min="-50"
            max="50"
            step="5"
            [ngModel]="paletteService.personality().lightness"
            (ngModelChange)="onSliderChange('lightness', $event)"
            class="range-slider"
          />
          <div class="slider-hints">
            <span>Escuro / Noturno</span>
            <span>Claro / Arejado</span>
          </div>
        </div>

        <!-- 3. Temperatura (Kelvin) -->
        <div class="slider-item">
          <div class="slider-top">
            <span class="slider-name">🌡️ Temperatura Térmica</span>
            <span class="slider-val">
              {{ paletteService.personality().temperature < 0 ? 'Fria ❄️' : paletteService.personality().temperature > 0 ? 'Quente ☀️' : 'Neutra' }}
            </span>
          </div>
          <input
            type="range"
            min="-100"
            max="100"
            step="10"
            [ngModel]="paletteService.personality().temperature"
            (ngModelChange)="onSliderChange('temperature', $event)"
            class="range-slider slider-temp"
          />
          <div class="slider-hints">
            <span>Azul / Fria</span>
            <span>Âmbar / Quente</span>
          </div>
        </div>

        <!-- 4. Contraste -->
        <div class="slider-item">
          <div class="slider-top">
            <span class="slider-name">🌓 Contraste Dinâmico</span>
            <span class="slider-val">{{ paletteService.personality().contrast > 0 ? '+' : '' }}{{ paletteService.personality().contrast }}%</span>
          </div>
          <input
            type="range"
            min="-50"
            max="50"
            step="5"
            [ngModel]="paletteService.personality().contrast"
            (ngModelChange)="onSliderChange('contrast', $event)"
            class="range-slider"
          />
          <div class="slider-hints">
            <span>Suave / Fade</span>
            <span>Alto Impacto</span>
          </div>
        </div>
      </div>

      <!-- Simulador de Daltonismo -->
      <div class="blindness-section">
        <div class="blindness-header">
          <span class="blindness-title">👁️ Simulador de Daltonismo:</span>
          <span class="blindness-sub">Veja como pessoas com diferentes visões enxergam esta paleta</span>
        </div>
        <div class="blindness-buttons">
          @for (filter of blindnessOptions; track filter.id) {
            <button
              type="button"
              class="blindness-pill"
              [class.active]="paletteService.blindnessFilter() === filter.id"
              (click)="setBlindness(filter.id)"
            >
              {{ filter.label }}
            </button>
          }
        </div>
      </div>
    </div>
  `,
  styles: [`
    .personality-card {
      padding: 1.5rem;
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 1.25rem;
      gap: 1rem;
    }

    .section-title {
      font-size: 1.35rem;
      margin-top: 0.35rem;
    }

    .section-desc {
      font-size: 0.88rem;
      color: var(--text-secondary);
      margin-top: 0.2rem;
    }

    .reset-btn {
      background: var(--bg-secondary);
      border: 1px solid var(--border-light);
      padding: 0.45rem 0.85rem;
      border-radius: var(--radius-pill);
      font-size: 0.82rem;
      font-weight: 600;
      color: var(--text-secondary);
      white-space: nowrap;
    }

    .reset-btn:hover {
      background: var(--bg-surface);
      color: var(--cozy-terracotta);
      border-color: var(--cozy-terracotta);
    }

    .sliders-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 1.25rem;
    }

    @media (min-width: 640px) {
      .sliders-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    .slider-item {
      background: var(--bg-secondary);
      border: 1px solid var(--border-light);
      padding: 1rem;
      border-radius: var(--radius-md);
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .slider-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .slider-name {
      font-size: 0.88rem;
      font-weight: 700;
      color: var(--text-primary);
    }

    .slider-val {
      font-family: var(--font-mono);
      font-size: 0.8rem;
      font-weight: 700;
      color: var(--cozy-terracotta);
      background: var(--bg-surface);
      padding: 0.15rem 0.5rem;
      border-radius: var(--radius-xs);
    }

    .range-slider {
      width: 100%;
      height: 6px;
      -webkit-appearance: none;
      background: var(--border-medium);
      border-radius: var(--radius-pill);
      outline: none;
      padding: 0;
      border: none;
      cursor: pointer;
    }

    .range-slider::-webkit-slider-thumb {
      -webkit-appearance: none;
      width: 18px;
      height: 18px;
      border-radius: 50%;
      background: var(--cozy-terracotta);
      border: 2px solid #FFFFFF;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
      cursor: pointer;
      transition: transform var(--transition-fast);
    }

    .range-slider::-webkit-slider-thumb:hover {
      transform: scale(1.2);
    }

    .slider-hints {
      display: flex;
      justify-content: space-between;
      font-size: 0.72rem;
      color: var(--text-muted);
    }

    .blindness-section {
      margin-top: 1.5rem;
      padding-top: 1.25rem;
      border-top: 1px solid var(--border-light);
    }

    .blindness-header {
      margin-bottom: 0.65rem;
    }

    .blindness-title {
      font-size: 0.92rem;
      font-weight: 700;
      color: var(--text-primary);
      margin-right: 0.5rem;
    }

    .blindness-sub {
      font-size: 0.8rem;
      color: var(--text-muted);
    }

    .blindness-buttons {
      display: flex;
      flex-wrap: wrap;
      gap: 0.45rem;
    }

    .blindness-pill {
      background: var(--bg-secondary);
      border: 1px solid var(--border-light);
      padding: 0.4rem 0.8rem;
      border-radius: var(--radius-pill);
      font-size: 0.82rem;
      font-weight: 600;
      color: var(--text-secondary);
      transition: all var(--transition-fast);
    }

    .blindness-pill:hover {
      background: var(--bg-surface);
      color: var(--text-primary);
    }

    .blindness-pill.active {
      background: var(--text-primary);
      color: #FFFFFF;
      border-color: var(--text-primary);
    }
  `]
})
export class PersonalityControlsComponent {
  readonly paletteService = inject(PaletteService);

  readonly blindnessOptions: { id: BlindnessType; label: string }[] = [
    { id: 'normal', label: 'Visão Normal' },
    { id: 'protanopia', label: 'Protanopia (Sem Vermelho)' },
    { id: 'deuteranopia', label: 'Deuteranopia (Sem Verde)' },
    { id: 'tritanopia', label: 'Tritanopia (Sem Azul)' },
    { id: 'achromatopsia', label: 'Acromatopsia (Preto & Branco)' }
  ];

  onSliderChange(field: 'saturation' | 'lightness' | 'temperature' | 'contrast', val: number): void {
    this.paletteService.updatePersonality(field, Number(val));
  }

  setBlindness(type: BlindnessType): void {
    this.paletteService.blindnessFilter.set(type);
    if (type !== 'normal') {
      this.paletteService.showToast(`Filtro "${type}" ativado na paleta`, 'info');
    }
  }
}
