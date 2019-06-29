import React from "react";
import PropTypes from "prop-types";
import { Divider, Grid } from "semantic-ui-react";

import styles from "./Event.module.css";
import Sprite from "../../Sprite";

export default class MetaShiny extends React.PureComponent {
  getColumnCount = arrayLength => {
    let columnCount = 1;

    if (arrayLength === 2) {
      columnCount = 2;
    } else if (arrayLength % 3 === 0) {
      columnCount = 3;
    } else if (arrayLength % 4 === 0) {
      columnCount = 4;
    } else if (arrayLength % 5 === 0) {
      columnCount = 5;
    }

    return columnCount;
  };

  render() {
    let newShinies = this.props.newShinies;
    let columnCount = this.getColumnCount(newShinies.length);
    let label = "New Shinies Released";
    let columns = [];
    let i = 0;

    if (newShinies.legnth === 1) {
      label = "New Shiny Released";
    }

    newShinies.forEach(function(shiny) {
      columns.push(
        <Grid.Column key={i}>
          <Sprite showShiny={true} src={shiny.image} />
        </Grid.Column>
      );
      i++;
    });

    return (
      <React.Fragment>
        <Divider
          className={`${styles["event-center"]} ${styles["event-margin-top"]}`}
          horizontal
          inverted
        >
          {label}
        </Divider>
        <Grid stackable columns={columnCount}>
          {columns}
        </Grid>
      </React.Fragment>
    );
  }
}

MetaShiny.propTypes = {
  newShinies: PropTypes.array.isRequired
};
