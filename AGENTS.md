# CLAUDE.md — Constituição do Projeto: Site Ótima Consultoria (v2)

> Cole este arquivo na raiz do repositório novo antes de escrever qualquer código.
> Claude Code deve ler este arquivo por completo antes de tocar em qualquer arquivo do projeto.
> Não pule etapas. A ordem abaixo importa mais que a velocidade.

---

## 0. Contexto do negócio (não é opcional — molda toda decisão técnica)

A Ótima Inteligência de Mercado é uma consultoria de pesquisa e IM com 21 anos de operação, fundada por Leandro Lins, sediada em Campo Grande/MS. Duas frentes de negócio, com públicos e tons **completamente diferentes** — nunca misturar copy, seção ou CTA entre elas:

**Frente 1 — B2B Institucional.** Pesquisa e IM para Sistema S (Sebrae, SESC, SENAI etc.) e entidades públicas, via licitação. Público-alvo ("Ana"): gerente/coordenadora, 32–48 anos, não compra pesquisa — compra segurança para defender decisão na diretoria. Já foi decepcionada por fornecedor que entregou relatório engavetado. Precisa ver rigor metodológico, aderência a edital, fontes primárias. Nunca prometer resultado — prometer processo rigoroso.

**Frente 2 — Parecer Estratégico (B2C / PME).** Produto de R$697, entrega em 48h, capacidade 4/mês. Público-alvo ("Décio"): empresário PME, 10–20 anos de mercado, faturamento R$2M–8M/ano, com uma decisão travada (expansão, precificação, concorrência). Quer clareza agora, com dado — avesso a consultor genérico. Entrada via formulário de 3 perguntas.

O site atual falha em ambas as frentes: não demonstra rigor metodológico para Ana, não menciona o Parecer Estratégico para Décio, e mistura os dois públicos na mesma home. Este rebuild existe para corrigir isso — ver `docs/roteiro-melhorias.md` (anexo/histórico) para o diagnóstico completo.

**Regra de conteúdo:** qualquer copy gerada por IA para este site deve ser revisada por Leandro antes de publicar — em especial a trilha B2B, que precisa citar metodologia real (amostragem, margem de erro) e nunca inventar números ou cases não confirmados.

---

## 1. Objetivo do projeto

Reconstruir o site institucional como um site estático gerado via Astro (saindo do WordPress/Elementor atual), com:

1. Duas trilhas de navegação claras — B2B (Ana) e B2C/Parecer Estratégico (Décio) — sem mistura de tom, prova social ou CTA.
2. Prova social com resultado quantificado (cases reais, não depoimento genérico).
3. Performance real: LCP < 2.5s, CLS < 0.1, INP < 200ms (metas de Core Web Vitals).
4. SEO técnico correto desde o primeiro deploy (meta tags por página, schema markup, sitemap, OG image em https).
5. Segurança de produção — ver seção 5. Não é um MVP de validação de ideia: é o site institucional ativo de uma empresa de 21 anos com contratos correntes na casa dos R$ milhões. Trate como produção desde o commit 1.

Este NÃO é um projeto de validação de modelo de negócio (a empresa e os produtos já existem e faturam) — portanto, pule Lean Canvas e interrogatório adversarial de ideia. Vá direto para PRD técnico (seção 2) e implementação disciplinada.

---

## 2. Escopo funcional (PRD resumido — sintaxe EARS)

### 2.1 Estrutura de páginas
- `/` — Home institucional: apresentação da Ótima, os dois CTAs de entrada ("Sou Sistema S / órgão público" → `/institucional`, "Sou empresário PME" → `/parecer-estrategico`), prova social mista (logos de clientes), sem aprofundar em nenhuma das duas linguagens.
- `/institucional` (trilha Ana/B2B) — Metodologia, processos, cases com resultado, formulário qualificado para licitação/proposta institucional, linguagem técnica sem gíria.
- `/parecer-estrategico` (trilha Décio/B2C) — O que é, preço (R$697), prazo (48h), entregáveis (Parecer 4 pág. + Mapa da Decisão + Carta de Contexto + Podcast + Sessão Zoom), link para formulário de candidatura de 3 perguntas, prova social B2C.
- `/blog` ou `/insights` — espelho ou RSS pull do Substack "Dados Sem Achismo", indexável, para acumular SEO orgânico no domínio próprio.
- `/sobre` — Leandro Lins, 21 anos, +500 empresas, posicionamento "Decisões sem achismo".
- `/contato` — formulário único de fallback, com campo de seleção "Sou Sistema S" / "Sou PME" / "Outro" para rotear internamente.

