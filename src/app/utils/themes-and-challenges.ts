import { ColorChallenge } from '../models/color.models';

export interface ThemePreset {
  id: string;
  name: string;
  category: 'Estação' | 'Estética';
  description: string;
  colors: string[];
}

export const THEME_PRESETS: ThemePreset[] = [
  // Estações
  {
    id: 'primavera',
    name: 'Primavera em Flor',
    category: 'Estação',
    description: 'Brotos verdes, flores de cerejeira e brisas perfumadas',
    colors: ['#F472B6', '#86EFAC', '#FDE047', '#38BDF8', '#C084FC']
  },
  {
    id: 'verao',
    name: 'Verão Tropical & Golden Hour',
    category: 'Estação',
    description: 'Sol dourado da tarde, águas cristalinas e areia quente',
    colors: ['#F97316', '#FBBF24', '#06B6D4', '#F43F5E', '#FEF08A']
  },
  {
    id: 'outono',
    name: 'Outono Aconchegante',
    category: 'Estação',
    description: 'Folhas secas de bordo, canela em pó, abóbora e chá quente',
    colors: ['#C2410C', '#D97706', '#7C2D12', '#E9C46A', '#CCD5AE']
  },
  {
    id: 'inverno',
    name: 'Inverno Nórdico',
    category: 'Estação',
    description: 'Gelo alpino, pinheiros escuros, bruma matinal e aconchego da lareira',
    colors: ['#0C4A6E', '#0284C7', '#BAE6FD', '#334155', '#E2E8F0']
  },

  // Estéticas
  {
    id: 'cottagecore',
    name: 'Cottagecore & Linho',
    category: 'Estética',
    description: 'Casas de campo, sálvia fresca, cerâmica artesanal e flores secas',
    colors: ['#81B29A', '#E07A5F', '#F4F1DE', '#3D405B', '#F2CC8F']
  },
  {
    id: 'vintage-70s',
    name: 'Retrô Anos 70',
    category: 'Estética',
    description: 'Tons quentes de vinil, mostarda nostálgica, veludo e madeira',
    colors: ['#E76F51', '#F4A261', '#E9C46A', '#2A9D8F', '#264653']
  },
  {
    id: 'cafe-cozy',
    name: 'Café & Livros Antigos',
    category: 'Estética',
    description: 'Grãos torrados, caramelo toffee, páginas amareladas e vapor suave',
    colors: ['#3E2723', '#795548', '#D4A373', '#FAEDCD', '#E07A5F']
  },
  {
    id: 'vaporwave',
    name: 'Vaporwave Sunset',
    category: 'Estética',
    description: 'Ciano neon, fúcsia elétrico, pôr do sol sintético e nostalgia lo-fi',
    colors: ['#FF007F', '#7928CA', '#00F0FF', '#FFE600', '#2B0938']
  },
  {
    id: 'cyberpunk',
    name: 'Cyberpunk Neon Matrix',
    category: 'Estética',
    description: 'Asfalto molhado de chuva refletindo neons de arranha-céus futuristas',
    colors: ['#00FFA3', '#00F0FF', '#FFE600', '#FF0055', '#0A0A14']
  },
  {
    id: 'minimalista',
    name: 'Minimalismo Escandinavo',
    category: 'Estética',
    description: 'Pureza visual, espaços brancos, madeira de bétula e contraste zen',
    colors: ['#1C1917', '#78716C', '#D6D3D1', '#F5F5F4', '#3B82F6']
  },
  {
    id: 'brutalista',
    name: 'Brutalismo Digital',
    category: 'Estética',
    description: 'Contraste cru e visceral, sem firulas, direto ao ponto com alta energia',
    colors: ['#000000', '#FFFFFF', '#FF3B30', '#FFCC00', '#0055FF']
  },
  {
    id: 'y2k',
    name: 'Y2K Cyber Millennium',
    category: 'Estética',
    description: 'Prata espelhada, rosa chiclete, azul glacê e otimismo do ano 2000',
    colors: ['#EC4899', '#38BDF8', '#A855F7', '#E2E8F0', '#FDE047']
  }
];

export const COLOR_CHALLENGES: ColorChallenge[] = [
  {
    title: 'Cafeteria & Livraria Cozy',
    description: 'Crie a identidade visual de uma cafeteria artesanal em uma livraria com cantinho de leitura, utilizando exatamente as cores da sua paleta.',
    category: 'Branding',
    difficulty: 'Fácil'
  },
  {
    title: 'Festival de Música Indie no Pôr do Sol',
    description: 'Desenvolva o cartaz promocional e ingressos para um festival de música ao ar livre durante o fim de tarde.',
    category: 'Poster',
    difficulty: 'Médio'
  },
  {
    title: 'App de Mindfulness & Relaxamento',
    description: 'Projete a tela inicial de um aplicativo móvel voltado para meditação guiada, respiração e sono tranquilo.',
    category: 'Web',
    difficulty: 'Inspiração'
  },
  {
    title: 'Velas Aromáticas Botânicas',
    description: 'Crie o rótulo e embalagem para uma nova linha de velas aromáticas artesanais feitas com ceras vegetais e essências naturais.',
    category: 'Produto',
    difficulty: 'Fácil'
  },
  {
    title: 'Dashboard de Observatório Espacial',
    description: 'Crie a interface de monitoramento de satélites e mapas estelares com alto contraste e legibilidade impecável.',
    category: 'Web',
    difficulty: 'Médio'
  },
  {
    title: 'Ilustração Editorial de Revista',
    description: 'Faça uma composição artística para uma matéria sobre equilíbrio entre trabalho remoto e qualidade de vida.',
    category: 'Ilustração',
    difficulty: 'Inspiração'
  }
];
