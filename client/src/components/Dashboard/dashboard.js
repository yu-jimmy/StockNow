import React, { Component }  from 'react';
import AuthContext from '../../context/auth-context';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { Alert, AlertTitle } from '@material-ui/lab';

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

    state = { rows: [] };

  componentDidMount() {
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
            console.log(res.data.userWatchList);
            this.setState({rows: res.data.userWatchList});
        })
        .catch(err => {
            throw err;
        });
  }

  componentDidUpdate() {
      console.log(this.context)
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
        console.log(res.data.userWatchList);
        if (!(res.data.userWatchList.length === this.state.rows.length)){
             this.setState({rows: res.data.userWatchList});
        }
    })
    .catch(err => {
        throw err;
    });
  }

  render() {
    const { classes } = this.props;
    if (this.state.rows.length === 0){
        return (
            <div style={{paddingTop:40}}>
                <Box className={classes.box} boxShadow={3}>
                    <Alert severity="info">
                        <AlertTitle>No stocks being watched!</AlertTitle>
                        Search for a stock symbol and add it to your watch list
                    </Alert>
                </Box>
            </div>
        );
    }
    return (
        <div style={{width:'100%', paddingTop: 40}}>
            <Box className={classes.box} boxShadow={3}>
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
            </Box>
        </div>
    );
  }
}


export default withStyles(useStyles)(Dashboard);