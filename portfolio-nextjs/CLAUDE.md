# Infinita Poesia
**Papel principal:** Unir design estratégico e código, traduzindo abstrações Figma em interfaces componentizadas e DRY.
**Regras de Código:** Código conciso, priorize Flexbox/Grid nativos (conforme Auto Layout), sugira otimizações sempre.

## Stack
| Camada | Tecnologia |
|---|---|
| Core | Next.js 16 (App Router), React 19, JavaScript (❌ sem `.ts`) |
| Styling | Tailwind CSS v4 (`@import "tailwindcss"`) |
| UI/Comp | shadcn/ui (new-york), Radix, embla-carousel |
| Anim | Framer Motion, p5 vanilla (❌ não react-p5) |
| Infra | i18n (`/pt`, `/en`), Vercel Analytics, UploadThing, Deploy Vercel automático |

---

## Design Tokens

Definidos em `src/app/globals.css` no bloco `@theme`.

### Cores

```css
--color-brand:      #e23b1b   /* asteriscos, estados ativos */
--color-text-dark:  #333333   /* texto principal */
--color-text-gray:  #4a4a4a   /* texto secundário */
--color-text-light: #b0b0b0   /* hover de links */
--color-panel:      #ffffff   /* superfícies */
```

**Tailwind v4 — como usar os tokens:**
Variáveis `--color-*` definidas em `@theme` geram automaticamente classes utilitárias nativas. Usar **sempre** a classe utilitária direta:

| Token CSS | Classe correta | ❌ Errado |
|---|---|---|
| `--color-brand` | `text-brand`, `bg-brand` | `text-[--color-brand]` |
| `--color-text-dark` | `text-text-dark` | `text-[--color-text-dark]` |
| `--color-text-light` | `text-text-light` | `text-[--color-text-light]` |
| `--color-text-gray` | `text-text-gray` | `text-[--color-text-gray]` |
| `--color-panel` | `bg-panel` | `bg-[--color-panel]` |

⚠️ `text-[--color-brand]` sem `var()` gera CSS inválido (`color: --color-brand`) — o navegador ignora e aplica a cor padrão. ❌ Nunca hardcodar hex.

### Tipografia

| Classe | Fonte | Uso |
|---|---|---|
| `font-sans` | Fira Sans | UI, navegação, títulos |
| `font-serif` | Source Serif 4 | Textos longos, descrições |

❌ Nunca usar `font-fira` diretamente ou `font-family` inline.

### Layout

- Conteúdo: `max-w-7xl mx-auto px-6`
- Grid de projetos: `max-w-[1400px] mx-auto px-8`
- Seções: `py-12`

---

## Internacionalização (i18n)

- **Locales suportados:** `pt` (padrão), `en`
- **Middleware** (`middleware.js`): redireciona `/` → `/pt` ou `/en` via `Accept-Language`
- **Dicionários:** `src/dictionaries/pt.json`, `en.json`, `index.js`
- **Dados bilíngues:** `src/data/siteData.js` exporta `filterTags` com chaves `pt` e `en`
- Usar `params.lang` para obter o locale atual nas páginas

---

## Estrutura de arquivos

```
src/
  app/
    [lang]/              → Todas as rotas públicas com prefixo de idioma
      page.js            → Home (fullscreen, sem Header/Footer)
      projetos/page.js   → Grid unificado de projetos (gráfico + produto)
      sobre/page.js      → Página sobre
      grafico/[slug]/    → Detalhe de projeto gráfico
      produto/[slug]/    → Detalhe de projeto de produto
    globals.css
    layout.js
  components/
    Header.jsx           → Navegação principal
    Footer.jsx           → Rodapé
    PageLayoutWrapper.js → Omite Header/Footer na Home
    LanguageToggle.jsx   → Alternância pt/en
    TypewriterHero.js    → Animação da Home
    DandelionAnimation.jsx
    ui/
      button.jsx         → shadcn/ui
      card.jsx           → shadcn/ui
      carousel.jsx       → shadcn/ui
      ProjectCard.jsx    → Componente customizado (imagem + hover com texto)
  data/
    siteData.js          → typewriterWords + filterTags (pt/en)
    tags.js              → filterTags (pt/en) — legado
    typewriterWords.js   → legado (migrado para siteData.js)
  dictionaries/
    pt.json / en.json / index.js
  lib/
    utils.js             → cn() helper
  utils/
    uploadthing.js
middleware.js            → Redirect de locale na raiz
```

---

## Rotas

```
/[lang]/                    → Home (fullscreen, sem Header/Footer)
/[lang]/projetos            → Grid unificado — gráfico + produto, filtro por tags
/[lang]/grafico/[slug]      → Detalhe de projeto gráfico (carousel + descrição)
/[lang]/produto/[slug]      → Detalhe de projeto de produto
/[lang]/sobre               → Página sobre
/admin                      → Área administrativa
/api/uploadthing            → API de upload
```

---

## Componentes — Regras

- Extensões `.jsx` ou `.js` — ❌ nunca `.tsx` ou `.ts`
- Path aliases: `@/components`, `@/lib`, `@/utils`, `@/data`
- `cn()` de `@/lib/utils` para merge de classes Tailwind
- ❌ Criar UI do zero — verificar shadcn/ui e componentes existentes primeiro
- ❌ Instalar bibliotecas de ícones — usar unicode (`*`, `/`) ou assets do Figma MCP

### Layout — regra crítica

`PageLayoutWrapper` omite Header/Footer quando `pathname` corresponde à Home (`/[lang]`).
- ❌ Nunca adicionar Header/Footer manualmente nas páginas

### ProjectCard

- Localização: `src/components/ui/ProjectCard.jsx` — componente customizado (não shadcn)
- Props: `{ title, img, href }`
- Comportamento: imagem visível → hover anima `opacity` do overlay de texto para `opacity-100`
- Imagem permanece visível; o overlay branco com texto aparece sobre ela no hover

---

## Identidade Visual

- `/*` + asterisco vermelho + nome = padrão de logo
- Asterisco `*` vermelho antes de itens de navegação ativos
- Links: inativo `text-[--color-text-dark]` | hover `text-[--color-text-light]` | ativo `text-[--color-brand]`
- Transições: `transition-colors duration-300`
- Navegação: `uppercase tracking-wide`
- Estética: sem bordas, sombras ou backgrounds coloridos — minimalismo

---

## Assets e Imagens

- Imagens em `/public/` — servidas como estáticas
- `next/image` com `unoptimized` nas galerias
- Grid: `fill` + `object-cover` + `aspect-video` — cria mosaico contínuo com `gap-0`

---

## Figma MCP — Fluxo obrigatório

1. `get_design_context(fileKey, nodeId)` — estrutura do node
2. Se truncado: `get_metadata` → identificar child nodes → `get_design_context` por node
3. `get_screenshot` — referência visual
4. Só após ambos: baixar assets e implementar
5. Traduzir output para convenções do projeto:
   - Hex avulsos → tokens (`--color-brand`, etc.)
   - Font-family inline → `font-sans` / `font-serif`
   - Reutilizar componentes existentes
6. Validar contra screenshot antes de marcar concluído

**Assets:** URL `localhost` do Figma MCP → usar diretamente. ❌ Não criar placeholders. ❌ Não instalar pacotes de ícones.



<!-- SPECKIT START -->
For additional context about technologies to be used, project structure,
shell commands, and other important information, read the current plan
<!-- SPECKIT END -->
