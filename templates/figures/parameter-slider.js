/**
 * Parameter Slider Figure Template
 *
 * Use when: the concept involves a parameter space to explore.
 * Provides a range slider that updates a visualization in real time.
 *
 * @param {string} selector - CSS selector for the container div (e.g., '#fig-1')
 * @param {Object} options - Configuration object
 * @param {number} [options.param=0.5] - Initial slider value
 * @param {number} [options.min=0] - Minimum slider value
 * @param {number} [options.max=1] - Maximum slider value
 * @param {number} [options.step=0.01] - Step increment
 * @param {string} [options.label='Parameter'] - Label shown next to slider
 * @param {Function} options.render - REQUIRED. Callback(svg, width, height, value) that draws
 *   the figure. Called initially and on every slider change. Use svg.selectAll('*').remove()
 *   to clear before redrawing, or use D3 join for smooth transitions.
 *
 * Usage:
 *   createSliderFigure('#fig-1', {
 *     param: 0.3, min: 0, max: 1.2, step: 0.01,
 *     label: 'Learning rate',
 *     render: (svg, width, height, value) => {
 *       // Draw your visualization using the current value
 *       const xScale = d3.scaleLinear().domain([0, 10]).range([0, width]);
 *       // ... draw bars, lines, paths, etc.
 *     }
 *   });
 */
function createSliderFigure(selector, options) {
  const {
    param = 0.5, min = 0, max = 1, step = 0.01,
    label = 'Parameter',
    render
  } = options;

  const container = d3.select(selector);
  const figure = container.append('div').attr('class', 'figure');

  const controls = figure.append('div').attr('class', 'controls');
  controls.append('label')
    .style('font-weight', '600')
    .style('color', 'var(--text)')
    .text(label + ':');
  const slider = controls.append('input')
    .attr('type', 'range')
    .attr('min', min).attr('max', max).attr('step', step)
    .attr('value', param);
  const valSpan = controls.append('span')
    .style('font-family', 'var(--mono-font)')
    .style('min-width', '3ch')
    .text(param);

  const wrapper = figure.append('div')
    .style('width', '100%')
    .style('overflow', 'hidden');

  const margin = { top: 10, right: 20, bottom: 30, left: 40 };
  let width = wrapper.node().clientWidth - margin.left - margin.right;
  let height = 320 - margin.top - margin.bottom;

  const svg = wrapper.append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);

  render(svg, width, height, param);

  slider.on('input', function() {
    const v = +this.value;
    valSpan.text(v);
    svg.selectAll('*').remove();
    render(svg, width, height, v);
  });

  const ro = new ResizeObserver(([entry]) => {
    const w = entry.contentRect.width;
    if (w > 0 && Math.abs(w - (width + margin.left + margin.right)) > 2) {
      width = w - margin.left - margin.right;
      svg.attr('width', width + margin.left + margin.right);
      wrapper.select('svg').attr('width', width + margin.left + margin.right);
      svg.selectAll('*').remove();
      render(svg, width, height, +slider.node().value);
    }
  });
  ro.observe(wrapper.node());
}
