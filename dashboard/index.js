const api = axios.create({
  baseURL: 'http://localhost:5000'
});

var fed_funds_data = await api.get("/fed_funds_rate").then(resp => resp.data);
var yield_curve_data = await api.get("/yield_curve").then(resp => resp.data);

var fed_funds_trace = {
  x: fed_funds_data.map(d => d.date),
  y: fed_funds_data.map(d => d.rate),
  type: 'line',
  name: "Fed Funds"
};

var yield_curve_trace = {
  x: yield_curve_data.map(d => d.date),
  y: yield_curve_data.map(d => d.rate),
  type: 'line',
  name: "Yield Curve"
};

var data = [fed_funds_trace, yield_curve_trace];

var layout = {
  title: 'Fed Funds Vs Yield Curve',
  xaxis: {
    title: 'Date'
  },
  yaxis: {
    title: 'Rate'
  }
};

Plotly.newPlot('chart', data, layout);
