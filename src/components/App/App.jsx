import React from "react";
import "semantic-ui-css/semantic.min.css";
import { BrowserRouter as Router, Route } from "react-router-dom";

import { auth, db, provider } from "../../firebase";
import Checklist from "../Checklist";
import Header from "../Header";
import PokemonBox from "../PokemonBox";
import Timeline from "../Timeline";

class App extends React.PureComponent {
  constructor(props) {
    super(props);

    // Capture the user from the localStorage / set the user in localStorage
    auth.onAuthStateChanged(function(user) {
      user
        ? localStorage.setItem("user", JSON.stringify(user))
        : localStorage.removeItem("user");
    });

    this.state = {
      admins: [],
      user: JSON.parse(localStorage.getItem("user"))
    };
  }

  // Gather the admins tabls
  componentWillMount() {
    let admins = [];

    db.collection("admins")
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          admins.push(doc.id);
        });
        this.setState({ admins: admins });
      });
  }

  // Sign the user in
  authSignIn = () => {
    auth.signInWithPopup(provider).then(result => {
      const user = result.user;
      this.setState({ user: user });
    });
  };

  // Sign the user out
  authSignOut = () => {
    auth.signOut().then(() => {
      localStorage.removeItem("user");
      this.setState({ user: undefined });
    });
  };

  render() {
    const { admins, user } = this.state;
    return (
      <Router>
        <Header
          actions={{
            signIn: this.authSignIn,
            signOut: this.authSignOut
          }}
          admins={admins}
          user={user}
        />
        <Route
          exact
          path="/"
          render={() => <Timeline admins={admins} user={user || {}} />}
        />
        <Route exact path="/checklist" component={Checklist} />
        <Route exact path="/pokemonbox" component={PokemonBox} />
      </Router>
    );
  }
}

export default App;
