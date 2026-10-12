import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PaletteService } from '../../services/palette.service';
import { generatePaletteFromPrompt } from '../../utils/color-utils';

@Component({
  selector: 'app-prompt-generator',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="prompt-card card-cozy">
      <div class="card-header">
        <span class="badge-tag">💡 Conceitual & Semântico</span>
        <h2 class="section-title">Paletas por Descrição e Emoção</h2>
        <p class="section-desc">
          Digite um conceito, clima ou atmosfera (ex: <em>"pôr do sol tropical"</em>, <em>"tecnologia futurista"</em>, <em>"café aconchegante"</em>) para criar combinações sintonizadas com sua ideia.
        </p>
      </div>

      <!-- Formulário de Busca Conceitual -->
      <form class="prompt-form" (submit)="onSubmit($event)">
        <div class="input-wrap">
          <span class="search-icon">✨</span>
          <input
            type="text"
            class="prompt-input"
            [(ngModel)]="promptText"
            name="promptText"
            placeholder="Ex: Pôr do sol tropical, floresta mágica, luxo minimalista, café cozy..."
            autocomplete="off"
          />
        </div>
        <button type="submit" class="submit-btn" [disabled]="!promptText.trim()">
          Gerar por Descrição
        </button>
      </form>

      <!-- Chips de Inspiração Rápida -->
      <div class="chips-section">
        <span class="chips-label">Sugestões de temas:</span>
        <div class="chips-list">
          @for (tag of promptSuggestions; track tag) {
            <button
              type="button"
              class="prompt-chip"
              (click)="useSuggestion(tag)"
            >
              {{ tag }}
            </button>
          }
        </div>
      </div>
    </div>
  `,
  styles: [`
    .prompt-card {
      padding: 1.5rem;
    }

    .card-header {
      margin-bottom: 1.25rem;
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

    .section-desc em {
      color: var(--cozy-terracotta);
      font-style: normal;
      font-weight: 600;
    }

    .prompt-form {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    @media (min-width: 640px) {
      .prompt-form {
        flex-direction: row;
      }
    }

    .input-wrap {
      flex: 1;
      position: relative;
      display: flex;
      align-items: center;
    }

    .search-icon {
      position: absolute;
      left: 1rem;
      font-size: 1.1rem;
      pointer-events: none;
    }

    .prompt-input {
      width: 100%;
      padding-left: 2.8rem;
      padding-right: 1rem;
      padding-top: 0.85rem;
      padding-bottom: 0.85rem;
      font-size: 0.95rem;
      border-radius: var(--radius-pill);
      background: var(--bg-secondary);
      border: 1px solid var(--border-light);
    }

    .prompt-input:focus {
      background: var(--bg-surface);
    }

    .submit-btn {
      background: linear-gradient(135deg, #E07A5F 0%, #D48B6E 100%);
      color: #FFFFFF;
      font-weight: 700;
      font-size: 0.92rem;
      padding: 0.85rem 1.6rem;
      border-radius: var(--radius-pill);
      white-space: nowrap;
      box-shadow: 0 4px 14px rgba(224, 122, 95, 0.3);
      transition: all var(--transition-bounce);
    }

    .submit-btn:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 6px 18px rgba(224, 122, 95, 0.4);
    }

    .submit-btn:disabled {
      opacity: 0.55;
      cursor: not-allowed;
    }

    .chips-section {
      margin-top: 1.25rem;
    }

    .chips-label {
      font-size: 0.78rem;
      font-weight: 700;
      color: var(--text-secondary);
      text-transform: uppercase;
      letter-spacing: 0.04em;
      display: block;
      margin-bottom: 0.5rem;
    }

    .chips-list {
      display: flex;
      flex-wrap: wrap;
      gap: 0.45rem;
    }

    .prompt-chip {
      background: var(--bg-secondary);
      border: 1px solid var(--border-light);
      padding: 0.35rem 0.75rem;
      border-radius: var(--radius-pill);
      font-size: 0.82rem;
      font-weight: 600;
      color: var(--text-secondary);
      transition: all var(--transition-fast);
    }

    .prompt-chip:hover {
      background: var(--bg-surface);
      color: var(--cozy-terracotta);
      border-color: var(--cozy-terracotta);
      transform: translateY(-1px);
    }
  `]
})
export class PromptGeneratorComponent {
  readonly paletteService = inject(PaletteService);
  promptText = '';

  readonly promptSuggestions: string[] = [
    'Pôr do sol tropical',
    'Tecnologia futurista',
    'Floresta mágica',
    'Luxo minimalista',
    'Café aconchegante',
    'Oceano profundo',
    'Cottagecore & Linho',
    'Vaporwave sunset',
    'Confeitaria doce',
    'Aurora boreal'
  ];

  useSuggestion(tag: string): void {
    this.promptText = tag;
    this.generateFromText(tag);
  }

  onSubmit(e: Event): void {
    e.preventDefault();
    if (!this.promptText.trim()) return;
    this.generateFromText(this.promptText.trim());
  }

  private generateFromText(query: string): void {
    const items = generatePaletteFromPrompt(query, this.paletteService.colorCount());
    const hexes = items.map(c => c.hex);
    this.paletteService.setFullPalette(hexes, query);
  }
}
