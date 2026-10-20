# Spec — Home (`/`)

Ref: CLAUDE.md §2.1, §2.2. Público: misto (Ana e Décio chegam aqui). A home NÃO aprofunda nenhuma das duas linguagens — ela roteia.

## Objetivo
Apresentar a Ótima em 5 segundos e rotear o visitante para a trilha certa em 1 clique.

## Seções (ordem)
1. **Hero** — headline institucional neutra ("Decisões sem achismo. Há 21 anos."), subheadline com o que a Ótima faz (pesquisa e inteligência de mercado), sem CTA de venda direta.
2. **Duas portas (roteador)** — dois cards lado a lado, mesmo peso visual:
   - "Sou Sistema S / órgão público" → `/institucional` (tom: rigor, metodologia, licitação)
   - "Sou empresário PME" → `/parecer-estrategico` (tom: decisão travada, clareza em 48h)
3. **Prova social mista** — faixa de logos/nomes de clientes (Multiarte, Urano, Fecomércio, CDL, Cruzeiro do Sul, Sistema S). Sem depoimento longo, sem número não confirmado.
4. **Sobre em 1 linha** — 21 anos, +500 empresas, Campo Grande/MS, link para `/sobre`.
5. **Footer** — contato (e-mail, WhatsApp +55 67 3015-4922), links de navegação, política de privacidade.

## Requisitos
- Meta title/description únicos.
- JSON-LD `ProfessionalService` (nome, url, telefone, endereço Campo Grande/MS, fundador Leandro Lins).
- Nenhuma copy exclusiva de trilha (nem "edital" nem "R$697") fora dos cards-porta.
- Zero JS hidratado. Imagens via `astro:assets` quando houver.
