import { Component, inject, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaletteService } from '../../services/palette.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header class="header-container">
      <div class="header-content">
        <!-- Logo & Identidade Cozy -->
        <div class="logo-area">
          <div class="logo-icon" (click)="paletteService.generatePalette()" title="Clique para gerar nova paleta!">
            <span class="icon-swatch">🎨</span>
          </div>
          <div>
            <div class="brand-title-wrap">
              <h1 class="brand-title">Cromática</h1>
              <span class="cozy-badge">✨ Cozy</span>
            </div>
            <p class="brand-subtitle">Gerador de Paletas de Cores Inteligente</p>
          </div>
        </div>

        <!-- Atalho Barra de Espaço (Desktop) -->
        <div class="shortcut-pill" (click)="paletteService.generatePalette()" title="Pressione a barra de espaço para gerar!">
          <kbd class="kbd-key">Espaço</kbd>
          <span class="kbd-text">para gerar nova paleta</span>
        </div>

        <!-- Barra de Ações Rápidas -->
        <div class="actions-area">
          <!-- Som Toggle -->
          <button
            class="action-btn"
            [class.muted]="!paletteService.soundEnabled()"
            (click)="paletteService.toggleSound()"
            [title]="paletteService.soundEnabled() ? 'Desativar sons' : 'Ativar sons acústicos'"
          >
            <span class="btn-icon">{{ paletteService.soundEnabled() ? '🔊' : '🔇' }}</span>
          </button>

          <!-- Salvar Favorito Rápido -->
          <button
            class="action-btn save-btn"
            (click)="paletteService.saveToFavorites()"
            title="Salvar paleta atual nos favoritos"
          >
            <span class="btn-icon">❤️</span>
            <span class="btn-label-desktop">Favoritar</span>
          </button>

          <!-- Compartilhar Link -->
          <button
            class="action-btn"
            (click)="copyShareUrl()"
            title="Copiar link compartilhável da paleta"
          >
            <span class="btn-icon">🔗</span>
            <span class="btn-label-desktop">Compartilhar</span>
          </button>

          <!-- Autor / Sobre -->
          <button
            class="action-btn author-btn"
            (click)="openAuthor.emit()"
            title="Informações do desenvolvedor Paulo Sarmanho"
          >
            <span class="avatar-dot">☕</span>
            <span class="btn-label-desktop">Desenvolvedor</span>
          </button>
        </div>
      </div>
    </header>
  `,
  styles: [`
    .header-container {
      background: var(--bg-surface-translucent);
      backdrop-filter: blur(14px);
      -webkit-backdrop-filter: blur(14px);
      border-bottom: 1px solid var(--border-light);
      position: sticky;
      top: 0;
      z-index: 100;
      padding: 0.75rem 1.25rem;
      transition: all var(--transition-normal);
    }

    .header-content {
      max-width: 1400px;
      margin: 0 auto;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
    }

    .logo-area {
      display: flex;
      align-items: center;
      gap: 0.85rem;
    }

    .logo-icon {
      width: 44px;
      height: 44px;
      border-radius: var(--radius-md);
      background: linear-gradient(135deg, #E07A5F 0%, #F4A261 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.35rem;
      box-shadow: 0 4px 12px rgba(224, 122, 95, 0.25);
      cursor: pointer;
      transition: transform var(--transition-bounce);
      user-select: none;
    }

    .logo-icon:hover {
      transform: scale(1.08) rotate(-4deg);
    }

    .brand-title-wrap {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .brand-title {
      font-family: var(--font-serif);
      font-size: 1.45rem;
      font-weight: 700;
      color: var(--text-primary);
      letter-spacing: -0.02em;
    }

    .cozy-badge {
      background: var(--bg-accent-soft);
      color: var(--cozy-terracotta);
      font-size: 0.7rem;
      font-weight: 700;
      padding: 0.15rem 0.55rem;
      border-radius: var(--radius-pill);
      border: 1px solid rgba(224, 122, 95, 0.2);
    }

    .brand-subtitle {
      font-size: 0.78rem;
      color: var(--text-muted);
      margin-top: -2px;
    }

    .shortcut-pill {
      display: none;
      align-items: center;
      gap: 0.5rem;
      background: var(--bg-secondary);
      border: 1px solid var(--border-light);
      padding: 0.35rem 0.85rem;
      border-radius: var(--radius-pill);
      cursor: pointer;
      transition: all var(--transition-fast);
    }

    @media (min-width: 900px) {
      .shortcut-pill {
        display: inline-flex;
      }
    }

    .shortcut-pill:hover {
      background: var(--bg-muted);
      border-color: var(--border-medium);
      transform: translateY(-1px);
    }

    .kbd-key {
      font-family: var(--font-mono);
      font-size: 0.72rem;
      font-weight: 700;
      background: var(--bg-surface);
      border: 1px solid var(--border-medium);
      padding: 0.15rem 0.45rem;
      border-radius: var(--radius-xs);
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
      color: var(--text-primary);
    }

    .kbd-text {
      font-size: 0.78rem;
      color: var(--text-secondary);
      font-weight: 500;
    }

    .actions-area {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .action-btn {
      background: var(--bg-secondary);
      border: 1px solid var(--border-light);
      padding: 0.5rem 0.85rem;
      border-radius: var(--radius-pill);
      font-size: 0.85rem;
      font-weight: 600;
      color: var(--text-secondary);
      transition: all var(--transition-fast);
    }

    .action-btn:hover {
      background: var(--bg-surface);
      border-color: var(--border-medium);
      color: var(--text-primary);
      transform: translateY(-1px);
      box-shadow: var(--shadow-sm);
    }

    .action-btn.save-btn:hover {
      color: #E11D48;
      border-color: #FECDD3;
      background: #FFF1F2;
    }

    .action-btn.author-btn {
      background: var(--bg-accent-soft);
      border-color: rgba(224, 122, 95, 0.25);
      color: var(--cozy-terracotta);
    }

    .action-btn.author-btn:hover {
      background: #FCE7D6;
    }

    .btn-icon {
      font-size: 1rem;
      line-height: 1;
    }

    .avatar-dot {
      font-size: 0.95rem;
    }

    .btn-label-desktop {
      display: none;
    }

    @media (min-width: 640px) {
      .btn-label-desktop {
        display: inline;
      }
    }
  `]
})
export class HeaderComponent {
  readonly paletteService = inject(PaletteService);
  readonly openAuthor = output<void>();

  copyShareUrl(): void {
    const url = this.paletteService.getShareUrl();
    this.paletteService.copyText(url, 'Link copiado');
  }
}
