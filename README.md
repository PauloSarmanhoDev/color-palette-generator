# 🎨 Cromática • Gerador de Paletas de Cores Inteligente & Cozy

> Um gerador de paletas de cores aconchegante, estético e repleto de recursos profissionais para designers e desenvolvedores web. Crie combinações harmoniosas, extraia cores de fotos, ajuste atmosferas emocionais, valide acessibilidade WCAG e exporte código pronto para uso.

[![Angular](https://img.shields.io/badge/Angular-22+-DD0031?style=for-the-badge&logo=angular&logoColor=white)](https://angular.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![PWA Ready](https://img.shields.io/badge/PWA-Pronto_para_Instalar-5A0FC8?style=for-the-badge&logo=pwa&logoColor=white)](https://web.dev/progressive-web-apps/)
[![Netlify Status](https://img.shields.io/badge/Deploy-Netlify-00C7B7?style=for-the-badge&logo=netlify&logoColor=white)](https://www.netlify.com/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](LICENSE)

---

## 🎯 Objetivo do Projeto

O **Cromática** foi desenvolvido para transformar o processo de criação e exploração de paletas cromáticas em uma experiência relaxante, intuitiva e tecnicamente precisa. Diferente de geradores genéricos e puramente utilitários, o Cromática adota uma **identidade visual cozy** (aconchegante), unindo a teoria das cores à usabilidade prática do dia a dia do desenvolvimento de software e design de interfaces.

---

## ✨ Funcionalidades

### 1. Funcionalidades Essenciais
- **Geração Inteligente de Paletas**: Escolha gerar **3, 5 ou 8 cores** perfeitamente equilibradas com suporte a harmonias:
  - *Tons de Terra (Cozy)*
  - *Complementar*
  - *Análoga*
  - *Monocromática*
  - *Triádica*
  - *Tetrádica*
  - *Pastel*
  - *Vibrante*
  - *Harmonia Orgânica*
- **Cores Editáveis & Copiáveis**:
  - Clique para copiar valores em **HEX**, **RGB** ou **HSL**.
  - Editor manual detalhado para ajustar canais de cor e matiz.
  - Bloqueio de cores (**Lock 🔒**) para fixar suas tonalidades favoritas enquanto gera novas combinações ao redor delas.
- **Gerar Novamente com 1 Clique ou Atalho**:
  - Botão principal com micro-interações táteis.
  - Pressione a **Barra de Espaço (Spacebar)** para gerar instantaneamente.
  - Efeitos sonoros acústicos sintetizados via Web Audio API (com opção de silenciar).
- **Favoritos & Histórico Persistente**:
  - Salve suas paletas favoritas no navegador (`localStorage`).
  - Personalize nomes poéticos para suas paletas.
  - Histórico automático das últimas 20 combinações geradas com restauração em 1 clique.
  - Exportação da coleção completa em formato JSON estruturado.

### 2. Funcionalidades Diferenciadas (Alto Impacto)
- **📷 Extrair Paleta de uma Imagem**: Envie fotos, ilustrações ou referências visuais via upload ou drag-and-drop. O algoritmo de quantização e amostragem em Canvas identifica as cores dominantes e mais vibrantes para montar sua paleta automaticamente. Inclui fotos de exemplo pré-carregadas.
- **💡 Paletas por Descrição Conceitual**: Digite qualquer conceito ou sentimento (ex: *"pôr do sol tropical"*, *"tecnologia futurista"*, *"floresta mágica"*, *"luxo minimalista"*, *"café aconchegante"*) e gere paletas temáticas instantâneas com apoio de sugestões rápidas.
- **🎛️ Controle de Personalidade das Cores**: Ajuste em tempo real:
  - *Saturação* (-100% a +100%)
  - *Luminosidade* (-50 a +50)
  - *Temperatura Térmica* (Tons Frios ❄️ / Tons Quentes ☀️)
  - *Contraste Dinâmico* (-50 a +50)
- **👁️ Simulador de Daltonismo & Acessibilidade WCAG 2.1**:
  - Simule a visão de usuários com **Protanopia**, **Deuteranopia**, **Tritanopia** e **Acromatopsia** (monocromacia).
  - Cálculo de contraste relativo com badges de conformidade **AA** e **AAA** tanto para texto claro quanto escuro.
- **🖥️ Pré-visualização em Projetos Reais (Mockups Interativos)**:
  - *Website / Landing Page*
  - *Dashboard de Métricas & Gráficos*
  - *Aplicativo Mobile*
  - *Cartão de Visita Corporativo*
  - *Tela de Login / Autenticação*
  - *Post de Rede Social*
  - *Alternância de Modo Claro e Modo Escuro* para testar contrastes em ambas as superfícies.
- **Variações Instantâneas**: 1 clique para transformar qualquer combinação em versões *Mais Clara*, *Mais Escura*, *Pastel*, *Vibrante* ou *Quente*.

### 3. Ferramentas para Designers e Desenvolvedores
| Ferramenta | Descrição |
|---|---|
| **Exportar CSS** | Gera variáveis modernas para `:root` (`--color-1: #...;`) com nomes poéticos em comentários. |
| **Exportar Tailwind** | Cria a estrutura pronta de `theme.extend.colors` para o `tailwind.config.js`. |
| **Exportar JSON** | Objeto estruturado com códigos HEX, RGB, HSL e scores de contraste. |
| **Exportar PNG / SVG** | Download em alta resolução com cartela de cores ou arquivo SVG vetorial limpo. |
| **Gerador de Gradientes** | Gradientes lineares (com slider de ângulo 0° a 360°) e radiais com CSS copiável. |
| **Escala Tonal (50 a 950)** | Gera automaticamente a régua completa de 11 tons (50, 100, 200... 950) para qualquer cor base. |
| **Cores Semânticas** | Sugestões para papéis de sistema (*Primary*, *Secondary*, *Accent*, *Background*, *Success*, *Danger*, etc.). |
| **Matriz de Contraste** | Tabela cruzada WCAG entre todas as cores da paleta com taxas e notas. |
| **Link Compartilhável** | Paletas serializadas na URL (`#palette=...`) para compartilhamento imediato. |

### 4. Ideias Criativas & Desafios
- **🍂 Estações do Ano**: Paletas consagradas para *Primavera*, *Verão*, *Outono* e *Inverno*.
- **✨ Estéticas & Subculturas**: Temas pré-configurados como *Cottagecore*, *Retrô Anos 70*, *Vaporwave*, *Cyberpunk*, *Minimalista Escandinavo*, *Brutalista* e *Y2K*.
- **🎯 Desafio de Cores (Creative Challenge)**: Desafios gerados com briefings aleatórios (ex: "Crie a identidade de uma livraria & café usando apenas estas cores") com celebração de confetes ao concluir!
- **📖 Nomes Poéticos**: Dicionário de mais de 300 nomes expressivos em português atribuídos matematicamente por aproximação perceptual da cor.

---

## 🛠️ Tecnologias Utilizadas

- **[Angular](https://angular.dev/)**: Framework moderno com componentes Standalone, Signals reativos e arquitetura desacoplada.
- **[TypeScript](https://www.typescriptlang.org/)**: Tipagem estrita e cálculo robusto de modelos cromáticos.
- **[CSS3 Vanilla / Design Tokens]**: Sistema de variáveis CSS, sombras orgânicas, animações fluidas e identidade cozy.
- **[Canvas API]**: Extração inteligente de cores a partir de pixels de imagens e renderização de cartelas PNG em alta resolução.
- **[Web Audio API]**: Síntese de áudio leve e acolhedora para micro-interações sem dependência de arquivos externos.
- **[canvas-confetti]**: Efeitos comemorativos para ações especiais.
- **[@angular/pwa]**: Manifesto Web App e Service Worker para instalação em dispositivos móveis e desktop com suporte offline.

---

## 🚀 Como Executar o Projeto Localmente

### Pré-requisitos
- **Node.js**: v18+ ou superior (recomendado v20+)
- **NPM**: v9+ ou superior

### Passo a passo
1. Clone ou acesse o diretório do projeto:
   ```bash
   cd color-palette-generator
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Inicie o servidor de desenvolvimento:
   ```bash
   npm start
   ```

4. Abra no seu navegador:
   ```text
   http://localhost:4200/
   ```

---

## 🌐 Deploy na Netlify

O projeto já inclui o arquivo [`netlify.toml`](./netlify.toml) configurado para roteamento SPA e cabeçalhos de segurança otimizados.

### Opção 1: Deploy com Netlify CLI
```bash
# 1. Instale a CLI da Netlify caso ainda não tenha
npm install -g netlify-cli

# 2. Faça o build de produção
npm run build

# 3. Realize o deploy
netlify deploy --prod --dir=dist/color-palette-generator/browser
```

### Opção 2: Deploy Contínuo via GitHub / GitLab
1. Suba este repositório para o seu **GitHub**.
2. Conecte o repositório na dashboard da **[Netlify](https://app.netlify.com/)**.
3. A Netlify detectará automaticamente o arquivo `netlify.toml`:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist/color-palette-generator/browser`
4. Clique em **Deploy Site**. Em instantes seu site estará online com HTTPS gratuito e CDN global!

---

## 📱 Suporte a PWA (Progressive Web App)

O aplicativo atende aos requisitos de PWA e pode ser instalado:
- **No Google Chrome / Edge (Desktop)**: Clique no ícone de computador/instalação na barra de endereços.
- **No Android**: Toque no banner "Adicionar à tela inicial".
- **No iOS (Safari)**: Toque em "Compartilhar" e selecione "Adicionar à Tela de Início".

---

## 👨‍💻 Desenvolvedor & Contato

Projeto idealizado e desenvolvido por **Paulo Sarmanho**:

- 💼 **LinkedIn**: [paulo-sarmanho](https://www.linkedin.com/in/paulo-sarmanho/)
- 🐙 **GitHub**: [PauloSarmanhoDev](https://github.com/PauloSarmanhoDev)
- 🌐 **Portfólio**: [paulo-sarmanho-dev.netlify.app](https://paulo-sarmanho-dev.netlify.app/)
- ✉️ **E-mail**: [paulodetarso99@live.com](mailto:paulodetarso99@live.com)

### ☕ Apoie este Projeto via PIX
Se este gerador foi útil para seus projetos de design e código, considere apoiar o desenvolvimento contínuo:
- **Chave PIX (Aleatória)**: `57886499-456c-43e8-93b9-8903f94e1452`

---

*Cromática • Cores que abraçam suas ideias.*
