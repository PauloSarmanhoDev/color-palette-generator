import { Component, inject, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaletteService } from '../../services/palette.service';
import { PwaService } from '../../services/pwa.service';

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
            <p class="brand-subtitle">Gerador de Paletas de Cores</p>
          </div>
        </div>

        <!-- Atalho Barra de Espaço (Desktop) -->
        <div class="shortcut-pill" (click)="paletteService.generatePalette()" title="Pressione a barra de espaço para gerar!">
          <kbd class="kbd-key">Espaço</kbd>
          <span class="kbd-text">para gerar nova paleta</span>
        </div>

        <!-- Ações Desktop (>= 768px) -->
        <div class="actions-area-desktop">
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

          <!-- Botão Instalar PWA -->
          <button
            class="action-btn pwa-btn"
            (click)="pwaService.installApp()"
            [title]="pwaService.isInstalled() ? 'Aplicativo instalado!' : 'Instalar Cromática como aplicativo no seu dispositivo'"
          >
            <span class="btn-icon">📲</span>
            <span class="btn-label-desktop">{{ pwaService.isInstalled() ? 'Instalado' : 'Instalar App' }}</span>
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

        <!-- Ações Mobile (< 768px): Compacto e sem overflow -->
        <div class="actions-area-mobile">
          <!-- Botão Instalar Direto -->
          <button
            class="mobile-quick-btn pwa-quick"
            (click)="pwaService.installApp()"
            [title]="pwaService.isInstalled() ? 'App Instalado' : 'Instalar App'"
          >
            <span class="btn-icon">📲</span>
            <span class="quick-text">{{ pwaService.isInstalled() ? 'Instalado' : 'Instalar' }}</span>
          </button>

          <!-- Botão Menu Hambúrguer -->
          <button
            class="mobile-menu-toggle"
            [class.active]="mobileMenuOpen()"
            (click)="toggleMobileMenu()"
            title="Abrir menu de opções"
            aria-label="Abrir menu de opções"
          >
            <span class="menu-icon">{{ mobileMenuOpen() ? '✕' : '☰' }}</span>
          </button>
        </div>
      </div>

      <!-- Menu Dropdown Mobile com Transição Suave -->
      @if (mobileMenuOpen()) {
        <div class="mobile-menu-overlay" (click)="closeMobileMenu()">
          <div class="mobile-menu-drawer animate-scale-in" (click)="$event.stopPropagation()">
            <div class="mobile-menu-header">
              <span class="menu-header-title">Menu de Opções</span>
              <button class="menu-close-icon" (click)="closeMobileMenu()">✕</button>
            </div>

            <div class="mobile-menu-items">
              <!-- Instalar App -->
              <button class="mobile-menu-item highlight" (click)="pwaService.installApp(); closeMobileMenu()">
                <span class="item-icon">📲</span>
                <div class="item-texts">
                  <strong>Instalar Cromática</strong>
                  <span>{{ pwaService.isInstalled() ? 'Aplicativo já instalado' : 'Usar como app no celular' }}</span>
                </div>
              </button>

              <!-- Favoritar -->
              <button class="mobile-menu-item" (click)="paletteService.saveToFavorites(); closeMobileMenu()">
                <span class="item-icon">❤️</span>
                <div class="item-texts">
                  <strong>Favoritar Paleta Atual</strong>
                  <span>Salvar na biblioteca pessoal</span>
                </div>
              </button>

              <!-- Compartilhar -->
              <button class="mobile-menu-item" (click)="copyShareUrl(); closeMobileMenu()">
                <span class="item-icon">🔗</span>
                <div class="item-texts">
                  <strong>Compartilhar Paleta</strong>
                  <span>Copiar link com as cores atuais</span>
                </div>
              </button>

              <!-- Som -->
              <button class="mobile-menu-item" (click)="paletteService.toggleSound()">
                <span class="item-icon">{{ paletteService.soundEnabled() ? '🔊' : '🔇' }}</span>
                <div class="item-texts">
                  <strong>Sons Acústicos</strong>
                  <span>{{ paletteService.soundEnabled() ? 'Ativados (toque para silenciar)' : 'Silenciados (toque para ativar)' }}</span>
                </div>
              </button>

              <!-- Autor / Desenvolvedor -->
              <button class="mobile-menu-item author" (click)="openAuthor.emit(); closeMobileMenu()">
                <span class="item-icon">☕</span>
                <div class="item-texts">
                  <strong>Sobre o Desenvolvedor</strong>
                  <span>Paulo Sarmanho • Apoiar via PIX</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      }
    </header>
  `,
  styles: [`
    .header-container {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      width: 100%;
      z-index: 1000;
      background: var(--bg-surface-translucent);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border-bottom: 1px solid var(--border-light);
      box-shadow: 0 2px 10px rgba(41, 37, 36, 0.05);
      padding: 0.65rem 1rem;
      transition: all var(--transition-normal);
    }

    @media (min-width: 768px) {
      .header-container {
        padding: 0.75rem 1.25rem;
      }
    }

    .header-content {
      max-width: 1400px;
      margin: 0 auto;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 0.75rem;
    }

    /* Logo */
    .logo-area {
      display: flex;
      align-items: center;
      gap: 0.65rem;
      flex-shrink: 0;
    }

    .logo-icon {
      width: 38px;
      height: 38px;
      border-radius: var(--radius-sm);
      background: linear-gradient(135deg, #E07A5F 0%, #F4A261 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.2rem;
      box-shadow: 0 4px 12px rgba(224, 122, 95, 0.25);
      cursor: pointer;
      transition: transform var(--transition-bounce);
      user-select: none;
    }

    @media (min-width: 768px) {
      .logo-icon {
        width: 44px;
        height: 44px;
        border-radius: var(--radius-md);
        font-size: 1.35rem;
      }
    }

    .logo-icon:hover {
      transform: scale(1.08) rotate(-4deg);
    }

    .brand-title-wrap {
      display: flex;
      align-items: center;
      gap: 0.4rem;
    }

    .brand-title {
      font-family: var(--font-serif);
      font-size: 1.25rem;
      font-weight: 700;
      color: var(--text-primary);
      letter-spacing: -0.02em;
      line-height: 1;
    }

    @media (min-width: 768px) {
      .brand-title {
        font-size: 1.45rem;
      }
    }

    .cozy-badge {
      background: var(--bg-accent-soft);
      color: var(--cozy-terracotta);
      font-size: 0.68rem;
      font-weight: 700;
      padding: 0.12rem 0.45rem;
      border-radius: var(--radius-pill);
      border: 1px solid rgba(224, 122, 95, 0.2);
    }

    .brand-subtitle {
      display: none;
      font-size: 0.78rem;
      color: var(--text-muted);
      margin-top: 2px;
    }

    @media (min-width: 860px) {
      .brand-subtitle {
        display: block;
      }
    }

    /* Shortcut Pill (Desktop) */
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

    @media (min-width: 1040px) {
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

    /* Desktop Actions (>= 768px) */
    .actions-area-desktop {
      display: none;
      align-items: center;
      gap: 0.5rem;
    }

    @media (min-width: 768px) {
      .actions-area-desktop {
        display: flex;
      }
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

    .action-btn.pwa-btn {
      background: var(--bg-accent-soft);
      border-color: rgba(224, 122, 95, 0.35);
      color: var(--cozy-terracotta);
      font-weight: 700;
    }

    .action-btn.pwa-btn:hover {
      background: #FCE7D6;
      border-color: var(--cozy-terracotta);
      transform: translateY(-1px);
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
      display: inline;
    }

    /* Mobile Actions (< 768px) */
    .actions-area-mobile {
      display: flex;
      align-items: center;
      gap: 0.45rem;
    }

    @media (min-width: 768px) {
      .actions-area-mobile {
        display: none;
      }
    }

    .mobile-quick-btn {
      display: inline-flex;
      align-items: center;
      gap: 0.3rem;
      background: var(--bg-accent-soft);
      border: 1px solid rgba(224, 122, 95, 0.3);
      color: var(--cozy-terracotta);
      font-size: 0.78rem;
      font-weight: 700;
      padding: 0.4rem 0.65rem;
      border-radius: var(--radius-pill);
      transition: all var(--transition-fast);
    }

    .mobile-quick-btn:hover {
      background: #FCE7D6;
    }

    .mobile-menu-toggle {
      width: 38px;
      height: 38px;
      border-radius: var(--radius-pill);
      background: var(--bg-secondary);
      border: 1px solid var(--border-light);
      color: var(--text-primary);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.15rem;
      transition: all var(--transition-fast);
    }

    .mobile-menu-toggle.active {
      background: var(--text-primary);
      color: #FFFFFF;
      border-color: var(--text-primary);
    }

    /* Overlay & Drawer do Menu Mobile */
    .mobile-menu-overlay {
      position: fixed;
      top: 52px;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(41, 37, 36, 0.45);
      backdrop-filter: blur(4px);
      z-index: 1001;
      display: flex;
      justify-content: flex-end;
      padding: 0.75rem 1rem;
    }

    .mobile-menu-drawer {
      width: 100%;
      max-width: 320px;
      background: var(--bg-surface);
      border: 1px solid var(--border-light);
      border-radius: var(--radius-md);
      box-shadow: var(--shadow-lg);
      padding: 1rem;
      height: fit-content;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .mobile-menu-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 0.5rem;
      border-bottom: 1px solid var(--border-light);
    }

    .menu-header-title {
      font-size: 0.85rem;
      font-weight: 700;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }

    .menu-close-icon {
      font-size: 0.9rem;
      font-weight: 700;
      color: var(--text-muted);
      padding: 0.2rem 0.5rem;
    }

    .mobile-menu-items {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .mobile-menu-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.75rem;
      border-radius: var(--radius-sm);
      background: var(--bg-secondary);
      border: 1px solid var(--border-light);
      text-align: left;
      width: 100%;
      transition: all var(--transition-fast);
    }

    .mobile-menu-item:hover {
      background: var(--bg-surface);
      border-color: var(--cozy-terracotta);
    }

    .mobile-menu-item.highlight {
      background: var(--bg-accent-soft);
      border-color: rgba(224, 122, 95, 0.3);
    }

    .mobile-menu-item.author {
      background: #F9F5F0;
      border-color: var(--border-medium);
    }

    .item-icon {
      font-size: 1.3rem;
      flex-shrink: 0;
    }

    .item-texts {
      display: flex;
      flex-direction: column;
    }

    .item-texts strong {
      font-size: 0.85rem;
      color: var(--text-primary);
    }

    .item-texts span {
      font-size: 0.72rem;
      color: var(--text-muted);
    }
  `]
})
export class HeaderComponent {
  readonly paletteService = inject(PaletteService);
  readonly pwaService = inject(PwaService);
  readonly openAuthor = output<void>();

  readonly mobileMenuOpen = signal<boolean>(false);

  toggleMobileMenu(): void {
    this.mobileMenuOpen.update(v => !v);
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen.set(false);
  }

  copyShareUrl(): void {
    const url = this.paletteService.getShareUrl();
    this.paletteService.copyText(url, 'Link copiado');
  }
}