### 2.2 Requisitos funcionais (EARS)
- O sistema deve servir cada página com meta title e meta description únicos (nunca reaproveitar a meta description genérica em todas as páginas, como acontece no site atual).
- QUANDO um formulário for submetido, o sistema deve validar todos os campos no servidor (não confiar em validação client-side) antes de processar.
- QUANDO um formulário for submetido, o sistema deve aplicar rate-limiting por IP para prevenir spam/abuso.
- O sistema deve gerar `sitemap.xml` e `robots.txt` automaticamente a partir das rotas.
- O sistema deve incluir JSON-LD (schema.org `ProfessionalService` ou `Organization`) na home e `Article` nas páginas de blog.
- ENQUANTO estiver em produção, o sistema deve responder com HTTPS forçado e headers de segurança definidos na seção 5.
- O sistema deve carregar imagens via componente otimizado do Astro (`astro:assets`), com lazy loading e formatos modernos (WebP/AVIF).
- QUANDO o usuário estiver em `/institucional`, o sistema NUNCA deve exibir CTAs ou copy da trilha `/parecer-estrategico`, e vice-versa.

---

## 3. Stack técnica (decisão fechada — não reabrir sem justificativa)

- **Framework:** Astro, TypeScript estrito. Escolhido em vez de Next.js porque este é um site institucional de conteúdo majoritariamente estático (não uma aplicação com estado, como o projeto SESC/MS, que é um SaaS e por isso justifica Next.js). Astro ships zero JavaScript por padrão e só hidrata componente que precisa de interatividade real (islands architecture) — menos superfície de bundle, menos superfície de ataque, Core Web Vitals mais fáceis de manter no verde.
- **Estilo:** Tailwind CSS. Componentes de UI simples podem ser `.astro` puro; usar React/Preact apenas nas ilhas que precisarem de interatividade real (ex: validação de formulário no client antes do submit) — nunca hidratar página inteira.
- **Conteúdo:** Content Collections nativas do Astro (Markdown/MDX com schema tipado via Zod) para as páginas de blog/insights, alimentadas por export/RSS do Substack "Dados Sem Achismo". Decidir com Leandro se haverá sincronização automática ou publicação manual espelhada.
- **Formulários:** Astro Actions (ou endpoint de API route do Astro) processando no servidor + envio via serviço transacional (ex: Resend) para `contato@otimaconsultoria.com.br`, com honeypot + rate-limit. Exige modo `server` ou `hybrid` do Astro (adapter, ex: Vercel/Netlify) só nas rotas de formulário — o resto do site continua estático.
- **Hospedagem:** Vercel ou Netlify (deploy automático a partir da branch `main`, preview deploys por PR) — ambos têm adapter Astro maduro.
- **Analytics:** Google Analytics 4 ou Plausible — decidir com Leandro (Plausible é mais compatível com LGPD, sem banner de cookies obrigatório, e mais leve — combina melhor com a filosofia "zero JS por padrão" do Astro).
- **Identidade visual:** paleta creme `#F5EFE0` / azul-marinho `#1A2B6B` / cyan `#33CCFF`, estilo sketch editorial — aplicar apenas na trilha B2C (@leandro_b_lins); a trilha institucional B2B deve usar uma variação mais sóbria da mesma marca, sem o traço "sketch", para não parecer infoproduto num contexto de licitação pública.

Critério de escolha: o que a IA processa com menor ambiguidade estrutural, não o que é mais na moda. Não trocar de framework no meio do projeto. Se o site institucional algum dia precisar de área logada, dashboard ou lógica de aplicação real, isso é sinal para avaliar migração/split para Next.js naquele momento — não uma razão para começar em Next.js agora.

---

## 4. Fluxo de trabalho obrigatório (não pular etapas)

Para cada página ou funcionalidade nova:

1. Escrever a spec em `docs/specs/nome-da-pagina.md` antes de codar (o que a página precisa fazer, referenciando a seção 2 deste arquivo).
2. Invocar: `ORCHESTRATE a feature definida em @docs/specs/nome-da-pagina.md. 1. Leia a spec e as regras deste CLAUDE.md. 2. Crie um plano de execução passo a passo. 3. Execute uma etapa por vez, aguardando aprovação entre etapas críticas.`
3. Não implementar tudo de uma vez — se uma tarefa levar mais de ~10 minutos de execução prevista, quebrar em subtarefas menores.
4. Rodar o protocolo de verificação (seção 6) antes de considerar qualquer tarefa concluída.
5. Depois de cada feature fechada, rodar `/compact` para limpar contexto e manter este `CLAUDE.md` fixado (`/pin`).

