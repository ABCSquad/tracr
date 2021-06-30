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
                <Navbar className='nav-color' fixed='top'>
                    <Col md={{ span:2, offset: 1}}>
                        <Row>
                            <Navbar.Brand href='/'>
                                <img src='../../static/images/logo.png' alt='tracr'/>
                            </Navbar.Brand>
                            <Nav>
                                <Nav.Link>Home</Nav.Link>
                            </Nav>
                        </Row>
                    </Col>
                    <Col md={{ span:2, offset: 6}}>
                        <Nav className='justify-content-end'>
                            <Nav.Item>
                                <Nav.Link>Login</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Button variant='outline-warning'>Get Started</Button>
                            </Nav.Item>
                        </Nav>
                    </Col>
                </Navbar>
            </Container>
        </div>
    );
}

export default HomePage;