import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import ClipLoader from "react-spinners/ClipLoader";
import { ProSidebar, Menu, MenuItem, SubMenu, SidebarHeader } from 'react-pro-sidebar';
import 'react-pro-sidebar/dist/css/styles.css';
import './watchlist.css'
var yahooFinance = require('yahoo-finance');

class Watchlist extends Component{
    state = {
        stocks: [
        ],
        finishedFetch: false,
    }
    style = {
        position: 'absolute',
        backgroundImage: 'url(https://www.nasdaq.com/sites/acquia.prod/files/styles/1370x700/public/2020/03/16/stocks-iamchamp-adobe.jpg?h=6acbff97&itok=9UbAnU_E)'
    }

    getQuote = (symbol) => {
        return yahooFinance.quote({
            symbol: symbol
        }, function (err, quote) {
            if (err){
                console.log(err);
            }
            return quote.price.regularMarketPrice.toFixed(2);
        }).then(res => {
            if (res)
                return res
            // this.setState({finishedFetch: true, price: res.price.regularMarketPrice.toFixed(2)});
        }).catch(err => {
            throw err;
        });
    };

    componentDidMount(){
        var symbols = ['gme', 'amc', 'pltr', 'sndl', 'msft']
        var newState = []
        symbols.forEach((sym) => {
            yahooFinance.quote({
                symbol: sym
            }, function (err, quote) {
                if (err){
                    console.log(err);
                }
                return quote;
            }).then(res => {
                if (res){
                    newState.push({symbol: sym,
                        price: res.price.regularMarketPrice.toFixed(2)})
                        
                    this.setState({stocks: newState, finishedFetch: true})
                     }
                     
            }).catch(err => {
                throw err;
            });
        });
            
        //     this.state.stocks.push({symbol: sym,
        //         price: this.getQuote(sym)})
        // })
        this.interval = setInterval(() => {
            newState = this.state.stocks;
            symbols.forEach((sym) => {
                yahooFinance.quote({
                    symbol: sym
                }, function (err, quote) {
                    if (err){
                        console.log(err);
                    }
                    return quote;
                }).then(res => {
                    if (res){
                        newState.forEach((stock) => {
                            if (stock.symbol === sym){
                                stock.price = res.price.regularMarketPrice.toFixed(2)
                            }
                        })
                        this.setState({stocks: newState, finishedFetch: true})
                         }
                         
                }).catch(err => {
                    throw err;
                });
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
        else if (this.state.stocks.length === 0) {
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
                    <Menu iconShape="square">
                        {this.state.stocks.map((stock) => {
                        // if want to see unused rewards
                        return (
                            <MenuItem>
                            {stock.symbol.toUpperCase()} ${stock.price} USD
                            <Link to={"/stock/" + stock.symbol} />
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
                </ProSidebar>
            )
        }
    }

}

export default Watchlist;