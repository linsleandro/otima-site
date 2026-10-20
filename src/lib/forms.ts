import { z } from 'zod';

// Validação server-side de todos os formulários públicos (CLAUDE.md §2.2, §5).
// Nunca confiar em validação client-side: todo submit passa por aqui.

const nome = z.string().trim().min(2, 'Informe seu nome.').max(120);
const email = z.string().trim().toLowerCase().email('E-mail inválido.').max(200);
const telefone = z
  .string()
  .trim()
  .max(30)
  .regex(/^[\d\s()+.-]*$/, 'Telefone inválido.')
  .optional()
  .or(z.literal(''));
const textoLongo = z.string().trim().min(10, 'Descreva com um pouco mais de detalhe.').max(3000);

// LGPD: consentimento explícito obrigatório (checkbox envia "on").
const consentimento = z.literal('on', {
  error: 'É preciso aceitar a política de privacidade.',
});

// Honeypot: campo invisível para humanos; se vier preenchido, é bot.
const honeypot = z.literal('').optional();

const base = { nome, email, consentimento, website: honeypot };

export const contatoSchema = z.object({
  form: z.literal('contato'),
  ...base,
  telefone,
  tipo: z.enum(['sistema-s', 'pme', 'outro']),
  mensagem: textoLongo,
});

export const institucionalSchema = z.object({
  form: z.literal('institucional'),
  ...base,
  cargo: z.string().trim().min(2).max(120),
  instituicao: z.string().trim().min(2).max(200),
  telefone,
  demanda: z.enum(['licitacao', 'proposta-tecnica', 'cotacao', 'outro']),
  descricao: textoLongo,
});

// Parecer Estratégico: porta de entrada mínima (decisão de 20/10/2026 — menos
// fricção para o Décio). Só nome, WhatsApp e a decisão travada; o resto é
// descoberto na call de 30 min. Sem e-mail: a conversa acontece no WhatsApp.
export const parecerSchema = z.object({
  form: z.literal('parecer'),
  nome,
  consentimento,
  website: honeypot,
  whatsapp: z
    .string()
    .trim()
    .min(8, 'Informe um WhatsApp válido.')
    .max(30)
    .regex(/^[\d\s()+.-]+$/, 'WhatsApp inválido.'),
  decisao: textoLongo.max(2000),
});

export const formSchema = z.discriminatedUnion('form', [
  contatoSchema,
  institucionalSchema,
  parecerSchema,
]);

export type FormSubmission = z.infer<typeof formSchema>;

export function parseSubmission(formData: FormData) {
  const raw: Record<string, string> = {};
  for (const [key, value] of formData.entries()) {
    // Só aceitamos campos de texto — uploads são descartados.
    if (typeof value === 'string') raw[key] = value;
  }
  return formSchema.safeParse(raw);
}

// Todo valor vindo do usuário é escapado antes de entrar no HTML do e-mail.
export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
