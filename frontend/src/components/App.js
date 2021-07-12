import React, { useState } from 'react';
import { render } from "react-dom";
import NavBar from "./NavBar";
import HomePage from "./HomePage";
import Footer from "./Footer";

const App = () => {

    const [token, setToken] = useState('');
    const tokenizer = (tok) => {
        setToken(tok);
        console.log(token);
    }

    return (
        <div>
            <NavBar tokenizer={tokenizer} token={token} />
            <HomePage tokenizer={tokenizer} token={token} />
            <Footer />
        </div>
    );
};

export default App;
render(<App />, document.getElementById('root'));