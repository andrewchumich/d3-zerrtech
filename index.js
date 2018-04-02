
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
        population: 8175.133,
    },
    {
        city: 'Denver',
        country: 'US',
        population: 600.158,
    },
    {
        city: 'Dallas',
        country: 'US',
        population: 1197.816,
    },
    {
        city: 'Portland',
        country: 'US',
        population: 583.776,
    },
    {
        city: 'Manchester',
        country: 'UK',
        population: 2553.379,
    },
    {
        city: 'London',
        country: 'UK',
        population: 9787.426,
    },
    {
        city: 'Nottingham',
        country: 'UK',
        population: 729.997,
    },
    {
        city: 'Salvador',
        country: 'BR',
        population: 2480.790,
    },
    {
        city: 'Salvador',
        country: 'BR',
        population: 2480.790,
    },
    {
        city: 'Rio de Janeiro',
        country: 'BR',
        population: 5940.224,
    },
    {
        city: 'Fortaleza',
        country: 'BR',
        population: 2315.116,
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
 */
function convertToConfig(cities, group_key) {
    const config = cities.reduce((prev, curr) => {
        const key = curr[group_key] || 'N/A';
        if (!prev.has(key)) {
            prev.set(key, {
                ...curr,
                key: key,
            });
        } else {
            const city = prev.get(key);
            prev.set(key, {
                ...city,
                population: city.population + curr.population,
            });
        }
        return prev;
    }, (new Map()));

    return [...config.values()];
}

console.log(convertToConfig(DATA, 'country'));

function update() {
    // select all items

    // enter

    // update

    // exit
}