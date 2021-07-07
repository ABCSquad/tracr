import React, { useState } from "react";
import { Button, Form, Container } from "react-bootstrap";

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
        <Container className='centered login-padding' fluid>
            <Form onSubmit={handleSignin}>
                <Form.Group controlId="formUsername">
                    <Form.Control placeholder="Username" size='lg' className='thicc-border' value={username} onChange={e => setUsername(e.target.value)} />
                </Form.Group>
                <Form.Group controlId="formPassword">
                    <Form.Control type="password" placeholder="Password" size='lg' className='thicc-border' value={password} onChange={e => setPassword(e.target.value)} />
                </Form.Group>
                <Button variant="warning" type="submit" block size='lg'>Log In</Button>
            </Form>
        </Container>
    );
}

export default SignIn;