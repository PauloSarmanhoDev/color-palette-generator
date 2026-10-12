import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PaletteService } from '../../services/palette.service';
import { HarmonyType } from '../../models/color.models';

@Component({
  selector: 'app-variations-bar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="control-bar-wrapper">
      <div class="control-bar-card">
        <!-- Esquerda: Quantidade de Cores & Harmonias -->
        <div class="controls-left">
          <!-- Quantidade 3, 5, 8 -->
          <div class="control-group">
            <span class="group-label">Cores:</span>
            <div class="count-pill-selector">
              @for (n of counts; track n) {
                <button
                  type="button"
                  class="count-pill"
                  [class.active]="paletteService.colorCount() === n"
                  (click)="paletteService.setCount(n)"
                >
                  {{ n }}
                </button>
              }
            </div>
          </div>

          <!-- Harmonia Cromática -->
          <div class="control-group">
            <span class="group-label">Harmonia:</span>
            <select
              class="harmony-select"
              [ngModel]="paletteService.harmony()"
              (ngModelChange)="onHarmonyChange($event)"
            >
              <option value="cozy">☕ Tons de Terra (Cozy)</option>
              <option value="complementary">🎯 Complementar</option>
              <option value="analogous">🌿 Análoga</option>
              <option value="monochromatic">🎨 Monocromática</option>
              <option value="triadic">🔺 Triádica</option>
              <option value="tetradic">🔷 Tetrádica</option>
              <option value="pastel">🌸 Suave / Pastel</option>
              <option value="vibrant">⚡ Vibrante & Alto Contraste</option>
              <option value="random">🎲 Harmonia Orgânica</option>
            </select>
          </div>
        </div>

        <!-- Centro: Botão Gerar Primário -->
        <div class="controls-center">
          <button
            class="generate-hero-btn"
            (click)="paletteService.generatePalette()"
            title="Gerar nova paleta (Atalho: Barra de Espaço)"
          >
            <span class="btn-sparkle">✨</span>
            <span class="btn-text">Gerar Nova Paleta</span>
            <span class="btn-shortcut-hint">[Espaço]</span>
          </button>
        </div>

        <!-- Direita: Variações Instantâneas -->
        <div class="controls-right">
          <span class="group-label">Variações:</span>
          <div class="variations-buttons">
            <button
              class="variation-btn"
              (click)="paletteService.applyVariation('lighter')"
              title="Aumentar luminosidade"
            >
              ☀️ Mais Clara
            </button>
            <button
              class="variation-btn"
              (click)="paletteService.applyVariation('darker')"
              title="Reduzir luminosidade"
            >
              🌙 Mais Escura
            </button>
            <button
              class="variation-btn"
              (click)="paletteService.applyVariation('pastel')"
              title="Tons suaves e pastéis"
            >
              🧁 Pastel
            </button>
            <button
              class="variation-btn"
              (click)="paletteService.applyVariation('vibrant')"
              title="Intensificar saturação"
            >
              🔥 Vibrante
            </button>
            <button
              class="variation-btn"
              (click)="paletteService.applyVariation('warm')"
              title="Aquecer tons cromáticos"
            >
              🍂 Quente
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .control-bar-wrapper {
      max-width: 1400px;
      margin: 0.5rem auto 1rem auto;
      padding: 0 1.25rem;
    }

    .control-bar-card {
      background: var(--bg-surface);
      border: 1px solid var(--border-light);
      border-radius: var(--radius-md);
      box-shadow: var(--shadow-sm);
      padding: 0.85rem 1.25rem;
      display: flex;
      flex-direction: column;
      gap: 1rem;
      align-items: center;
      justify-content: space-between;
    }

    @media (min-width: 1024px) {
      .control-bar-card {
        flex-direction: row;
      }
    }

    .controls-left, .controls-right {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.75rem;
      flex-wrap: wrap;
      width: 100%;
    }

    @media (min-width: 1024px) {
      .controls-left, .controls-right {
        width: auto;
        justify-content: flex-start;
      }
    }

    .control-group {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .group-label {
      font-size: 0.82rem;
      font-weight: 700;
      color: var(--text-secondary);
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }

    .count-pill-selector {
      display: flex;
      background: var(--bg-secondary);
      border: 1px solid var(--border-light);
      border-radius: var(--radius-pill);
      padding: 2px;
    }

    .count-pill {
      font-size: 0.85rem;
      font-weight: 700;
      padding: 0.25rem 0.75rem;
      border-radius: var(--radius-pill);
      color: var(--text-secondary);
      transition: all var(--transition-fast);
    }

    .count-pill.active {
      background: var(--bg-surface);
      color: var(--cozy-terracotta);
      box-shadow: var(--shadow-subtle);
    }

    .harmony-select {
      font-size: 0.85rem;
      font-weight: 600;
      padding: 0.45rem 0.8rem;
      border-radius: var(--radius-sm);
      border: 1px solid var(--border-light);
      background-color: var(--bg-secondary);
      color: var(--text-primary);
      cursor: pointer;
    }

    .controls-center {
      display: flex;
      justify-content: center;
    }

    .generate-hero-btn {
      background: linear-gradient(135deg, #E07A5F 0%, #D48B6E 100%);
      color: #FFFFFF;
      font-weight: 700;
      font-size: 0.98rem;
      padding: 0.75rem 1.6rem;
      border-radius: var(--radius-pill);
      box-shadow: 0 4px 16px rgba(224, 122, 95, 0.35);
      letter-spacing: -0.01em;
      transition: all var(--transition-bounce);
    }

    .generate-hero-btn:hover {
      transform: translateY(-2px) scale(1.02);
      box-shadow: 0 6px 22px rgba(224, 122, 95, 0.45);
      background: linear-gradient(135deg, #E76F51 0%, #E07A5F 100%);
    }

    .generate-hero-btn:active {
      transform: translateY(1px) scale(0.99);
    }

    .btn-sparkle {
      font-size: 1.1rem;
    }

    .btn-shortcut-hint {
      font-size: 0.75rem;
      font-family: var(--font-mono);
      opacity: 0.8;
      margin-left: 0.25rem;
    }

    .variations-buttons {
      display: flex;
      align-items: center;
      gap: 0.35rem;
      flex-wrap: wrap;
    }

    .variation-btn {
      font-size: 0.78rem;
      font-weight: 600;
      padding: 0.35rem 0.65rem;
      border-radius: var(--radius-pill);
      background: var(--bg-secondary);
      border: 1px solid var(--border-light);
      color: var(--text-secondary);
      transition: all var(--transition-fast);
    }

    .variation-btn:hover {
      background: var(--bg-surface);
      color: var(--text-primary);
      border-color: var(--border-medium);
      transform: translateY(-1px);
    }
  `]
})
export class VariationsBarComponent {
  readonly paletteService = inject(PaletteService);
  readonly counts: (3 | 5 | 8)[] = [3, 5, 8];

  onHarmonyChange(val: any): void {
    const harmony = val as HarmonyType;
    this.paletteService.harmony.set(harmony);
    this.paletteService.generatePalette(harmony);
  }
}
