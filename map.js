


// Set up the SVG dimensions
const width = 312;
const height = 195;

const SUPPORTER_STATE = "#0B125A";
const NO_SUPPORTER_STATE = "#5588BE";
const CIRCLE_COLOR = "#FEA621";

// Create the SVG element
const svg = d3.select("#map")
  .attr("width", width)
  .attr("height", height);

// Load the US map data
d3.json("https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json").then(data => {

  // Load the zipcode data from the CSV files
  Promise.all([
    d3.csv("zipcodes.csv"),
    d3.csv("zipcode_mapping.csv")
  ]).then(([infoData, zipcodesData]) => {
    // Extract the unique zipcodes from the info.csv data
    const uniqueZipcodes = Array.from(new Set(infoData.map(d => d.COUNTY)));

    // Filter the zipcodes.csv data based on the unique zipcodes
    const filteredZipcodesData = zipcodesData.filter(d => uniqueZipcodes.includes(d.ZIP));

    // Convert the TopoJSON data to GeoJSON
    const states = topojson.feature(data, data.objects.states);

    // Create a projection and path generator
    const projection = d3.geoAlbersUsa().fitSize([width, height], states);
    const path = d3.geoPath().projection(projection);

    // Array to store the states with dots
    const statesWithDots = [];

    // Draw the state outlines
    svg.selectAll("path")
      .data(states.features)
      .enter()
      .append("path")
      .attr("d", path)
      .attr("fill", d => statesWithDots.includes(d.properties.name) ? SUPPORTER_STATE : NO_SUPPORTER_STATE)
      .attr("stroke", "white")
      .attr("stroke-width", 0.5);

    // Function to add dots based on latitude and longitude
    function addDot(latitude, longitude) {
      const [x, y] = projection([longitude, latitude]);
      svg.append("circle")
        .attr("cx", x)
        .attr("cy", y)
        .attr("r", 1)
        .attr("fill", CIRCLE_COLOR);

      // Find the state that contains the dot
      const state = states.features.find(d => {
        return d3.geoContains(d, [longitude, latitude]);
      });

      // Add the state to the statesWithDots array if it's not already present
      if (state && !statesWithDots.includes(state.properties.name)) {
        statesWithDots.push(state.properties.name);
        svg.selectAll("path")
          .attr("fill", d => statesWithDots.includes(d.properties.name) ? SUPPORTER_STATE : NO_SUPPORTER_STATE);
      }
    }

      // Iterate over each row in the filteredZipcodesData array and call addDot
  filteredZipcodesData.forEach(row => {
    const latitude = row.LAT;
    const longitude = row.LNG;
    addDot(latitude, longitude);
  });
  });
});