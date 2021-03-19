import React from "react";
import { NavLink } from 'react-router-dom';
import { Avatar, Button, CssBaseline, TextField, Paper, Grid, Typography } from "@material-ui/core";
import { withStyles } from '@material-ui/core/styles';
import PersonIcon from '@material-ui/icons/Person';

import bgImage from './stocks.jpg';
import AuthContext from '../../context/auth-context';

const useStyles = theme => ({
    root: {
      height: '100vh',
    },
    image: {
      backgroundImage: `url(${bgImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    },
    paper: {
      margin: theme.spacing(8, 4),
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    },
    avatar: {
      margin: theme.spacing(1),
      backgroundColor: theme.palette.success.dark,
    },
    form: {
      width: '100%', 
      marginTop: theme.spacing(4)
    },
    submit: {
      margin: theme.spacing(3, 0, 3),
    },
  });


class Landing extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            "email": "",
            "password": ""
        }
    }
    static contextType = AuthContext;

    handleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    }

    handleSubmit = (e) => {
        e.preventDefault();
        const email = this.state.email;
        const password = this.state.password;
        console.log(email + " " + password);

        fetch('http://localhost:4000/graphql', {
            method: 'POST',
            body: JSON.stringify({query:`query {login(email:"${email}", password:"${password}"){email userId token tokenExp}}`}),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(data => {
          if (data.status !== 200) throw new Error("Login failed");
          return data.json();
        })
        .then(res => {
          console.log(res);
          if (res.data.login.token){
            this.context.login(res.data.login.email, res.data.login.userId, res.data.login.token, res.data.login.tokenExp);
          }
        })
        .catch(err => {
          throw err;
        });
    }

    render() {
        const { classes } = this.props;
        // if (this.context.token) return <Redirect to='/' />;
        return (
            <Grid container component="main" className={classes.root}>
            <CssBaseline />
            <Grid item xs={false} sm={4} md={8} className={classes.image} />
            <Grid item xs={12} sm={8} md={4} component={Paper}>
              <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                  <PersonIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                  Sign in
                </Typography>
                <form className={classes.form} noValidate onSubmit={this.handleSubmit}>
                  <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                    autoFocus
                    value={this.state.email}
                    onChange={this.handleChange}
                  />
                  <TextField
                    variant="outlined"
                    margin="normal"
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
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    className={classes.submit}
                  >
                    Sign In
                  </Button>
                  <Grid container>
                    <Grid item>
                      <NavLink to="/signup">
                        {"Don't have an account? Sign Up"}
                      </NavLink>
                    </Grid>
                  </Grid>
                </form>
              </div>
            </Grid>
          </Grid>
        );
    }
}

export default withStyles(useStyles)(Landing);
