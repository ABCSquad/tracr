import React, { useState } from "react";
import { Button, Form, Container } from "react-bootstrap";

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
        <Container className='centered login-padding' fluid>
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
                <Button variant="warning" type="submit" block size='lg'>Create account</Button>
            </Form>
        </Container>
    );
}

export default SignUp;