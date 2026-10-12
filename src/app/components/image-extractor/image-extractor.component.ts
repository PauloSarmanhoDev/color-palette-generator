import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaletteService } from '../../services/palette.service';
import { extractPaletteFromImage } from '../../utils/color-utils';

interface SampleImage {
  name: string;
  category: string;
  url: string;
}

@Component({
  selector: 'app-image-extractor',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="extractor-card card-cozy">
      <div class="card-header">
        <div class="header-info">
          <span class="badge-tag">📷 Alto Impacto</span>
          <h2 class="section-title">Extrair Paleta de uma Imagem</h2>
          <p class="section-desc">
            Envie uma foto, ilustração ou referência visual. O algoritmo identifica automaticamente as cores predominantes e mais vibrantes.
          </p>
        </div>
      </div>

      <!-- Área de Upload & Drag-and-Drop -->
      <div
        class="dropzone"
        [class.is-dragover]="isDragOver()"
        (dragover)="onDragOver($event)"
        (dragleave)="onDragLeave($event)"
        (drop)="onDrop($event)"
        (click)="fileInput.click()"
      >
        <input
          #fileInput
          type="file"
          accept="image/*"
          style="display: none"
          (change)="onFileSelected($event)"
        />

        @if (!previewUrl()) {
          <div class="dropzone-empty">
            <span class="upload-icon">🖼️</span>
            <p class="drop-text">Arraste e solte uma imagem aqui ou <strong>clique para escolher</strong></p>
            <span class="drop-hint">Formatos suportados: PNG, JPG, WebP, SVG</span>
          </div>
        } @else {
          <div class="dropzone-preview">
            <img [src]="previewUrl()" alt="Preview da imagem" class="preview-img" (load)="onImageLoaded($event)" />
            <button class="change-img-btn" (click)="$event.stopPropagation(); fileInput.click()">
              Trocar Imagem
            </button>
          </div>
        }
      </div>

      <!-- Presets de Imagens para Teste Imediato -->
      <div class="sample-images-section">
        <span class="sample-label">Ou teste com uma foto de inspiração:</span>
        <div class="sample-grid">
          @for (sample of sampleImages; track sample.name) {
            <button class="sample-btn" (click)="loadSampleImage(sample.url, sample.name)">
              <span class="sample-thumb" [style.background-image]="'url(' + sample.url + ')'"></span>
              <span class="sample-name">{{ sample.name }}</span>
            </button>
          }
        </div>
      </div>

      <!-- Resultado da Extração -->
      @if (extractedHexes().length > 0) {
        <div class="extraction-result animate-fade-in">
          <div class="result-header">
            <h3 class="result-title">Cores Identificadas na Imagem:</h3>
            <button class="apply-btn" (click)="applyExtractedPalette()">
              ✨ Aplicar esta Paleta no Gerador
            </button>
          </div>

          <div class="swatches-row">
            @for (hex of extractedHexes(); track hex) {
              <div
                class="swatch-card"
                [style.background-color]="hex"
                (click)="paletteService.copyText(hex, 'HEX Copiado')"
                title="Clique para copiar {{ hex }}"
              >
                <span class="swatch-hex">{{ hex }}</span>
              </div>
            }
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .extractor-card {
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

    .dropzone {
      border: 2px dashed var(--border-medium);
      border-radius: var(--radius-md);
      background: var(--bg-secondary);
      padding: 2rem 1.5rem;
      text-align: center;
      cursor: pointer;
      transition: all var(--transition-fast);
      position: relative;
      overflow: hidden;
    }

    .dropzone:hover, .dropzone.is-dragover {
      border-color: var(--cozy-terracotta);
      background: #FAF3EE;
    }

    .dropzone-empty {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.4rem;
    }

    .upload-icon {
      font-size: 2.2rem;
    }

    .drop-text {
      font-size: 0.95rem;
      color: var(--text-primary);
    }

    .drop-text strong {
      color: var(--cozy-terracotta);
    }

    .drop-hint {
      font-size: 0.78rem;
      color: var(--text-muted);
    }

    .dropzone-preview {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.75rem;
    }

    .preview-img {
      max-height: 240px;
      max-width: 100%;
      border-radius: var(--radius-sm);
      object-fit: cover;
      box-shadow: var(--shadow-sm);
    }

    .change-img-btn {
      background: var(--bg-surface);
      border: 1px solid var(--border-light);
      padding: 0.35rem 0.8rem;
      border-radius: var(--radius-pill);
      font-size: 0.8rem;
      font-weight: 600;
      color: var(--text-secondary);
    }

    .sample-images-section {
      margin-top: 1.25rem;
    }

    .sample-label {
      font-size: 0.8rem;
      font-weight: 700;
      color: var(--text-secondary);
      text-transform: uppercase;
      letter-spacing: 0.04em;
      display: block;
      margin-bottom: 0.5rem;
    }

    .sample-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 0.5rem;
    }

    @media (min-width: 640px) {
      .sample-grid {
        grid-template-columns: repeat(4, 1fr);
      }
    }

    .sample-btn {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.4rem;
      background: var(--bg-secondary);
      border: 1px solid var(--border-light);
      border-radius: var(--radius-sm);
      text-align: left;
      transition: all var(--transition-fast);
    }

    .sample-btn:hover {
      background: var(--bg-surface);
      border-color: var(--cozy-terracotta);
      transform: translateY(-1px);
    }

    .sample-thumb {
      width: 32px;
      height: 32px;
      border-radius: var(--radius-xs);
      background-size: cover;
      background-position: center;
      flex-shrink: 0;
    }

    .sample-name {
      font-size: 0.78rem;
      font-weight: 600;
      color: var(--text-primary);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .extraction-result {
      margin-top: 1.5rem;
      padding-top: 1.25rem;
      border-top: 1px solid var(--border-light);
    }

    .result-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 0.75rem;
      margin-bottom: 0.85rem;
    }

    .result-title {
      font-size: 1rem;
      font-weight: 700;
    }

    .apply-btn {
      background: linear-gradient(135deg, #E07A5F 0%, #D48B6E 100%);
      color: #FFFFFF;
      font-size: 0.85rem;
      font-weight: 700;
      padding: 0.45rem 1rem;
      border-radius: var(--radius-pill);
      box-shadow: 0 2px 10px rgba(224, 122, 95, 0.3);
    }

    .apply-btn:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 14px rgba(224, 122, 95, 0.4);
    }

    .swatches-row {
      display: flex;
      gap: 0.5rem;
      overflow-x: auto;
      padding-bottom: 0.5rem;
    }

    .swatch-card {
      flex: 1;
      min-width: 70px;
      height: 75px;
      border-radius: var(--radius-sm);
      display: flex;
      align-items: flex-end;
      justify-content: center;
      padding: 0.4rem;
      box-shadow: var(--shadow-sm);
      cursor: pointer;
      transition: transform var(--transition-bounce);
    }

    .swatch-card:hover {
      transform: translateY(-3px) scale(1.04);
    }

    .swatch-hex {
      font-family: var(--font-mono);
      font-size: 0.72rem;
      font-weight: 700;
      background: rgba(0, 0, 0, 0.45);
      color: #FFFFFF;
      padding: 0.15rem 0.35rem;
      border-radius: var(--radius-xs);
    }
  `]
})
export class ImageExtractorComponent {
  readonly paletteService = inject(PaletteService);

  readonly isDragOver = signal(false);
  readonly previewUrl = signal<string | null>(null);
  readonly extractedHexes = signal<string[]>([]);
  private currentImageName = 'Extraída de Imagem';

  readonly sampleImages: SampleImage[] = [
    {
      name: 'Pôr do Sol Dourado',
      category: 'Natureza',
      // High-quality SVG data URI representation
      url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300"><defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="%23F97316"/><stop offset="50%" stop-color="%23F43F5E"/><stop offset="100%" stop-color="%231E1B4B"/></linearGradient></defs><rect width="400" height="300" fill="url(%23g)"/><circle cx="200" cy="180" r="70" fill="%23FBBF24"/><path d="M0 240 Q100 210 200 240 T400 240 L400 300 L0 300 Z" fill="%230F172A"/></svg>'
    },
    {
      name: 'Café & Livros Cozy',
      category: 'Cozy',
      url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300"><defs><linearGradient id="c" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="%23FAEDCD"/><stop offset="100%" stop-color="%23D4A373"/></linearGradient></defs><rect width="400" height="300" fill="url(%23c)"/><rect x="50" y="80" width="300" height="140" rx="20" fill="%235D4037"/><circle cx="150" cy="150" r="45" fill="%23E07A5F"/><rect x="230" y="110" width="80" height="80" rx="10" fill="%2381B29A"/></svg>'
    },
    {
      name: 'Floresta de Outono',
      category: 'Natureza',
      url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300"><defs><linearGradient id="f" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="%23E9C46A"/><stop offset="60%" stop-color="%23E76F51"/><stop offset="100%" stop-color="%23264653"/></linearGradient></defs><rect width="400" height="300" fill="url(%23f)"/><circle cx="80" cy="120" r="60" fill="%23D97706"/><circle cx="280" cy="100" r="80" fill="%23C2410C"/><circle cx="190" cy="160" r="50" fill="%232A9D8F"/></svg>'
    },
    {
      name: 'Jardim Botânico',
      category: 'Botânica',
      url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300"><defs><linearGradient id="b" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="%23E9EDC9"/><stop offset="100%" stop-color="%23CCD5AE"/></linearGradient></defs><rect width="400" height="300" fill="url(%23b)"/><circle cx="120" cy="140" r="65" fill="%23588157"/><circle cx="260" cy="160" r="75" fill="%233A5A40"/><circle cx="190" cy="90" r="45" fill="%23F472B6"/></svg>'
    }
  ];

  onDragOver(e: DragEvent): void {
    e.preventDefault();
    this.isDragOver.set(true);
  }

  onDragLeave(e: DragEvent): void {
    e.preventDefault();
    this.isDragOver.set(false);
  }

  onDrop(e: DragEvent): void {
    e.preventDefault();
    this.isDragOver.set(false);
    if (e.dataTransfer && e.dataTransfer.files.length > 0) {
      this.handleFile(e.dataTransfer.files[0]);
    }
  }

  onFileSelected(e: Event): void {
    const target = e.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      this.handleFile(target.files[0]);
    }
  }

  private handleFile(file: File): void {
    if (!file.type.startsWith('image/')) {
      this.paletteService.showToast('Por favor, selecione um arquivo de imagem.', 'info');
      return;
    }
    this.currentImageName = file.name.replace(/\.[^/.]+$/, '');
    const reader = new FileReader();
    reader.onload = (event) => {
      this.previewUrl.set(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  }

  loadSampleImage(url: string, name: string): void {
    this.currentImageName = name;
    this.previewUrl.set(url);
  }

  onImageLoaded(e: Event): void {
    const img = e.target as HTMLImageElement;
    const hexes = extractPaletteFromImage(img, this.paletteService.colorCount());
    this.extractedHexes.set(hexes);
    this.paletteService.showToast('Cores extraídas com sucesso!', 'success');
  }

  applyExtractedPalette(): void {
    const hexes = this.extractedHexes();
    if (hexes.length > 0) {
      this.paletteService.setFullPalette(hexes, this.currentImageName);
    }
  }
}
