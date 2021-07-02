import React from 'react';
import Landing from "./Landing";
import SignIn from "./SignIn";
import Steps from "./Steps";

const HomePage = (props) => {
    return (
        <div>
            <Landing />
            <Steps />
            <SignIn />
        </div>
    );
}

export default HomePage;