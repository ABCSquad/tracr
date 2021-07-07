import React, { useState } from 'react';
import Landing from "./Landing";
import SignUp from "./SignUp";
import SignIn from "./SignIn";
import Steps from "./Steps";

const HomePage = (props) => {
    const [isSignIn, setIsSignIn] = useState(true)
    return (
        <div>
            <Landing />
            <Steps />
            <div className='gainsboro-bg'>
                {isSignIn?<SignIn />:<SignUp />}
                <button className='link-button' onClick={() => setIsSignIn(!isSignIn)}>{isSignIn?"Don't have an account?":'Already have an account?'}</button>
            </div>
        </div>
    );
}

export default HomePage;