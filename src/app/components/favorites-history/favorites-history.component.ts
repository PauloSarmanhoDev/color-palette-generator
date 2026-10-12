import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PaletteService } from '../../services/palette.service';
import { PaletteHistoryItem } from '../../models/color.models';

@Component({
  selector: 'app-favorites-history',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="favs-history-card card-cozy">
      <div class="card-header">
        <div class="header-titles">
          <span class="badge-tag">💾 Biblioteca Pessoal</span>
          <h2 class="section-title">Favoritos & Histórico</h2>
          <p class="section-desc">
            Suas combinações salvas e paletas geradas recentemente. Todas guardadas com segurança no seu navegador.
          </p>
        </div>

        <button
          class="export-all-btn"
          (click)="exportCollection()"
          [disabled]="paletteService.favorites().length === 0"
        >
          📤 Exportar Coleção JSON
        </button>
      </div>

      <!-- Abas de Navegação -->
      <div class="library-tabs">
        <button
          class="library-tab-btn"
          [class.active]="activeTab() === 'favorites'"
          (click)="activeTab.set('favorites')"
        >
          ❤️ Favoritos ({{ paletteService.favorites().length }})
        </button>
        <button
          class="library-tab-btn"
          [class.active]="activeTab() === 'history'"
          (click)="activeTab.set('history')"
        >
          🕒 Histórico Recente ({{ paletteService.history().length }})
        </button>
      </div>

      <!-- 1. FAVORITOS -->
      @if (activeTab() === 'favorites') {
        <div class="items-list animate-fade-in">
          @if (paletteService.favorites().length === 0) {
            <div class="empty-state">
              <span class="empty-icon">☕</span>
              <h4>Nenhuma paleta favoritada ainda</h4>
              <p>Clique no botão "Favoritar" no cabeçalho para guardar suas combinações preferidas!</p>
            </div>
          } @else {
            <div class="palettes-grid">
              @for (item of paletteService.favorites(); track item.id) {
                <div class="palette-saved-card">
                  <!-- Header do Card -->
                  <div class="saved-card-header">
                    <input
                      type="text"
                      class="palette-title-input"
                      [ngModel]="item.name"
                      (ngModelChange)="updateFavoriteName(item.id, $event)"
                      title="Clique para editar o nome"
                    />
                    <button
                      class="delete-fav-btn"
                      (click)="paletteService.removeFavorite(item.id)"
                      title="Remover dos favoritos"
                    >
                      ✕
                    </button>
                  </div>

                  <!-- Faixas de Cores -->
                  <div class="palette-mini-strip" (click)="restore(item)">
                    @for (hex of item.colors; track hex) {
                      <div
                        class="mini-strip-color"
                        [style.background-color]="hex"
                        [title]="hex"
                      ></div>
                    }
                  </div>

                  <!-- Rodapé do Card -->
                  <div class="saved-card-footer">
                    <span class="saved-date font-mono">{{ formatDate(item.createdAt) }}</span>
                    <div class="saved-card-actions">
                      <button class="mini-action-btn" (click)="copyHexList(item.colors)">
                        Copiar HEX
                      </button>
                      <button class="mini-action-btn primary" (click)="restore(item)">
                        Carregar
                      </button>
                    </div>
                  </div>
                </div>
              }
            </div>
          }
        </div>
      }

      <!-- 2. HISTÓRICO -->
      @if (activeTab() === 'history') {
        <div class="items-list animate-fade-in">
          @if (paletteService.history().length === 0) {
            <div class="empty-state">
              <span class="empty-icon">🎨</span>
              <h4>Nenhum histórico gerado ainda</h4>
              <p>Pressione a barra de espaço para gerar suas primeiras paletas!</p>
            </div>
          } @else {
            <div class="palettes-grid">
              @for (item of paletteService.history(); track item.id) {
                <div class="palette-saved-card">
                  <div class="saved-card-header">
                    <strong class="history-item-name">{{ item.name }}</strong>
                    <button
                      class="fav-quick-btn"
                      (click)="favoriteFromHistory(item)"
                      title="Salvar nos Favoritos"
                    >
                      ❤️
                    </button>
                  </div>

                  <div class="palette-mini-strip" (click)="restore(item)">
                    @for (hex of item.colors; track hex) {
                      <div
                        class="mini-strip-color"
                        [style.background-color]="hex"
                        [title]="hex"
                      ></div>
                    }
                  </div>

                  <div class="saved-card-footer">
                    <span class="saved-date font-mono">{{ formatDate(item.createdAt) }}</span>
                    <button class="mini-action-btn primary" (click)="restore(item)">
                      Restaurar
                    </button>
                  </div>
                </div>
              }
            </div>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .favs-history-card {
      padding: 1.5rem;
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 1.25rem;
      flex-wrap: wrap;
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

    .export-all-btn {
      background: var(--bg-secondary);
      border: 1px solid var(--border-light);
      padding: 0.45rem 0.95rem;
      border-radius: var(--radius-pill);
      font-size: 0.82rem;
      font-weight: 700;
      color: var(--text-secondary);
    }

    .export-all-btn:hover:not(:disabled) {
      background: var(--bg-surface);
      border-color: var(--cozy-terracotta);
      color: var(--cozy-terracotta);
    }

    .library-tabs {
      display: flex;
      gap: 0.5rem;
      margin-bottom: 1.25rem;
      border-bottom: 1px solid var(--border-light);
      padding-bottom: 0.75rem;
    }

    .library-tab-btn {
      background: var(--bg-secondary);
      border: 1px solid var(--border-light);
      padding: 0.45rem 1rem;
      border-radius: var(--radius-pill);
      font-size: 0.85rem;
      font-weight: 600;
      color: var(--text-secondary);
      transition: all var(--transition-fast);
    }

    .library-tab-btn:hover {
      background: var(--bg-surface);
      color: var(--text-primary);
    }

    .library-tab-btn.active {
      background: var(--text-primary);
      color: #FFFFFF;
      border-color: var(--text-primary);
    }

    .empty-state {
      text-align: center;
      padding: 3rem 1.5rem;
      background: var(--bg-secondary);
      border-radius: var(--radius-md);
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
    }

    .empty-icon {
      font-size: 2.2rem;
      margin-bottom: 0.25rem;
    }

    .empty-state h4 {
      font-size: 1.1rem;
    }

    .empty-state p {
      font-size: 0.85rem;
      color: var(--text-muted);
      max-width: 380px;
    }

    .palettes-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 1rem;
    }

    @media (min-width: 640px) {
      .palettes-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (min-width: 1024px) {
      .palettes-grid {
        grid-template-columns: repeat(3, 1fr);
      }
    }

    .palette-saved-card {
      background: var(--bg-secondary);
      border: 1px solid var(--border-light);
      border-radius: var(--radius-md);
      padding: 0.85rem;
      display: flex;
      flex-direction: column;
      gap: 0.65rem;
      transition: all var(--transition-fast);
    }

    .palette-saved-card:hover {
      background: var(--bg-surface);
      border-color: var(--cozy-terracotta);
      box-shadow: var(--shadow-sm);
    }

    .saved-card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 0.5rem;
    }

    .palette-title-input {
      font-size: 0.88rem;
      font-weight: 700;
      color: var(--text-primary);
      background: transparent;
      border: 1px dashed transparent;
      padding: 0.2rem 0.4rem;
      border-radius: var(--radius-xs);
      width: 100%;
    }

    .palette-title-input:hover, .palette-title-input:focus {
      background: var(--bg-surface);
      border-color: var(--border-medium);
    }

    .history-item-name {
      font-size: 0.88rem;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .delete-fav-btn, .fav-quick-btn {
      color: var(--text-muted);
      font-size: 0.85rem;
      padding: 0.2rem 0.45rem;
      border-radius: var(--radius-pill);
    }

    .delete-fav-btn:hover {
      color: #EF4444;
      background: #FEE2E2;
    }

    .fav-quick-btn:hover {
      transform: scale(1.15);
    }

    .palette-mini-strip {
      display: flex;
      height: 48px;
      border-radius: var(--radius-sm);
      overflow: hidden;
      cursor: pointer;
      box-shadow: var(--shadow-subtle);
      transition: transform var(--transition-fast);
    }

    .palette-mini-strip:hover {
      transform: scale(1.02);
    }

    .mini-strip-color {
      flex: 1;
      height: 100%;
    }

    .saved-card-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 0.72rem;
    }

    .saved-date {
      color: var(--text-muted);
    }

    .saved-card-actions {
      display: flex;
      gap: 0.35rem;
    }

    .mini-action-btn {
      font-size: 0.75rem;
      font-weight: 700;
      padding: 0.25rem 0.6rem;
      border-radius: var(--radius-pill);
      background: var(--bg-surface);
      border: 1px solid var(--border-light);
      color: var(--text-secondary);
    }

    .mini-action-btn:hover {
      color: var(--text-primary);
      border-color: var(--border-medium);
    }

    .mini-action-btn.primary {
      background: var(--cozy-terracotta);
      border-color: var(--cozy-terracotta);
      color: #FFFFFF;
    }

    .mini-action-btn.primary:hover {
      background: #E76F51;
    }
  `]
})
export class FavoritesHistoryComponent {
  readonly paletteService = inject(PaletteService);
  readonly activeTab = signal<'favorites' | 'history'>('favorites');

  restore(item: PaletteHistoryItem): void {
    this.paletteService.setFullPalette(item.colors, item.name);
  }

  updateFavoriteName(id: string, newName: string): void {
    const list = this.paletteService.favorites().map(f => {
      if (f.id === id) {
        return { ...f, name: newName };
      }
      return f;
    });
    this.paletteService.favorites.set(list);
    try {
      localStorage.setItem('cromatica_favorites_v1', JSON.stringify(list));
    } catch {}
  }

  favoriteFromHistory(item: PaletteHistoryItem): void {
    this.paletteService.saveToFavorites(item.name);
  }

  copyHexList(colors: string[]): void {
    const text = colors.join(', ');
    this.paletteService.copyText(text, 'Cores da paleta');
  }

  formatDate(timestamp: number): string {
    const d = new Date(timestamp);
    return `${d.toLocaleDateString('pt-BR')} ${d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
  }

  exportCollection(): void {
    const data = JSON.stringify(this.paletteService.favorites(), null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = `cromatica-colecao-${Date.now()}.json`;
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
    this.paletteService.showToast('Coleção JSON exportada!', 'success');
  }
}
