import React from "react";
import { Navbar, Nav, Col, Button, Row } from "react-bootstrap";
import logo from "../static/images/logo.png";

const NavBar = (props) => {
    return (
        <div id='navbar'> 
            <Navbar variant='dark' className='davys-bg' sticky='top'>
                <Col md={{ span:8, offset:2 }}>
                    <Row>
                        <Nav className='mr-auto'>
                            <Navbar.Brand href='/'>
                                <img src={logo} alt='tracr'/>
                            </Navbar.Brand>
                            <Nav.Link href='/'>Home</Nav.Link>
                            {props.token?
                            <Nav.Link>Account</Nav.Link>:
                            <Nav.Link href='#accounts'>Login</Nav.Link>}
                        </Nav>
                        <Nav>
                            {props.token?
                            <Button variant='outline-warning' onClick={() => props.tokenizer('')}>Logout</Button>:
                            <Button variant='outline-warning' href='#accounts'>Sign up for free</Button>}
                        </Nav>
                    </Row>
                </Col>
            </Navbar>
        </div>
    );
}

export default NavBar;