import React from "react";
import { Navbar, Nav, Col, Button, Container, Row } from "react-bootstrap";
import { BrowserRouter as Router, Switch, Route, Link, Redirect } from "react-router-dom";

const HomePage = (props) => {
    return (
        <div>
            <NavBar />
        </div>
    );
}

const NavBar = (props) => {
    return (
        <div> 
            <Container>
                <Navbar variant='dark' className='nav-color' fixed='top'>
                    <Col sm={{ span:10, offset:1 }}>
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
            </Container>
        </div>
    );
}

export default HomePage;