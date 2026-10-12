import { Component, inject, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaletteService } from '../../services/palette.service';

@Component({
  selector: 'app-author-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="modal-backdrop" (click)="close.emit()">
      <div class="modal-card card-cozy animate-scale-in" (click)="$event.stopPropagation()">
        <!-- Fechar -->
        <button class="close-btn" (click)="close.emit()" title="Fechar modal">✕</button>

        <!-- Topo do Perfil -->
        <div class="author-header">
          <div class="author-avatar-wrap">
            <div class="author-avatar">☕</div>
            <span class="online-indicator" title="Desenvolvedor Ativo"></span>
          </div>

          <div class="author-identity">
            <h2 class="author-name">Paulo Sarmanho</h2>
            <p class="author-title">Desenvolvedor Frontend & Arquiteto de Software</p>
            <span class="author-badge">✨ Criador do Cromática</span>
          </div>
        </div>

        <!-- Descrição Cozy -->
        <p class="author-bio">
          Desenvolvido com carinho e precisão para trazer um ambiente aconchegante, estético e funcional para designers, desenvolvedores e entusiastas de cores.
        </p>

        <!-- Redes e Contatos -->
        <div class="social-links-grid">
          <a
            href="https://www.linkedin.com/in/paulo-sarmanho/"
            target="_blank"
            rel="noopener noreferrer"
            class="social-link-item linkedin"
          >
            <span class="social-icon">💼</span>
            <div class="social-meta">
              <strong>LinkedIn</strong>
              <span>/in/paulo-sarmanho</span>
            </div>
          </a>

          <a
            href="https://github.com/PauloSarmanhoDev"
            target="_blank"
            rel="noopener noreferrer"
            class="social-link-item github"
          >
            <span class="social-icon">🐙</span>
            <div class="social-meta">
              <strong>GitHub</strong>
              <span>@PauloSarmanhoDev</span>
            </div>
          </a>

          <a
            href="https://paulo-sarmanho-dev.netlify.app/"
            target="_blank"
            rel="noopener noreferrer"
            class="social-link-item portfolio"
          >
            <span class="social-icon">🌐</span>
            <div class="social-meta">
              <strong>Portfólio Oficial</strong>
              <span>paulo-sarmanho-dev</span>
            </div>
          </a>

          <a
            href="mailto:paulodetarso99@live.com"
            class="social-link-item email"
          >
            <span class="social-icon">✉️</span>
            <div class="social-meta">
              <strong>E-mail Direto</strong>
              <span>paulodetarso99&#64;live.com</span>
            </div>
          </a>
        </div>

        <!-- Apoio / Chave PIX -->
        <div class="pix-card">
          <div class="pix-header">
            <span class="pix-tag">☕ Apoie este Projeto</span>
            <h4 class="pix-title">Gostou da ferramenta? Pague um cafézinho!</h4>
          </div>

          <p class="pix-desc">
            Contribuições via PIX ajudam a manter projetos de código aberto ativos e em constante evolução.
          </p>

          <div class="pix-key-box">
            <div class="pix-key-info">
              <span class="pix-key-label">Chave PIX (Aleatória):</span>
              <code class="pix-key-code font-mono">{{ pixKey }}</code>
            </div>
            <button class="pix-copy-btn" (click)="copyPix()">
              {{ copied() ? '✓ Copiado!' : '📋 Copiar Chave' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .modal-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(41, 37, 36, 0.55);
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      z-index: 9999;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1.25rem;
    }

    .modal-card {
      width: 100%;
      max-width: 540px;
      padding: 2rem;
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
      font-size: 0.9rem;
      font-weight: 700;
    }

    .close-btn:hover {
      background: var(--bg-muted);
      color: var(--text-primary);
    }

    .author-header {
      display: flex;
      align-items: center;
      gap: 1.25rem;
      margin-bottom: 1.25rem;
    }

    .author-avatar-wrap {
      position: relative;
    }

    .author-avatar {
      width: 64px;
      height: 64px;
      border-radius: var(--radius-md);
      background: linear-gradient(135deg, #E07A5F 0%, #F4A261 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 2rem;
      box-shadow: 0 4px 14px rgba(224, 122, 95, 0.35);
    }

    .online-indicator {
      position: absolute;
      bottom: -2px;
      right: -2px;
      width: 14px;
      height: 14px;
      background: #22C55E;
      border: 2px solid #FFFFFF;
      border-radius: 50%;
    }

    .author-name {
      font-family: var(--font-serif);
      font-size: 1.5rem;
      line-height: 1.2;
    }

    .author-title {
      font-size: 0.82rem;
      color: var(--text-muted);
      margin-top: 0.15rem;
    }

    .author-badge {
      display: inline-block;
      margin-top: 0.35rem;
      font-size: 0.72rem;
      font-weight: 700;
      background: var(--bg-accent-soft);
      color: var(--cozy-terracotta);
      padding: 0.15rem 0.55rem;
      border-radius: var(--radius-pill);
    }

    .author-bio {
      font-size: 0.9rem;
      color: var(--text-secondary);
      line-height: 1.5;
      margin-bottom: 1.5rem;
    }

    .social-links-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 0.75rem;
      margin-bottom: 1.5rem;
    }

    @media (min-width: 480px) {
      .social-links-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    .social-link-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.75rem;
      background: var(--bg-secondary);
      border: 1px solid var(--border-light);
      border-radius: var(--radius-sm);
      text-decoration: none;
      color: inherit;
      transition: all var(--transition-fast);
    }

    .social-link-item:hover {
      background: var(--bg-surface);
      border-color: var(--cozy-terracotta);
      transform: translateY(-2px);
      box-shadow: var(--shadow-sm);
    }

    .social-icon {
      font-size: 1.4rem;
    }

    .social-meta strong {
      display: block;
      font-size: 0.85rem;
      color: var(--text-primary);
    }

    .social-meta span {
      font-size: 0.72rem;
      color: var(--text-muted);
    }

    /* PIX Card */
    .pix-card {
      background: #FAF3EE;
      border: 1px solid rgba(224, 122, 95, 0.25);
      border-radius: var(--radius-md);
      padding: 1.25rem;
    }

    .pix-tag {
      font-size: 0.72rem;
      font-weight: 800;
      color: var(--cozy-terracotta);
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }

    .pix-title {
      font-size: 0.98rem;
      font-weight: 700;
      margin-top: 0.15rem;
      color: var(--text-primary);
    }

    .pix-desc {
      font-size: 0.8rem;
      color: var(--text-secondary);
      margin: 0.4rem 0 0.85rem 0;
    }

    .pix-key-box {
      background: #FFFFFF;
      border: 1px solid var(--border-medium);
      padding: 0.65rem 0.85rem;
      border-radius: var(--radius-sm);
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 0.5rem;
    }

    .pix-key-label {
      font-size: 0.7rem;
      font-weight: 700;
      color: var(--text-muted);
      display: block;
    }

    .pix-key-code {
      font-size: 0.8rem;
      font-weight: 700;
      color: var(--text-primary);
      word-break: break-all;
    }

    .pix-copy-btn {
      background: var(--cozy-terracotta);
      color: #FFFFFF;
      font-size: 0.8rem;
      font-weight: 700;
      padding: 0.45rem 0.85rem;
      border-radius: var(--radius-pill);
      white-space: nowrap;
    }

    .pix-copy-btn:hover {
      background: #E76F51;
    }
  `]
})
export class AuthorModalComponent {
  readonly paletteService = inject(PaletteService);
  readonly close = output<void>();

  readonly pixKey = '57886499-456c-43e8-93b9-8903f94e1452';
  readonly copied = signal(false);

  copyPix(): void {
    this.paletteService.copyText(this.pixKey, 'Chave PIX copiada');
    this.copied.set(true);
    this.paletteService.triggerCelebration();
    setTimeout(() => this.copied.set(false), 2500);
  }
}
