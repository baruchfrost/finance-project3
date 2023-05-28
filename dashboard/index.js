// using axios javascript library to query data from flask api
const api = axios.create({
  baseURL: 'http://localhost:5000'
});

// initializing variables for plotting
var fed_funds_data, yield_curve_data, unemployment_rate_data;
var fed_funds_trace, yield_curve_trace, unemployment_rate_trace;
var data, data_mock, layout;

// axios api requests
api.get("/fed_funds_rate").then(function (response) {
  fed_funds_data = response.data;
  api.get("/yield_curve").then(function (response) {
    yield_curve_data = response.data;
    api.get("/unemployment_rate").then(function (response) {
      unemployment_rate_data = response.data;

      // using plotly.js for plotting
      fed_funds_trace = {
        x: fed_funds_data.map(d => d.date),
        y: fed_funds_data.map(d => d.rate),
        type: 'line',
        name: "Fed Funds"
      };

      yield_curve_trace = {
        x: yield_curve_data.map(d => d.date),
        y: yield_curve_data.map(d => d.rate),
        type: 'line',
        name: "Yield Curve"
      };

      unemployment_rate_trace = {
        x: unemployment_rate_data.map(d => d.date),
        y: unemployment_rate_data.map(d => d.rate),
        type: 'line',
        name: "Unemployment"
      };

      data = [fed_funds_trace, yield_curve_trace, unemployment_rate_trace];
      data_mock = ["fed_funds", "yield_curve", "unemployment"];
      layout = {
        title: 'Fed Funds Vs Yield Curve',
        xaxis: {
          title: 'Date'
        },
        yaxis: {
          title: 'Rate'
        },
        width: 1000
      };
      Plotly.newPlot('chart', data, layout);
    })
  });
});
 
// funtion for the navigation options on the right

// first navigation option
function selectEcon() {
  let elem = document.getElementById("nav-slider");
  elem.style.height = '2.4rem';

  // adding interactive elements
  let dashboard = document.getElementById("dashboard");
  dashboard.innerHTML = `
  <form>
    <input type="checkbox" id="fedfunds" name="fed-funds" value="Fed Funds" checked>
    <label for="fedfunds">Fed Funds</label><br>
    <input type="checkbox" id="unemployment" name="unemployment" value="Unemployment" checked>
    <label for="unemployment">Unemployment</label><br>
    <input type="checkbox" id="yield" name="yield" value="Yield" checked>
    <label for="yield">Yield</label>
  </form>
  `;
  var fedfunds = document.getElementById("fedfunds");
  var unemployment = document.getElementById("unemployment");
  var yield = document.getElementById("yield");

  // event listeners to update the graph
  fedfunds.addEventListener('change', (event) => {
    if (event.target.checked) {
      data.push(fed_funds_trace);
      data_mock.push("fed_funds")
      Plotly.newPlot('chart', data, layout);
    } else {
      let ind = data_mock.indexOf("fed_funds");
      data.splice(ind, 1);
      data_mock.splice(ind, 1);
      Plotly.react('chart', data, layout);
    }
  });

  unemployment.addEventListener('change', (event) => {
    if (event.target.checked) {
      data.push(unemployment_rate_trace);
      data_mock.push("unemployment");
      Plotly.newPlot('chart', data, layout);
    } else {
      let ind = data_mock.indexOf("unemployment");
      data.splice(ind, 1);
      data_mock.splice(ind, 1);
      Plotly.newPlot('chart', data, layout);
    }
  });

  yield.addEventListener('change', (event) => {
    if (event.target.checked) {
      data.push(yield_curve_trace);
      data_mock.push("yield_curve");
      Plotly.newPlot('chart', data, layout);
    } else {
      let ind = data_mock.indexOf("yield_curve");
      data.splice(ind, 1);
      data_mock.splice(ind, 1);
      Plotly.newPlot('chart', data, layout);
    }
  });

  // descriptive text about the current selected navigation option
  document.getElementById("info-text").innerText = economy_text;
}

// second navigation option
function selectSect() {
  let elem = document.getElementById("nav-slider");
  elem.style.height = '6.8rem';

  document.getElementById("info-text").innerText = sectors_text;
}

// third navigation option
function selectPlay() {
  let elem = document.getElementById("nav-slider");
  elem.style.height = '11.2rem';

  document.getElementById("info-text").innerText = playground_text;
}

// initialize the page to the first nagivation option
selectEcon()