---

## 5. Segurança — requisitos obrigatórios de produção

Esta seção é inegociável — o usuário pediu explicitamente "toda a segurança". Nenhuma tarefa é considerada concluída se violar algo abaixo:

- **Sem segredos no repositório.** Chaves de API (Resend, analytics, CMS) sempre via variáveis de ambiente (`.env.local`, nunca commitado — confirmar `.gitignore` inclui `.env*`). Usar variáveis de ambiente do Vercel em produção.
- **HTTPS forçado** em todas as rotas, sem exceção. Nenhuma referência a asset (imagem, script, OG image) em `http://` — o site atual tem esse erro exato no `og:image` e não pode se repetir.
- **Headers de segurança** configurados no `astro.config` (via adapter) ou middleware do host (Vercel/Netlify): `Content-Security-Policy`, `X-Frame-Options: DENY` (ou `SAMEORIGIN` se precisar embutir), `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Strict-Transport-Security`.
- **Validação e sanitização server-side** de todo input de formulário — nunca confiar em validação de frontend como única barreira. Usar uma lib de schema (ex: Zod) na Astro Action/endpoint que processa o submit.
- **Rate limiting** nos formulários de contato/candidatura (ex: Upstash Ratelimit ou equivalente) para evitar spam e abuso.
- **Honeypot ou CAPTCHA leve** (ex: Cloudflare Turnstile) nos formulários públicos.
- **Dependências:** rodar `npm audit` (ou equivalente) antes de cada deploy para produção; nenhuma dependência com vulnerabilidade crítica conhecida deve ir para `main`.
- **Backups/rollback:** aproveitar preview deploys da Vercel — nunca fazer deploy direto para produção sem passar por PR + preview.
- **LGPD:** formulários que coletam nome/e-mail/telefone precisam de checkbox de consentimento e link para política de privacidade; se usar GA4, avaliar necessidade de banner de cookies (Plausible evita esse problema).
- **Sem dados sensíveis em logs** — não logar conteúdo de formulário (nome, e-mail, telefone) em texto plano em serviços de log persistente.

---

## 6. Protocolo de verificação / Definition of Done

Nenhuma tarefa é considerada concluída até que TODOS os itens abaixo passem:

- [ ] `npm run lint` — 0 erros.
- [ ] `npm run typecheck` (TypeScript estrito) — 0 erros.
- [ ] `npm run test` — todos os testes passando (ver TDD abaixo).
- [ ] `npm run build` — build de produção completo sem warnings críticos.
- [ ] Lighthouse/PageSpeed Insights rodado na página alterada — LCP < 2.5s, CLS < 0.1 (mobile).
- [ ] Nenhum asset referenciado em `http://` (checar OG images, favicons, scripts externos).
- [ ] Formulário testado manualmente com input malicioso básico (script tag, campos vazios) para confirmar que a validação server-side segura.
- [ ] Página revisada visualmente via screenshot (Playwright) comparando contra a spec — confirmar que a trilha B2B não vazou linguagem/CTA da trilha B2C ou vice-versa.

**TDD obrigatório:** Red → Green → Refactor. Escrever o teste antes do código para qualquer lógica não-trivial (validação de formulário, roteamento de CTA, geração de sitemap). Não declarar tarefa concluída sem teste passando.

---

## 7. O que preservar do site atual (não jogar fora)

- Domínio, e-mail institucional (`contato@otimaconsultoria.com.br`) e número de WhatsApp (`+55 67 3015-4922`) — manter.
- Logos de clientes já usados (Multiarte, Urano, Fecomércio, CDL, Cruzeiro do Sul) — reaproveitar como prova social na home institucional, mas complementar com cases reais quantificados sempre que Leandro aprovar o texto.
- Depoimento da Daniela Dias (SESC) e do Rodrigo Possari (Cruzeiro do Sul) — bons ativos, mas reescrever para incluir número/resultado quando possível, com aprovação do cliente citado.

---

## 8. Primeira instrução a dar ao Claude Code

Depois de colar este arquivo como `CLAUDE.md` na raiz do repositório novo, a primeira mensagem para o Claude Code deve ser algo como:

```
Leia CLAUDE.md por completo. Depois:
1. Proponha a estrutura de pastas do projeto Astro alinhada à seção 3.
2. Crie docs/specs/home.md com a spec da página inicial, seguindo a seção 2.1.
3. Não escreva código de página ainda — aguarde minha aprovação da spec e do plano.
```

Não deixe o Claude Code pular direto para gerar páginas completas sem spec aprovada — isso é a causa mais comum de retrabalho neste tipo de projeto.
