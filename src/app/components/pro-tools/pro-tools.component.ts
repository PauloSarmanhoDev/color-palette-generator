import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PaletteService } from '../../services/palette.service';
import {
  exportToCssVariables,
  exportToTailwindConfig,
  exportToJson,
  generateTonalScale,
  getContrastRatio,
  rgbToHex,
  hexToRgb
} from '../../utils/color-utils';

type ToolTab = 'export' | 'scale' | 'gradient' | 'semantics' | 'contrast';

@Component({
  selector: 'app-pro-tools',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="pro-tools-card card-cozy">
      <div class="card-header">
        <span class="badge-tag">🧰 Design & Dev Suite</span>
        <h2 class="section-title">Ferramentas para Designers & Desenvolvedores</h2>
        <p class="section-desc">
          Exporte código limpo, gere escalas de design system, crie gradientes e valide acessibilidade WCAG 2.1.
        </p>
      </div>

      <!-- Abas de Ferramentas -->
      <div class="tools-nav-bar">
        <button
          class="tool-nav-btn"
          [class.active]="activeTab() === 'export'"
          (click)="activeTab.set('export')"
        >
          📦 Exportar Código & Assets
        </button>
        <button
          class="tool-nav-btn"
          [class.active]="activeTab() === 'scale'"
          (click)="activeTab.set('scale')"
        >
          📐 Escala Tonal (50-950)
        </button>
        <button
          class="tool-nav-btn"
          [class.active]="activeTab() === 'gradient'"
          (click)="activeTab.set('gradient')"
        >
          🌈 Gerador de Gradientes
        </button>
        <button
          class="tool-nav-btn"
          [class.active]="activeTab() === 'semantics'"
          (click)="activeTab.set('semantics')"
        >
          🏷️ Cores Semânticas
        </button>
        <button
          class="tool-nav-btn"
          [class.active]="activeTab() === 'contrast'"
          (click)="activeTab.set('contrast')"
        >
          🔍 Matriz de Contraste WCAG
        </button>
      </div>

      <!-- Conteúdo da Aba Ativa -->
      <div class="tool-content-body animate-fade-in">
        <!-- 1. EXPORTAÇÃO -->
        @if (activeTab() === 'export') {
          <div class="export-view">
            <div class="export-buttons-grid">
              <button class="export-action-card" (click)="paletteService.downloadPalettePng()">
                <span class="exp-icon">🖼️</span>
                <strong>Baixar Imagem PNG</strong>
                <p>Card de alta resolução com códigos e nomes</p>
              </button>
              <button class="export-action-card" (click)="paletteService.downloadPaletteSvg()">
                <span class="exp-icon">📐</span>
                <strong>Baixar Vetor SVG</strong>
                <p>Pronto para importar no Figma, Illustrator ou web</p>
              </button>
              <button class="export-action-card" (click)="copyShareUrl()">
                <span class="exp-icon">🔗</span>
                <strong>Link Compartilhável</strong>
                <p>URL para enviar sua paleta para a equipe</p>
              </button>
            </div>

            <!-- Snippets de Código -->
            <div class="code-snippets-section">
              <div class="snippet-header">
                <div class="code-format-tabs">
                  <button
                    class="code-tab"
                    [class.active]="codeFormat() === 'css'"
                    (click)="codeFormat.set('css')"
                  >
                    CSS Variables
                  </button>
                  <button
                    class="code-tab"
                    [class.active]="codeFormat() === 'tailwind'"
                    (click)="codeFormat.set('tailwind')"
                  >
                    Tailwind CSS
                  </button>
                  <button
                    class="code-tab"
                    [class.active]="codeFormat() === 'json'"
                    (click)="codeFormat.set('json')"
                  >
                    JSON Estruturado
                  </button>
                </div>
                <button class="copy-code-btn" (click)="copyActiveCode()">
                  📋 Copiar Código
                </button>
              </div>

              <pre class="code-block font-mono"><code>{{ currentCodeString() }}</code></pre>
            </div>
          </div>
        }

        <!-- 2. ESCALA TONAL (50 a 950) -->
        @if (activeTab() === 'scale') {
          <div class="scale-view">
            <div class="scale-top-info">
              <div>
                <h3>Escala Tonal Perceptual</h3>
                <p>Gere tons de 50 a 950 para qualquer cor da paleta, no padrão do Tailwind CSS.</p>
              </div>
              <div class="color-picker-mini">
                <span>Cor base:</span>
                <select [ngModel]="selectedScaleBaseColor()" (ngModelChange)="selectedScaleBaseColor.set($event)">
                  @for (c of paletteService.currentColors(); track c.hex) {
                    <option [value]="c.hex">{{ c.name }} ({{ c.hex }})</option>
                  }
                </select>
              </div>
            </div>

            <!-- Escala Visual -->
            <div class="scale-grid">
              @for (item of currentTonalScale(); track item.shade) {
                <div
                  class="scale-item-card"
                  [style.background-color]="item.hex"
                  (click)="paletteService.copyText(item.hex, 'Tom ' + item.shade)"
                  title="Clique para copiar {{ item.hex }}"
                >
                  <div class="scale-item-top">
                    <span class="scale-num">{{ item.shade }}</span>
                    <span class="scale-wcag">{{ item.contrastWhite >= 4.5 ? 'AA' : '' }}</span>
                  </div>
                  <span class="scale-hex font-mono">{{ item.hex }}</span>
                </div>
              }
            </div>

            <div class="scale-footer-actions">
              <button class="copy-scale-btn" (click)="copyTonalScaleTokens()">
                📋 Copiar Objeto Tailwind para Design System
              </button>
            </div>
          </div>
        }

        <!-- 3. GRADIENTES -->
        @if (activeTab() === 'gradient') {
          <div class="gradient-view">
            <div class="gradient-controls-row">
              <div class="grad-type-selector">
                <button
                  class="grad-pill"
                  [class.active]="gradientType() === 'linear'"
                  (click)="gradientType.set('linear')"
                >
                  Linear
                </button>
                <button
                  class="grad-pill"
                  [class.active]="gradientType() === 'radial'"
                  (click)="gradientType.set('radial')"
                >
                  Radial
                </button>
              </div>

              @if (gradientType() === 'linear') {
                <div class="angle-slider-wrap">
                  <span>Ângulo: <strong>{{ gradientAngle() }}°</strong></span>
                  <input
                    type="range"
                    min="0"
                    max="360"
                    step="15"
                    [ngModel]="gradientAngle()"
                    (ngModelChange)="gradientAngle.set(+$event)"
                    class="range-slider"
                  />
                </div>
              }
            </div>

            <!-- Preview do Gradiente -->
            <div
              class="gradient-preview-box"
              [style.background]="currentGradientCss()"
            ></div>

            <div class="gradient-code-row">
              <code class="font-mono grad-css-text">background: {{ currentGradientCss() }};</code>
              <button class="copy-code-btn" (click)="paletteService.copyText('background: ' + currentGradientCss() + ';', 'CSS de Gradiente')">
                📋 Copiar CSS
              </button>
            </div>
          </div>
        }

        <!-- 4. CORES SEMÂNTICAS -->
        @if (activeTab() === 'semantics') {
          <div class="semantics-view">
            <p class="semantics-intro">
              Mapeamento automático da paleta para papéis funcionais de interface de usuário (UI):
            </p>

            <div class="semantics-grid">
              <div class="semantic-item-card">
                <div class="sem-badge" [style.background-color]="paletteService.semanticColors().primary"></div>
                <div>
                  <strong>Primary (Ação Principal)</strong>
                  <span class="font-mono">{{ paletteService.semanticColors().primary }}</span>
                </div>
              </div>

              <div class="semantic-item-card">
                <div class="sem-badge" [style.background-color]="paletteService.semanticColors().secondary"></div>
                <div>
                  <strong>Secondary (Suporte)</strong>
                  <span class="font-mono">{{ paletteService.semanticColors().secondary }}</span>
                </div>
              </div>

              <div class="semantic-item-card">
                <div class="sem-badge" [style.background-color]="paletteService.semanticColors().accent"></div>
                <div>
                  <strong>Accent (Destaque)</strong>
                  <span class="font-mono">{{ paletteService.semanticColors().accent }}</span>
                </div>
              </div>

              <div class="semantic-item-card">
                <div class="sem-badge" [style.background-color]="paletteService.semanticColors().background" style="border: 1px solid #CCC;"></div>
                <div>
                  <strong>Background (Fundo Cozy)</strong>
                  <span class="font-mono">{{ paletteService.semanticColors().background }}</span>
                </div>
              </div>

              <div class="semantic-item-card">
                <div class="sem-badge" [style.background-color]="paletteService.semanticColors().success"></div>
                <div>
                  <strong>Success (Sucesso)</strong>
                  <span class="font-mono">{{ paletteService.semanticColors().success }}</span>
                </div>
              </div>

              <div class="semantic-item-card">
                <div class="sem-badge" [style.background-color]="paletteService.semanticColors().warning"></div>
                <div>
                  <strong>Warning (Atenção)</strong>
                  <span class="font-mono">{{ paletteService.semanticColors().warning }}</span>
                </div>
              </div>

              <div class="semantic-item-card">
                <div class="sem-badge" [style.background-color]="paletteService.semanticColors().danger"></div>
                <div>
                  <strong>Danger (Erro / Alerta)</strong>
                  <span class="font-mono">{{ paletteService.semanticColors().danger }}</span>
                </div>
              </div>

              <div class="semantic-item-card">
                <div class="sem-badge" [style.background-color]="paletteService.semanticColors().info"></div>
                <div>
                  <strong>Info (Informação)</strong>
                  <span class="font-mono">{{ paletteService.semanticColors().info }}</span>
                </div>
              </div>
            </div>
          </div>
        }

        <!-- 5. MATRIZ DE CONTRASTE WCAG -->
        @if (activeTab() === 'contrast') {
          <div class="contrast-matrix-view">
            <p class="contrast-intro">
              Tabela cruzada de contraste relativo (WCAG 2.1). O padrão AA exige mínimo de <strong>4.5:1</strong> para textos normais e <strong>3.0:1</strong> para textos grandes.
            </p>

            <div class="matrix-table-wrap">
              <table class="matrix-table">
                <thead>
                  <tr>
                    <th>Fundo \ Texto</th>
                    @for (col of paletteService.currentColors(); track col.hex) {
                      <th>
                        <span class="tbl-dot" [style.background-color]="col.hex"></span>
                        <span class="tbl-hex font-mono">{{ col.hex }}</span>
                      </th>
                    }
                  </tr>
                </thead>
                <tbody>
                  @for (row of paletteService.currentColors(); track row.hex) {
                    <tr>
                      <td class="row-header">
                        <span class="tbl-dot" [style.background-color]="row.hex"></span>
                        <span class="font-mono">{{ row.hex }}</span>
                      </td>
                      @for (col of paletteService.currentColors(); track col.hex) {
                        @let ratio = getRatio(row.hex, col.hex);
                        <td
                          class="matrix-cell"
                          [class.pass-aaa]="ratio >= 7"
                          [class.pass-aa]="ratio >= 4.5 && ratio < 7"
                          [class.pass-large]="ratio >= 3 && ratio < 4.5"
                          [class.fail]="ratio < 3"
                        >
                          <span class="cell-ratio font-mono">{{ ratio }}:1</span>
                          <span class="cell-tag">
                            {{ ratio >= 7 ? 'AAA' : ratio >= 4.5 ? 'AA' : ratio >= 3 ? 'AA+' : '✖' }}
                          </span>
                        </td>
                      }
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .pro-tools-card {
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

    .tools-nav-bar {
      display: flex;
      gap: 0.5rem;
      overflow-x: auto;
      padding-bottom: 0.75rem;
      margin-bottom: 1.25rem;
      border-bottom: 1px solid var(--border-light);
    }

    .tool-nav-btn {
      background: var(--bg-secondary);
      border: 1px solid var(--border-light);
      padding: 0.5rem 1rem;
      border-radius: var(--radius-pill);
      font-size: 0.85rem;
      font-weight: 600;
      color: var(--text-secondary);
      white-space: nowrap;
      transition: all var(--transition-fast);
    }

    .tool-nav-btn:hover {
      background: var(--bg-surface);
      color: var(--text-primary);
    }

    .tool-nav-btn.active {
      background: var(--text-primary);
      color: #FFFFFF;
      border-color: var(--text-primary);
    }

    /* 1. Export View */
    .export-buttons-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1rem;
      margin-bottom: 1.5rem;
    }

    @media (max-width: 768px) {
      .export-buttons-grid { grid-template-columns: 1fr; }
    }

    .export-action-card {
      background: var(--bg-secondary);
      border: 1px solid var(--border-light);
      border-radius: var(--radius-md);
      padding: 1.25rem;
      text-align: left;
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
      transition: all var(--transition-fast);
    }

    .export-action-card:hover {
      background: var(--bg-surface);
      border-color: var(--cozy-terracotta);
      transform: translateY(-2px);
      box-shadow: var(--shadow-sm);
    }

    .exp-icon {
      font-size: 1.6rem;
      margin-bottom: 0.35rem;
    }

    .export-action-card strong {
      font-size: 0.95rem;
      color: var(--text-primary);
    }

    .export-action-card p {
      font-size: 0.78rem;
      color: var(--text-muted);
    }

    .code-snippets-section {
      background: #1C1917;
      border-radius: var(--radius-md);
      overflow: hidden;
      box-shadow: var(--shadow-md);
    }

    .snippet-header {
      background: #292524;
      padding: 0.65rem 1rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #44403C;
      flex-wrap: wrap;
      gap: 0.5rem;
    }

    .code-format-tabs {
      display: flex;
      gap: 0.35rem;
    }

    .code-tab {
      color: #A8A29E;
      font-size: 0.8rem;
      font-weight: 600;
      padding: 0.3rem 0.75rem;
      border-radius: var(--radius-xs);
    }

    .code-tab.active {
      background: #44403C;
      color: #FFFFFF;
    }

    .copy-code-btn {
      background: var(--cozy-terracotta);
      color: #FFFFFF;
      font-size: 0.8rem;
      font-weight: 700;
      padding: 0.35rem 0.85rem;
      border-radius: var(--radius-pill);
    }

    .code-block {
      padding: 1.25rem;
      color: #F5F5F4;
      font-size: 0.82rem;
      overflow-x: auto;
      max-height: 280px;
    }

    /* 2. Scale View */
    .scale-top-info {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.25rem;
      flex-wrap: wrap;
      gap: 1rem;
    }

    .color-picker-mini {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.85rem;
      font-weight: 600;
    }

    .scale-grid {
      display: grid;
      grid-template-columns: repeat(11, 1fr);
      gap: 0.35rem;
      border-radius: var(--radius-md);
      overflow: hidden;
    }

    @media (max-width: 900px) {
      .scale-grid {
        grid-template-columns: repeat(4, 1fr);
        gap: 0.5rem;
      }
    }

    .scale-item-card {
      min-height: 100px;
      padding: 0.6rem 0.4rem;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      border-radius: var(--radius-sm);
      cursor: pointer;
      transition: transform var(--transition-bounce);
    }

    .scale-item-card:hover {
      transform: translateY(-3px) scale(1.05);
      z-index: 2;
    }

    .scale-item-top {
      display: flex;
      justify-content: space-between;
      font-size: 0.72rem;
      font-weight: 800;
      background: rgba(0, 0, 0, 0.35);
      color: #FFFFFF;
      padding: 0.15rem 0.3rem;
      border-radius: var(--radius-xs);
    }

    .scale-hex {
      font-size: 0.68rem;
      font-weight: 700;
      background: rgba(0, 0, 0, 0.45);
      color: #FFFFFF;
      padding: 0.15rem 0.25rem;
      border-radius: var(--radius-xs);
      text-align: center;
    }

    .scale-footer-actions {
      margin-top: 1.25rem;
      text-align: right;
    }

    .copy-scale-btn {
      background: var(--bg-secondary);
      border: 1px solid var(--border-light);
      padding: 0.5rem 1rem;
      border-radius: var(--radius-pill);
      font-size: 0.85rem;
      font-weight: 700;
    }

    .copy-scale-btn:hover {
      background: var(--bg-surface);
      border-color: var(--cozy-terracotta);
      color: var(--cozy-terracotta);
    }

    /* 3. Gradient View */
    .gradient-controls-row {
      display: flex;
      align-items: center;
      gap: 1.5rem;
      margin-bottom: 1.25rem;
      flex-wrap: wrap;
    }

    .grad-type-selector {
      display: flex;
      background: var(--bg-secondary);
      padding: 2px;
      border-radius: var(--radius-pill);
      border: 1px solid var(--border-light);
    }

    .grad-pill {
      font-size: 0.82rem;
      font-weight: 700;
      padding: 0.35rem 0.85rem;
      border-radius: var(--radius-pill);
      color: var(--text-secondary);
    }

    .grad-pill.active {
      background: var(--bg-surface);
      color: var(--text-primary);
    }

    .angle-slider-wrap {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      font-size: 0.85rem;
    }

    .gradient-preview-box {
      width: 100%;
      height: 220px;
      border-radius: var(--radius-md);
      box-shadow: var(--shadow-md);
      border: 1px solid var(--border-light);
      margin-bottom: 1.25rem;
    }

    .gradient-code-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: var(--bg-secondary);
      padding: 0.75rem 1rem;
      border-radius: var(--radius-sm);
      border: 1px solid var(--border-light);
      flex-wrap: wrap;
      gap: 0.5rem;
    }

    .grad-css-text {
      font-size: 0.85rem;
      color: var(--text-primary);
    }

    /* 4. Semantics View */
    .semantics-intro, .contrast-intro {
      font-size: 0.88rem;
      color: var(--text-secondary);
      margin-bottom: 1.25rem;
    }

    .semantics-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 1rem;
    }

    @media (max-width: 800px) {
      .semantics-grid { grid-template-columns: repeat(2, 1fr); }
    }

    .semantic-item-card {
      background: var(--bg-secondary);
      border: 1px solid var(--border-light);
      padding: 1rem;
      border-radius: var(--radius-sm);
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .sem-badge {
      width: 32px;
      height: 32px;
      border-radius: var(--radius-xs);
      flex-shrink: 0;
      box-shadow: var(--shadow-subtle);
    }

    .semantic-item-card strong {
      display: block;
      font-size: 0.85rem;
    }

    .semantic-item-card span {
      font-size: 0.78rem;
      color: var(--text-muted);
    }

    /* 5. Contrast Matrix */
    .matrix-table-wrap {
      overflow-x: auto;
    }

    .matrix-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 0.8rem;
    }

    .matrix-table th, .matrix-table td {
      padding: 0.65rem 0.85rem;
      border: 1px solid var(--border-light);
      text-align: center;
    }

    .matrix-table th {
      background: var(--bg-secondary);
      font-weight: 700;
    }

    .tbl-dot {
      display: inline-block;
      width: 10px;
      height: 10px;
      border-radius: 50%;
      margin-right: 0.35rem;
      vertical-align: middle;
    }

    .row-header {
      font-weight: 700;
      background: var(--bg-secondary);
      text-align: left !important;
    }

    .matrix-cell {
      transition: background 0.2s;
    }

    .cell-ratio {
      font-weight: 700;
      display: block;
    }

    .cell-tag {
      font-size: 0.7rem;
      font-weight: 800;
    }

    .pass-aaa {
      background: rgba(34, 197, 94, 0.18);
      color: #15803D;
    }

    .pass-aa {
      background: rgba(59, 130, 246, 0.15);
      color: #1D4ED8;
    }

    .pass-large {
      background: rgba(234, 179, 8, 0.18);
      color: #A16207;
    }

    .fail {
      background: rgba(239, 68, 68, 0.1);
      color: #B91C1C;
    }
  `]
})
export class ProToolsComponent {
  readonly paletteService = inject(PaletteService);

  readonly activeTab = signal<ToolTab>('export');
  readonly codeFormat = signal<'css' | 'tailwind' | 'json'>('css');
  readonly selectedScaleBaseColor = signal<string>('');
  readonly gradientType = signal<'linear' | 'radial'>('linear');
  readonly gradientAngle = signal<number>(135);

  currentCodeString(): string {
    const colors = this.paletteService.currentColors();
    switch (this.codeFormat()) {
      case 'css':
        return exportToCssVariables(colors);
      case 'tailwind':
        return exportToTailwindConfig(colors);
      case 'json':
        return exportToJson(colors);
    }
  }

  currentTonalScale() {
    const base = this.selectedScaleBaseColor() || this.paletteService.currentColors()[0]?.hex || '#E07A5F';
    return generateTonalScale(base);
  }

  currentGradientCss(): string {
    const colors = this.paletteService.currentColors();
    if (colors.length < 2) return 'linear-gradient(135deg, #E07A5F 0%, #3D5A80 100%)';
    const stops = colors.map((c, idx) => `${c.hex} ${Math.round((idx / (colors.length - 1)) * 100)}%`).join(', ');

    if (this.gradientType() === 'linear') {
      return `linear-gradient(${this.gradientAngle()}deg, ${stops})`;
    } else {
      return `radial-gradient(circle at center, ${stops})`;
    }
  }

  getRatio(h1: string, h2: string): number {
    return getContrastRatio(h1, h2);
  }

  copyActiveCode(): void {
    const code = this.currentCodeString();
    this.paletteService.copyText(code, 'Código copiado');
  }

  copyShareUrl(): void {
    const url = this.paletteService.getShareUrl();
    this.paletteService.copyText(url, 'Link copiado');
  }

  copyTonalScaleTokens(): void {
    const scale = this.currentTonalScale();
    const obj: Record<string, string> = {};
    scale.forEach((item: any) => {
      obj[item.shade.toString()] = item.hex;
    });
    const formatted = JSON.stringify({ primary: obj }, null, 2);
    this.paletteService.copyText(formatted, 'Tokens da escala');
  }
}
