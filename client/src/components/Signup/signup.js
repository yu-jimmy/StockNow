// Signup page template from material ui: https://material-ui.com/getting-started/templates/

import React from 'react';
import { NavLink, Redirect } from 'react-router-dom';
import { Avatar, Button, Container, CssBaseline, TextField, Grid, Typography } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import PersonIcon from '@material-ui/icons/Person';

import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

const backend = process.env.NODE_ENV === 'production' ? 'https://stocknow.herokuapp.com' : 'http://localhost:4000';

const useStyles = theme => ({
    paper: {
      marginTop: theme.spacing(12),
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    avatar: {
      margin: theme.spacing(1),
      backgroundColor: theme.palette.success.dark,
    },
    form: {
      width: '100%', 
      marginTop: theme.spacing(4),
    },
    submit: {
      margin: theme.spacing(3, 0, 3),
    },
});


class Signup extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            "email": "",
            "password": "",
            "name": "",
            isError: false,
            errorMessage: 'Signup failed!',
            open: false,
            signIn: false
        }
    }

    handleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    }

    handleSubmit = (e) => {
        e.preventDefault();
        const email = this.state.email;
        const password = this.state.password;
        const user = this.state.name;

        this.setState({signIn: false});

        fetch(`${backend}/graphql`, {
            method: 'POST',
            body: JSON.stringify({query:`mutation {signup(email:"${email}", password:"${password}", user:"${user}"){_id email user}}`}),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(data => {
          if (data.status !== 200) throw new Error("Signup failed");
          return data.json();
        })
        .then(res => {
            if(res.errors) {
                this.setState({isError: true, errorMessage: res.errors[0].message, open: true})
            }
            else {
                this.setState({isError: false, signIn: true});
            }
        })
        .catch(err => {
          throw err;
        });
    }

    handleClose = () => {
        this.setState({open:false});
      }

    render() {
        const { classes } = this.props;

        if ((!(this.state.isError)) && this.state.signIn) {
            return (
                <Redirect to="/" />
            );
        }

        return (
          <Container component="main" maxWidth="xs">
            <CssBaseline />
            <div className={classes.paper}>
              <Avatar className={classes.avatar}>
                <PersonIcon />
              </Avatar>
              <Typography component="h1" variant="h5">
                Sign up
              </Typography>
              <form className={classes.form} noValidate onSubmit={this.handleSubmit}>
                <Grid container spacing={2}>
                {this.state.isError && 
                    <div>
                        <Snackbar
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'right',
                        }}
                        open={this.state.open}
                        autoHideDuration={6000}
                        onClose={this.handleClose}
                        message={this.state.errorMessage}
                        action={
                            <React.Fragment>
                            <IconButton size="small" aria-label="close" color="inherit" onClick={this.handleClose}>
                                <CloseIcon fontSize="small" />
                            </IconButton>
                            </React.Fragment>
                        }
                        />
                    </div>
                }
                  <Grid item xs={12} sm={12}>
                    <TextField
                      variant="outlined"
                      required
                      fullWidth
                      id="name"
                      label="Name"
                      name="name"
                      autoFocus
                      value={this.state.name}
                      onChange={this.handleChange}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      variant="outlined"
                      required
                      fullWidth
                      id="email"
                      label="Email Address"
                      name="email"
                      autoComplete="email"
                      value={this.state.email}
                      onChange={this.handleChange}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      variant="outlined"
                      required
                      fullWidth
                      name="password"
                      label="Password"
                      type="password"
                      id="password"
                      autoComplete="current-password"
                      value={this.state.password}
                      onChange={this.handleChange}
                    />
                  </Grid>
                </Grid>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  className={classes.submit}
                >
                  Sign Up
                </Button>
                <Grid container justify="flex-end">
                  <Grid item>
                    <NavLink to="/" variant="body2">
                      Already have an account? Sign in
                    </NavLink>
                  </Grid>
                </Grid>
              </form>
            </div>
          </Container>
        );
    }
}

export default withStyles(useStyles)(Signup);