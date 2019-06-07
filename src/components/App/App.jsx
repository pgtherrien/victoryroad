import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";

import Checklist from "../Checklist";
import Header from "../Header";
import Timeline from "../Timeline";
import PokemonBox from "../PokemonBox";

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