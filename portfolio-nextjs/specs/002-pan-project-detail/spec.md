# Feature Specification: Página de Detalhe — Projeto PAN

**Feature Branch**: `002-pan-project-detail`
**Created**: 2026-04-24
**Status**: Draft

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 — Explorar o projeto PAN em profundidade (Priority: P1)

Um visitante que chegou à página do PAN a partir do grid de projetos quer entender o trabalho completo: contexto, conceito, solução de design e processo. Ele espera uma narrativa visual com textos e imagens em sequência lógica, sem distrações.

**Why this priority**: É o fluxo primário — a razão de existir da página. Sem isso, não há valor entregue.

**Independent Test**: Acessar `/pt/grafico/pan` deve exibir título, texto descritivo do projeto (contexto, conceito, solução, processo) e um conjunto de imagens reais do projeto, sem placeholders cinzas.

**Acceptance Scenarios**:

1. **Given** que o visitante acessa `/pt/grafico/pan`, **When** a página carrega, **Then** o título "PAN" e a descrição completa do projeto são visíveis, com as imagens reais do CDN exibidas em ordem narrativa.
2. **Given** que o visitante rola a página, **When** passa pela seção hero, **Then** uma imagem de destaque é revelada com efeito visual de transição (imagem fixa, conteúdo scrollável sobre ela).
3. **Given** qualquer largura de tela (320px–2560px), **When** a página é carregada, **Then** o layout não quebra, não há sobreposição de elementos e as imagens são visíveis.

---

### User Story 2 — Ler o projeto em inglês (Priority: P2)

Um visitante que navega no site em inglês (`/en/grafico/pan`) espera encontrar todos os textos do projeto traduzidos — título, contexto, conceito, solução e processo.

**Why this priority**: O site é bilíngue e o portfólio tem audiência internacional. A falta de tradução bloqueia metade dos visitantes.

**Independent Test**: Acessar `/en/grafico/pan` deve exibir os mesmos blocos de conteúdo com textos em inglês, sem nenhuma string em português.

**Acceptance Scenarios**:

1. **Given** que o visitante está em `/en/grafico/pan`, **When** a página carrega, **Then** título, subtítulo e todos os blocos de texto narrativo estão em inglês.
2. **Given** que o visitante alterna o idioma via toggle na navegação, **When** o locale muda, **Then** o conteúdo da página é atualizado para o idioma correspondente sem recarregar imagens.

---

### User Story 3 — Navegar entre projetos sem perder contexto (Priority: P3)

Após explorar o projeto PAN, o visitante quer voltar ao grid de projetos ou navegar para outro projeto sem usar o botão "voltar" do browser.

**Why this priority**: Melhora a retenção e o fluxo de navegação do portfólio como um todo.

**Independent Test**: A página deve ter acesso claro ao Header de navegação com links para as seções principais.

**Acceptance Scenarios**:

1. **Given** que o visitante está em `/pt/grafico/pan`, **When** clica em "DESIGN GRÁFICO" no header, **Then** é redirecionado para `/pt/projetos` com o filtro "Gráfico" ativo.
2. **Given** que o visitante está na página, **When** o header está visível, **Then** o item de navegação ativo ("DESIGN GRÁFICO") está destacado com o asterisco vermelho.

---

### Edge Cases

- O que acontece se uma imagem do CDN falhar ao carregar? A página não deve quebrar — o espaço da imagem deve permanecer reservado.
- O que acontece em telas muito estreitas (320px)? O layout de 3 colunas da seção de processo deve colapsar para coluna única.
- O que acontece se o visitante acessar `/grafico/pan` sem prefixo de idioma? O middleware deve redirecionar para `/pt/grafico/pan`.

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: A página DEVE exibir o título completo do projeto PAN em ambos os idiomas (`pt`, `en`).
- **FR-002**: A página DEVE exibir quatro blocos de texto narrativo bilíngues: Contexto, Conceito, Solução de Design, Processo e Expansão.
- **FR-003**: A página DEVE exibir as imagens reais do projeto, obtidas do CDN, sem placeholders cinzas.
- **FR-004**: A seção hero DEVE implementar efeito de "reveal" — texto scrollável sobre imagem fixa (sticky).
- **FR-005**: A seção "Contexto" DEVE usar layout de 1/3 texto + 2/3 imagens empilhadas verticalmente.
- **FR-006**: A seção "Processo" DEVE usar layout com texto fixo (sticky) à esquerda e pares imagem+legenda rolando à direita.
- **FR-007**: A seção "Resultados" DEVE usar layout de 1/3 rótulo + 2/3 texto em duas colunas, seguido de imagens em largura total.
- **FR-008**: A página DEVE ser acessível na rota `/[lang]/grafico/pan` para os locales `pt` e `en`.
- **FR-009**: O Header de navegação DEVE ser visível na página, com o item "DESIGN GRÁFICO" marcado como ativo.
- **FR-010**: A página DEVE usar exclusivamente os tokens de cor e tipografia do design system (`brand`, `text-dark`, `text-gray`, Fira Sans), sem cores ou fontes hardcoded.
- **FR-011**: A metainformação do projeto (cliente: WWF/ICMBio, ano: 2024) DEVE ser exibida na página.

### Key Entities

- **Projeto PAN**: Entidade de conteúdo com título (pt/en), descrição narrativa (4 blocos, pt/en), cliente, ano e conjunto de imagens ordenadas.
- **Seção Narrativa**: Bloco de conteúdo com rótulo (ex: "Contexto"), texto bilíngue e imagens associadas.
- **Imagem de Projeto**: Ativo visual identificado por URL de CDN e posição na sequência narrativa.

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A página renderiza sem erros visuais em viewports de 320px, 768px, 1440px e 2560px de largura.
- **SC-002**: Nenhum placeholder cinza (caixa vazia) permanece visível — 100% das imagens são exibidas com URLs reais do CDN.
- **SC-003**: Todo o texto da página é bilíngue — acessar via `/en/` exibe 0 strings em português.
- **SC-004**: Zero tokens de cor hardcoded (hex, rgb, hsl) são introduzidos no código — todas as cores usam as classes utilitárias do design system.
- **SC-005**: O efeito de reveal do hero (imagem sticky + texto scrollável) funciona corretamente em todos os breakpoints suportados.
- **SC-006**: O visitante consegue chegar à página PAN a partir do grid de projetos em no máximo 2 cliques.

---

## Assumptions

- As imagens do projeto PAN estão disponíveis no CDN (UploadThing) com URLs estáveis — não é necessário upload adicional.
- O conteúdo textual do projeto é estático (não vem de CMS); será embutido diretamente no código da página como dados bilíngues.
- O wireframe existente em `src/app/[lang]/teste-layout/page.js` é a estrutura de layout aprovada e será a base do grid.
- A tipografia do design system Figma (Fira Sans) já está configurada no projeto via `font-sans` — não requer instalação adicional.
- O Header e Footer padrão do projeto serão exibidos nesta página (não é uma página fullscreen como a Home).
- As imagens do arquivo HTML legado (`img/pan*.jpg`) correspondem a assets já migrados para o CDN.
- O número e a ordem das imagens a serem usadas será definido na fase de implementação com base nos assets disponíveis no CDN.
