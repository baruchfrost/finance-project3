// using axios javascript library to query data from flask api
const api = axios.create({
  baseURL: window.location.pathname
});

// initializing variables for plotting
var fed_funds_data, t_bond_data, unemployment_rate_data;
var fed_funds_trace, t_bond_trace, unemployment_rate_trace;
var data, data_mock, layout;
var selected_etfs = null;
var selected_rates = null;
var traces;

var etfsSymbolsAndDescriptions = {
  "XLY": "Cons. Disc. Select Sector SPDR® Fund",
  "XLP": "Cons. Staples Select Sector SPDR® Fund",
  "XLE": "Energy Select Sector SPDR® Fund",
  "XLF": "Financial Select Sector SPDR® Fund",
  "XLV": "Health Care Select Sector SPDR® Fund",
  "XLI": "Industrial Select Sector SPDR® Fund",
  "IBB": "iShares Biotechnology ETF",
  "IYE": "iShares U.S. Energy ETF",
  "ITB": "iShares U.S. Home Construction ETF",
  "IYR": "iShares U.S. Real Estate ETF",
  "XLB": "Materials Select Sector SPDR® Fund",
  "KBE": "SPDR® S&P Bank ETF",
  "XHB": "SPDR® S&P Homebuilders ETF",
  "XME": "SPDR® S&P Metals and Mining ETF",
  "XOP": "SPDR® S&P Oil & Gas Exp. & Prod. ETF",
  "KRE": "SPDR® S&P Regional Banking ETF",
  "XTL": "SPDR® S&P Telecom ETF",
  "XLK": "Technology Select Sector SPDR® Fund",
  "XLU": "Utilities Select Sector SPDR® Fund",
  "GDXJ": "VanEck Junior Gold Miners ETF",
  "OIH": "VanEck Oil Services ETF",
  "SMH": "VanEck Semiconductor ETF",
  "VNQ": "Vanguard Real Estate Index Fund ETF Shares"
};

var etfsTraces = {
  "XLY": {x: [], y: [], type: 'line', name: "XLY", yaxis: 'y2'},
  "XLP": {x: [], y: [], type: 'line', name: "XLP", yaxis: 'y2'},
  "XLE": {x: [], y: [], type: 'line', name: "XLE", yaxis: 'y2'},
  "XLF": {x: [], y: [], type: 'line', name: "XLF", yaxis: 'y2'},
  "XLV": {x: [], y: [], type: 'line', name: "XLV", yaxis: 'y2'},
  "XLI": {x: [], y: [], type: 'line', name: "XLI", yaxis: 'y2'},
  "IBB": {x: [], y: [], type: 'line', name: "IBB", yaxis: 'y2'},
  "IYE": {x: [], y: [], type: 'line', name: "IYE", yaxis: 'y2'},
  "ITB": {x: [], y: [], type: 'line', name: "ITB", yaxis: 'y2'},
  "IYR": {x: [], y: [], type: 'line', name: "IYR", yaxis: 'y2'},
  "XLB": {x: [], y: [], type: 'line', name: "XLB", yaxis: 'y2'},
  "KBE": {x: [], y: [], type: 'line', name: "KBE", yaxis: 'y2'},
  "XHB": {x: [], y: [], type: 'line', name: "XHB", yaxis: 'y2'},
  "XME": {x: [], y: [], type: 'line', name: "XME", yaxis: 'y2'},
  "XOP": {x: [], y: [], type: 'line', name: "XOP", yaxis: 'y2'},
  "KRE": {x: [], y: [], type: 'line', name: "KRE", yaxis: 'y2'},
  "XTL": {x: [], y: [], type: 'line', name: "XTL", yaxis: 'y2'},
  "XLK": {x: [], y: [], type: 'line', name: "XLK", yaxis: 'y2'},
  "XLU": {x: [], y: [], type: 'line', name: "XLU", yaxis: 'y2'},
  "OIH": {x: [], y: [], type: 'line', name: "OIH", yaxis: 'y2'},
  "SMH": {x: [], y: [], type: 'line', name: "SMH", yaxis: 'y2'},
  "VNQ": {x: [], y: [], type: 'line', name: "VNQ", yaxis: 'y2'},
};

