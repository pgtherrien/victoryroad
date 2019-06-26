import React from "react";
import PropTypes from "prop-types";
import { Divider, Grid, Image } from "semantic-ui-react";

import styles from "./Event.module.css";

class MetaShiny extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      toggled: []
    };
  }

  toggleSprite = sprite => {
    let toggled = Object.assign([], this.state.toggled);
    let index = toggled.indexOf(sprite);

    if (index > -1) {
      toggled.splice(index, 1);
    } else {
      toggled.push(sprite);
    }
    this.setState({
      toggled
    });
  };

  getColumnCount = arrayLength => {
    let columnCount = 1;

    if (arrayLength % 2 === 0) {
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
    const { toggled } = this.state;
    let newShinies = JSON.parse(this.props.newShinies);
    let columnCount = this.getColumnCount(newShinies.length);
    let columns = [];
    let label = "New Shinies Released";
    let oThis = this;
    let src;
    let i = 0;

    if (newShinies.legnth === 1) {
      label = "New Shiny Released";
    }

    newShinies.forEach(function(shiny) {
      src = shiny;
      if (toggled.includes(shiny)) {
        src = shiny.split("_shiny")[0];
        src += ".png";
      }

      columns.push(
        <Grid.Column
          className={
            columnCount === 1 ? styles["meta-shinies-sprite-single"] : ""
          }
          key={i}
        >
          <Image
            className={styles["meta-shinies-sprite"]}
            id="content-sprite"
            onClick={() => oThis.toggleSprite(shiny)}
            src={src}
            title="Click to toggle shiny & normal forms"
          />
        </Grid.Column>
      );
      i++;
    });

    return (
      <React.Fragment>
        <Divider className={styles["event-divider"]} horizontal inverted>
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

export default MetaShiny;
