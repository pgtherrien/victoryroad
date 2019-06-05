import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";

import Home from "../Home";

class App extends React.PureComponent {
  render() {
    return (
      <Router>
        <Route exact path="/" component={Home} />
      </Router>
    );
  }
}

export default App;
