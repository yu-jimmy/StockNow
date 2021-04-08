import React, { Component } from 'react';
import AuthContext from '../../context/auth-context';
import ClipLoader from "react-spinners/ClipLoader";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Grid from '@material-ui/core/Grid';
import { Button } from '@material-ui/core';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import { withStyles } from '@material-ui/core/styles';
import "./stockdetails.css";
import {Line} from 'react-chartjs-2';
//var yahooFinance = require('yahoo-finance');

const backend = process.env.NODE_ENV === 'production' ? 'https://stocknow.herokuapp.com' : 'http://localhost:4000';

const useStyles = theme => ({
    root: {
      display: 'flex',
      alignItems: 'center',
      '& > *': {
        margin: theme.spacing(1),
      },
    },
  });

class Dashboard extends Component{
    state = {
        symbol: this.props.match.params.symbol,
        name: "",
        price: null,
        open: null,
        high: null,
        low: null,
        close: null,
        notFound: false,
        finishedFetch: false,
        added: false,
        timeStamps: [],
        prices: []
    };

    static contextType = AuthContext;

    addToWatchlist = () => {
        var requestBody = JSON.stringify({query:`mutation{ addSymbol(email:"${this.context.email}", symbol:"${this.state.symbol}") {symbols} }`});
        fetch(`${backend}/graphql`, {
            method: 'POST',
            body: requestBody,
            headers:{'Content-Type': 'application/json', 'Authorization': 'Bearer ' + this.context.token}
        })
        .then(data => {
            if (data.status !== 200) throw new Error("Retrieving symbols failed");
            return data.json();
        })
        .then(res => {
            console.log(res);
            this.addStockToWatchlist();
            this.setState({ added: true })
        })
        .catch(err => {
            throw err;
        });
    }

    addStockToWatchlist = () => {
        const request = require('request');

        request(`https://finnhub.io/api/v1/quote?symbol=${this.state.symbol}&token=c1hea6f48v6qtr46akgg`, { json: true }, (err, res, body) => {
            if (err) { 
                console.log(err);
                throw err; 
            }
            if (res.body) {
                this.context.watchlist.push({symbol: this.state.symbol.toUpperCase(), price: res.body.c});
            }
        });
    }