// axios api requests
api.get("/fed_funds_rate").then(function (response) {
  fed_funds_data = response.data;
  api.get("/t_bond").then(function (response) {
    t_bond_data = response.data;
    api.get("/unemployment_rate").then(function (response) {
      unemployment_rate_data = response.data;

      // using plotly.js for plotting
      fed_funds_trace = {
        x: fed_funds_data.map(d => d.date),
        y: fed_funds_data.map(d => d.rate),
        type: 'line',
        name: "Fed Funds"
      };

      t_bond_trace = {
        x: t_bond_data.map(d => d.date),
        y: t_bond_data.map(d => d.rate),
        type: 'line',
        name: "T-bond"
      };

      unemployment_rate_trace = {
        x: unemployment_rate_data.map(d => d.date),
        y: unemployment_rate_data.map(d => d.rate),
        type: 'line',
        name: "Unemployment"
      };

      // initialize the page to the first nagivation option
      selectEcon()
      loadSectorsData()
    })
  }); 
});

function loadSectorsData() {
  api.get("/sector_etfs").then( response => {
    var sector_data = response.data;

    for (i in sector_data) {
      let data = sector_data[i];
      etfsTraces[data.name].x.push(data.date);
      etfsTraces[data.name].y.push(data.open);
    }
  })
}

function etfsToHtml(etfsList) {
  html = "";

  for (i in etfsList) {
    etf = etfsList[i];
    etfHtml = `<p>${etfsSymbolsAndDescriptions[etf]} (${etf}) <button onclick="removeEtf('${etf}')">X</button></p>`;
    html = html + etfHtml;
  }

  return html;
}

function removeEtf(etf) {
  let i = selected_etfs.indexOf(etf);
  selected_etfs.splice(i, 1);
  let selections = document.getElementById('selections');
  selections.innerHTML = etfsToHtml(selected_etfs)

  let d_i = data_mock.indexOf(etf);
  data.splice(d_i, 1);
  data_mock.splice(d_i, 1);
  Plotly.react('chart', data, layout);
}

// funtion for the navigation options on the right

// first navigation option
function selectEcon() {
  let charts = document.getElementById('chart');
  charts.innerHTML = "";

  // adding interactive elements
  let dashboard = document.getElementById("dashboard");
  dashboard.innerHTML = `
  <form class="dash-form">
    <input type="checkbox" id="fedfunds" name="fed-funds" value="Fed Funds" checked>
    <label for="fedfunds">Fed Funds</label><br>
    <input type="checkbox" id="unemployment" name="unemployment" value="Unemployment" checked>
    <label for="unemployment">Unemployment</label><br>
    <input type="checkbox" id="tbond" name="tbond" value="tbond" checked>
    <label for="tbond">T-bond</label>
  </form>
  `;
  var fedfunds = document.getElementById("fedfunds");
  var unemployment = document.getElementById("unemployment");
  var tbond = document.getElementById("tbond");

  // event listeners to update the graph
  fedfunds.addEventListener('change', (event) => {
    if (event.target.checked) {
      data.push(fed_funds_trace);
      data_mock.push("fed_funds");
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
      Plotly.react('chart', data, layout);
    } else {
      let ind = data_mock.indexOf("unemployment");
      data.splice(ind, 1);
      data_mock.splice(ind, 1);
      Plotly.react('chart', data, layout);
    }
  });

  tbond.addEventListener('change', (event) => {
    if (event.target.checked) {
      data.push(t_bond_trace);
      data_mock.push("t_bond");
      Plotly.react('chart', data, layout);
    } else {
      let ind = data_mock.indexOf("t_bond");
      data.splice(ind, 1);
      data_mock.splice(ind, 1);
      Plotly.react('chart', data, layout);
    }
  });

  data = [fed_funds_trace, t_bond_trace, unemployment_rate_trace];
  data_mock = ["fed_funds", "t_bond", "unemployment"];

  layout = {
    title: "Fed Funds Vs T-bond Vs Unemployment",
    legend: {
      orientation: 'h',
      yanchor: 'bottom',
      y: 1.02,
      xanchor: 'right',
      x: 1
    },
    xaxis: {
      title: 'Date'
    },
    yaxis: {
      title: 'Price'
    },
    width: 960
  };
  Plotly.newPlot('chart', data, layout);

  // descriptive text about the current selected navigation option
  document.getElementById("info-text").innerText = economy_text;
}

