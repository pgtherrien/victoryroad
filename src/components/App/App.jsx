import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "material-icons/iconfont/material-icons.css";
import "semantic-ui-css/semantic.min.css";
import { BrowserRouter as Router, Route } from "react-router-dom";

import Checklist from "../Checklist";
import Header from "../Header";
import PokemonBox from "../PokemonBox";
import Timeline from "../Timeline";

class App extends React.PureComponent {
  render() {
    return (
      <Router>
        <Header />
        <Route exact path="/" component={Timeline} />
        <Route exact path="/checklist" component={Checklist} />
        <Route exact path="/pokemonbox" component={PokemonBox} />
      </Router>
    );
  }
}

export default App;
