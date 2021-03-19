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
var yahooFinance = require('yahoo-finance');

class Dashboard extends Component{
    state = {
        symbol: this.props.match.params.symbol,
        price: null,
        notFound: false,
        finishedFetch: false,
    };

    static contextType = AuthContext;

    getQuote = (symbol) => {
        yahooFinance.quote({
            symbol: symbol
            // from: '2012-01-01',
            // to: '2012-12-31',
            // period: 'd'  // 'd' (daily), 'w' (weekly), 'm' (monthly), 'v' (dividends only)
        }, function (err, quote) {
            if (err){
                console.log(err);
            }
            return quote;
        }).then(res => {
            if (res.price)
            this.setState({finishedFetch: true, price: res.price.regularMarketPrice.toFixed(2)});
        }).catch(err => {
            this.setState({finishedFetch: true, notFound: true});  
            throw err;
        });
    };

    componentWillReceiveProps(props) {
        this.setState({finishedFetch: false, notFound: false});
        this.setState({symbol: props.match.params.symbol});
        this.getQuote(props.match.params.symbol)  
    }

    componentDidMount(){
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
                <h1>Symbol {this.state.symbol} was not found</h1>
            )
        }
        else{
            return (
                <TableContainer component={Paper}>
                    <Table className="table" aria-label="simple table">
                        <TableHead>
                        <TableRow>
                            <TableCell>{this.state.symbol.toUpperCase()}</TableCell>
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