// second navigation option
function selectSect() {
  let charts = document.getElementById('chart');
  charts.innerHTML = "";

  // adding interactive elements
  let dashboard = document.getElementById("dashboard");
  dashboard.innerHTML = `
  <form>
    <label for="sectors">Select a Sector</label>
    <br />
    <select name="sectors" id="sectors">
      <option value="XLY">Consumer Discretionary Select Sector SPDR® Fund</option>
      <option value="XLP">Consumer Staples Select Sector SPDR® Fund</option>
      <option value="XLE">Energy Select Sector SPDR® Fund</option>
      <option value="XLF">Financial Select Sector SPDR® Fund</option>
      <option value="XLV">Health Care Select Sector SPDR® Fund</option>
      <option value="XLI">Industrial Select Sector SPDR® Fund</option>
      <option value="IBB">iShares Biotechnology ETF</option>
      <option value="IYE">iShares U.S. Energy ETF</option>
      <option value="ITB">iShares U.S. Home Construction ETF</option>
      <option value="IYR">iShares U.S. Real Estate ETF</option>
      <option value="XLB">Materials Select Sector SPDR® Fund</option>
      <option value="KBE">SPDR® S&P Bank ETF</option>
      <option value="XHB">SPDR® S&P Homebuilders ETF</option>
      <option value="XME">SPDR® S&P Metals and Mining ETF</option>
      <option value="XOP">SPDR® S&P Oil & Gas Exploration & Production ETF</option>
      <option value="KRE">SPDR® S&P Regional Banking ETF</option>
      <option value="XTL">SPDR® S&P Telecom ETF</option>
      <option value="XLK">Technology Select Sector SPDR® Fund</option>
      <option value="XLU">Utilities Select Sector SPDR® Fund</option>
      <option value="GDXJ">VanEck Junior Gold Miners ETF</option>
      <option value="OIH">VanEck Oil Services ETF</option>
      <option value="SMH">VanEck Semiconductor ETF</option>
      <option value="VNQ">Vanguard Real Estate Index Fund ETF Shares</option>
    </select>
    <div id="selections"></div>
  </form>
  `;

  let selections = document.getElementById("selections");

  var sectors = document.getElementById("sectors");

  sectors.onchange = function() {
    var sector = sectors.value;
    
    data.push(etfsTraces[sector]);
    data_mock.push(sector);
    Plotly.react('chart', data, layout);

    selected_etfs.push(sector);
    selections.innerHTML = etfsToHtml(selected_etfs);
  }
  
  if (selected_etfs == null) {
    selected_etfs = ["XLF", "KBE"];
  }
  selections.innerHTML = etfsToHtml(selected_etfs);
  
  data = [fed_funds_trace];
  data_mock = ["fed_funds"];
  for (i in selected_etfs) {
    let sector = selected_etfs[i];
    data.push(etfsTraces[sector]);
    data_mock.push(sector);
  }
  Plotly.react('chart', data, layout);

  layout = {
    title: "Fed Funds and Sectors",
    legend: {
      orientation: 'h',
      yanchor: 'bottom',
      y: 1.02,
      xanchor: 'right',
      x: 1
    },
    xaxis: {
      title: 'Date'
    },
    yaxis: {
      title: 'Rate'
    },
    yaxis2: {
      title: 'Price',
      overlaying: 'y',
      side: 'right'
    },
    width: 960
  };
  Plotly.newPlot('chart', data, layout);

  document.getElementById("info-text").innerText = sectors_text;
}

