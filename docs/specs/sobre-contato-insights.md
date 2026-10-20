# Spec — Sobre (`/sobre`), Contato (`/contato`), Insights (`/insights`)

Ref: CLAUDE.md §2.1.

## `/sobre`
- Leandro Lins, fundador; 21 anos de operação; +500 empresas atendidas; Campo Grande/MS.
- Posicionamento: "Decisões sem achismo".
- Tom neutro-institucional (serve às duas trilhas). Link para as duas portas.
- Sem números além dos confirmados no CLAUDE.md (21 anos, +500 empresas).

## `/contato`
- Formulário único de fallback: nome, e-mail, telefone (opcional), select "Sou Sistema S / órgão público" | "Sou empresário PME" | "Outro" (roteamento interno), mensagem, consentimento LGPD.
- Honeypot + validação server-side + rate limit. POST → `/api/forms` (tipo `contato`).
- Exibir também e-mail `contato@otimaconsultoria.com.br` e WhatsApp `+55 67 3015-4922`.

## `/insights`
- Content Collection `insights` (Markdown, schema Zod): title, description, pubDate, substackUrl?, draft.
- Lista de artigos indexável; artigo individual com JSON-LD `Article`.
- Estado vazio: card apontando para o Substack "Dados Sem Achismo".
- Decisão pendente com Leandro: sync automático RSS vs. publicação manual espelhada → implementado o manual (arquivos .md); sync automático fica para depois.

## Global
- `sitemap.xml` + `robots.txt` automáticos; página 404; política de privacidade (`/privacidade`) exigida pelos checkboxes LGPD.
