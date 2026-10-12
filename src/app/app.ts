import { Component, HostListener, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaletteService } from './services/palette.service';
import { HeaderComponent } from './components/header/header.component';
import { PaletteStripComponent } from './components/palette-strip/palette-strip.component';
import { VariationsBarComponent } from './components/variations-bar/variations-bar.component';
import { PersonalityControlsComponent } from './components/personality-controls/personality-controls.component';
import { ImageExtractorComponent } from './components/image-extractor/image-extractor.component';
import { PromptGeneratorComponent } from './components/prompt-generator/prompt-generator.component';
import { MockupsPreviewComponent } from './components/mockups-preview/mockups-preview.component';
import { ProToolsComponent } from './components/pro-tools/pro-tools.component';
import { ThemesAndChallengesComponent } from './components/themes-and-challenges/themes-and-challenges.component';
import { FavoritesHistoryComponent } from './components/favorites-history/favorites-history.component';
import { AuthorModalComponent } from './components/author-modal/author-modal.component';
import { ColorEditModalComponent } from './components/color-edit-modal/color-edit-modal.component';
import { PwaInstallModalComponent } from './components/pwa-install-modal/pwa-install-modal.component';
import { PwaService } from './services/pwa.service';

export type MainSectionTab =
  | 'personality'
  | 'extract'
  | 'prompt'
  | 'mockups'
  | 'tools'
  | 'themes'
  | 'library';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    PaletteStripComponent,
    VariationsBarComponent,
    PersonalityControlsComponent,
    ImageExtractorComponent,
    PromptGeneratorComponent,
    MockupsPreviewComponent,
    ProToolsComponent,
    ThemesAndChallengesComponent,
    FavoritesHistoryComponent,
    AuthorModalComponent,
    ColorEditModalComponent,
    PwaInstallModalComponent
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  readonly paletteService = inject(PaletteService);
  readonly pwaService = inject(PwaService);

  // Aba principal de funcionalidades estendidas
  readonly activeSection = signal<MainSectionTab>('personality');

  // Modal do Autor
  readonly showAuthorModal = signal<boolean>(false);

  // Atalho Teclado: Barra de Espaço
  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.code === 'Space') {
      const target = event.target as HTMLElement;
      // Não aciona se o usuário estiver digitando em um input ou textarea
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) {
        return;
      }
      event.preventDefault();
      this.paletteService.generatePalette();
    }
  }

  setSection(tab: MainSectionTab): void {
    this.activeSection.set(tab);
  }
}
