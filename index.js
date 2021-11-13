const width = 800;
const height = 600;
const marginLeft = 300;
const marginRight = 30;
const marginTop = 30;
const marginBottom = 30;

const barColor = '#ffb752';

const barHeight = 10;
const barSpacing = 5;

const commaFormat = d3.format(',');

const showBarChart = (data) => {
  data = data.sort((a, b) => a.total_count - b.total_count);

  const totalCounts = data.map((d) => d.total_count);
  const categories = data.map((d) => d.Name);

  const xScale = d3
    .scaleLinear()
    .domain([0, d3.max(totalCounts)])
    .range([0, width]);

  const yScale = d3
    .scaleBand()
    .domain(categories)
    .range([height, 0])
    .paddingInner(0.15);

  const xAxis = d3.axisTop(xScale).ticks(6);
  const yAxis = d3.axisLeft(yScale);

  const svg = d3
    .select('#bar-chart')
    .append('svg')
    .attr('viewBox', [
      0,
      0,
      width + marginLeft + marginRight,
      height + marginTop + marginBottom,
    ]);

  // Bars
  svg
    .append('g')
    .selectAll('rect')
    .data(data)
    .enter()
    .append('rect')
    .attr('x', marginLeft)
    .attr('y', (d) => yScale(d.Name) + marginTop)
    .attr('fill', barColor)
    .attr('width', (d) => xScale(d.total_count))
    .attr('height', yScale.bandwidth())
    .on('mouseover', (event, d) => {
      console.log('mouse entered');
      d3.select('#tooltip')
        .style('left', event.pageX + 15 + 'px')
        .style('top', event.pageY + 'px')
        .classed('hidden', false);
      d3.select('#value').text(
        `Total 311 Requests: ${commaFormat(d.total_count)}`
      );
    })
    .on('mousemove', (event) => {
      d3.select('#tooltip')
        .style('left', event.pageX + 15 + 'px')
        .style('top', event.pageY + 'px');
    })
    .on('mouseout', function (d) {
      console.log('mouse left');
      d3.select('#tooltip').classed('hidden', true);
    });

  // x-axis
  svg
    .append('g')
    .attr('class', 'x-axis')
    .attr('transform', `translate(${marginLeft}, ${marginTop})`)
    .call(xAxis);

  // y-axis
  svg
    .append('g')
    .attr('class', 'y-axis')
    .attr('transform', `translate(${marginLeft}, ${marginTop})`)
    .call(yAxis);
};

d3.csv('boston_311.csv', d3.autoType)
  .then((data) => {
    console.log(data);
    showBarChart(data);
  })
  .catch((err) => alert(err));
