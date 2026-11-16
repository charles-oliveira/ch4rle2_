import { readdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const dicasDir = new URL('../src/content/dicas/', import.meta.url).pathname;

function getNextFriday(from = new Date()) {
  const date = new Date(from);
  const day = date.getDay(); // 0 = domingo, 5 = sexta
  const diff = (5 - day + 7) % 7;
  date.setDate(date.getDate() + diff);
  return date.toISOString().slice(0, 10);
}

function getNextEdition() {
  if (!existsSync(dicasDir)) return 1;
  const files = readdirSync(dicasDir).filter((f) => f.endsWith('.md'));
  let maxEdition = 0;

  for (const file of files) {
    const content = readFileSync(join(dicasDir, file), 'utf-8');
    const match = content.match(/^edicao:\s*(\d+)/m);
    if (match) {
      maxEdition = Math.max(maxEdition, Number.parseInt(match[1], 10));
    }
  }

  return maxEdition + 1;
}

const targetDate = process.argv[2] ?? getNextFriday();
const nextEdition = getNextEdition();
const filePath = join(dicasDir, `${targetDate}.md`);

if (existsSync(filePath)) {
  console.error(`Já existe um arquivo para ${targetDate}: ${filePath}`);
  process.exit(1);
}

const template = `---
edicao: ${nextEdition}
data: ${targetDate}
titulo: "Tema opcional da semana"
dicas:
  - tipo: livro
    titulo: "Título do livro — Autor"
    # imagem: "/images/dicas/exemplo.jpg"
    # imagemAlt: "Descrição da imagem"
    nota: "Por que vale a pena em 1 ou 2 linhas."
    # citacao: "Trecho marcante do livro."
    # citacaoFonte: "Autor, p. 42"
    # link: "https://..."
  - tipo: filme
    titulo: "Nome do filme (Ano)"
    nota: "Comentário rápido sem spoilers."
  - tipo: artigo
    titulo: "Título do artigo ou ensaio"
    nota: "O que chamou atenção."
    link: "https://example.com"
  - tipo: musica
    titulo: "Artista — Álbum ou faixa"
    nota: "Clima ou contexto bom para ouvir."
  - tipo: ferramenta
    titulo: "Nome da ferramenta ou projeto"
    nota: "Para que serve no dia a dia."
---
`;

writeFileSync(filePath, template, 'utf-8');
console.log(`Criado: src/content/dicas/${targetDate}.md (Edição #${nextEdition})`);

