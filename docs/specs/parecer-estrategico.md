# Spec — Parecer Estratégico (`/parecer-estrategico`) — trilha Décio (B2C/PME)

Ref: CLAUDE.md §0 (persona Décio), §2.1, §2.2. Tom: direto, empresário-para-empresário, estética sketch editorial (creme #F5EFE0 / navy #1A2B6B / cyan #33CCFF).

## Objetivo
Décio (PME, R$2M–8M/ano, decisão travada) entende o produto, o preço e se candidata em menos de 2 minutos.

## Seções (ordem)
1. **Hero** — headline sobre a decisão travada ("Uma decisão travada custa mais caro que a resposta."). Sub: parecer com dado real, em 48h, por R$697.
2. **O que é** — parecer estratégico individual, feito por quem faz pesquisa há 21 anos, não consultoria genérica.
3. **O que você recebe** — lista de entregáveis (CLAUDE.md §2.1): Parecer de 4 páginas, Mapa da Decisão, Carta de Contexto, Podcast (áudio do parecer), Sessão de 30 min via Zoom.
4. **Preço e prazo** — R$697, entrega em 48h úteis, capacidade de 4 pareceres/mês (escassez real, não fabricada).
5. **Para quem é / não é** — qualifica Décio e afasta curiosos (é para decisão específica; não é plano de negócio nem mentoria).
6. **Formulário de candidatura — 3 perguntas** — (1) Qual decisão está travada hoje? (2) Há quanto tempo você adia essa decisão e o que já tentou? (3) Faixa de faturamento anual (select). + nome, e-mail, WhatsApp, consentimento LGPD. Honeypot + validação server-side + rate limit.
7. **Prova social B2C** — placeholder (aguardar cases aprovados por Leandro; não inventar).

## Proibições
- NUNCA exibir copy institucional/licitação (edital, Sistema S, proposta técnica).
- Não inventar depoimento nem número de resultado.

## Requisitos técnicos
- Meta title/description únicos. Form POST → `/api/forms` (tipo `parecer`). JSON-LD `Product`/`Service` com preço R$697 (avaliar; mínimo: `Service`).
