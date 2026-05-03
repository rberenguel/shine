#!/usr/bin/env node
/**
 * Validate a shine article against editorial and structural rules.
 * Usage: node validate.js <path-to-index.html>
 */
const fs = require('fs');
const path = require('path');

const file = process.argv[2];
if (!file) {
  console.error('Usage: node validate.js <path-to-html>');
  process.exit(1);
}

const html = fs.readFileSync(file, 'utf-8');
const lower = html.toLowerCase();
const issues = [];

// --- Structural checks ---
if (!lower.includes('d3.v7')) issues.push('Missing D3 v7 CDN');
if (!lower.includes('source serif 4')) issues.push('Missing Source Serif 4 font');
if (!lower.includes('source sans 3')) issues.push('Missing Source Sans 3 font');
if (!lower.includes('source code pro')) issues.push('Missing Source Code Pro font');

// --- Anti-slop checks ---
const figCount = (html.match(/class="figure"/g) || []).length;
const captionCount = (html.match(/class="figure-caption"/g) || []).length;
if (figCount > 0 && captionCount < figCount) {
  issues.push(`Found ${figCount} figure(s) but only ${captionCount} caption(s). Every figure needs a caption.`);
}

if (lower.includes('kpi') || lower.includes('metric card') || lower.includes('status badge')) {
  issues.push('Dashboard pattern detected (KPI card / metric grid / status badge). Articles are not dashboards.');
}

if (lower.includes('inter') || lower.includes('roboto') || lower.includes('system-ui')) {
  // system-ui is in the heading font fallback, that's ok. Check if it's the ONLY font.
  if (!lower.includes('source serif')) issues.push('Generic font stack detected. Use Source Serif 4 / Source Sans 3.');
}

if (lower.includes('#3b82f6') || lower.includes('#8b5cf6')) {
  issues.push('Default AI blue/purple palette detected. Choose colors that relate to the content.');
}

if (lower.includes('box-shadow') && lower.includes('0 0')) {
  issues.push('Glowing box-shadow detected. Decorative effects are not informative.');
}

// --- Prose checks ---
const emDashCount = (html.match(/&mdash;|—/g) || []).length;
if (emDashCount > 3) issues.push(`${emDashCount} em dashes found. Avoid em dashes; use commas, periods, or restructure.`);

if (/fundamentally changes|game-changer|precise metaphor/i.test(html)) {
  issues.push('Hype language detected ("fundamentally changes", "game-changer"). Tone it down.');
}

// --- Accessibility ---
if (!lower.includes('prefers-reduced-motion')) issues.push('Missing prefers-reduced-motion media query.');
if (figCount > 0 && !lower.includes('aria-label') && !lower.includes('role=')) {
  issues.push('Figures present but no ARIA labels found. Add aria-label or role="img" to SVG containers.');
}

// --- Pedagogy ---
if (lower.includes('click a particle') || lower.includes('click to start') || lower.includes('blank canvas')) {
  issues.push('Blank canvas / click-to-start pattern detected. Every figure must show something interesting by default.');
}

// --- Results ---
console.log(`\nValidating: ${path.resolve(file)}`);
console.log(`Figures: ${figCount}, Captions: ${captionCount}`);

if (issues.length === 0) {
  console.log('\n✓ All checks passed. Looks like shine.');
  process.exit(0);
} else {
  console.log(`\n✗ ${issues.length} issue(s) found:\n`);
  issues.forEach((issue, i) => console.log(`  ${i + 1}. ${issue}`));
  process.exit(1);
}
