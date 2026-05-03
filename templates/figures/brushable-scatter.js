/**
 * Brushable Scatter Figure Template
 *
 * Use when: the same data has multiple meaningful representations (linked views).
 * Provides a 2D brush that dispatches selected keys to other figures via d3.dispatch.
 *
 * @param {string} selector - CSS selector for the container div (e.g., '#fig-1')
 * @param {Array} data - Array of data objects
 * @param {Object} options - Configuration object
 * @param {Function} options.x - Accessor: d => d.xValue
 * @param {Function} options.y - Accessor: d => d.yValue
 * @param {Function} [options.r=(d)=>4] - Radius accessor
 * @param {Function} [options.id=(d,i)=>i] - Unique identifier for each point
 * @param {string} [options.xLabel='X'] - X-axis label
 * @param {string} [options.yLabel='Y'] - Y-axis label
 * @param {Function} [options.color=(d)=>'var(--accent)'] - Color accessor
 *
 * @returns {Object} Controller with .highlight(keys) method for receiving selections
 *   from other figures.
 *
 * Usage:
 *   const fig = createBrushableScatter('#fig-1', data, {
 *     x: d => d.x, y: d => d.y, r: d => d.r, id: d => d.id,
 *     xLabel: 'X', yLabel: 'Y', color: d => d.cat
 *   });
 *
 *   // Listen to brush selections from this figure
 *   dispatch.on('select.fromScatter', keys => {
 *     // keys are the id values of brushed points
 *   });
 *
 *   // Highlight points from another figure
 *   dispatch.on('select.fromTable', keys => fig.highlight(keys));
 */
function createBrushableScatter(selector, data, options) {
  const {
    x, y, r = () => 4, id = (d, i) => i,
    xLabel = 'X', yLabel = 'Y',
    color = () => 'var(--accent)'
  } = options;

  const container = d3.select(selector).append('div').attr('class', 'figure');
  const wrapper = container.append('div').style('width', '100%').style('overflow', 'hidden');

  const margin = { top: 10, right: 20, bottom: 40, left: 50 };
  let width = wrapper.node().clientWidth - margin.left - margin.right;
  let height = 360 - margin.top - margin.bottom;

  const svg = wrapper.append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom);

  const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

  const xExtent = d3.extent(data, x);
  const yExtent = d3.extent(data, y);
  const xScale = d3.scaleLinear().domain(xExtent).nice().range([0, width]);
  const yScale = d3.scaleLinear().domain(yExtent).nice().range([height, 0]);

  g.append('g').attr('class', 'axis').attr('transform', `translate(0,${height})`)
    .call(d3.axisBottom(xScale).ticks(Math.max(2, width / 80)))
    .append('text').attr('x', width).attr('y', -6).attr('fill', 'var(--text-2)')
    .attr('text-anchor', 'end').style('font-size', '12px').text(xLabel);

  g.append('g').attr('class', 'axis')
    .call(d3.axisLeft(yScale).ticks(Math.max(2, height / 50)))
    .append('text').attr('transform', 'rotate(-90)').attr('y', 10).attr('fill', 'var(--text-2)')
    .attr('text-anchor', 'end').style('font-size', '12px').text(yLabel);

  const circles = g.selectAll('circle')
    .data(data, id)
    .join('circle')
    .attr('cx', d => xScale(x(d)))
    .attr('cy', d => yScale(y(d)))
    .attr('r', r)
    .attr('fill', color)
    .attr('opacity', 0.7)
    .attr('stroke', 'none');

  const brush = d3.brush()
    .extent([[0, 0], [width, height]])
    .on('brush end', event => {
      if (!event.selection) {
        circles.attr('opacity', 0.7).attr('fill', color);
        if (typeof dispatch !== 'undefined') dispatch.call('select', null, []);
        return;
      }
      const [[x0, y0], [x1, y1]] = event.selection;
      const sx0 = xScale.invert(x0), sx1 = xScale.invert(x1);
      const sy0 = yScale.invert(y1), sy1 = yScale.invert(y0);
      const brushedKeys = [];
      circles.attr('fill', d => {
        const xv = x(d), yv = y(d);
        const inBrush = xv >= sx0 && xv <= sx1 && yv >= sy0 && yv <= sy1;
        if (inBrush) brushedKeys.push(id(d));
        return inBrush ? color(d) : '#ddd';
      }).attr('opacity', d => {
        const xv = x(d), yv = y(d);
        const inBrush = xv >= sx0 && xv <= sx1 && yv >= sy0 && yv <= sy1;
        return inBrush ? 0.85 : 0.15;
      });
      if (typeof dispatch !== 'undefined') dispatch.call('select', null, brushedKeys);
    });

  g.append('g').call(brush);

  return {
    highlight(keys) {
      const sel = new Set(keys);
      circles.attr('fill', d => sel.size === 0 || sel.has(id(d)) ? color(d) : '#ddd')
             .attr('opacity', d => sel.size === 0 || sel.has(id(d)) ? 0.85 : 0.15);
    }
  };
}
