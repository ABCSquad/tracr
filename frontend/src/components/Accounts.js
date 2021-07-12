import React, { useState } from 'react';
import { Row, Col } from "react-bootstrap";
import SignUp from "./SignUp";
import SignIn from "./SignIn";

const Accounts = (props) => {
    const [isSignIn, setIsSignIn] = useState(false);
    return (
            <div className='gainsboro-bg' id="accounts">
                <Col md={{ span:8, offset:2 }} className={isSignIn?'step-paddingx2':'step-padding'}>
                    <h2 className='text-center'>
                        {isSignIn?'Log in to tracr.':'Try tracr for free.'}
                    </h2>
                    <Row>
                        {isSignIn?<SignIn tokenizer={props.tokenizer} />:<SignUp />}
                    </Row>
                    <Row className='centered'>
                        <button className='link-button' onClick={() => setIsSignIn(!isSignIn)}>
                            {isSignIn?"Don't have an account?":'Already have an account?'}
                        </button>
                    </Row>
                </Col>
            </div>
    );
};

export default Accounts;