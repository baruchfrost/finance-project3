# finance-project3

## Analysis: Overview
In this project, we analyzed how different business sectors are affected by the Federal Reserve

Our analysis can be broken down into two parts
- How different economic numbers are correlated to Fed Funds
- How different sectors are affected by Fed Funds

## Analysis: Economy and Fed Funds
- Fed funds are negatively correlated to the yield curve
- Fed funds are negatively correlated to unemployment

## Analysis: Fed Funds and the Sectors
- Fed funds tend to be correlated with market performance

# Dashboard
## Running the Dashboard
To run this dashboard you must first navigate to the `dashboard` directory via `cd dashboard`. Then, install the required packages (see list below) and run the following command to start the flask server:

```bash
python main.py
```

and then navigate to the url flask gives you. (Usually 127.0.0.1:5000). Flask will serve both the API and the static
web page content from the same server.

## Requires
This dashboard has the following python dependancies:
- flask
- flask-sqlalchemy
To install them, run:

```bash
pip install flask flask-sqlalchemy
```

All frontend dependancies will be downloaded automatically by the HTML code.