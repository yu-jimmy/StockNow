import React, { Component }  from 'react';
import AuthContext from '../../context/auth-context';
import { withStyles } from '@material-ui/core/styles';
import ClipLoader from "react-spinners/ClipLoader";
import Grid from '@material-ui/core/Grid';
import { Typography } from '@material-ui/core';

const useStyles = theme => ({
    root: {
        ...theme.typography.h3,
        backgroundColor: theme.palette.background.paper,
        padding: theme.spacing(3),
      },
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
        if (res.body){
            this.setState({news: res.body, errFetching: false});
        }
    });
  }

  render() {
    const { classes } = this.props;
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
                    <Typography color="primary" paragraph="true" className={classes.root}>Here's the latest market news!</Typography>
                    <div style={{display: 'flex', flexWrap: "wrap", position: "relative"}}>
                        {this.state.news.map((article) => {
                            return(
                                <div style={{flexGrow: 1, width: '25%' }}>
                                    <a href={article.url} target="blank"><img src={article.image} height="200px" alt="Not Found"></img></a><br></br>
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