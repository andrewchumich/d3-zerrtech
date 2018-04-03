let barChartGroup = d3.select('g.bar-chart');

const DATA_ARRAY = [
    {
        id: 0,
        value: 1,
    },
    {
        id: 1,
        value: 2,
    },
    {
        id: 2,
        value: 8,
    },
    {
        id: 3,
        value: 4,
    },
];

let update = barChartGroup
    .selectAll('g.bar-group')
    .data(DATA_ARRAY, function(d) {
        // if you don't do this, it will key by index
        return d.id;
    });

update
    // get the exit selection
    .exit()
    // remove exiting elements
    .remove()
    ;


update
    // get the enter selection
    .enter()
    // append g for each new item and add attributes
    .append('g')
        .attr('class', 'bar-group')
        .append('rect')
        // set height, width, color, position
        // .attr('width', xScale.bandwidth())
        // ...
    ;

update
    // update height, width, color, position
    // .attr('width', xScale.bandwidth())
    // ...    





