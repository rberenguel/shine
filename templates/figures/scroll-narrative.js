/**
 * Scroll-Driven Narrative Figure Template
 *
 * Use when: the explanation has a natural sequence of reveals.
 * Sticky figure with scrolling text steps. Each step triggers a render function.
 *
 * @param {string} selector - CSS selector for the container div (e.g., '#fig-1')
 * @param {Array} steps - Array of step objects, each with:
 *   @param {string} steps[].text - The prose for this scroll step
 *   @param {Function} steps[].render - REQUIRED. Callback(svg, width, height) that draws
 *     this step's visualization. Must be idempotent: calling it multiple times should produce
 *     the same visual state.
 *
 * Usage:
 *   createScrollNarrative('#fig-1', [
 *     {
 *       text: 'First, the data looks like this...',
 *       render: (svg, w, h) => {
 *         // Draw overview state
 *       }
 *     },
 *     {
 *       text: 'When we split by category, clusters appear...',
 *       render: (svg, w, h) => {
 *         // Draw split-by-category state
 *       }
 *     },
 *   ]);
 *
 * Tip: Make every render function idempotent. When the user scrolls backward,
 * the chart must transition correctly from ANY state to the target step, not just
 * from the previous step.
 */
function createScrollNarrative(selector, steps) {
  const container = d3.select(selector).append('div')
    .style('display', 'flex')
    .style('gap', '2rem')
    .style('margin', '2rem 0');

  const figureWrap = container.append('div')
    .style('position', 'sticky')
    .style('top', '2rem')
    .style('flex', '1')
    .style('height', 'fit-content');

  const margin = { top: 10, right: 20, bottom: 30, left: 40 };
  let width = 400 - margin.left - margin.right;
  let height = 360 - margin.top - margin.bottom;

  const svg = figureWrap.append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);

  const stepsWrap = container.append('div').style('flex', '1');

  steps.forEach((step, i) => {
    const div = stepsWrap.append('div')
      .attr('class', 'step')
      .attr('data-step', i)
      .style('min-height', '60vh')
      .style('padding', '2rem 0');
    div.append('p').text(step.text);
  });

  let currentStep = -1;
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const i = +e.target.dataset.step;
        if (i !== currentStep) {
          currentStep = i;
          svg.interrupt().selectAll('*').remove();
          steps[i].render(svg, width, height);
        }
      }
    });
  }, { threshold: 0.5 });

  stepsWrap.selectAll('.step').each(function() { observer.observe(this); });

  // render first step immediately
  currentStep = 0;
  steps[0].render(svg, width, height);
}
