import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import ClipLoader from "react-spinners/ClipLoader";
import AuthContext from '../../context/auth-context';
import { ProSidebar, Menu, MenuItem, SidebarHeader } from 'react-pro-sidebar';
import 'react-pro-sidebar/dist/css/styles.css';
import './watchlist.css'
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
var yahooFinance = require('yahoo-finance');

const backend = process.env.NODE_ENV === 'production' ? 'https://stocknow.herokuapp.com' : 'http://localhost:4000';

class Watchlist extends Component{
    state = {
        stocks: [
        ],
        finishedFetch: false,
    }

    static contextType = AuthContext;

    style = {
        position: 'absolute',
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
        return yahooFinance.quote({
            symbol: symbol
        }, function (err, quote) {
            if (err){
                console.log(err);
            }
            return quote.price.regularMarketPrice;
        }).then(res => {
            if (res)
                return res
            // this.setState({finishedFetch: true, price: res.price.regularMarketPrice.toFixed(2)});
        }).catch(err => {
            throw err;
        });
    };

    deleteSymbol = (symbol) => {
        this.context.test = "test";
        console.log(this.context.test)
        this.removeFromWatchlist(symbol.target.parentElement.id);
        // var currentStocks = this.state.stocks;
        // currentStocks = currentStocks.filter((stock) => { return stock.symbol.toUpperCase() !== symbol.target.parentElement.id.toUpperCase() });
        // this.setState({stocks: currentStocks});
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
                yahooFinance.quote({
                    symbol: sym
                }, function (err, quote) {
                    if (err){
                        console.log(err);
                    }
                    return quote;
                }).then(res => {
                    if (res.price){
                        newState.push({symbol: sym,
                            price: res.price.regularMarketPrice})
                        this.context.watchlist = newState
                        this.setState({finishedFetch: true})
                        // this.setState({stocks: newState, finishedFetch: true})
                        }
                }).catch(err => {
                    throw err;
                });
            });
        })
        .catch(err => {
            throw err;
        });
        
      
        this.interval = setInterval(() => {
            newState = this.state.stocks;
            console.log(newState);
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
                symbols = res.data.userWatchList;
                symbols.forEach((sym) => {
                    yahooFinance.quote({
                        symbol: sym
                    }, function (err, quote) {
                        if (err){
                            console.log(err);
                        }
                        return quote;
                    }).then(res => {
                        if (res.price){
                            var watchlistSymbols = newState.map((stock) => {return stock.symbol})
                            if (!watchlistSymbols.includes(sym)){
                                console.log(res)
                                if (res.price.regularMarketPrice){
                                    if (res.price.regularMarketPrice.raw){
                                        newState.push({symbol: sym,
                                            price: res.price.regularMarketPrice.raw})
                                        console.log(newState)
                                        }
                                        else{
                                            newState.push({symbol: sym,
                                                price: res.price.regularMarketPrice})
                                                console.log(newState)
                                        }
                                    }
                                }
                            else{
                                newState.forEach((stock) => {
                                    if (stock.symbol === sym){
                                        if (res.price.regularMarketPrice){
                                            if (res.price.regularMarketPrice.raw){
                                            stock.price = res.price.regularMarketPrice.raw
                                            }
                                            else{
                                                stock.price = res.price.regularMarketPrice
                                            }
                                        }
                                    }
                                })
                            }
                            this.setState({stocks: newState, finishedFetch: true})
                            }
                            
                    }).catch(err => {
                        throw err;
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
            {/* <MenuItem>
                GME ${} USD
                <Link to="/stock/gme" />
            </MenuItem> */}
            {/* <SubMenu title="Components">
            <MenuItem>Component 1</MenuItem>
            <MenuItem>Component 2</MenuItem>
            </SubMenu> */}
        </Menu>
          )}
                    
                    </AuthContext.Consumer>
                </ProSidebar>
            )
        }
    }

}

export default Watchlist;