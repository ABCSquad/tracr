import React from "react";
import { BrowserRouter as Router, Switch, Route, Link, Redirect } from "react-router-dom";

const HomePage = (props) => {
    return (
        <div> 
            <h1>Home Page</h1>
            <p>This is the {props.name} page</p>
        </div>
        // <Router>
        //     <Switch>
        //         <Route exact path='/'><p>This is the home page</p></Route>
        //         <Route path='/other' component={OtherPage}></Route>
        //     </Switch>
        // </Router>
    );
}

export default HomePage;