// third navigation option
function selectPlay() {
  let charts = document.getElementById('chart');
  charts.innerHTML = "";

  // adding interactive elements
  let dashboard = document.getElementById("dashboard");
  dashboard.innerHTML = `
  <form class="dash-form">
    <input type="checkbox" id="fedfunds" name="fed-funds" value="Fed Funds" checked>
    <label for="fedfunds">Fed Funds</label><br>
    <input type="checkbox" id="unemployment" name="unemployment" value="Unemployment">
    <label for="unemployment">Unemployment</label><br>
    <input type="checkbox" id="tbond" name="tbond" value="tbond" checked>
    <label for="tbond">T-bond</label>
    <br /><br />
    <label for="sectors">Select a Sector</label>
    <br />
    <select name="sectors" id="sectors">
      <option value="XLY">Consumer Discretionary Select Sector SPDR® Fund</option>
      <option value="XLP">Consumer Staples Select Sector SPDR® Fund</option>
      <option value="XLE">Energy Select Sector SPDR® Fund</option>
      <option value="XLF">Financial Select Sector SPDR® Fund</option>
      <option value="XLV">Health Care Select Sector SPDR® Fund</option>
      <option value="XLI">Industrial Select Sector SPDR® Fund</option>
      <option value="IBB">iShares Biotechnology ETF</option>
      <option value="IYE">iShares U.S. Energy ETF</option>
      <option value="ITB">iShares U.S. Home Construction ETF</option>
      <option value="IYR">iShares U.S. Real Estate ETF</option>
      <option value="XLB">Materials Select Sector SPDR® Fund</option>
      <option value="KBE">SPDR® S&P Bank ETF</option>
      <option value="XHB">SPDR® S&P Homebuilders ETF</option>
      <option value="XME">SPDR® S&P Metals and Mining ETF</option>
      <option value="XOP">SPDR® S&P Oil & Gas Exploration & Production ETF</option>
      <option value="KRE">SPDR® S&P Regional Banking ETF</option>
      <option value="XTL">SPDR® S&P Telecom ETF</option>
      <option value="XLK">Technology Select Sector SPDR® Fund</option>
      <option value="XLU">Utilities Select Sector SPDR® Fund</option>
      <option value="GDXJ">VanEck Junior Gold Miners ETF</option>
      <option value="OIH">VanEck Oil Services ETF</option>
      <option value="SMH">VanEck Semiconductor ETF</option>
      <option value="VNQ">Vanguard Real Estate Index Fund ETF Shares</option>
    </select>
    <div id="selections"></div>
  </form>
  `;

  var fedfunds = document.getElementById("fedfunds");
  var unemployment = document.getElementById("unemployment");
  var tbond = document.getElementById("tbond");

  // event listeners to update the graph
  fedfunds.addEventListener('change', (event) => {
    if (event.target.checked) {
      data.push(fed_funds_trace);
      data_mock.push("fed_funds");
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
      Plotly.react('chart', data, layout);
    } else {
      let ind = data_mock.indexOf("unemployment");
      data.splice(ind, 1);
      data_mock.splice(ind, 1);
      Plotly.react('chart', data, layout);
    }
  });

  tbond.addEventListener('change', (event) => {
    if (event.target.checked) {
      data.push(t_bond_trace);
      data_mock.push("t_bond");
      Plotly.react('chart', data, layout);
    } else {
      let ind = data_mock.indexOf("t_bond");
      data.splice(ind, 1);
      data_mock.splice(ind, 1);
      Plotly.react('chart', data, layout);
    }
  });

  if (traces == undefined) {
    traces = {
      "fed_funds": fed_funds_trace,
      "t_bond": t_bond_trace,
      "unemployment": unemployment_rate_trace,
      ...etfsTraces
    };
  }

  let selections = document.getElementById("selections");

  var sectors = document.getElementById("sectors");

  sectors.onchange = function() {
    var sector = sectors.value;
    
    data.push(etfsTraces[sector]);
    data_mock.push(sector);
    Plotly.react('chart', data, layout);

    selected_etfs.push(sector);
    selections.innerHTML = etfsToHtml(selected_etfs);
  }

  if (selected_rates == null) {
    selected_rates = ["fed_funds", "t_bond"];
  }

  if (selected_etfs == null) {
    selected_etfs = ["XLF", "KBE"];
  }
  selections.innerHTML = etfsToHtml(selected_etfs);

  data = [];
  data_mock = [...selected_rates, ...selected_etfs];
  for (i in data_mock) {
    data.push(traces[data_mock[i]]);
  }
  Plotly.react('chart', data, layout);

  layout = {
    title: "Fed Funds and Sectors",
    legend: {
      orientation: 'h',
      yanchor: 'bottom',
      y: 1.02,
      xanchor: 'right',
      x: 1
    },
    xaxis: {
      title: 'Date'
    },
    yaxis: {
      title: 'Rate'
    },
    yaxis2: {
      title: 'Price',
      overlaying: 'y',
      side: 'right'
    },
    width: 960
  };
  Plotly.newPlot('chart', data, layout);

  document.getElementById("info-text").innerText = playground_text;
}
