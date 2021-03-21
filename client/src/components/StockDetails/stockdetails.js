import React, { Component } from 'react';
import AuthContext from '../../context/auth-context';
import ClipLoader from "react-spinners/ClipLoader";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { Button } from '@material-ui/core';
import "./stockdetails.css"
var yahooFinance = require('yahoo-finance');

class Dashboard extends Component{
    state = {
        symbol: this.props.match.params.symbol,
        name: "",
        price: null,
        notFound: false,
        finishedFetch: false,
        added: false,
    };

    static contextType = AuthContext;

    addToWatchlist = () => {
        var requestBody = JSON.stringify({query:`mutation{ addSymbol(email:"${this.context.email}", symbol:"${this.state.symbol}") {symbols} }`});
        fetch('http://localhost:4000/graphql', {
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
        yahooFinance.quote({
            symbol: this.state.symbol
        }, function (err, quote) {
            if (err){
                console.log(err);
            }
            return quote;
        }).then(res => {
            if (res.price.regularMarketPrice)
                this.context.watchlist.push({symbol: this.state.symbol.toUpperCase(),
                    price: res.price.regularMarketPrice});
        }).catch(err => {
            throw err;
        });
    }

    getQuote = (symbol) => {
        yahooFinance.quote({
            symbol: symbol
        }, function (err, quote) {
            if (err){
                console.log(err);
            }
            return quote;
        }).then(res => {
            if (res.price.regularMarketPrice){
                if (res.price.regularMarketPrice.raw){
                    this.setState({finishedFetch: true,
                        price: res.price.regularMarketPrice.raw,
                        name: res.price.longName});
                }
                else{
                    this.setState({finishedFetch: true,
                        price: res.price.regularMarketPrice,
                        name: res.price.longName});
                }
            }
            else
                this.setState({finishedFetch: true,
                    notFound: true});
        }).catch(err => {
            this.setState({finishedFetch: true,
                notFound: true});  
            throw err;
        });
    };

    componentWillReceiveProps(props) {
        this.setState({finishedFetch: false, notFound: false, added: false});
        fetch('http://localhost:4000/graphql', {
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
        this.getQuote(props.match.params.symbol)  
    }

    componentDidMount(){
        fetch('http://localhost:4000/graphql', {
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
        this.interval = setInterval(() => this.getQuote(this.state.symbol), 10000);
    }
    componentWillUnmount() {
        clearInterval(this.interval);
    }
    render() {
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
                <TableContainer className="stock-details" component={Paper}>
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
                        {/* {rows.map((row) => (
                            <TableRow key={row.name}>
                            <TableCell component="th" scope="row">
                                {row.name}
                            </TableCell>
                            <TableCell align="right">{row.calories}</TableCell>
                            <TableCell align="right">{row.fat}</TableCell>
                            <TableCell align="right">{row.carbs}</TableCell>
                            <TableCell align="right">{row.protein}</TableCell>
                            </TableRow>
                        ))} */}
                        </TableBody>
                    </Table>
                    </TableContainer>
            );
                // <div className="stock-details">
                //     <h1>
                //         {this.state.symbol}: {this.state.price}
                //     </h1>
                // </div>
            
        }
    }
}

export default Dashboard;