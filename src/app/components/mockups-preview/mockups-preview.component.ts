import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaletteService } from '../../services/palette.service';

type MockupView = 'website' | 'dashboard' | 'mobile' | 'card' | 'login' | 'social';

@Component({
  selector: 'app-mockups-preview',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="mockups-card card-cozy">
      <div class="card-header">
        <div class="header-titles">
          <span class="badge-tag">🖥️ Aplicação no Mundo Real</span>
          <h2 class="section-title">Pré-visualização em Projetos Reais</h2>
          <p class="section-desc">
            Veja exatamente como as cores da sua paleta se comportam aplicadas em interfaces reais de produtos e design.
          </p>
        </div>

        <!-- Modo Claro / Escuro -->
        <div class="theme-toggle-wrap">
          <button
            class="theme-pill-btn"
            [class.active]="!isDarkMode()"
            (click)="isDarkMode.set(false)"
          >
            ☀️ Claro
          </button>
          <button
            class="theme-pill-btn"
            [class.active]="isDarkMode()"
            (click)="isDarkMode.set(true)"
          >
            🌙 Escuro
          </button>
        </div>
      </div>

      <!-- Abas de Modelos de Projetos -->
      <div class="mockup-tabs">
        <button
          class="mockup-tab-btn"
          [class.active]="activeView() === 'website'"
          (click)="activeView.set('website')"
        >
          🌐 Site & Landing Page
        </button>
        <button
          class="mockup-tab-btn"
          [class.active]="activeView() === 'dashboard'"
          (click)="activeView.set('dashboard')"
        >
          📊 Dashboard
        </button>
        <button
          class="mockup-tab-btn"
          [class.active]="activeView() === 'mobile'"
          (click)="activeView.set('mobile')"
        >
          📱 App Mobile
        </button>
        <button
          class="mockup-tab-btn"
          [class.active]="activeView() === 'login'"
          (click)="activeView.set('login')"
        >
          🔐 Tela de Login
        </button>
        <button
          class="mockup-tab-btn"
          [class.active]="activeView() === 'card'"
          (click)="activeView.set('card')"
        >
          💳 Cartão de Visita
        </button>
        <button
          class="mockup-tab-btn"
          [class.active]="activeView() === 'social'"
          (click)="activeView.set('social')"
        >
          📸 Post de Rede Social
        </button>
      </div>

      <!-- Preview Canvas -->
      <div
        class="preview-viewport"
        [class.dark-theme]="isDarkMode()"
        [style.--c-p]="c(0)"
        [style.--c-s]="c(1)"
        [style.--c-a]="c(2)"
        [style.--c-4]="c(3)"
        [style.--c-5]="c(4)"
      >
        <!-- 1. WEBSITE / LANDING PAGE -->
        @if (activeView() === 'website') {
          <div class="mockup-canvas mockup-website animate-fade-in">
            <!-- Navbar -->
            <div class="mock-nav">
              <div class="mock-brand">
                <span class="mock-logo-dot" [style.background-color]="c(0)"></span>
                <strong>Aurora Studio</strong>
              </div>
              <div class="mock-nav-links">
                <span>Início</span>
                <span>Projetos</span>
                <span>Serviços</span>
              </div>
              <button class="mock-btn-sm" [style.background-color]="c(0)">
                Entrar em Contato
              </button>
            </div>

            <!-- Hero Section -->
            <div class="mock-hero">
              <span class="mock-pill-badge" [style.color]="c(0)" [style.border-color]="c(0)">
                Novo Design System 2026
              </span>
              <h2 class="mock-hero-title">
                Criamos experiências digitais <span [style.color]="c(0)">acolhedoras</span> & inesquecíveis.
              </h2>
              <p class="mock-hero-p">
                Harmonia cromática, design centrado nas pessoas e identidade visual consistente para o seu negócio crescer.
              </p>
              <div class="mock-hero-cta">
                <button class="mock-cta-primary" [style.background-color]="c(0)">
                  Iniciar Projeto
                </button>
                <button class="mock-cta-secondary" [style.border-color]="c(1)" [style.color]="c(1)">
                  Ver Demonstração
                </button>
              </div>
            </div>

            <!-- Cards de Destaque -->
            <div class="mock-cards-row">
              <div class="mock-card" [style.border-top-color]="c(0)">
                <div class="mock-card-icon" [style.background-color]="c(0)">🎨</div>
                <h4>Paletas Harmoniosas</h4>
                <p>Equilíbrio visual baseado na teoria das cores e psicologia perceptual.</p>
              </div>
              <div class="mock-card" [style.border-top-color]="c(1)">
                <div class="mock-card-icon" [style.background-color]="c(1)">⚡</div>
                <h4>Alta Performance</h4>
                <p>Componentes leves, tipografia polida e acessibilidade WCAG garantida.</p>
              </div>
              <div class="mock-card" [style.border-top-color]="c(2)">
                <div class="mock-card-icon" [style.background-color]="c(2)">💎</div>
                <h4>Identidade Única</h4>
                <p>Cores que transmitem valores autênticos e acolhimento para sua marca.</p>
              </div>
            </div>
          </div>
        }

        <!-- 2. DASHBOARD DE MÉTRICAS -->
        @if (activeView() === 'dashboard') {
          <div class="mockup-canvas mockup-dashboard animate-fade-in">
            <div class="dash-header">
              <div>
                <h3>Visão Geral Financeira & Crescimento</h3>
                <span class="dash-subtitle">Métricas em tempo real • Últimos 30 dias</span>
              </div>
              <div class="dash-actions">
                <button class="mock-btn-sm" [style.background-color]="c(0)">Exportar Relatório</button>
              </div>
            </div>

            <!-- KPI Cards -->
            <div class="dash-kpi-grid">
              <div class="kpi-card">
                <span class="kpi-label">Receita Mensal</span>
                <div class="kpi-value" [style.color]="c(0)">R$ 48.920</div>
                <span class="kpi-trend" [style.color]="c(2)">+14.2% vs mês anterior</span>
              </div>
              <div class="kpi-card">
                <span class="kpi-label">Usuários Ativos</span>
                <div class="kpi-value" [style.color]="c(1)">12.450</div>
                <span class="kpi-trend" [style.color]="c(0)">+8.7% novas ativações</span>
              </div>
              <div class="kpi-card">
                <span class="kpi-label">Taxa de Conversão</span>
                <div class="kpi-value" [style.color]="c(2)">4.82%</div>
                <span class="kpi-trend" [style.color]="c(1)">Meta atingida ★</span>
              </div>
            </div>

            <!-- Gráfico de Barras Estilizado -->
            <div class="dash-chart-card">
              <h4>Desempenho Semanal</h4>
              <div class="chart-bars">
                <div class="bar-col">
                  <div class="bar-fill" [style.height]="'45%'" [style.background-color]="c(0)"></div>
                  <span>Seg</span>
                </div>
                <div class="bar-col">
                  <div class="bar-fill" [style.height]="'65%'" [style.background-color]="c(1)"></div>
                  <span>Ter</span>
                </div>
                <div class="bar-col">
                  <div class="bar-fill" [style.height]="'90%'" [style.background-color]="c(0)"></div>
                  <span>Qua</span>
                </div>
                <div class="bar-col">
                  <div class="bar-fill" [style.height]="'75%'" [style.background-color]="c(2)"></div>
                  <span>Qui</span>
                </div>
                <div class="bar-col">
                  <div class="bar-fill" [style.height]="'85%'" [style.background-color]="c(0)"></div>
                  <span>Sex</span>
                </div>
                <div class="bar-col">
                  <div class="bar-fill" [style.height]="'55%'" [style.background-color]="c(1)"></div>
                  <span>Sáb</span>
                </div>
              </div>
            </div>
          </div>
        }

        <!-- 3. APP MOBILE -->
        @if (activeView() === 'mobile') {
          <div class="mockup-canvas mockup-mobile-wrap animate-fade-in">
            <div class="phone-frame">
              <div class="phone-notch"></div>
              <!-- App Header -->
              <div class="phone-header" [style.background-color]="c(0)">
                <span>9:41</span>
                <span>Cromática App</span>
                <span>100% 🔋</span>
              </div>
              <!-- App Content -->
              <div class="phone-body">
                <div class="phone-hero-card" [style.background-color]="c(1)">
                  <span class="phone-hero-tag">Destaque de Hoje</span>
                  <h3>Explore Novas Inspirações</h3>
                  <button class="phone-mini-cta" [style.background-color]="c(0)">Abrir</button>
                </div>
                <div class="phone-feed-item">
                  <div class="phone-avatar" [style.background-color]="c(2)">PS</div>
                  <div>
                    <h5>Paleta Floral Cozy</h5>
                    <p>Coleção de Primavera 2026</p>
                  </div>
                </div>
                <div class="phone-feed-item">
                  <div class="phone-avatar" [style.background-color]="c(0)">AG</div>
                  <div>
                    <h5>Café Vintage & Livros</h5>
                    <p>Tons terrosos e acolhedores</p>
                  </div>
                </div>
              </div>
              <!-- App Nav Bar -->
              <div class="phone-bottom-nav">
                <span class="active-tab" [style.color]="c(0)">🏠 Feed</span>
                <span>🔍 Explorar</span>
                <span>❤️ Salvos</span>
                <span>👤 Perfil</span>
              </div>
            </div>
          </div>
        }

        <!-- 4. CARTÃO DE VISITA -->
        @if (activeView() === 'card') {
          <div class="mockup-canvas mockup-card-wrap animate-fade-in">
            <div class="business-card-frente" [style.background-color]="c(0)">
              <div class="card-logo-circle" [style.background-color]="c(2)">✦</div>
              <h3 class="card-brand-name">Paulo Sarmanho</h3>
              <p class="card-role">Arquiteto de Software & Designer</p>
            </div>
            <div class="business-card-verso" [style.background-color]="c(1)">
              <div class="verso-content">
                <h4>Cromática Design</h4>
                <p>paulo-sarmanho-dev.netlify.app</p>
                <p>paulodetarso99&#64;live.com</p>
                <div class="card-strip" [style.background-color]="c(2)"></div>
              </div>
            </div>
          </div>
        }

        <!-- 5. TELA DE LOGIN -->
        @if (activeView() === 'login') {
          <div class="mockup-canvas mockup-login-wrap animate-fade-in">
            <div class="login-card-box">
              <div class="login-badge-icon" [style.background-color]="c(0)">☕</div>
              <h3>Bem-vindo de Volta</h3>
              <p class="login-sub">Acesse seu cantinho de design e paletas</p>

              <div class="login-input-group">
                <label>E-mail</label>
                <input type="text" placeholder="seuemail@exemplo.com" readonly />
              </div>
              <div class="login-input-group">
                <label>Senha</label>
                <input type="password" value="••••••••" readonly />
              </div>

              <button class="login-submit-btn" [style.background-color]="c(0)">
                Entrar na Conta
              </button>
              <span class="login-footer-link" [style.color]="c(1)">Criar nova conta gratuita</span>
            </div>
          </div>
        }

        <!-- 6. POST DE REDE SOCIAL -->
        @if (activeView() === 'social') {
          <div class="mockup-canvas mockup-social-wrap animate-fade-in">
            <div class="social-banner" [style.background]="'linear-gradient(135deg, ' + c(0) + ' 0%, ' + c(1) + ' 100%)'">
              <div class="social-top-pill" [style.background-color]="c(2)">
                DICA DE DESIGN
              </div>
              <h2 class="social-banner-title">
                Como usar cores aconchegantes para aumentar a retenção do seu app.
              </h2>
              <div class="social-footer-bar">
                <span>✦ @paulosarmanhodev</span>
                <span>Arraste para o lado ➔</span>
              </div>
            </div>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .mockups-card {
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

    .theme-toggle-wrap {
      display: flex;
      background: var(--bg-secondary);
      border: 1px solid var(--border-light);
      border-radius: var(--radius-pill);
      padding: 2px;
    }

    .theme-pill-btn {
      font-size: 0.82rem;
      font-weight: 700;
      padding: 0.35rem 0.8rem;
      border-radius: var(--radius-pill);
      color: var(--text-secondary);
    }

    .theme-pill-btn.active {
      background: var(--bg-surface);
      color: var(--text-primary);
      box-shadow: var(--shadow-subtle);
    }

    .mockup-tabs {
      display: flex;
      gap: 0.5rem;
      overflow-x: auto;
      padding-bottom: 0.75rem;
      margin-bottom: 1.25rem;
      border-bottom: 1px solid var(--border-light);
    }

    .mockup-tab-btn {
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

    .mockup-tab-btn:hover {
      background: var(--bg-surface);
      color: var(--text-primary);
    }

    .mockup-tab-btn.active {
      background: var(--text-primary);
      color: #FFFFFF;
      border-color: var(--text-primary);
    }

    /* Viewport Container */
    .preview-viewport {
      background: #FFFFFF;
      border: 1px solid var(--border-light);
      border-radius: var(--radius-md);
      padding: 1.5rem;
      min-height: 480px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: inset 0 2px 6px rgba(0, 0, 0, 0.02);
      transition: background 0.3s ease;
    }

    .preview-viewport.dark-theme {
      background: #18181B;
      border-color: #27272A;
      color: #F4F4F5;
    }

    .mockup-canvas {
      width: 100%;
      max-width: 900px;
    }

    /* 1. Website */
    .mockup-website {
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }

    .mock-nav {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 1rem;
      border-bottom: 1px solid rgba(0, 0, 0, 0.08);
    }

    .dark-theme .mock-nav {
      border-color: rgba(255, 255, 255, 0.1);
    }

    .mock-brand {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 1.1rem;
    }

    .mock-logo-dot {
      width: 14px;
      height: 14px;
      border-radius: 50%;
    }

    .mock-nav-links {
      display: flex;
      gap: 1.5rem;
      font-size: 0.88rem;
      font-weight: 500;
      opacity: 0.8;
    }

    @media (max-width: 640px) {
      .mock-nav-links { display: none; }
    }

    .mock-btn-sm {
      color: #FFFFFF;
      padding: 0.45rem 1rem;
      border-radius: var(--radius-pill);
      font-size: 0.82rem;
      font-weight: 700;
    }

    .mock-hero {
      text-align: center;
      padding: 2rem 1rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
    }

    .mock-pill-badge {
      font-size: 0.75rem;
      font-weight: 700;
      padding: 0.2rem 0.75rem;
      border-radius: var(--radius-pill);
      border: 1px solid;
    }

    .mock-hero-title {
      font-size: 2.2rem;
      max-width: 680px;
      line-height: 1.2;
    }

    .mock-hero-p {
      max-width: 520px;
      font-size: 0.95rem;
      opacity: 0.75;
    }

    .mock-hero-cta {
      display: flex;
      gap: 0.75rem;
      margin-top: 0.5rem;
    }

    .mock-cta-primary {
      color: #FFFFFF;
      padding: 0.7rem 1.6rem;
      border-radius: var(--radius-pill);
      font-weight: 700;
      font-size: 0.95rem;
    }

    .mock-cta-secondary {
      background: transparent;
      border: 2px solid;
      padding: 0.7rem 1.4rem;
      border-radius: var(--radius-pill);
      font-weight: 700;
      font-size: 0.95rem;
    }

    .mock-cards-row {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1rem;
    }

    @media (max-width: 768px) {
      .mock-cards-row { grid-template-columns: 1fr; }
    }

    .mock-card {
      background: rgba(0, 0, 0, 0.03);
      border-top: 4px solid;
      padding: 1.25rem;
      border-radius: var(--radius-sm);
    }

    .dark-theme .mock-card {
      background: rgba(255, 255, 255, 0.05);
    }

    .mock-card-icon {
      width: 36px;
      height: 36px;
      border-radius: var(--radius-xs);
      color: #FFFFFF;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.1rem;
      margin-bottom: 0.75rem;
    }

    .mock-card h4 {
      font-size: 1rem;
      margin-bottom: 0.35rem;
    }

    .mock-card p {
      font-size: 0.82rem;
      opacity: 0.7;
    }

    /* 2. Dashboard */
    .mockup-dashboard {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .dash-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .dash-subtitle {
      font-size: 0.82rem;
      opacity: 0.7;
    }

    .dash-kpi-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1rem;
    }

    @media (max-width: 640px) {
      .dash-kpi-grid { grid-template-columns: 1fr; }
    }

    .kpi-card {
      background: rgba(0, 0, 0, 0.03);
      padding: 1.25rem;
      border-radius: var(--radius-md);
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .dark-theme .kpi-card {
      background: rgba(255, 255, 255, 0.05);
    }

    .kpi-label {
      font-size: 0.78rem;
      font-weight: 600;
      opacity: 0.7;
    }

    .kpi-value {
      font-family: var(--font-mono);
      font-size: 1.8rem;
      font-weight: 800;
    }

    .kpi-trend {
      font-size: 0.75rem;
      font-weight: 700;
    }

    .dash-chart-card {
      background: rgba(0, 0, 0, 0.02);
      border: 1px solid rgba(0, 0, 0, 0.06);
      border-radius: var(--radius-md);
      padding: 1.5rem;
    }

    .dark-theme .dash-chart-card {
      background: rgba(255, 255, 255, 0.03);
      border-color: rgba(255, 255, 255, 0.08);
    }

    .chart-bars {
      display: flex;
      justify-content: space-around;
      align-items: flex-end;
      height: 160px;
      margin-top: 1rem;
      padding-bottom: 0.5rem;
      border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    }

    .dark-theme .chart-bars {
      border-color: rgba(255, 255, 255, 0.1);
    }

    .bar-col {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
      height: 100%;
      justify-content: flex-end;
    }

    .bar-fill {
      width: 32px;
      border-radius: 6px 6px 0 0;
      transition: height 0.3s ease;
    }

    .bar-col span {
      font-size: 0.75rem;
      opacity: 0.65;
    }

    /* 3. Mobile */
    .mockup-mobile-wrap {
      display: flex;
      justify-content: center;
    }

    .phone-frame {
      width: 290px;
      background: #FFFFFF;
      border: 8px solid #27272A;
      border-radius: 36px;
      overflow: hidden;
      box-shadow: var(--shadow-lg);
      display: flex;
      flex-direction: column;
    }

    .dark-theme .phone-frame {
      background: #18181B;
    }

    .phone-notch {
      width: 80px;
      height: 14px;
      background: #27272A;
      border-radius: 0 0 10px 10px;
      margin: 0 auto;
    }

    .phone-header {
      color: #FFFFFF;
      padding: 0.6rem 1rem;
      font-size: 0.75rem;
      font-weight: 700;
      display: flex;
      justify-content: space-between;
    }

    .phone-body {
      padding: 1rem;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      flex: 1;
    }

    .phone-hero-card {
      color: #FFFFFF;
      padding: 1.2rem;
      border-radius: var(--radius-sm);
    }

    .phone-hero-tag {
      font-size: 0.7rem;
      opacity: 0.85;
    }

    .phone-mini-cta {
      margin-top: 0.5rem;
      color: #FFFFFF;
      font-size: 0.75rem;
      font-weight: 700;
      padding: 0.35rem 0.8rem;
      border-radius: var(--radius-pill);
    }

    .phone-feed-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.5rem;
      background: rgba(0, 0, 0, 0.03);
      border-radius: var(--radius-sm);
    }

    .dark-theme .phone-feed-item {
      background: rgba(255, 255, 255, 0.05);
    }

    .phone-avatar {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      color: #FFFFFF;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 0.8rem;
    }

    .phone-feed-item h5 {
      font-size: 0.82rem;
    }

    .phone-feed-item p {
      font-size: 0.72rem;
      opacity: 0.7;
    }

    .phone-bottom-nav {
      display: flex;
      justify-content: space-around;
      padding: 0.75rem;
      border-top: 1px solid rgba(0, 0, 0, 0.08);
      font-size: 0.72rem;
      font-weight: 600;
    }

    /* 4. Business Card */
    .mockup-card-wrap {
      display: flex;
      gap: 1.5rem;
      justify-content: center;
      flex-wrap: wrap;
    }

    .business-card-frente, .business-card-verso {
      width: 340px;
      height: 190px;
      border-radius: 12px;
      color: #FFFFFF;
      padding: 1.5rem;
      box-shadow: var(--shadow-md);
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }

    .card-logo-circle {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.2rem;
    }

    .card-brand-name {
      font-size: 1.3rem;
      letter-spacing: -0.01em;
    }

    .card-role {
      font-size: 0.8rem;
      opacity: 0.85;
    }

    .verso-content {
      display: flex;
      flex-direction: column;
      gap: 0.4rem;
      font-size: 0.82rem;
      opacity: 0.9;
    }

    .card-strip {
      height: 6px;
      border-radius: 3px;
      margin-top: 0.8rem;
    }

    /* 5. Login */
    .mockup-login-wrap {
      display: flex;
      justify-content: center;
    }

    .login-card-box {
      width: 340px;
      padding: 2rem 1.5rem;
      background: rgba(0, 0, 0, 0.03);
      border: 1px solid rgba(0, 0, 0, 0.08);
      border-radius: var(--radius-lg);
      text-align: center;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .dark-theme .login-card-box {
      background: rgba(255, 255, 255, 0.04);
      border-color: rgba(255, 255, 255, 0.1);
    }

    .login-badge-icon {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      color: #FFFFFF;
      font-size: 1.4rem;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 0.5rem auto;
    }

    .login-sub {
      font-size: 0.82rem;
      opacity: 0.7;
    }

    .login-input-group {
      text-align: left;
      display: flex;
      flex-direction: column;
      gap: 0.2rem;
    }

    .login-input-group label {
      font-size: 0.75rem;
      font-weight: 700;
    }

    .login-submit-btn {
      color: #FFFFFF;
      font-weight: 700;
      font-size: 0.9rem;
      padding: 0.7rem;
      border-radius: var(--radius-pill);
      margin-top: 0.5rem;
    }

    .login-footer-link {
      font-size: 0.75rem;
      font-weight: 600;
      cursor: pointer;
    }

    /* 6. Social */
    .mockup-social-wrap {
      display: flex;
      justify-content: center;
    }

    .social-banner {
      width: 360px;
      height: 360px;
      border-radius: var(--radius-md);
      color: #FFFFFF;
      padding: 2rem;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      box-shadow: var(--shadow-lg);
    }

    .social-top-pill {
      align-self: flex-start;
      font-size: 0.7rem;
      font-weight: 800;
      padding: 0.25rem 0.65rem;
      border-radius: var(--radius-pill);
    }

    .social-banner-title {
      font-size: 1.6rem;
      line-height: 1.25;
      font-family: var(--font-serif);
    }

    .social-footer-bar {
      display: flex;
      justify-content: space-between;
      font-size: 0.78rem;
      font-weight: 600;
      opacity: 0.9;
    }
  `]
})
export class MockupsPreviewComponent {
  readonly paletteService = inject(PaletteService);

  readonly activeView = signal<MockupView>('website');
  readonly isDarkMode = signal<boolean>(false);

  c(index: number): string {
    const list = this.paletteService.currentColors();
    if (list.length === 0) return '#E07A5F';
    return list[index % list.length].hex;
  }
}
