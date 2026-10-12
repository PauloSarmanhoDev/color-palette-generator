import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaletteService } from '../../services/palette.service';
import { ColorItem } from '../../models/color.models';

@Component({
  selector: 'app-palette-strip',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="palette-strip-wrapper">
      <div class="palette-container" [style.--columns]="paletteService.simulatedColors().length">
        @for (color of paletteService.simulatedColors(); track $index) {
          <div
            class="color-column"
            [style.background-color]="color.hex"
            [style.color]="color.textColor"
          >
            <!-- Topo: Contraste & Status -->
            <div class="column-top">
              <span
                class="contrast-badge"
                [style.background-color]="color.textColor === '#FFFFFF' ? 'rgba(0,0,0,0.35)' : 'rgba(255,255,255,0.45)'"
                [style.color]="color.textColor"
                [title]="'Contraste WCAG com branco: ' + color.contrastWithWhite + ':1 | com preto: ' + color.contrastWithBlack + ':1'"
              >
                {{ color.contrastWithWhite >= 4.5 || color.contrastWithBlack >= 4.5 ? 'AA' : 'A' }}
                {{ (color.contrastWithWhite >= 7 || color.contrastWithBlack >= 7) ? '★' : '' }}
              </span>

              @if (color.locked) {
                <span class="locked-indicator" title="Esta cor está bloqueada e não mudará ao gerar nova paleta">
                  🔒 Travada
                </span>
              }
            </div>

            <!-- Centro: Código HEX & Nome Poético -->
            <div class="column-center">
              <button
                class="hex-button"
                [style.color]="color.textColor"
                (click)="paletteService.copyText(color.hex, 'HEX Copiado')"
                title="Clique para copiar código HEX"
              >
                {{ color.hex }}
              </button>

              <p class="color-name" [style.color]="color.textColor">
                {{ color.name }}
              </p>

              <div class="color-codes-sub">
                <span
                  class="code-pill"
                  (click)="paletteService.copyText('rgb(' + color.rgb.r + ', ' + color.rgb.g + ', ' + color.rgb.b + ')', 'RGB Copiado')"
                  title="Copiar RGB"
                >
                  RGB({{ color.rgb.r }}, {{ color.rgb.g }}, {{ color.rgb.b }})
                </span>
                <span
                  class="code-pill"
                  (click)="paletteService.copyText('hsl(' + color.hsl.h + ', ' + color.hsl.s + '%, ' + color.hsl.l + '%)', 'HSL Copiado')"
                  title="Copiar HSL"
                >
                  HSL({{ color.hsl.h }}°, {{ color.hsl.s }}%, {{ color.hsl.l }}%)
                </span>
              </div>
            </div>

            <!-- Base: Ações da Cor -->
            <div class="column-bottom">
              <!-- Botão Bloquear / Destravar -->
              <button
                class="col-action-btn"
                [class.is-locked]="color.locked"
                [style.color]="color.textColor"
                [style.border-color]="color.textColor === '#FFFFFF' ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.2)'"
                (click)="paletteService.toggleLock($index)"
                [title]="color.locked ? 'Destravar cor' : 'Bloquear cor para mantê-la'"
              >
                <span class="action-icon">{{ color.locked ? '🔒' : '🔓' }}</span>
                <span class="action-label">{{ color.locked ? 'Travada' : 'Travar' }}</span>
              </button>

              <!-- Botão Editar / Ajustar -->
              <button
                class="col-action-btn"
                [style.color]="color.textColor"
                [style.border-color]="color.textColor === '#FFFFFF' ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.2)'"
                (click)="paletteService.activeColorIndex.set($index)"
                title="Editar matiz e valores desta cor"
              >
                <span class="action-icon">✏️</span>
                <span class="action-label">Editar</span>
              </button>

              <!-- Botão Copiar Rápido -->
              <button
                class="col-action-btn"
                [style.color]="color.textColor"
                [style.border-color]="color.textColor === '#FFFFFF' ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.2)'"
                (click)="paletteService.copyText(color.hex, 'Copiado')"
                title="Copiar código HEX rápido"
              >
                <span class="action-icon">📋</span>
                <span class="action-label">Copiar</span>
              </button>
            </div>
          </div>
        }
      </div>
    </section>
  `,
  styles: [`
    .palette-strip-wrapper {
      width: 100%;
      padding: 1rem 1.25rem 0.5rem 1.25rem;
      max-width: 1400px;
      margin: 0 auto;
    }

    .palette-container {
      display: flex;
      flex-direction: column;
      border-radius: var(--radius-lg);
      overflow: hidden;
      box-shadow: var(--shadow-md);
      border: 1px solid var(--border-light);
      min-height: 480px;
      position: relative;
    }

    @media (min-width: 768px) {
      .palette-container {
        flex-direction: row;
        min-height: 520px;
      }
    }

    .color-column {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 1.25rem 1rem;
      position: relative;
      transition: flex var(--transition-normal), background-color 0.3s ease;
      min-height: 120px;
    }

    @media (min-width: 768px) {
      .color-column {
        min-height: auto;
      }
      .color-column:hover {
        flex: 1.35;
      }
    }

    .column-top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 0.5rem;
      font-size: 0.75rem;
    }

    .contrast-badge {
      font-weight: 700;
      padding: 0.2rem 0.55rem;
      border-radius: var(--radius-pill);
      backdrop-filter: blur(4px);
      letter-spacing: 0.05em;
    }

    .locked-indicator {
      font-size: 0.72rem;
      font-weight: 700;
      background: rgba(0, 0, 0, 0.4);
      color: #FFFFFF;
      padding: 0.2rem 0.55rem;
      border-radius: var(--radius-pill);
      backdrop-filter: blur(4px);
    }

    .column-center {
      text-align: center;
      padding: 1rem 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 0.35rem;
    }

    .hex-button {
      font-family: var(--font-mono);
      font-size: 1.65rem;
      font-weight: 700;
      letter-spacing: 0.05em;
      padding: 0.2rem 0.5rem;
      border-radius: var(--radius-sm);
      transition: transform var(--transition-bounce), background-color var(--transition-fast);
      user-select: all;
    }

    .hex-button:hover {
      transform: scale(1.08);
      background: rgba(0, 0, 0, 0.1);
    }

    .color-name {
      font-size: 0.95rem;
      font-weight: 600;
      letter-spacing: -0.01em;
      opacity: 0.92;
      max-width: 180px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .color-codes-sub {
      display: flex;
      flex-direction: column;
      gap: 0.2rem;
      margin-top: 0.35rem;
      opacity: 0.75;
      font-size: 0.72rem;
      font-family: var(--font-mono);
    }

    .code-pill {
      cursor: pointer;
      padding: 0.15rem 0.4rem;
      border-radius: var(--radius-xs);
      transition: opacity var(--transition-fast), background-color var(--transition-fast);
    }

    .code-pill:hover {
      opacity: 1;
      background: rgba(0, 0, 0, 0.12);
    }

    .column-bottom {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.4rem;
      flex-wrap: wrap;
    }

    .col-action-btn {
      padding: 0.4rem 0.65rem;
      border-radius: var(--radius-pill);
      border: 1px solid;
      background: rgba(255, 255, 255, 0.15);
      backdrop-filter: blur(6px);
      font-size: 0.75rem;
      font-weight: 600;
      transition: all var(--transition-fast);
    }

    .col-action-btn:hover {
      background: rgba(255, 255, 255, 0.3);
      transform: translateY(-1px);
    }

    .col-action-btn.is-locked {
      background: rgba(0, 0, 0, 0.35);
      color: #FFFFFF !important;
      border-color: rgba(255, 255, 255, 0.4) !important;
    }

    .action-icon {
      font-size: 0.85rem;
      line-height: 1;
    }

    .action-label {
      display: inline;
    }

    @media (max-width: 900px) {
      .col-action-btn .action-label {
        display: none;
      }
    }
  `]
})
export class PaletteStripComponent {
  readonly paletteService = inject(PaletteService);
}
