import React, { Component }  from 'react';
import ClipLoader from "react-spinners/ClipLoader";
import { withStyles } from '@material-ui/core/styles';
import AuthContext from '../../context/auth-context';
import { Grid, Typography, Button, TextField } from '@material-ui/core';


const backend = process.env.NODE_ENV === 'production' ? 'https://stocknow.herokuapp.com' : 'http://localhost:4000';

const useStyles = theme => ({
    root: {
      ...theme.typography.button,
      backgroundColor: theme.palette.background.paper,
      padding: theme.spacing(1),
    },
    form: {
        width: '50%', 
        marginTop: theme.spacing(4)
      },
  });

class TwoFactorLogin extends Component{
    state = {
        twoFactorCode: "",
        wrong: false,
    }
    static contextType = AuthContext;

    
    handleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    }

    handleSubmit = (e) => {
        e.preventDefault();
        const speakeasy = require('speakeasy');
    
        let verified = speakeasy.totp.verify({
            secret: this.context.twoFactorSecretAscii,
            encoding: 'ascii',
            token: this.state.twoFactorCode.toString().replace(/\s/g, ''),
        })
        console.log(verified);
        if (verified) {
            this.context.twoFactorLogin();
        }
        else {
            this.setState({ wrong: true })
        }
        
    }

    componentDidMount() {
        
    }

    render() {
        const { classes } = this.props;
        return (
            <Grid container spacing={0} direction="column" alignItems="center" justify="center" style={{ minHeight: '70vh' }}>
                <Typography color="primary" paragraph="true" className={classes.root}>Enter your 2fa code from Authenticator app</Typography>
                <form className={classes.form} noValidate onSubmit={this.handleSubmit}>
                <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    id="twoFactorCode"
                    label="2FA Code"
                    name="twoFactorCode"
                    autoFocus
                    value={this.state.email}
                    onChange={this.handleChange}
                  />
                  
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    className={classes.submit}
                  >
                    Sign In
                  </Button>
                  
                </form>
                {this.state.wrong && 
                    <Typography color="secondary" paragraph="true" className={classes.root}>Incorrect Code</Typography>
                  }
            </Grid>
        )
    }
}

export default withStyles(useStyles)(TwoFactorLogin);