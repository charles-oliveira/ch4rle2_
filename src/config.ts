export const SITE = {
  name: 'ch4rle2',
  title: 'ch4rle2 — notas & newsletter',
  description:
    'Site pessoal e newsletter de ch4rle2. Textos curtos sobre tecnologia, software e ideias.',
  // Troque para o endereço real do seu Substack quando estiver pronto
  substackUrl: 'https://ch4rle2.substack.com',
  // Ative como true quando o Substack estiver publicado para buscar o RSS real no build
  fetchLiveSubstack: false,
  links: [
    { label: 'substack', href: 'https://ch4rle2.substack.com' },
    { label: 'github', href: 'https://github.com/ch4rle2' },
    { label: 'rss', href: 'https://ch4rle2.substack.com/feed' },
    { label: 'email', href: 'mailto:oi@ch4rle2.dev' },
  ],
} as const;

