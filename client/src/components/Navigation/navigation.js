import React, { Component } from "react";
import {
MDBNavbar, MDBNavbarBrand, MDBNavbarNav, MDBNavItem, MDBNavLink, MDBFormInline,
MDBDropdown, MDBDropdownToggle, MDBDropdownMenu, MDBDropdownItem, MDBNavbarToggler
} from "mdbreact";
import AuthContext from '../../context/auth-context';

class Navigation extends Component {
// state = {
//   isOpen: false
// };
  static contextType = AuthContext;
// toggleCollapse = () => {
//   this.setState({ isOpen: !this.state.isOpen });
// }
render() {
  return (
      <MDBNavbar color="indigo" dark expand="md">
        <MDBNavbarBrand>
          <MDBNavLink to="/home"><strong className="white-text">StockNow</strong></MDBNavLink>
        </MDBNavbarBrand>
       
          <MDBNavbarNav left>
            <MDBNavItem active>
              <MDBNavLink to="/home">{this.context.email}</MDBNavLink>
            </MDBNavItem>
            {this.context.token && <MDBNavItem>
              <MDBNavLink to="/">Signed In</MDBNavLink>
            </MDBNavItem>}
            {!this.context.token && <MDBNavItem>
              <MDBNavLink to="/">Signed Out</MDBNavLink>
            </MDBNavItem>}
            {/* <MDBNavItem>
              <MDBDropdown>
                <MDBDropdownToggle nav caret>
                  <span className="mr-2">Dropdown</span>
                </MDBDropdownToggle>
                <MDBDropdownMenu>
                  <MDBDropdownItem href="#!">Action</MDBDropdownItem>
                  <MDBDropdownItem href="#!">Another Action</MDBDropdownItem>
                  <MDBDropdownItem href="#!">Something else here</MDBDropdownItem>
                  <MDBDropdownItem href="#!">Something else here</MDBDropdownItem>
                </MDBDropdownMenu>
              </MDBDropdown>
            </MDBNavItem> */}
          </MDBNavbarNav>
          <MDBNavbarNav right>
            
            {/* <MDBNavItem>
              <MDBFormInline waves>
                <div className="md-form my-0">
                  <input className="form-control mr-sm-2" type="text" placeholder="Search" aria-label="Search" />
                </div>
              </MDBFormInline>
            </MDBNavItem> */}
            {this.context.token && <MDBNavItem onClick={this.context.logout}>
              <MDBNavLink to="/">
                Logout
              </MDBNavLink>
            </MDBNavItem>}
          </MDBNavbarNav>
      </MDBNavbar>
    );
  }
}

export default Navigation;