    getQuote = (symbol) => {
        const request = require('request');

        request(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=c1hea6f48v6qtr46akgg`, { json: true }, (err, res, body) => {
            if (err) { 
                console.log(err); 
                this.setState({finishedFetch: true, notFound: true});
                throw err; 
            }
            console.log(res.body);
            if (res.body) {
                this.setState({finishedFetch: true, notFound: false, price: res.body.c, open: res.body.o, high: res.body.h, low: res.body.l, close: res.body.pc});
            }
        });
    };

    getSymbolName = (symbol) => {
        const request = require('request');

        request(`https://finnhub.io/api/v1/stock/profile2?symbol=${symbol}&token=c1hea6f48v6qtr46akgg`, { json: true }, (err, res, body) => {
            if (err) { 
                console.log(err); 
                this.setState({finishedFetch: true, notFound: true});
                throw err; 
            }
            console.log(res.body);
            if (res.body) {
                this.setState({finishedFetch: true, notFound: false, name: res.body.name});
            }
        });
    }

    getChart = (symbol, range) => {
        console.log("getting chart data");
        let unirest = require('unirest');

        let queryObj = {}
        if (range === '1d') {
            queryObj = {"symbol": symbol, "interval": "5m", "range": range, "region": "US"}
        }
        else if (range === '5d') {
            queryObj = {"symbol": symbol, "interval": "15m", "range": range, "region": "US"}
        }
        else if (range === '3mo') {
            queryObj = {"symbol": symbol, "interval": "1wk", "range": range, "region": "US"}
        }
        else if (range === '6mo') {
            queryObj = {"symbol": symbol, "interval": "1mo", "range": range, "region": "US"}
        }
        else if (range === '1y') {
            queryObj = {"symbol": symbol, "interval": "1mo", "range": range, "region": "US"}
        }
        else if (range === '5y') {
            queryObj = {"symbol": symbol, "interval": "1mo", "range": range, "region": "US"}
        }
        else {
            queryObj = {"symbol": symbol, "interval": "5m", "range": "1d", "region": "US"}
        }

        unirest.get("https://apidojo-yahoo-finance-v1.p.rapidapi.com/market/get-charts")
            .query(queryObj)
            .headers({
                "x-rapidapi-key": "a4c6ab8496mshad5bc2e98111fbbp19638ejsn2708817a9504",
                "x-rapidapi-host": "apidojo-yahoo-finance-v1.p.rapidapi.com",
                "useQueryString": true
            })
            .end(res => {
                if (res.body.chart.error === null && res.body.chart.result) {
                    let dates = [];
                    let index;
                    if (range === '1d') {
                        for (index = 0; index < res.body.chart.result[0].timestamp.length; index++){
                            let fullDate = new Date(res.body.chart.result[0].timestamp[index] * 1000);
                            dates.push(fullDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}))
                        }
                    }
                    else {
                        for (index = 0; index < res.body.chart.result[0].timestamp.length; index++){
                            let fullDate = new Date(res.body.chart.result[0].timestamp[index] * 1000);
                            dates.push(fullDate.toLocaleDateString())
                        }
                    }
                    this.setState({timeStamps: dates, prices: res.body.chart.result[0].indicators.quote[0].high});
                }
            });
    }

    componentWillReceiveProps(props) {
        this.setState({finishedFetch: false, notFound: false, added: false});
        fetch(`${backend}/graphql`, {
        method: 'POST',
        body: JSON.stringify({query:`query{ userWatchList(email:"${this.context.email}") }`}),
        headers:{'Content-Type': 'application/json'}
        })
        .then(data => {
            if (data.status !== 200) throw new Error("Retrieving symbols failed");
            return data.json();
        })
        .then(res => {
            res.data.userWatchList.forEach((sym => {
                if (sym.toUpperCase() === this.props.match.params.symbol.toUpperCase()) {
                    this.setState({ added: true })
                }
            }))
        })
        .catch(err => {
            throw err;
        });
        this.setState({symbol: props.match.params.symbol});
        this.getSymbolName(props.match.params.symbol);
        this.getQuote(props.match.params.symbol);
        this.getChart(props.match.params.symbol);
    }

    componentDidMount(){
        fetch(`${backend}/graphql`, {
        method: 'POST',
        body: JSON.stringify({query:`query{ userWatchList(email:"${this.context.email}") }`}),
        headers:{'Content-Type': 'application/json'}
        })
        .then(data => {
            if (data.status !== 200) throw new Error("Retrieving symbols failed");
            return data.json();
        })
        .then(res => {
            res.data.userWatchList.forEach((sym => {
                if (sym.toUpperCase() === this.props.match.params.symbol.toUpperCase()) {
                    this.setState({ added: true })
                }
            }))
        })
        .catch(err => {
            throw err;
        });
        this.getQuote(this.state.symbol)
        this.getSymbolName(this.state.symbol)
        this.getChart(this.state.symbol);
        this.interval = setInterval(() => this.getQuote(this.state.symbol), 10000);
    }
    componentWillUnmount() {
        clearInterval(this.interval);
    }
    render() {
        const { classes } = this.props;

        if (!this.state.finishedFetch) {
            return (
                <ClipLoader color={"blue"} loading={true}
                css={`
                display: block;
                margin: 0 auto;
                border-color: blue;
                `} size={150} />
            )
        }
        else if (this.state.notFound) {
            return (
                <div className="stock-details">
                    <h1>Symbol {this.state.symbol} was not found</h1>
                </div>
            )
        }
        else{
            return (
                <Grid>
                    <Grid>
                        <TableContainer style={{paddingLeft:300}}>
                            <Table className="table" aria-label="simple table">
                                <TableHead>
                                <TableRow>
                                    <TableCell>{this.state.symbol.toUpperCase()} ({this.state.name + ") "}
                                        {!this.state.added &&
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={this.addToWatchlist}
                                        >
                                            Add
                                        </Button>}
                                        {this.state.added &&
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            disabled
                                        >
                                            Added
                                        </Button>}
                                    </TableCell>
                                    
                                </TableRow>
                                </TableHead>
                                <TableBody>
                                    <TableRow key="marketPrice">
                                    <TableCell component="th" scope="row">
                                        Market Price
                                    </TableCell>
                                    <TableCell align="right">${this.state.price} USD</TableCell>
                                    </TableRow>
                                    <TableRow key="marketHigh">
                                        <TableCell component="th" scope="row">
                                            Market High
                                        </TableCell>
                                        <TableCell align="right">${this.state.high} USD</TableCell>
                                    </TableRow>
                                    <TableRow key="marketLow">
                                        <TableCell component="th" scope="row">
                                            Market Low
                                        </TableCell>
                                        <TableCell align="right">${this.state.low} USD</TableCell>
                                    </TableRow>
                                    <TableRow key="marketOpen">
                                        <TableCell component="th" scope="row">
                                            Market Open
                                        </TableCell>
                                        <TableCell align="right">${this.state.open} USD</TableCell>
                                    </TableRow>
                                    <TableRow key="marketClose">
                                        <TableCell component="th" scope="row">
                                            Market Close
                                        </TableCell>
                                        <TableCell align="right">${this.state.close} USD</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Grid>
                    <Grid style={{paddingLeft:300, paddingBottom:30, paddingRight:30}}>
                        <div className={classes.root}>
                        <ButtonGroup>
                            <Button variant="contained" color="primary" onClick={() => { this.getChart(this.state.symbol, '1d') }}>1d</Button>
                            <Button variant="contained" color="primary" onClick={() => { this.getChart(this.state.symbol, '5d') }}>5d</Button>
                            <Button variant="contained" color="primary" onClick={() => { this.getChart(this.state.symbol, '3mo') }}>3mo</Button>
                            <Button variant="contained" color="primary" onClick={() => { this.getChart(this.state.symbol, '6mo') }}>6mo</Button>
                            <Button variant="contained" color="primary" onClick={() => { this.getChart(this.state.symbol, '1y') }}>1y</Button>
                            <Button variant="contained" color="primary" onClick={() => { this.getChart(this.state.symbol, '5y') }}>5y</Button>
                        </ButtonGroup>
                        </div>
                        <Line
                        data={{
                            labels: this.state.timeStamps,
                            datasets: [
                            {
                                label: 'Stock Price',
                                fill: false,
                                lineTension: 0.5,
                                backgroundColor: 'rgba(75,192,192,1)',
                                borderColor: 'rgba(0,0,0,1)',
                                borderWidth: 2,
                                data: this.state.prices
                            }
                            ]
                        }}
                        options={{
                            title:{
                            display:true,
                            text: this.state.symbol + " (" + this.state.name + ") Stock Prices",
                            fontSize:20,
                            responsive: true,
                            maintainAspectRatio: true
                            }
                        }}
                        />
                    </Grid>
                </Grid>
            );
        }
    }
}

export default withStyles(useStyles)(Dashboard);