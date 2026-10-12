import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaletteService } from '../../services/palette.service';
import { THEME_PRESETS, COLOR_CHALLENGES, ThemePreset } from '../../utils/themes-and-challenges';
import { ColorChallenge } from '../../models/color.models';

@Component({
  selector: 'app-themes-and-challenges',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="themes-card card-cozy">
      <!-- Cabeçalho -->
      <div class="card-header">
        <span class="badge-tag">🎨 Estações, Estéticas & Jogos</span>
        <h2 class="section-title">Temas Clássicos e Desafio Criativo</h2>
        <p class="section-desc">
          Inspire-se com atmosferas atemporais ou teste suas habilidades de design com desafios de cores guiados.
        </p>
      </div>

      <!-- DESAFIO DE CORES CRIATIVO (GAME / CHALLENGE) -->
      <div class="challenge-box">
        <div class="challenge-top">
          <div class="challenge-badge">
            <span>🎯 Desafio de Cores do Dia</span>
            <span class="diff-tag">{{ activeChallenge().difficulty }}</span>
          </div>
          <button class="new-challenge-btn" (click)="drawNewChallenge()">
            🎲 Sortear Novo Desafio
          </button>
        </div>

        <div class="challenge-body">
          <h3 class="challenge-title">{{ activeChallenge().title }}</h3>
          <p class="challenge-desc">{{ activeChallenge().description }}</p>

          <div class="challenge-rule-box">
            <strong>Regra Criativa:</strong>
            <span>Você só pode utilizar as cores atualmente ativas na sua paleta do topo!</span>
          </div>

          <div class="challenge-actions">
            <button class="challenge-apply-btn" (click)="generateForChallenge()">
              ✨ Gerar Paleta para este Desafio
            </button>
            <button class="challenge-finish-btn" (click)="completeChallenge()">
              🎉 Aceitar e Concluir Desafio!
            </button>
          </div>
        </div>
      </div>

      <!-- ESTAÇÕES DO ANO -->
      <div class="presets-section">
        <h3 class="group-title">🍂 Paletas por Estação do Ano</h3>
        <div class="presets-grid">
          @for (preset of seasonsPresets; track preset.id) {
            <div class="preset-card" (click)="applyPreset(preset)">
              <div class="preset-card-top">
                <strong>{{ preset.name }}</strong>
                <p>{{ preset.description }}</p>
              </div>
              <div class="preset-colors-strip">
                @for (c of preset.colors; track c) {
                  <span class="color-mini-bar" [style.background-color]="c"></span>
                }
              </div>
            </div>
          }
        </div>
      </div>

      <!-- ESTÉTICAS & SUBCULTURAS -->
      <div class="presets-section">
        <h3 class="group-title">✨ Estéticas, Tempos & Subculturas</h3>
        <div class="presets-grid">
          @for (preset of aestheticPresets; track preset.id) {
            <div class="preset-card" (click)="applyPreset(preset)">
              <div class="preset-card-top">
                <strong>{{ preset.name }}</strong>
                <p>{{ preset.description }}</p>
              </div>
              <div class="preset-colors-strip">
                @for (c of preset.colors; track c) {
                  <span class="color-mini-bar" [style.background-color]="c"></span>
                }
              </div>
            </div>
          }
        </div>
      </div>
    </div>
  `,
  styles: [`
    .themes-card {
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

    /* Desafio */
    .challenge-box {
      background: linear-gradient(135deg, #FAF3EE 0%, #F5EAE1 100%);
      border: 2px dashed rgba(224, 122, 95, 0.4);
      border-radius: var(--radius-md);
      padding: 1.5rem;
      margin-bottom: 2rem;
      box-shadow: var(--shadow-sm);
    }

    .challenge-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.75rem;
      flex-wrap: wrap;
      gap: 0.5rem;
    }

    .challenge-badge {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.82rem;
      font-weight: 700;
      color: var(--cozy-terracotta);
    }

    .diff-tag {
      background: rgba(224, 122, 95, 0.15);
      padding: 0.15rem 0.55rem;
      border-radius: var(--radius-pill);
      font-size: 0.72rem;
    }

    .new-challenge-btn {
      background: var(--bg-surface);
      border: 1px solid var(--border-medium);
      padding: 0.35rem 0.8rem;
      border-radius: var(--radius-pill);
      font-size: 0.8rem;
      font-weight: 600;
      color: var(--text-secondary);
    }

    .new-challenge-btn:hover {
      color: var(--cozy-terracotta);
      border-color: var(--cozy-terracotta);
    }

    .challenge-title {
      font-size: 1.25rem;
      font-family: var(--font-serif);
      margin-bottom: 0.35rem;
    }

    .challenge-desc {
      font-size: 0.92rem;
      color: var(--text-secondary);
      line-height: 1.45;
    }

    .challenge-rule-box {
      margin: 1rem 0;
      background: rgba(255, 255, 255, 0.7);
      padding: 0.65rem 1rem;
      border-radius: var(--radius-sm);
      font-size: 0.82rem;
      border-left: 3px solid var(--cozy-terracotta);
    }

    .challenge-rule-box strong {
      color: var(--cozy-terracotta);
      margin-right: 0.35rem;
    }

    .challenge-actions {
      display: flex;
      gap: 0.75rem;
      flex-wrap: wrap;
    }

    .challenge-apply-btn {
      background: var(--bg-surface);
      border: 1px solid var(--border-medium);
      color: var(--text-primary);
      padding: 0.55rem 1.1rem;
      border-radius: var(--radius-pill);
      font-size: 0.85rem;
      font-weight: 700;
    }

    .challenge-apply-btn:hover {
      border-color: var(--cozy-terracotta);
      color: var(--cozy-terracotta);
    }

    .challenge-finish-btn {
      background: linear-gradient(135deg, #E07A5F 0%, #D48B6E 100%);
      color: #FFFFFF;
      padding: 0.55rem 1.25rem;
      border-radius: var(--radius-pill);
      font-size: 0.85rem;
      font-weight: 700;
      box-shadow: 0 4px 12px rgba(224, 122, 95, 0.3);
    }

    .challenge-finish-btn:hover {
      transform: translateY(-1px);
      box-shadow: 0 6px 16px rgba(224, 122, 95, 0.4);
    }

    /* Presets */
    .presets-section {
      margin-top: 1.5rem;
    }

    .group-title {
      font-size: 1.05rem;
      font-weight: 700;
      margin-bottom: 0.85rem;
    }

    .presets-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 0.85rem;
    }

    @media (min-width: 768px) {
      .presets-grid {
        grid-template-columns: repeat(4, 1fr);
      }
    }

    .preset-card {
      background: var(--bg-secondary);
      border: 1px solid var(--border-light);
      border-radius: var(--radius-md);
      overflow: hidden;
      cursor: pointer;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      transition: all var(--transition-fast);
    }

    .preset-card:hover {
      background: var(--bg-surface);
      border-color: var(--cozy-terracotta);
      transform: translateY(-2px);
      box-shadow: var(--shadow-sm);
    }

    .preset-card-top {
      padding: 0.85rem;
    }

    .preset-card-top strong {
      display: block;
      font-size: 0.88rem;
      color: var(--text-primary);
    }

    .preset-card-top p {
      font-size: 0.72rem;
      color: var(--text-muted);
      margin-top: 0.2rem;
      line-height: 1.3;
    }

    .preset-colors-strip {
      display: flex;
      height: 28px;
    }

    .color-mini-bar {
      flex: 1;
      height: 100%;
    }
  `]
})
export class ThemesAndChallengesComponent {
  readonly paletteService = inject(PaletteService);

  readonly seasonsPresets = THEME_PRESETS.filter(p => p.category === 'Estação');
  readonly aestheticPresets = THEME_PRESETS.filter(p => p.category === 'Estética');

  readonly activeChallenge = signal<ColorChallenge>(COLOR_CHALLENGES[0]);

  drawNewChallenge(): void {
    const list = COLOR_CHALLENGES;
    const current = this.activeChallenge();
    let next = list[Math.floor(Math.random() * list.length)];
    while (next.title === current.title && list.length > 1) {
      next = list[Math.floor(Math.random() * list.length)];
    }
    this.activeChallenge.set(next);
  }

  generateForChallenge(): void {
    this.paletteService.generatePalette('cozy');
    this.paletteService.showToast('Nova paleta sorteada para o desafio!', 'info');
  }

  completeChallenge(): void {
    this.paletteService.triggerCelebration();
    this.paletteService.showToast('Parabéns! Desafio criativo concluído com sucesso! 🏆', 'success');
  }

  applyPreset(preset: ThemePreset): void {
    this.paletteService.setFullPalette(preset.colors, preset.name);
  }
}
