import React, { useState } from "react";
import { Col, Button, Form, Container } from "react-bootstrap";

const SignUp = (props) => {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const handleSignup = (e) => {
        e.preventDefault()
        const credentials = {
            username: username,
            password: password
        }
        console.log(credentials);
    }

    return (
        <Col md={{ span:8, offset:2 }} className='step-padding'>
            <h2 className='text-center'>Try tracr for free.</h2>
            <Container className='centered' style={{ marginTop: 15 }} fluid>
                <Form onSubmit={handleSignup}>
                    <Form.Group controlId="formUsername">
                        <Form.Control placeholder="Username" size='lg' className='thicc-border' value={username} onChange={e => setUsername(e.target.value)} />
                    </Form.Group>
                    <Form.Group controlId="formPassword">
                        <Form.Control type="password" placeholder="Password" size='lg' className='thicc-border' value={password} onChange={e => setPassword(e.target.value)} />
                    </Form.Group>
                    <Form.Group controlId="formConfirmPassword">
                        <Form.Control type="password" placeholder="Confirm password" size='lg' className='thicc-border' value={confirm} onChange={e => setConfirm(e.target.value)} />
                    </Form.Group>
                    <Button variant="warning" type="submit" block size='lg' >Create account</Button>
                </Form>
            </Container>
        </Col>
    );
}

export default SignUp;