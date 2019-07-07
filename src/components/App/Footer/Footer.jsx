import React from "react";
import { Grid, Header, Icon } from "semantic-ui-react";

import styles from "../App.module.css";

const Footer = () => {
  return (
    <Grid className={styles["footer"]}>
      <Grid.Column width="4" />
      <Grid.Column width="8">
        <Header
          as="h4"
          className={styles["footer-title"]}
          inverted
          onClick={() =>
            window.open(
              "https://github.com/pgtherrien/victoryroad/issues/new",
              "_blank"
            )
          }
        >
          <Icon inverted name="github" size="large" />
          Victory Road
        </Header>
      </Grid.Column>
      <Grid.Column width="4" />
    </Grid>
  );
};

export default Footer;
