import React, { Component }  from 'react';
import AuthContext from '../../context/auth-context';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { Alert, AlertTitle } from '@material-ui/lab';
import ClipLoader from "react-spinners/ClipLoader";

const backend = process.env.NODE_ENV === 'production' ? 'https://stocknow.herokuapp.com' : 'http://localhost:4000';

const useStyles = theme => ({
    root: {
        width: '100%',
        '& > * + *': {
          marginTop: theme.spacing(2),
        },
    },
    table: {
        width: 500,
        margin: 'auto',
    },
    box: {
        width: 500,
        margin: 'auto',
    },
    head: {
        backgroundColor: theme.palette.common.black
    },
    cell: {
        color: theme.palette.common.white
    }
  });

class Dashboard extends Component{

    static contextType = AuthContext;

    state = { 
        rows: [],
        news: [],
    };

  componentDidMount() {
    const request = require('request');

    request('https://finnhub.io/api/v1/news?category=general&token=c1hea6f48v6qtr46akgg', { json: true }, (err, res) => {
      if (err) { return console.log(err); }
      console.log(res.body);
      this.setState({news: res.body});
    });

    // let unirest = require("unirest");

    // let req = unirest("GET", "https://yahoo-finance15.p.rapidapi.com/api/yahoo/ne/news");

    // req.headers({
    //     "x-rapidapi-key": "4ee5ac1e99mshef31668732a3510p16b7b4jsndc822db4aa01",
    //     "x-rapidapi-host": "yahoo-finance15.p.rapidapi.com",
    //     "useQueryString": true
    // });


    // req.end((res) => {
    //     if (res.error) throw new Error(res.error);
    //     this.setState({news: res.body});
    //     console.log(res.body);
    // });
    // fetch(`${backend}/graphql`, {
    //         method: 'POST',
    //         body: JSON.stringify({query:`query{ userWatchList(email:"${this.context.email}") }`}),
    //         headers:{'Content-Type': 'application/json'}
    //     })
    //     .then(data => {
    //         if (data.status !== 200) throw new Error("Retrieving symbols failed");
    //         return data.json();
    //     })
    //     .then(res => {
    //         console.log(res.data.userWatchList);
    //         this.setState({rows: res.data.userWatchList});
    //     })
    //     .catch(err => {
    //         throw err;
    //     });
  }

  componentDidUpdate() {
    // console.log(this.context)
    // fetch(`${backend}/graphql`, {
    //     method: 'POST',
    //     body: JSON.stringify({query:`query{ userWatchList(email:"${this.context.email}") }`}),
    //     headers:{'Content-Type': 'application/json'}
    // })
    // .then(data => {
    //     if (data.status !== 200) throw new Error("Retrieving symbols failed");
    //     return data.json();
    // })
    // .then(res => {
    //     console.log(res.data.userWatchList);
    //     if (!(res.data.userWatchList.length === this.state.rows.length)){
    //          this.setState({rows: res.data.userWatchList});
    //     }
    // })
    // .catch(err => {
    //     throw err;
    // });
  }

  render() {
    const { classes } = this.props;
        if (this.state.news.length === 0){
            return (
            <div style={{width:'100%', paddingTop: 40, paddingLeft: '15%'}}>
                <ClipLoader color={"blue"} loading={true}
                                css={`
                                display: block;
                                margin: 0 auto;
                                border-color: blue;
                                `} size={150} />
                </div>
            )
        }
    // if (this.state.rows.length === 0){
    //     return (
    //         <div style={{paddingTop:40}}>
    //             <Box className={classes.box} boxShadow={3}>
    //                 <Alert severity="info">
    //                     <AlertTitle>No stocks being watched!</AlertTitle>
    //                     Search for a stock symbol and add it to your watch list
    //                 </Alert>
    //             </Box>
    //         </div>
    //     );
    // }
    else{
        return (
            <div style={{paddingTop: 10, paddingLeft: '15%'}}>
                <h1>Market News</h1>
                <div style={{display: 'flex', flexWrap: "wrap", position: "relative"}}>
                    {this.state.news.map((article) => {
                        return(
                            <div style={{flexGrow: 1, width: '25%' }}>
                                <a href={article.url} target="blank"><img src={article.image} height="200px" alt="No Image Found"></img></a><br></br>
                                <a href={article.url} target="blank">{article.headline}</a>
                                <p>Source: {article.source}<br></br>Posted on: {new Date(article.datetime*1000).toLocaleDateString()}</p>
                            </div>
                        )
                    })}
                    {/* <Box className={classes.box} boxShadow={3}>
                        <TableContainer>
                            <Table className={classes.table} aria-label="simple table">
                                <TableHead className={classes.head}>
                                    <TableRow>
                                        <TableCell className={classes.cell}>
                                            Your Stock WatchList!
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {this.state.rows.map(row => (
                                        <TableRow key={row}>
                                            <TableCell component="th" scope="row">
                                                {row}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box> */}
                </div>
            </div>
        );
    }
  }
}


export default withStyles(useStyles)(Dashboard);