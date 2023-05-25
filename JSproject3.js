$(document).ready(function() {
  // Make AJAX request to the Flask-powered API
  $.ajax({
    url: '/api/business-cycle',
    dataType: 'json',
    success: function(data) {
      // Process the data and create visualizations using D3.js or other libraries
      createChart(data);
    },
    error: function(error) {
      console.log('Error:', error);
    }
  });

  function createChart(data) {
    // Use D3.js or other libraries to create visualizations based on the data
    // Example D3.js code to create a bar chart
    var svg = d3.select('#chart-container')
                .append('svg')
                .attr('width', 800)
                .attr('height', 500);

    // ... Add D3.js code here to create the chart using the data
  }
});