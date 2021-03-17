import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';

class Landing extends React.Component {
    constructor(props) {
        super(props);
        
    }

    state = {
        login: false,
        signup: false
    }

    render() {
        return (
        <div>
            <Button type="submit" size="large" variant="contained" color="primary">
            Sign Up
            </Button>
        </div>
        );
    }
}

export default Landing;
