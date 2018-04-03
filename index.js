//////////////////////////
// Set up data and util functions
//////////////////////////


/**
 * Convert string to hex color
 * @param {string} str string to convert
 * @returns {string} color hex string
 */
var stringToColor = function(str) {
    var hash = 0;
    for (var i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    var color = '#';
    for (var i = 0; i < 3; i++) {
      var value = (hash >> (i * 8)) & 0xFF;
      color += ('00' + value.toString(16)).substr(-2);
    }
    return color;
}

/**
 * @typedef {Object} City
 * @property {string} city
 * @property {string} country
 * @property {number} population in thousands
 */

/**
 * @type {City[]}
 */
const DATA = [
    {
        city: 'New York City',
        country: 'US',
        population: 8175133,
    },
    {
        city: 'Denver',
        country: 'US',
        population: 600158,
    },
    {
        city: 'Dallas',
        country: 'US',
        population: 1197816,
    },
    {
        city: 'Portland',
        country: 'US',
        population: 583776,
    },
    {
        city: 'Manchester',
        country: 'UK',
        population: 2553379,
    },
    {
        city: 'London',
        country: 'UK',
        population: 9787426,
    },
    {
        city: 'Nottingham',
        country: 'UK',
        population: 729997,
    },
    {
        city: 'Salvador',
        country: 'BR',
        population: 2480790,
    },
/*     {
        city: 'BR',
        country: 'BR',
        population: 2480790,
    }, */
    {
        city: 'Rio de Janeiro',
        country: 'BR',
        population: 5940224,
    },
    {
        city: 'Fortaleza',
        country: 'BR',
        population: 2315116,
    },
];

/**
 * @typedef {Object} ChartConfigItem
 * @property {string} key
 * @property {number} population
 */


/**
 * @param {City[]} cities
 * @param {string} group_key
 * @returns {ChartConfigItem[]}
 */
function convertToConfig(cities, group_keys) {
    const config = cities.reduce((prev, city) => {
        const key = group_keys.reduce((prev, k, i, a) => {
            if (prev === 'N/A') {
                return prev;
            } else if (city.hasOwnProperty(k)) {
                return prev + city[k];
            } else {
                return 'N/A';
            }
        }, '');

        if (!prev.has(key)) {
            prev.set(key, {
                ...city,
                key: key,
            });
        } else {
            const place = prev.get(key);
            prev.set(key, {
                ...place,
                population: place.population + city.population,
            });
        }
        return prev;
    }, (new Map()));

    return [...config.values()];
}


//////////////////////////
// D3 Stuff
//////////////////////////

// set margins
var margins = {
    top: 20,
    right: 40,
    bottom: 65,
    left: 65
};

// calculate visualization width and height
const width = 900 - margins.left - margins.right;
const height = 425 - margins.top - margins.bottom;

// create svg element and set width height
var svg = d3.select('div.viz')
    .append('svg')
    .attr('width', width + margins.left + margins.right)
    .attr('height', height + margins.top + margins.bottom)
    .append('g')
    .attr('width', width)
    .attr('height', height)
    .attr('transform', 'translate(' + margins.left + ',' + margins.top + ')')
    .attr('class', 'viz-group');

// create a group for the bars
var barChartGroup = svg.append('g')
    .attr('class', 'bars-main-group');

// initialize x scale
var xScale = d3.scaleBand()
    .range([0, width])
    .padding(0.3)
    ;

// initialize y scale
var yScale = d3.scaleLinear()
    .domain([0, 1])
    .clamp(true)
    .range([height, 0])
    ;

var xAxis = svg
    .append('g')
    .attr('class', 'x-axis')
    .attr('transform', 'translate(0,' + height + ')')
    .call(d3.axisBottom(xScale))
    ;

var yAxis = svg
    .append('g')
    .attr('class', 'y-axis')
    .call(d3.axisLeft(yScale).tickFormat(d3.format('.2s')))
    ;

/**
 * Main render function
 * @param {ChartConfigItem[]} config configuration
 */
function render(config, onClick) {
    var DURATION = 500;
    var t = d3.transition()
        .duration(DURATION)
        ;
        
    // SET SCALES
    xScale
        .domain(config.map(function(d) {
            return d.key;
        }));

    yScale
        .domain([0, d3.max(config, function(d) {
            return d.population;
        })])
        ;

    yAxis
        .transition(t)
        .call(d3.axisLeft(yScale).tickFormat(d3.format('.2s')))
        ;

    xAxis
        .call(d3.axisBottom(xScale))
        ;

    // select update 
    let update = barChartGroup
        .selectAll('g.bar-group')
        .data(config, function(d) {
            return d.key;
        })
        ;
    
    // exit
    update
        .exit()
        .remove();

    // enter
    var enter = update
        .enter()
        // create group
        .append('g')
            .attr('class', 'bar-group')
            // move group to correct x location
            .attr('transform', function(d) {
                return ['translate(' + xScale(d.key) + ',' + height + ')'];
            })
            .append('rect')
                .attr('class', 'bar')
                .attr('fill', (d) => stringToColor(d.key))
                .attr('width', xScale.bandwidth())
                .attr('height', 0)
                .attr('y', 0)
                .on('click', (d) => onClick(d))
                .transition(t)
                .attr('height', (d) => (height - yScale(d.population)))
                .attr('y', (d) => (yScale(d.population) - height))

            

    // update
    update
        .transition(t)
        .attr('transform', function(d) {
            return ['translate(' + xScale(d.key) + ',' + height + ')'];
        })
        .select('.bar')
            .attr('width', xScale.bandwidth())
            .attr('height', (d) =>  (height - yScale(d.population)))
            .attr('y', (d) => (yScale(d.population) - height))
        ;
}

function renderCities(country) {
    const CONFIG = convertToConfig(DATA.filter((v) => v.country === (country || v.country)), ['city']);
    render(CONFIG, function(d) {
        renderCountries();
    });
}

function renderCountries() {
    const CONFIG = convertToConfig(DATA, ['country']);
    render(CONFIG, function(d) {
        renderCities(d.country);
    });
}

renderCountries();
