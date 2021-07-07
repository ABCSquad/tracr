import React, { useState } from 'react';
import { Row, Col } from "react-bootstrap";
import Landing from "./Landing";
import SignUp from "./SignUp";
import SignIn from "./SignIn";
import Steps from "./Steps";

const HomePage = (props) => {
    const [isSignIn, setIsSignIn] = useState(false)
    return (
        <div>
            <Landing />
            <Steps />
            <div className='gainsboro-bg'>
                <Col md={{ span:8, offset:2 }} className={isSignIn?'step-paddingx2':'step-padding'}>
                    <h2 className='text-center'>
                        {isSignIn?'Log in to tracr.':'Try tracr for free.'}
                    </h2>
                    <Row>
                        {isSignIn?<SignIn />:<SignUp />}
                    </Row>
                    <Row className='centered'>
                        <button className='link-button' onClick={() => setIsSignIn(!isSignIn)}>
                            {isSignIn?"Don't have an account?":'Already have an account?'}
                        </button>
                    </Row>
                </Col>
            </div>
        </div>
    );
}

export default HomePage;