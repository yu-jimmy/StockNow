import React, { Component }  from 'react';
import ClipLoader from "react-spinners/ClipLoader";
import { Grid, Typography } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import AuthContext from '../../context/auth-context';
import { Button } from '@material-ui/core';


const backend = process.env.NODE_ENV === 'production' ? 'https://stocknow.herokuapp.com' : 'http://localhost:4000';

const useStyles = theme => ({
    root: {
      ...theme.typography.button,
      backgroundColor: theme.palette.background.paper,
      padding: theme.spacing(1),
    },
  });

class TwoFactor extends Component{
    state = {
        qrcode:"",
        activated: this.context.twoFactor,
        secret: this.context.twoFactorSecret
    }
    static contextType = AuthContext;

    activateTwoFactor = (() => {
        const speakeasy = require('speakeasy');
        const qrcode = require('qrcode');
        let secret = speakeasy.generateSecret({
            name: "StockNow",
        })
        var requestBody = JSON.stringify({query:`mutation{ activateTwoFactor(email:"${this.context.email}", secret:"${secret.base32}", asciiSecret:"${secret.ascii}") {twoFactor} }`});
        fetch(`${backend}/graphql`, {
            method: 'POST',
            body: requestBody,
            headers:{'Content-Type': 'application/json', 'Authorization': 'Bearer ' + this.context.token}
        })
        .then(data => {
            if (data.status !== 200) throw new Error("Two Factor Activation failed");
            return data.json();
        })
        .then(res => {
            localStorage.setItem('twoFactor', "true");
            localStorage.setItem('twoFactorSecret', secret.base32);
            localStorage.setItem('twoFactorSecretAscii', secret.ascii);
            this.context.twoFactorSecret = secret.base32;
            this.context.twoFactorSecretAscii = secret.ascii;
            this.setState({activated: true, secret: secret.ascii});
            qrcode.toDataURL('otpauth://totp/StockNow?secret='+secret.base32, (err, res) => {
                if (err) throw err;
                this.setState({qrcode: res});
            })
            return res;
        })
        .catch(err => {
            throw err;
        });
        
    })

    componentDidMount() {
        const qrcode = require('qrcode');
        if(this.state.secret !== ""){
            qrcode.toDataURL('otpauth://totp/StockNow?secret='+this.state.secret, (err, res) => {
                if (err) throw err;
                this.setState({qrcode: res});
            })
        }
    }

    render() {
        const { classes } = this.props;
        if (this.state.activated === false){
            return(
                <Grid container spacing={0} direction="column" alignItems="center" justify="center" style={{ minHeight: '70vh' }}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={this.activateTwoFactor}
                    >
                        Activate 2 Factor Authentication
                    </Button>
                </Grid>
            )
        }
        else if (this.state.qrcode === ""){
            return (
                <Grid container spacing={0} direction="column" alignItems="center" justify="center" style={{ minHeight: '70vh' }}>
                    <ClipLoader color={"blue"} loading={true}
                                    css={`
                                    display: block;
                                    margin: 0 auto;
                                    border-color: blue;
                                    `} size={150} />
                </Grid>
            )
        }
        else{
            return (
                <Grid container spacing={0} direction="column" alignItems="center" justify="center" style={{ minHeight: '70vh' }}>
                    <Typography color="primary" paragraph="true" className={classes.root}>Scan this QrCode on Google Authenticator to get your code!</Typography>
                    <img src={this.state.qrcode} alt="Error"></img>
                </Grid>
            )
        }
    }
}

export default withStyles(useStyles)(TwoFactor);