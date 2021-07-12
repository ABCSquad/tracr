import React from 'react';
import Landing from "./Landing";
import Steps from "./Steps";
import Accounts from "./Accounts";

const HomePage = (props) => {
    return (
        <div>
            <Landing token={props.token} />
            <Steps />
            {!props.token && <Accounts tokenizer={props.tokenizer} />}
        </div>
    );
};

export default HomePage;