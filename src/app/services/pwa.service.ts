import { Injectable, signal } from '@angular/core';
import confetti from 'canvas-confetti';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

@Injectable({
  providedIn: 'root'
})
export class PwaService {
  private deferredPrompt: BeforeInstallPromptEvent | null = null;

  // Sinais reativos
  readonly canInstall = signal<boolean>(false);
  readonly isInstalled = signal<boolean>(false);
  readonly showInstructionsModal = signal<boolean>(false);

  constructor() {
    this.initPwaListeners();
  }

  private initPwaListeners(): void {
    if (typeof window === 'undefined') return;

    // Detecta se já está rodando em modo standalone (já instalado)
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;

    if (isStandalone) {
      this.isInstalled.set(true);
    }

    // Captura o evento nativo do navegador
    window.addEventListener('beforeinstallprompt', (e: Event) => {
      e.preventDefault();
      this.deferredPrompt = e as BeforeInstallPromptEvent;
      this.canInstall.set(true);
    });

    // Detecta conclusão da instalação
    window.addEventListener('appinstalled', () => {
      this.isInstalled.set(true);
      this.canInstall.set(false);
      this.deferredPrompt = null;
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {}
    });
  }

  async installApp(): Promise<void> {
    if (this.deferredPrompt) {
      try {
        await this.deferredPrompt.prompt();
        const choice = await this.deferredPrompt.userChoice;
        if (choice.outcome === 'accepted') {
          this.canInstall.set(false);
          this.deferredPrompt = null;
        }
      } catch (err) {
        console.warn('Erro ao acionar prompt de instalação:', err);
        this.showInstructionsModal.set(true);
      }
    } else {
      // Se não há prompt nativo disponível (ex: iOS Safari ou navegador restritivo), abre instruções visuais
      this.showInstructionsModal.set(true);
    }
  }

  closeInstructions(): void {
    this.showInstructionsModal.set(false);
  }
}
