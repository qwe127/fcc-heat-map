const url = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json'

const getData = async () => {
    const response = await fetch(url)
    const data = await response.json()
    const baseTemperature = data.baseTemperature
    const monthlyVariance = data.monthlyVariance
    const yearData = monthlyVariance.map((i) => i.year)
    const monthData = monthlyVariance.map((i) => i.month - 1)
    const colorsArray = ['rgb(69,117,180)', 'rgb(116,173,209)', 'rgb(224,243,248)', 'rgb(255,255,191)', 'rgb(254,224,144)', 'rgb(253,174,97)', 'rgb(244,109,67)', 'rgb(215,48,39)']
    
    const months = [...new Set(monthData)];
    console.log(monthlyVariance)
    
    const width = 1300
    const height = 700
    const padding = 70

    const svgCanvas = d3.select('body').append('svg').attr('width', width).attr('height', height).attr('class', 'svgCanvas')
    const legendCanvas = d3.select('.svgCanvas').append('svg').attr('id', 'legend').attr('width', width / 4).attr('height', height / 4)
    d3.select('.svgCanvas').style('background-color', 'white')
    d3.select('#legend').style('background-color', 'black')

    const xScale = d3.scaleLinear().domain([d3.min(yearData), d3.max(yearData) + 1]).range([padding, width - padding])
    const yScale = d3.scaleBand().domain(months).range([height - padding, 0 + padding])

    const xAxis = d3.axisBottom(xScale).tickFormat(d3.format('d'))
    svgCanvas.append('g').attr("transform", `translate(0,  ${height - padding})`).call(xAxis).attr('id', 'x-axis')
    
    const yAxis = d3.axisLeft(yScale).tickValues(yScale.domain())
    .tickFormat((month) => {
        let date = new Date(0);
        date.setUTCMonth(month);
        let format = d3.utcFormat('%B');
        return format(date);
      })
    svgCanvas.append('g').attr('transform', `translate(${padding})`).call(yAxis).attr('id', 'y-axis')
   
    d3.select('#main-container').append('h2')
    d3.select('h2').text(`${d3.min(yearData)}-${d3.max(yearData)}: base temperature ${baseTemperature}℃`).attr('id', 'description')

    svgCanvas.selectAll('rect').data(monthlyVariance).enter().append('rect').attr('class', 'cell')
    .attr('fill', (d)=>{
        if (d.variance.toFixed(1) <= -6){
            return colorsArray[0]
        }
        if (d.variance.toFixed(1) <= -3){
            return colorsArray[1]
        }
        if (d.variance.toFixed(1) <= -1){
            return colorsArray[2]
        }
        if (d.variance.toFixed(1) <= 0){
            return colorsArray[3]
        }
        if (d.variance.toFixed(1) <= 1){
            return colorsArray[4]
        }
        if (d.variance.toFixed(1) <= 3){
            return colorsArray[5]
        }
        if (d.variance.toFixed(1) <= 4){
            return colorsArray[6]
        } else {return colorsArray[7]}
    })
    .attr('data-year', (d)=>d.year)
    .attr('data-month', (d)=> (d.month - 1))
    .attr('data-temp', (d)=> baseTemperature + d.variance)
    .attr('x', (d)=>xScale(d.year))
    .attr('y', (d)=>yScale(d.month - 1))
    .attr('height', (d)=>(height - (2 * padding)) / 12)
    .attr('width', (d) => 6 )
    
    legendCanvas.append('text').text('Legend:').attr('x', 86).attr('y', 20).attr('font-size', 13)
    legendCanvas.data(colorsArray).enter().select('#legend').append('rect').style('outline', '1.5px solid rgba(0, 0, 0, 0.616)')
    .attr('x', (_, i) => 17 * (i+2))
    .attr('y', 30)
    .attr('height', 20)
    .attr('width', 16)
    .attr('fill', (_, i) => colorsArray[i - 1])

    const tooltip = d3.select('#tooltip')
    .style("position", "absolute")
    .style("visibility", "hidden")
    .style("border-width", "1px")


    d3.selectAll('.cell').data(monthlyVariance)
    .on("mouseover", (event, d) => {
        tooltip.attr('data-year', d.year)
        tooltip.style("visibility", "visible")
        tooltip.style("opacity", "1")
        tooltip.html(`<p>Year: ${d.year}<br>Variance: ${d.variance.toFixed(1)}℃`)        
        .style('outline', '1.5px solid rgba(0, 0, 0, 0.616)')
    })
    .on("mousemove", (event, d) => {
        const x = event.x
        const y = event.y
            return tooltip.style('top', y + 10 + 'px').style('left', x + 10 +'px')})
    .on("mouseout", () => {return tooltip.style("opacity", "0").style('visibility', 'hidden')});
}

document.addEventListener('DOMContentLoaded', getData)
