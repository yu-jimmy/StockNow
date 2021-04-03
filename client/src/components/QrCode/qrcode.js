import React, { Component } from "react";
import AuthContext from '../../context/auth-context';
import { Grid, Typography } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
var QRCode = require('qrcode.react');

const backend = process.env.NODE_ENV === 'production' ? 'https://stocknow.herokuapp.com' : 'http://localhost:4000';

const useStyles = theme => ({
    root: {
      ...theme.typography.button,
      backgroundColor: theme.palette.background.paper,
      padding: theme.spacing(1),
    },
  });

class QrCode extends Component {

    static contextType = AuthContext;

    state = {
        stockString: ""
    }

    async componentDidMount() {
        try{
            let stockStr = ""
            const res = await fetch(`${backend}/graphql`, {
                method: 'POST',
                body: JSON.stringify({query:`query{ userWatchList(email:"${this.context.email}") }`}),
                headers:{'Content-Type': 'application/json'}
            })
            const resData = await res.json()
            if (resData.data.userWatchList) {
                let unirest = require('unirest');
                const quoteRes = await unirest.get("https://apidojo-yahoo-finance-v1.p.rapidapi.com/market/v2/get-quotes")
                    .query({"region": "US", "symbols": resData.data.userWatchList.toString()})
                    .headers({
                        "x-rapidapi-key": "a4c6ab8496mshad5bc2e98111fbbp19638ejsn2708817a9504",
                        "x-rapidapi-host": "apidojo-yahoo-finance-v1.p.rapidapi.com",
                        "useQueryString": true
                    });
                console.log(quoteRes.body.quoteResponse.result)
                console.log(quoteRes.body.quoteResponse.result.length)
                if (quoteRes.body.quoteResponse.error === null && quoteRes.body.quoteResponse.result) {
                    let i;
                    for (i = 0; i< quoteRes.body.quoteResponse.result.length; i++) {
                        let stockData = quoteRes.body.quoteResponse.result[i]
                        let str = stockData.symbol + ": has stock price of " + stockData.regularMarketPrice + ", market high of " + stockData.regularMarketDayHigh + ", market low of " + stockData.regularMarketDayLow + ", and a volume of " + stockData.regularMarketVolume + " shares.\n";
                        stockStr += str;
                    }
                    
                }
            }
            this.setState({stockString: stockStr})
        } catch(err) {
            console.log(err)
        }
    }

    render() {
        const { classes } = this.props;

        return (
            <Grid container spacing={0} direction="column" alignItems="center" justify="center" style={{ minHeight: '70vh' }}>
                <Typography color="primary" paragraph="true" className={classes.root}>Scan this QrCode for quick information about your watchlist!</Typography>
                <QRCode value={this.state.stockString} size={256}/>
            </Grid>
        );
    }
}
 
export default withStyles(useStyles)(QrCode);