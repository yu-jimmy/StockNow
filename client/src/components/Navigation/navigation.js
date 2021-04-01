import React, { Component } from "react";
import { withRouter } from 'react-router';
import {
MDBNavbar, MDBNavbarBrand, MDBNavbarNav, MDBNavItem, MDBNavLink,
// MDBDropdown, MDBDropdownToggle, MDBDropdownMenu, MDBDropdownItem, MDBNavbarToggler
} from "mdbreact";
import AuthContext from '../../context/auth-context';

class Navigation extends Component {
  state = {
    searchSymbol: '',
  }
  static contextType = AuthContext;

  handleChange = (e) => {
    this.setState({
      [e.target.id]: e.target.value,
    });
  }

  searchSymbol = (e) => {
    e.preventDefault();
    this.props.history.push('/stock/' + this.state.searchSymbol)
    this.setState({
      searchSymbol: ''
    });
  }

  render() {
    return (
      <div class="sticky-top">
        <MDBNavbar color="indigo" dark expand="md">
          <MDBNavbarBrand>
            <MDBNavLink to="/home"><strong className="white-text">StockNow</strong></MDBNavLink>
          </MDBNavbarBrand>
            <MDBNavbarNav right>
              
              {this.context.token && 
                <MDBNavItem>
                  {/* <MDBFormInline waves> */}
                  <form onSubmit={this.searchSymbol}>
                    <div className="md-form my-0">
                      <input className="form-control mr-sm-2" id="searchSymbol" onChange={this.handleChange} type="text" value={this.state.searchSymbol} placeholder="Search For Symbol" aria-label="Search" />
                    </div>
                  </form>
                  {/* </MDBFormInline> */}
                </MDBNavItem>
              }
              {this.context.token &&
                <MDBNavItem>
                  <MDBNavLink to="/">
                    {this.context.email}
                  </MDBNavLink>
                </MDBNavItem>
              }
              {this.context.token &&
                <MDBNavItem onClick={this.context.logout}>
                  <MDBNavLink to="/">
                    Logout
                  </MDBNavLink>
                </MDBNavItem>
              }
            </MDBNavbarNav>
        </MDBNavbar>
        </div>
      );
   }
}

export default withRouter(Navigation);