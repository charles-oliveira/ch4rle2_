import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const dicaItemSchema = z.object({
  tipo: z.enum([
    'livro',
    'filme',
    'serie',
    'musica',
    'artigo',
    'video',
    'ferramenta',
    'outro',
  ]),
  titulo: z.string().min(1),
  nota: z.string().min(1).optional(),
  imagem: z.string().min(1).optional(),
  imagemAlt: z.string().optional(),
  citacao: z.string().min(1).optional(),
  citacaoFonte: z.string().optional(),
  link: z.string().url().optional(),
});

const dicas = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/dicas' }),
  schema: z.object({
    edicao: z.number().int().positive(),
    data: z.coerce.date(),
    titulo: z.string().optional(),
    dicas: z.array(dicaItemSchema).min(1).max(5),
  }),
});

export const collections = { dicas };
