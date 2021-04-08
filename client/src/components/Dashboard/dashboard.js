import React, { Component }  from 'react';
import AuthContext from '../../context/auth-context';
import { withStyles } from '@material-ui/core/styles';
import ClipLoader from "react-spinners/ClipLoader";
import Grid from '@material-ui/core/Grid';

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
        errFetching: false,
        news: [],
    };

  componentDidMount() {
    const request = require('request');

    request('https://finnhub.io/api/v1/news?category=general&token=c1hea6f48v6qtr46akgg', { json: true }, (err, res) => {
        if (err) { 
          console.log(err);
          this.setState({errFetching: true}) 
        }
        this.setState({news: res.body, errFetching: false});
    });
  }

  render() {
    if (this.state.errFetching || this.state.news.length === 0){
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
    else{
        return (
            <Grid style={{paddingLeft:300}}>
            <div>
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
                </div>
            </div>
            </Grid>
        );
    }
  }
}


export default withStyles(useStyles)(Dashboard);