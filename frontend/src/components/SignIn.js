import React from 'react';
import { Col, Button, Form, Container } from 'react-bootstrap';

const SignIn = (props) => {
    return (
        <div className='gainsboro-bg'>
            <Col md={{ span:8, offset:2 }} className='step-padding'>
                <h2 className='text-center'>Try tracr for free.</h2>
                <Container className='centered' style={{ marginTop: 15 }} fluid>
                    <Form>
                        <Form.Group controlId="formBasicEmail">
                            <Form.Control type="email" placeholder="Username" size='lg' className='thicc-border'/>
                        </Form.Group>
                        <Form.Group controlId="formBasicPassword">
                            <Form.Control type="password" placeholder="Password" size='lg' className='thicc-border'/>
                        </Form.Group>
                        <Form.Group controlId="formBasicPassword">
                            <Form.Control type="password" placeholder="Confirm password" size='lg' className='thicc-border'/>
                        </Form.Group>
                        <Button variant="warning" type="submit" block size='lg'>Create account</Button>
                    </Form>
                </Container>
            </Col>
        </div>
    );
}

export default SignIn;