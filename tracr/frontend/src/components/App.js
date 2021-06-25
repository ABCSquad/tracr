import React, { Component } from "react";
import { render } from "react-dom";

export default class App extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return <h1>Testy Pesty</h1>;
    }
}

render(<App/>, document.getElementById('app'));