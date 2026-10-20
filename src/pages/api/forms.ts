import type { APIRoute } from 'astro';
import { Resend } from 'resend';
import { escapeHtml, parseSubmission, type FormSubmission } from '../../lib/forms';
import { createRateLimiter } from '../../lib/rate-limit';

export const prerender = false;

// 5 submissões por IP a cada 10 minutos (CLAUDE.md §5).
const limiter = createRateLimiter({ limit: 5, windowMs: 10 * 60_000 });

const RETURN_PATHS: Record<string, string> = {
  contato: '/contato',
  institucional: '/institucional',
  parecer: '/parecer-estrategico',
};

const FIELD_LABELS: Record<string, string> = {
  nome: 'Nome',
  email: 'E-mail',
  telefone: 'Telefone',
  whatsapp: 'WhatsApp',
  tipo: 'Perfil',
  cargo: 'Cargo',
  instituicao: 'Instituição',
  demanda: 'Tipo de demanda',
  descricao: 'Descrição',
  mensagem: 'Mensagem',
  decisao: 'Decisão travada',
  contexto: 'Contexto',
  faturamento: 'Faixa de faturamento',
};

const SUBJECTS: Record<FormSubmission['form'], string> = {
  contato: '[Site] Novo contato',
  institucional: '[Site] Solicitação de proposta institucional',
  parecer: '[Site] Registro de interesse — Parecer Estratégico',
};

function buildEmailHtml(data: FormSubmission): string {
  const rows = Object.entries(data)
    .filter(([key]) => key !== 'form' && key !== 'consentimento' && key !== 'website')
    .map(
      ([key, value]) =>
        `<tr><td style="padding:4px 12px 4px 0"><strong>${FIELD_LABELS[key] ?? key}</strong></td>` +
        `<td style="padding:4px 0">${escapeHtml(String(value ?? ''))}</td></tr>`,
    )
    .join('');
  return `<p>Nova submissão do site (${escapeHtml(data.form)}), com consentimento LGPD registrado.</p><table>${rows}</table>`;
}

async function deliver(data: FormSubmission): Promise<void> {
  const apiKey = import.meta.env.RESEND_API_KEY;
  if (!apiKey) {
    // Sem chave (dev/preview): não entrega e não loga conteúdo do formulário
    // (CLAUDE.md §5 — sem dados sensíveis em logs).
    console.warn(`[forms] RESEND_API_KEY ausente — submissão "${data.form}" não entregue.`);
    return;
  }
  const resend = new Resend(apiKey);
  const { data: sent, error } = await resend.emails.send({
    // Até o domínio otimaconsultoria.com.br ser verificado no Resend, só o
    // remetente de teste funciona. Depois da verificação, definir
    // FORMS_FROM_EMAIL="Site Ótima <site@otimaconsultoria.com.br>" na Vercel.
    from: import.meta.env.FORMS_FROM_EMAIL ?? 'Site Ótima <onboarding@resend.dev>',
    to: import.meta.env.FORMS_TO_EMAIL ?? 'contato@otimaconsultoria.com.br',
    // O registro do Parecer não coleta e-mail (retorno é pelo WhatsApp).
    ...('email' in data ? { replyTo: data.email } : {}),
    subject: SUBJECTS[data.form],
    html: buildEmailHtml(data),
  });
  if (error) throw new Error(`Falha no envio: ${error.name}`);
  // Só o ID do envio — nunca o conteúdo (CLAUDE.md §5).
  console.info(`[forms] e-mail enviado (${data.form}) id=${sent?.id ?? '?'}`);
}

export const POST: APIRoute = async ({ request, clientAddress, redirect }) => {
  const formData = await request.formData().catch(() => null);
  if (!formData) return redirect('/contato#erro-validacao', 303);

  const back = RETURN_PATHS[String(formData.get('form'))] ?? '/contato';

  let ip = 'unknown';
  try {
    ip = clientAddress;
  } catch {
    // Sem IP disponível (ex.: dev) — cai na chave compartilhada "unknown".
  }
  if (!limiter.check(ip).allowed) {
    return redirect(`${back}#erro-limite`, 303);
  }

  // Honeypot preenchido: responder como sucesso para não ensinar o bot.
  const honeypot = formData.get('website');
  if (typeof honeypot === 'string' && honeypot !== '') {
    return redirect(`${back}#enviado`, 303);
  }

  const result = parseSubmission(formData);
  if (!result.success) {
    return redirect(`${back}#erro-validacao`, 303);
  }

  try {
    await deliver(result.data);
  } catch {
    // Não logar o conteúdo da submissão — apenas o fato da falha.
    console.error('[forms] Falha ao entregar e-mail de formulário.');
    return redirect(`${back}#erro-envio`, 303);
  }

  return redirect(`${back}#enviado`, 303);
};
