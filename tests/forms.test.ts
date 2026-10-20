import { describe, expect, it } from 'vitest';
import { escapeHtml, parseSubmission } from '../src/lib/forms';

function fd(entries: Record<string, string>): FormData {
  const data = new FormData();
  for (const [k, v] of Object.entries(entries)) data.append(k, v);
  return data;
}

const contatoValido = {
  form: 'contato',
  nome: 'Ana Coordenadora',
  email: 'ana@sebrae.com.br',
  tipo: 'sistema-s',
  mensagem: 'Preciso de uma proposta para pesquisa de satisfação.',
  consentimento: 'on',
};

describe('formulário de contato', () => {
  it('aceita submissão válida', () => {
    const result = parseSubmission(fd(contatoValido));
    expect(result.success).toBe(true);
  });

  it('rejeita e-mail inválido', () => {
    const result = parseSubmission(fd({ ...contatoValido, email: 'não-é-email' }));
    expect(result.success).toBe(false);
  });

  it('rejeita campos obrigatórios vazios', () => {
    const result = parseSubmission(fd({ ...contatoValido, nome: '', mensagem: '' }));
    expect(result.success).toBe(false);
  });

  it('rejeita sem consentimento LGPD', () => {
    const { consentimento: _omitido, ...semConsentimento } = contatoValido;
    const result = parseSubmission(fd(semConsentimento));
    expect(result.success).toBe(false);
  });

  it('rejeita quando o honeypot vem preenchido (bot)', () => {
    const result = parseSubmission(fd({ ...contatoValido, website: 'https://spam.example' }));
    expect(result.success).toBe(false);
  });

  it('rejeita tipo fora do enum', () => {
    const result = parseSubmission(fd({ ...contatoValido, tipo: 'hacker' }));
    expect(result.success).toBe(false);
  });
});

describe('formulário institucional', () => {
  it('aceita submissão válida', () => {
    const result = parseSubmission(
      fd({
        form: 'institucional',
        nome: 'Ana Coordenadora',
        email: 'ana@sesc.com.br',
        cargo: 'Gerente de Unidade',
        instituicao: 'SESC/MS',
        demanda: 'licitacao',
        descricao: 'Pesquisa de perfil do público das unidades para 2027.',
        consentimento: 'on',
      }),
    );
    expect(result.success).toBe(true);
  });
});

describe('formulário do parecer estratégico', () => {
  const parecerValido = {
    form: 'parecer',
    nome: 'Décio Empresário',
    whatsapp: '(67) 99999-0000',
    decisao: 'Abrir uma segunda unidade ou reforçar a atual?',
    consentimento: 'on',
  };

  it('aceita registro de interesse válido (sem e-mail)', () => {
    const result = parseSubmission(fd(parecerValido));
    expect(result.success).toBe(true);
  });

  it('rejeita sem WhatsApp', () => {
    const { whatsapp: _omitido, ...semWhatsapp } = parecerValido;
    const result = parseSubmission(fd(semWhatsapp));
    expect(result.success).toBe(false);
  });

  it('rejeita decisão curta demais', () => {
    const result = parseSubmission(fd({ ...parecerValido, decisao: 'Abrir' }));
    expect(result.success).toBe(false);
  });

  it('rejeita WhatsApp com caracteres inválidos', () => {
    const result = parseSubmission(fd({ ...parecerValido, whatsapp: '<script>alert(1)</script>' }));
    expect(result.success).toBe(false);
  });
});

describe('escapeHtml', () => {
  it('neutraliza tags script em qualquer campo de texto', () => {
    const escaped = escapeHtml('<script>alert("xss")</script>');
    expect(escaped).not.toContain('<script>');
    expect(escaped).toContain('&lt;script&gt;');
  });

  it('escapa aspas e ampersand', () => {
    expect(escapeHtml(`a & "b" 'c'`)).toBe('a &amp; &quot;b&quot; &#39;c&#39;');
  });
});
