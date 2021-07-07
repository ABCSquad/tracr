import React, { useState } from "react";
import { Col, Button, Form, Container } from "react-bootstrap";

const SignIn = (props) => {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const handleSignin = (e) => {
        e.preventDefault()
        const credentials = {
            username: username,
            password: password
        }
        console.log(credentials);
        fetch('http://127.0.0.1:8000/auth/', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(credentials)
        })
        .then(data => data.json())
        .then(data => console.log(data))
        .catch(err => console.log(err))
    }

    return (
        <Col md={{ span:8, offset:2 }} className='step-paddingx2'>
            <h2 className='text-center'>Log in to tracr</h2>
            <Container className='centered' style={{ marginTop: 15 }} fluid>
                <Form onSubmit={handleSignin}>
                    <Form.Group controlId="formUsername2">
                        <Form.Control placeholder="Username" size='lg' className='thicc-border' value={username} onChange={e => setUsername(e.target.value)} />
                    </Form.Group>
                    <Form.Group controlId="formPassword2">
                        <Form.Control type="password" placeholder="Password" size='lg' className='thicc-border' value={password} onChange={e => setPassword(e.target.value)} />
                    </Form.Group>
                    <Button variant="warning" type="submit" block size='lg' >Log In</Button>
                </Form>
            </Container>
            {/* <h6 className='text-center' style={{ marginTop: 15, marginBottom: 0 }}>Don't have an account?</h6> */}
        </Col>
    );
}

export default SignIn;