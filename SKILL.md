---
name: shine
description: Create interactive, web-based technical explanations inspired by Distill.pub. Guides users through story discovery, article structure, and building self-contained HTML files with D3 v7 visualizations. Use when the user wants to explain a technical concept visually, build an explorable article, or distill complex ideas into interactive prose.
---

# Shine: Interactive Technical Explanations

Shine helps create interactive, web-based explanations of technical concepts. Inspired by [Distill.pub](https://distill.pub)'s argument that research distillation is valuable creative work, it provides scaffolding to turn complex ideas into explorable, visual, interactive articles.

AI tools generate complexity faster than people can consume it. Shine is for bridging that gap: helping people digest and communicate technical concepts clearly.

**Toolkit:**
- `SKILL.md` — This file. Editorial process and rules.
- `ARTICLE.md` — HTML scaffold, CSS foundation, layout patterns, series structure
- `VISUALS.md` — D3 visualization patterns, interaction, rendering, iteration
- `templates/scaffold.html` — Copy-paste starting HTML template
- `templates/series-index.html` — Copy-paste series index template
- `templates/figures/` — Reusable figure implementations (slider, brush, scroll narrative)
- `scripts/init.sh` — Scaffold a new project folder
- `scripts/validate.js` — Check generated HTML against shine rules
- `scripts/serve.js` — Local dev server with live reload
- `examples/gradient-descent/index.html` — Complete working example article

## Invocation

The user invokes this skill with a topic:

```
/skill:shine how gradient descent finds minima
```

If no topic is provided, start by asking what concept they want to explain.

**Path convention:** All file paths referenced in this skill (`templates/`, `scripts/`, `examples/`) are relative to the skill directory (the directory containing `SKILL.md`). The agent resolves them from there.

## Articles, Not Dashboards

This is the central principle. Everything else follows from it.

Shine makes explanatory articles where prose drives understanding and interactive figures serve the narrative. We are not making dashboards, data products, or slide decks. The difference matters because it shapes every decision:

- An article has an author's voice and a progression of ideas. A dashboard has widgets.
- An article's figures are embedded in an argument. A dashboard's charts stand alone.
- An article earns attention through clarity. A dashboard demands attention through density.

When in doubt about a design choice, ask: "Would this feel at home in a Distill.pub article, or in a Grafana dashboard?" If the answer is dashboard, reconsider.

We are also not making coding tutorials. Equations and their connection to behavior should be shown through interactive visualizations, not code listings. If pseudocode helps connect math to implementation, keep it minimal and pair it with the equation. Never show implementation code (framework boilerplate, shader code, API calls) unless the article is specifically about programming.

## The Process

**Do not skip to code.** The most common failure mode is jumping straight to scaffolding without understanding what the user is trying to explain and who they're explaining it to. The second most common failure mode is asking a few questions upfront and then writing the entire article in one shot.

Shine is a conversation, not a generation pipeline. The process has natural checkpoints where you stop and check in with the user before continuing.

### Phase 1: Story Discovery

Before writing any code, have a conversation with the user. Ask questions and listen. You need to understand:

- **What concept are you explaining?** Get specific. Not "machine learning" but "how gradient descent finds minima."
- **Who is the audience?** What can they already be assumed to know? What's new to them?
- **What is the key insight?** What is the single thing the reader should walk away understanding?
- **What is the progression of understanding?** What does the reader need to learn first, second, third to arrive at the insight? Map the dependency chain of ideas.
- **What misconceptions exist?** What do people commonly get wrong, and how can interaction expose the correct mental model?

Ask these questions one or two at a time. Start with "What are you trying to explain?" and follow the thread. Wait for answers before moving on. If the user gives you all the context upfront, you can move faster, but if they give a brief prompt, slow down and ask.

**Single-Shot Mode:** If the user provides source material (a document, notes, paper, KB article), skip the full conversational discovery. Extract the key insight, audience, and progression yourself. Present a one-paragraph summary for confirmation: "Here's what I understand: you're explaining [concept] to [audience]. The key insight is [X]. The progression is A → B → C. I'll turn the comparisons with numbers into bar charts, the parameter space into a slider figure, and the step-by-step process into prose. Does that sound right?" Once confirmed, move to Phase 2.

**Checkpoint:** Before moving to Phase 2, confirm the concept, audience, insight, and progression with the user. "Here's what I think we're building..." This is the single most important moment in the process. Get it wrong and everything downstream is wasted effort.

### Phase 2: Article Structure

Now design the article at a high level. Present the user with a proposed structure:

- What sections will the article have?
- What is the role of each section in the progression? (introduces concept, builds intuition, shows application, etc.)
- Where will interactive figures go, and what will they show?
- What kind of interaction will each figure use? (slider, brush, scroll-driven, hover, etc.)
- Is this a single article or a series?

Write this as a short outline, not code. For each figure, describe it in prose: what it shows, what the reader can do with it, and what they should learn from it. This prose description is the spec.

**Content adaptation heuristic:** When adapting existing content, look for these patterns:

| Source pattern | Becomes | Why |
|---|---|---|
| Comparisons with numbers (before/after, with/without) | Bar chart, slope chart, or toggle | Direct comparison is clearest |
| 2D parameter space or tradeoff surface | Contour plot + draggable marker, or slider figure | Reader explores the tradeoff |
| Step-by-step process or sequence | Scroll-driven narrative or stepper | Time-ordered revelation |
| List of items where one is surprising | Sortable table with hover highlight | Density + discoverability |
| Trend over time | Line chart with annotation | Shows direction + magnitude |
| Distribution or spread | Violin, box plot, or histogram | Shape matters more than summary stats |

Everything else stays as prose. Do not turn every table into a chart. Figures earn their place by teaching something prose alone cannot.

**Checkpoint:** Share this outline with the user. Ask if the progression makes sense. Are there concepts missing? Is the order right? Should any section be interactive that isn't, or static that is? Do the prose descriptions of the figures capture what the user has in mind? This is cheap to change now and expensive to change after building.

### Phase 3: Build One Section

Pick the most important interactive section and build it first. Not the whole article. One section.

**Use the toolkit:**
1. Run `scripts/init.sh <project-name> [dest-dir]` to scaffold a new project (default: `~/.pi/shine/`).
2. Copy `templates/figures/` modules into the article's `<script>` instead of writing raw D3 from scratch.
3. Adapt the figure to the concept. The templates give you working interaction, axes, and responsiveness.

Run `scripts/serve.js <project-dir>` to launch a local dev server with live reload. Open the browser. Ask:
- Does this interaction teach what we intended?
- Is the data/example well chosen?
- Does the visual encoding make sense?

Iterate on this section until it works before building the rest.

### Phase 4: Complete the Article

Build the remaining sections, following the structure from Phase 2. After each major section, check the browser (the dev server reloads automatically). Prose should be written alongside the figures, not after, because the prose frames what the reader should notice in each figure.

**Before delivering, complete this checklist in order:**

1. **Validate** — Run `scripts/validate.js <path-to-index.html>`. Fix every issue it reports.
2. **Responsive** — Shrink the browser to 400px width. Is the article still readable? Do figures reflow?
3. **Dark mode** — Toggle system dark mode. Do colors invert correctly? Is text still readable?
4. **Reduced motion** — Enable `prefers-reduced-motion` in browser dev tools. Do animations become instant state changes (not just duration 0)?
5. **Cross-figure consistency** — Do colors mean the same thing everywhere? Are axis labels readable? Does every figure have a caption?
6. **Prose pass** — Read the article aloud. Does it sound like a person wrote it? Fix any em dashes, hype, or list-where-prose-would-flow.

Do not skip step 1. The validator catches mistakes that are invisible to you but obvious to readers.

Run `scripts/validate.js <path-to-index.html>` from anywhere — it checks the article against shine rules regardless of where it lives.

### Output

Default output: `~/.pi/shine/<project-name>/`. You can change this — just tell the agent where you want the article written.

Each explanation is a self-contained HTML file.

Reference `examples/gradient-descent/index.html` for a complete working article that follows every rule in this skill.

## Editorial Tone

Shine articles should have clear and humble prose. We are helping people digest, not force-feeding them.

- Avoid em dashes. Use commas, periods, or restructure the sentence.
- Don't oversell. Say "this can help" not "this is a game-changer." Say "an appropriate metaphor" not "a precise metaphor."
- State what things do, not how important they are. Let the reader decide the importance.
- Prefer short, direct sentences. If a paragraph feels like it's building to a dramatic reveal, flatten it.
- Use "tries to", "can", "helps" instead of absolute claims.

The writing should feel like a knowledgeable colleague explaining something at a whiteboard, not a keynote presentation.

## Anti-Slop

AI coding tools have strong defaults that produce generic, recognizable output. Shine articles should not look like AI made them. They should look like a thoughtful person made them.

The test is simple: does this look like an article, or does it look like a dashboard? Every rule below is a specific case of that question.

**Dashboard patterns to avoid:**

- **Numbered KPI cards** (big number + label + colored border). These are for monitoring, not explaining. If you need to show a quantity, put it in a sentence or a figure caption.
- **Metric grids** (3-4 cards in a row showing counts/percentages). Same problem. An article introduces numbers in context, not in a grid of isolated stats.
- **Status badges** (green/yellow/red pills). These encode operational state. Articles explain concepts, not system health.
- **Card-heavy layouts** where every section is a rounded-corner box with a shadow. Articles use whitespace and typography for structure, not containers.
- **Colored callout boxes** (blue "insight" boxes, green "tip" boxes). Information should flow as prose within the narrative. Callouts break reading flow. If something is important enough to highlight, write it as a strong sentence in the text.

**Generic AI visual patterns to avoid:**

- Inter, Roboto, or system-ui as the only font. Use the shine type stack (Source Serif 4, Source Sans 3, Source Code Pro) or choose fonts with intention.
- Default blue (#3B82F6) + purple (#8B5CF6) accent palette. Choose colors that relate to the content.
- Glowing box-shadows, pulsing animations, or gradient borders. These are decorative, not informative.
- Emoji as section headers or bullet markers.
- "Hero" sections with giant centered text and a gradient background on every page.

**Prose patterns to avoid:**

- Em dashes everywhere (covered in Editorial Tone).
- Bold claims stated as universal truth ("This fundamentally changes...").
- Numbered lists where prose would flow better. Not everything is a "3-step process."
- Ending with a grand summary that restates everything just said.

**The check:** Before delivering, scan the output. If you swapped the content for a different topic and nothing else needed to change, the design is too generic. The visual choices should relate to what's being explained.

## Design Principles

These principles come from [Distill.pub](https://distill.pub) and the broader tradition of explanatory writing:

**Information hierarchy.** Three levels, always distinguishable. Primary: the key insight and its argument. Secondary: context, definitions, related concepts. Tertiary: technical details, proofs, edge cases (margin notes or expandable sections). Typography, spacing, and visual weight make this hierarchy clear without the reader having to read a word.

**Visual encoding.** Position and length are the most accurate channels; use them for the most important data. Color encodes categories or highlights, not quantitative information alone. Redundant encoding (color + position) improves accessibility. Consistent visual language across all figures.

**Typography.** Large readable body (18-20px), generous line height (1.5-1.6), constrained line length (60-75 chars), clear heading hierarchy. Monospace for code, KaTeX for math. Margin notes over footnotes.

**Interaction patterns.**

| Pattern | Use When |
|---------|----------|
| Details-on-demand | Supplementary info would clutter the narrative |
| Explorable explanation | The concept involves a parameter space to explore |
| Linked views | The same data has multiple meaningful representations |
| Scroll-driven narrative | The explanation has a natural sequence of reveals |
| Animated transition | The path between two states is meaningful |

## Pedagogy

These principles come from building real shine articles and noticing what gets corrected most often.

**Exaggerate for clarity.** Default parameter values should make phenomena dramatically visible. If you're showing viscosity, crank it up so the effect is obvious. If you're showing divergence between two methods, pick parameters where they clearly disagree. Pedagogical clarity trumps physical realism. The reader can always dial things down; they can't learn from effects too subtle to see.

**Sensible defaults.** Every interactive figure must show something interesting before the reader touches anything. No blank canvases, no "click a particle to start", no grids of dots waiting to settle. Pre-select a default element, pre-populate with data, start the simulation in a state that already demonstrates the concept.

**Slow enough to follow.** Animated demonstrations should move slowly enough that the reader can track cause and effect. When a particle moves through a field, the reader needs to see the field respond. When in doubt, go slower. The reader can always speed things up.

**Consistent conventions across figures.** If you show a radius as a dotted circle in one figure, show it the same way in every figure. If you color-code a variable blue in an equation, use that same blue everywhere it appears. Inconsistency forces the reader to re-learn the visual language in each figure.

**Looping animations reset cleanly.** If a demonstration loops, it should reset to its initial state, not carry over physics or accumulated values from the previous iteration.
