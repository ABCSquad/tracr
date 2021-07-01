import React from "react";
import { render } from "react-dom";
import NavBar from "./NavBar";
import HomePage from "./HomePage";


const App = () => {
    return (
        <div>
            <NavBar />
            <HomePage name='home'/>
        </div>
    );
}

export default App;
render(<App />, document.getElementById('app'));