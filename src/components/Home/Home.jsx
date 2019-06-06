import React from "react";

import styles from "./Home.module.css";

class Home extends React.PureComponent {
  render() {
    return <div className={styles["home-container"]} />;
  }
}

export default Home;
