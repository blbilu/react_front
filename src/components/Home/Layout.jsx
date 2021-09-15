import React, { useState } from 'react';
import { MDBNavbar, MDBNavbarBrand, MDBNavbarNav, MDBNavItem, MDBNavLink, MDBNavbarToggler, MDBCollapse, MDBDropdown,
    MDBDropdownToggle, MDBDropdownMenu, MDBDropdownItem, MDBIcon } from "mdbreact";
import {getUsername, logout} from '../../service/auth'
import { Link ,useHistory} from 'react-router-dom';
const Layout = () =>{
    const [state,setState] = useState({
        isOpen : false
    })
    const history = useHistory()
    const toggleCollapse = () => {
        setState({ isOpen: !state.isOpen });
      }
      const logOutClick  = ()=>{
          logout();
        history.push('/Login')
      }
    return(
        <MDBNavbar color="default-color" dark expand="md">
        <MDBNavbarBrand>
            <MDBIcon icon="home" />
          {/* <strong className="white-text">Home</strong> */}
        </MDBNavbarBrand>
        <MDBNavbarToggler onClick={toggleCollapse} />
        <MDBCollapse id="navbarCollapse3" isOpen={state.isOpen} navbar>
            <MDBNavbarNav left>
                <MDBNavItem active>
                    <Link className="nav-link waves-effect waves-light" to="Home">Home</Link>
                {/* <MDBNavLink to="#!">Home</MDBNavLink> */}
                </MDBNavItem>
            </MDBNavbarNav>
            <MDBNavbarNav right>
                <MDBNavItem className="mr-2">
                    <span className="mr-4 text-white">
                        {getUsername()}
                    </span>
                    <span style={{cursor : 'pointer'}} title="logout">
                        <MDBIcon icon="power-off fx-2" onClick={logOutClick}> 

                        </MDBIcon>
                    </span>
                </MDBNavItem>
            </MDBNavbarNav>
        </MDBCollapse>
      </MDBNavbar>
    )
}
export default Layout