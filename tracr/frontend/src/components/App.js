import React from "react";
import { render } from "react-dom";
import NavBar from "./NavBar";
import HomePage from "./HomePage";
import Footer from "./Footer";


const App = () => {
    return (
        <div>
            <NavBar />
            <HomePage />
            <Footer />
        </div>
    );
}

export default App;
render(<App />, document.getElementById('root'));