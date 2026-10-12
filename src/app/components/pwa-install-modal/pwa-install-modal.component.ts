import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PwaService } from '../../services/pwa.service';

@Component({
  selector: 'app-pwa-install-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="modal-backdrop" (click)="pwaService.closeInstructions()">
      <div class="modal-card card-cozy animate-scale-in" (click)="$event.stopPropagation()">
        <button class="close-btn" (click)="pwaService.closeInstructions()" title="Fechar">✕</button>

        <!-- Topo -->
        <div class="modal-header">
          <div class="icon-wrap">📲</div>
          <div>
            <span class="badge-tag">PWA • Instalação Rápida</span>
            <h3 class="modal-title">Instalar Cromática no Dispositivo</h3>
          </div>
        </div>

        <p class="modal-desc">
          Instale o Cromática como um aplicativo independente para ter acesso offline, inicialização instantânea e tela cheia sem barras do navegador.
        </p>

        <!-- Instruções por Plataforma -->
        <div class="guides-list">
          <!-- Desktop (Chrome / Edge) -->
          <div class="guide-item">
            <span class="device-icon">💻</span>
            <div>
              <strong>No Computador (Chrome / Edge / Brave):</strong>
              <p>Clique no ícone de <strong>instalação</strong> (ou computadorzinho com seta para baixo) no canto direito da barra de endereços do navegador.</p>
            </div>
          </div>

          <!-- Celular Android -->
          <div class="guide-item">
            <span class="device-icon">🤖</span>
            <div>
              <strong>No Android (Chrome):</strong>
              <p>Toque no menu de três pontos <strong>(⋮)</strong> no canto superior direito e selecione <strong>"Instalar aplicativo"</strong> ou <strong>"Adicionar à tela inicial"</strong>.</p>
            </div>
          </div>

          <!-- iPhone / iPad iOS Safari -->
          <div class="guide-item">
            <span class="device-icon">🍎</span>
            <div>
              <strong>No iPhone / iPad (Safari):</strong>
              <p>Toque no botão de <strong>Compartilhar</strong> (ícone de quadrado com seta para cima ⎋) na barra inferior e escolha <strong>"Adicionar à Tela de Início"</strong>.</p>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button class="understood-btn" (click)="pwaService.closeInstructions()">
            Entendi, obrigado!
          </button>
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
      z-index: 9999;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1.25rem;
    }

    .modal-card {
      width: 100%;
      max-width: 520px;
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
      font-weight: 700;
    }

    .close-btn:hover {
      background: var(--bg-muted);
      color: var(--text-primary);
    }

    .modal-header {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 1rem;
    }

    .icon-wrap {
      width: 52px;
      height: 52px;
      border-radius: var(--radius-md);
      background: linear-gradient(135deg, #E07A5F 0%, #F4A261 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.6rem;
      box-shadow: 0 4px 14px rgba(224, 122, 95, 0.35);
      flex-shrink: 0;
    }

    .modal-title {
      font-size: 1.25rem;
      line-height: 1.2;
      margin-top: 0.2rem;
    }

    .modal-desc {
      font-size: 0.88rem;
      color: var(--text-secondary);
      line-height: 1.45;
      margin-bottom: 1.25rem;
    }

    .guides-list {
      display: flex;
      flex-direction: column;
      gap: 0.85rem;
      margin-bottom: 1.5rem;
    }

    .guide-item {
      display: flex;
      align-items: flex-start;
      gap: 0.85rem;
      background: var(--bg-secondary);
      border: 1px solid var(--border-light);
      padding: 0.85rem;
      border-radius: var(--radius-sm);
    }

    .device-icon {
      font-size: 1.35rem;
      flex-shrink: 0;
    }

    .guide-item strong {
      font-size: 0.85rem;
      display: block;
      color: var(--text-primary);
      margin-bottom: 0.15rem;
    }

    .guide-item p {
      font-size: 0.8rem;
      color: var(--text-secondary);
      line-height: 1.35;
    }

    .modal-footer {
      text-align: right;
    }

    .understood-btn {
      background: linear-gradient(135deg, #E07A5F 0%, #D48B6E 100%);
      color: #FFFFFF;
      font-weight: 700;
      font-size: 0.9rem;
      padding: 0.65rem 1.4rem;
      border-radius: var(--radius-pill);
      box-shadow: 0 4px 12px rgba(224, 122, 95, 0.3);
    }

    .understood-btn:hover {
      background: #E76F51;
    }
  `]
})
export class PwaInstallModalComponent {
  readonly pwaService = inject(PwaService);
}
