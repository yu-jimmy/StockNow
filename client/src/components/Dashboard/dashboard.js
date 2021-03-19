import React, { Component }  from 'react';
import AuthContext from '../../context/auth-context';
import {Redirect} from 'react-router-dom';

class Dashboard extends Component{

    static contextType = AuthContext;

    render() {
        if (!this.context.token) return <Redirect to='/signin' />;
        return (
            <h1>Token: {this.context.token}</h1>
        )
    }
}

export default Dashboard;