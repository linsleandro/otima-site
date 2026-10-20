# Copy pendente de revisão do Leandro (CLAUDE.md §0 — regra de conteúdo)

Nenhum item abaixo deve ir ao ar sem aprovação. Nada foi inventado: números usados no site
são apenas os confirmados (21 anos, +500 empresas — CLAUDE.md; o funil do Parecer Estratégico
segue a síntese de 02/09/2026, sem preço, pois o preço ainda não foi fechado).

## Bloqueador ativo — redesenho do Parecer Estratégico (02/09/2026)
`/parecer-estrategico` foi reescrita para o funil novo (seleção mensal → WhatsApp → reunião de
30min de diagnóstico, ANTES de proposta/pagamento → proposta e preço por WhatsApp → entrega
única de Apresentação + Relatório + Infográfico + Podcast). O preço foi removido da página por
decisão do Leandro — não aparece em lugar nenhum, nem no JSON-LD. 5 pontos que o próprio
Leandro listou como não fechados e que mudam a página quando decididos:
- [ ] **Preço exato.** Direção é "mais alto" que o R$697 antigo (Leandro cogitou algo como
      R$1.697 em 10x, mas não é definitivo). Continua fora da página de propósito — só entra em
      copy pública se/quando a decisão for expor o valor publicamente (hoje o modelo é "preço só
      na proposta").
- [ ] **A reunião de 30min substitui de vez a sessão de 45min antiga, ou existe um segundo
      encontro ao vivo pós-pagamento?** Como ficou, só sobra entrega assíncrona depois do
      pagamento — se não for intencional, a seção "Como funciona" precisa de um passo a mais.
- [ ] **Existe sessão de ajuste pós-entrega?** Não mencionada na síntese nova; a página não
      promete isso.
- [x] **Porta de entrada — decidido em 20/10/2026.** Formulário mínimo: nome + WhatsApp +
      "qual decisão está travada?" + consentimento. Sem e-mail, sem faturamento, sem 2ª
      pergunta. Leandro chama no WhatsApp em até 1 dia útil → call de 30 min → proposta com
      preço por complexidade. Esse mesmo link (`/parecer-estrategico`) deve ser o único usado
      na bio do Instagram e no Substack, para o fluxo ser idêntico em todos os canais.
- [ ] **Como as 4 peças novas (Apresentação/Relatório/Infográfico/Podcast) mapeiam pro Dossiê
      antigo (Parecer 4pg/Mapa da Decisão/Carta de Contexto/Podcast)?** Usei a lista nova
      literalmente; se for renomeação 1-para-1 em vez de estrutura genuinamente diferente, não
      muda a página, só a explicação interna do que é cada peça.

O artboard `ParecerEstrategico` no canvas de design (Claude Design) também precisa da mesma
atualização — ver seção de canvas mais abaixo.

## Bloqueadores de lançamento
- [x] **Logo real** — resolvido em 03/09/2026 a partir de `logo ótima.jpeg` (Dropbox). O JPEG
      foi processado em `public/brand/` (fundo branco removido, variante branca para o footer,
      recorte do "Ó" para favicon) e `public/og.png` regenerado com a logo real. Melhoria
      opcional: se um dia aparecer o arquivo vetorial (SVG/AI), trocar os PNGs por ele para
      escalar sem perda em telas de alta densidade.
- [ ] **Depoimentos** — `/institucional` tem placeholders para Daniela Dias (SESC) e Rodrigo
      Possari (Cruzeiro do Sul). Inserir o texto real (o original do site atual ou versão com
      resultado quantificado aprovada pelos citados). Nenhum texto foi redigido em nome deles.
- [x] **Prova social B2C** — resolvido em 20/10/2026: os 3 casos do site antigo
      (parecerestrategico.netlify.app) entraram em `/parecer-estrategico`, sem a frase
      "em 48 horas". Texto original de Leandro.
- [ ] **Política de privacidade** (`/privacidade`) — rascunho LGPD; revisar (idealmente com
      assessoria jurídica).
- [ ] **OG image** (`public/og.png`) — placeholder sólido gerado por script; substituir por
      arte 1200×630 com a marca.
- [ ] **Toda a copy das páginas** — revisar tom e precisão, em especial a trilha B2B
      (metodologia citada: amostragem, margem de erro, nível de confiança — confirmar que
      descreve o processo real da Ótima).

## Decisões pendentes (CLAUDE.md §3)
- [ ] **Analytics** — GA4 vs. Plausible (recomendação do CLAUDE.md: Plausible, sem banner de
      cookies). Nenhum foi instalado ainda.
- [ ] **Insights/Substack** — sincronização automática via RSS ou espelhamento manual?
      O manual já funciona: ver modelo em `src/content/insights/exemplo.md`.
- [ ] **Logos de clientes** — hoje são nomes em texto; obter os arquivos de logo autorizados
      (Multiarte, Urano, Fecomércio, CDL, Cruzeiro do Sul…) para a faixa da home.
- [ ] **Endereço completo** — o schema JSON-LD usa só "Campo Grande/MS"; incluir logradouro
      se quiser exibir endereço físico.
- [ ] **Faixas de faturamento** do formulário do Parecer (`até 2M / 2–8M / acima de 8M`) —
      confirmar se são as faixas de qualificação desejadas.
