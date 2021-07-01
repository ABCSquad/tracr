import React from "react";
import { Navbar, Nav, Col, Button, Row } from "react-bootstrap";

const NavBar = (props) => {
    return (
        <div> 
            <Navbar variant='dark' className='nav-style' sticky='top'>
                <Col md={{ span:8, offset:2 }}>
                    <Row>
                        <Nav className='mr-auto'>
                            <Navbar.Brand href='/'>
                                <img src='../../static/images/logo.png' alt='tracr'/>
                            </Navbar.Brand>
                            <Nav.Link href='/'>Home</Nav.Link>
                            <Nav.Link>Login</Nav.Link>
                        </Nav>
                        <Nav>
                            <Button variant='outline-warning' className='mikado-btn'>Get Started</Button>
                        </Nav>
                    </Row>
                </Col>
            </Navbar>
        </div>
    );
}

export default NavBar;