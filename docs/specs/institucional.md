# Spec — Institucional (`/institucional`) — trilha Ana (B2B)

Ref: CLAUDE.md §0 (persona Ana), §2.1, §2.2. Tom: técnico, sóbrio, sem gíria, sem estética "sketch". Nunca prometer resultado — prometer processo rigoroso.

## Objetivo
Dar à Ana (gerente/coordenadora de Sistema S ou órgão público) segurança para defender a contratação da Ótima internamente.

## Seções (ordem)
1. **Hero sóbrio** — headline sobre rigor metodológico e pesquisa que sustenta decisão de diretoria. Zero menção a Parecer Estratégico/preço.
2. **Metodologia** — etapas do processo (briefing → desenho amostral → campo com fontes primárias → tratamento estatístico → relatório acionável → apresentação). Mencionar amostragem e margem de erro como disciplina, sem inventar números de projeto.
3. **Aderência a edital** — bloco sobre experiência com licitação, documentação e conformidade (Sistema S: Sebrae, SESC, SENAI).
4. **Cases / depoimentos** — placeholders estruturados para Daniela Dias (SESC) e Rodrigo Possari (Cruzeiro do Sul). NÃO redigir texto em nome deles — aguardar texto aprovado (CLAUDE.md §7).
5. **Formulário qualificado** — campos: nome, cargo, instituição, e-mail institucional, telefone (opcional), tipo de demanda (licitação / proposta técnica / cotação / outro), descrição da necessidade, consentimento LGPD. Honeypot + validação server-side + rate limit.
6. **CTA final** — "Solicitar proposta técnica" (âncora para o formulário).

## Proibições
- NUNCA exibir CTA/copy da trilha B2C (R$697, 48h, "decisão travada", estética sketch).
- Nunca prometer resultado ("aumente X%") — só processo.

## Requisitos técnicos
- Meta title/description únicos. Form POST → `/api/forms` (tipo `institucional`).
