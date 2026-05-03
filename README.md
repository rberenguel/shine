# shine

A pi agent skill for creating interactive, web-based technical explanations inspired by [Distill.pub](https://distill.pub).

Converted from [moonshine](https://github.com/enjalot/moonshine) by [Ian Johnson](https://twitter.com/enjalot) (enjalot).

## What It Does

Shine guides you through distilling a complex technical concept into a self-contained, interactive HTML article with D3 v7 visualizations. It is a conversation, not a generation pipeline:

1. **Story Discovery** — clarify the concept, audience, key insight, and progression. *Single-Shot Mode:* if you provide source material (a doc, paper, or notes), the agent extracts the story itself and confirms with you in one paragraph.
2. **Article Structure** — design sections and figure descriptions before writing code. Includes a content-adaptation heuristic: comparisons → bars, parameter spaces → sliders, sequences → scroll narratives, etc.
3. **Build One Section** — prototype the most important interactive figure first using reusable templates.
4. **Complete the Article** — build the rest, then run a validator that catches anti-slop, accessibility, and pedagogy issues before you deliver.

## Install

### Option 1: Global skill directory
```bash
ln -s /Users/ruben/code/shine ~/.pi/agent/skills/shine
```

### Option 2: Per-project
```bash
mkdir -p .pi/skills
ln -s /Users/ruben/code/shine .pi/skills/shine
```

### Option 3: Settings
Add to your `~/.pi/settings.json`:
```json
{
  "skills": ["/Users/ruben/code/shine"]
}
```

### Option 4: CLI flag
```bash
pi --skill /Users/ruben/code/shine
```

## Usage

```
/skill:shine how gradient descent finds minima
```

If no topic is provided, shine will start by asking what you want to explain.

## Files

| File | Purpose |
|------|---------|
| `SKILL.md` | Editorial process, story discovery, single-shot mode, anti-slop rules, pedagogy, delivery checklist |
| `ARTICLE.md` | HTML scaffold, CSS foundation, layout patterns, series structure, thematic color starters |
| `VISUALS.md` | D3 v7 patterns, **Figure Chooser** (narrative goal → chart type), interaction, motion, **Shine Gotchas** |
| `templates/scaffold.html` | Starting HTML template (copy, don't generate from scratch) |
| `templates/series-index.html` | Series index page template |
| `templates/figures/parameter-slider.js` | Reusable slider figure with ResizeObserver |
| `templates/figures/brushable-scatter.js` | Reusable brushable scatter with linked-view dispatch |
| `templates/figures/scroll-narrative.js` | Reusable scroll-driven sticky figure |
| `scripts/init.sh` | Scaffold a new project folder |
| `scripts/validate.js` | Lint generated HTML against shine rules (hard gate before delivery) |
| `scripts/serve.js` | Dev server with live reload |
| `examples/gradient-descent/index.html` | Complete working example: uses template, ResizeObserver, KaTeX, dark mode |

## Workflow

```bash
# 1. Scaffold (default: ~/.pi/shine/)
./scripts/init.sh my-topic

# Or scaffold somewhere else
./scripts/init.sh my-topic ~/Desktop

# 2. Dev server (auto-reloads on save)
./scripts/serve.js ~/.pi/shine/my-topic 8080

# 3. Validate before delivering (hard gate — do not skip)
./scripts/validate.js ~/.pi/shine/my-topic/index.html
```

## License

MIT (same as the original moonshine project)
