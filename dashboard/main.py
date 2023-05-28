from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
import os

app = Flask(__name__)

db_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'data', 'db.sqlite'))
app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{db_path}'

db = SQLAlchemy(app)

class SectorETFs(db.Model):
    __tablename__ = 'sector_etfs'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    date = db.Column(db.String(10), nullable=False)
    open = db.Column(db.Float, nullable=False)
    high = db.Column(db.Float, nullable=False)
    low = db.Column(db.Float, nullable=False)
    close = db.Column(db.Float, nullable=False)
    volume = db.Column(db.Integer, nullable=False)

class FedFundsRate(db.Model):
    __tablename__ = "fed_funds_rate"
    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.String(10), nullable=False)
    rate = db.Column(db.Float)

class UnemploymentRate(db.Model):
    __tablename__ = "unemployment_rate"
    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.String(10), nullable=False)
    rate = db.Column(db.Float)

class YieldCurve(db.Model):
    __tablename__ = "yield_curve"
    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.String(10), nullable=False)
    rate = db.Column(db.Float)

@app.after_request
def after_request(response):
    allowed_origins = ['http://127.0.0.1:5500', 'http://localhost:5500']
    if request.headers.get('Origin') in allowed_origins:
        response.headers.add('Access-Control-Allow-Origin', request.headers['Origin'])
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
    return response

@app.route('/')
def home():
    return {"routes": ["/sector_etfs", "/fed_funds_rates", "/unemployment_rate", "/yield_curve"]}

@app.route('/sector_etfs')
def sector_etfs():
    start_date = request.args.get('start_date', default="2006-08-01")
    end_date = request.args.get('end_date')
    if start_date and end_date:
        rows = SectorETFs.query.filter(SectorETFs.date.between(start_date, end_date)).all()
    elif start_date:
        rows = SectorETFs.query.filter(SectorETFs.date >= start_date).all()
    elif end_date:
        rows = SectorETFs.query.filter(SectorETFs.date <= end_date).all()
    else:
        rows = SectorETFs.query.all()
    return jsonify([row.__dict__ for row in rows])

@app.route('/fed_funds_rate')
def fed_funds_rate():
    start_date = request.args.get('start_date', default="2006-08-01")
    end_date = request.args.get('end_date')
    if start_date and end_date:
        rows = FedFundsRate.query.filter(FedFundsRate.date.between(start_date, end_date)).all()
    elif start_date:
        rows = FedFundsRate.query.filter(FedFundsRate.date >= start_date).all()
    elif end_date:
        rows = FedFundsRate.query.filter(FedFundsRate.date <= end_date).all()
    else:
        rows = FedFundsRate.query.all()
    return jsonify([{'id': row.id, 'date': row.date, 'rate': row.rate} for row in rows])

@app.route('/unemployment_rate')
def unemployment_rate():
    start_date = request.args.get('start_date', default="2006-08-01")
    end_date = request.args.get('end_date')
    if start_date and end_date:
        rows = UnemploymentRate.query.filter(UnemploymentRate.date.between(start_date, end_date)).all()
    elif start_date:
        rows = UnemploymentRate.query.filter(UnemploymentRate.date >= start_date).all()
    elif end_date:
        rows = UnemploymentRate.query.filter(UnemploymentRate.date <= end_date).all()
    else:
        rows = UnemploymentRate.query.all()
    return jsonify([{'id': row.id, 'date': row.date, 'rate': row.rate} for row in rows])

@app.route('/yield_curve')
def yield_curve():
    start_date = request.args.get('start_date', default="2006-08-01")
    end_date = request.args.get('end_date')
    if start_date and end_date:
        rows = YieldCurve.query.filter(YieldCurve.date.between(start_date, end_date)).all()
    elif start_date:
        rows = YieldCurve.query.filter(YieldCurve.date >= start_date).all()
    elif end_date:
        rows = YieldCurve.query.filter(YieldCurve.date <= end_date).all()
    else:
        rows = YieldCurve.query.all()

    return jsonify([{'id': row.id, 'date': row.date, 'rate': row.rate} for row in rows])

if __name__ == "__main__":
    app.run(debug=True)