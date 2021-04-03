import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import ClipLoader from "react-spinners/ClipLoader";
import AuthContext from '../../context/auth-context';
import { ProSidebar, Menu, MenuItem, SidebarHeader } from 'react-pro-sidebar';
import { Button } from '@material-ui/core';
import 'react-pro-sidebar/dist/css/styles.css';
import './watchlist.css'
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
//var yahooFinance = require('yahoo-finance');

const backend = process.env.NODE_ENV === 'production' ? 'https://stocknow.herokuapp.com' : 'http://localhost:4000';

class Watchlist extends Component{
    state = {
        stocks: [],
        finishedFetch: false,
        notFound: false
    }

    static contextType = AuthContext;

    style = {
        position: 'fixed',
    }

    removeFromWatchlist = (symbol) => {
        var requestBody = JSON.stringify({query:`mutation{ deleteSymbol(email:"${this.context.email}", symbol:"${symbol}") {symbols} }`});
        fetch(`${backend}/graphql`, {
            method: 'POST',
            body: requestBody,
            headers:{'Content-Type': 'application/json', 'Authorization': 'Bearer ' + this.context.token}
        })
        .then(data => {
            if (data.status !== 200) throw new Error("Delete symbol failed");
            return data.json();
        })
        .then(res => {
            this.context.watchlist = this.context.watchlist.filter((stock) => {return stock.symbol.toUpperCase() !== symbol.toUpperCase()})
            this.setState({stocks: this.context.watchlist});
            return res;
        })
        .catch(err => {
            throw err;
        });
    }

    getQuote = (symbol) => {
        const request = require('request');

        request(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=c1hea6f48v6qtr46akgg`, { json: true }, (err, res, body) => {
            if (err) { 
                console.log(err); 
                throw err;
            }
            if (res.body) {
                return res.body.c;
            }
        });
    };

    deleteSymbol = (symbol) => {
        this.context.test = "test";
        console.log(this.context.test)
        this.removeFromWatchlist(symbol.target.parentElement.id);
    }

    componentDidMount(){
        var symbols = [];
        var newState = [];
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
            symbols = res.data.userWatchList;
            if (symbols.length === 0){   
                this.setState({stocks: [], finishedFetch: true})
            }
            symbols.forEach((sym) => {
                const request = require('request');

                request(`https://finnhub.io/api/v1/quote?symbol=${sym}&token=c1hea6f48v6qtr46akgg`, { json: true }, (err, res, body) => {
                    if (err) { 
                        console.log(err); 
                        throw err;
                    }
                    if (res.body) {
                        newState.push({symbol: sym, price: res.body.c});
                        this.context.watchlist = newState;
                        this.setState({finishedFetch: true});
                    }
                });
            });
        })
        .catch(err => {
            throw err;
        });
        
      
        this.interval = setInterval(() => {
            newState = this.state.stocks;
            console.log(newState);
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
                symbols = res.data.userWatchList;
                symbols.forEach((sym) => {
                    const request = require('request');

                    request(`https://finnhub.io/api/v1/quote?symbol=${sym}&token=c1hea6f48v6qtr46akgg`, { json: true }, (err, res, body) => {
                        if (err) { 
                            console.log(err); 
                            throw err;
                        }
                        if (res.body) {
                            var watchlistSymbols = newState.map((stock) => {return stock.symbol})
                            if (!watchlistSymbols.includes(sym)){
                                console.log(res.body);
                                if (res.body.c) {
                                    newState.push({symbol: sym, price: res.body.c})
                                }
                            } else {
                                newState.forEach((stock) => {
                                    if (stock.symbol === sym) {
                                        if (res.body.c) {
                                            stock.price = res.body.c;
                                        }
                                    }
                                });
                            }
                            this.setState({stocks: newState, finishedFetch: true})
                        }
                    });
                });
            })
            .catch(err => {
                throw err;
            });
        }, 10000);
    }
    componentWillUnmount() {
        clearInterval(this.interval);
    }
    render(){

        if (!this.state.finishedFetch) {
            return (
                <ProSidebar style={this.style}>
                    <ClipLoader color={"blue"} loading={true}
                css={`
                display: block;
                margin: 0 auto;
                border-color: blue;
                `} size={150} />
                </ProSidebar>
                
            )
        }
        else if (this.context.watchlist.length === 0) { 
            return (
                <ProSidebar style={this.style}>
                    <SidebarHeader>
                        <div className="header">
                            Your Watchlist
                        </div>
                        
                    </SidebarHeader>
                    <div className="header">
                    There are no stocks in your watchlist
                    </div>
                </ProSidebar>
            )
        } else {

            return (
                <ProSidebar style={this.style}>
                    <SidebarHeader>
                        <div className="header">
                            Your Watchlist
                        </div>
                        
                    </SidebarHeader>
                    <AuthContext.Consumer>{({ watchlist }) => (
                        <Menu iconShape="square">
                        {watchlist.map((stock) => {
                            // if want to see unused rewards
                            return (
                                <MenuItem>
                                    {stock.symbol.toUpperCase()} ${stock.price} USD
                                    <Link to={"/stock/" + stock.symbol} />
                                    <div className="delete-button">
                                        <IconButton
                                        variant="contained"
                                        color="secondary"
                                        size="small"
                                        onClick={this.deleteSymbol}
                                        >
                                            <DeleteIcon id={stock.symbol}/>
                                        </IconButton>
                                    </div>
                                </MenuItem>
                            );
                            })}
                        </Menu>
                    )}
                    </AuthContext.Consumer>
                    <Button href="/qrcode" color='primary' variant="text">Generate A QrCode!</Button>
                </ProSidebar>
            )
        }
    }

}

export default Watchlist;