import React from "react";
import PropTypes from "prop-types";
import { Grid, Image } from "semantic-ui-react";

import styles from "./TimelineRow.module.css";

class ShinyGrid extends React.PureComponent {
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

  render() {
    let newShinies = JSON.parse(this.props.newShinies);
    const { toggled } = this.state;
    let columnCount = 1;
    let columns = [];
    let oThis = this;
    let src;
    let i = 0;

    if (newShinies.length % 2 === 0) {
      columnCount = 2;
    } else if (newShinies.length % 3 === 0) {
      columnCount = 3;
    } else if (newShinies.length % 4 === 0) {
      columnCount = 4;
    } else if (newShinies.length % 5 === 0) {
      columnCount = 5;
    }

    newShinies.forEach(function(shiny) {
      src = shiny;
      if (toggled.includes(shiny)) {
        src = shiny.split("_shiny")[0];
        src += ".png";
      }
      columns.push(
        <Grid.Column
          className={columnCount === 1 ? styles["content-sprite-single"] : ""}
          key={i}
        >
          <Image
            className={styles["content-sprite"]}
            id="content-sprite"
            onClick={() => oThis.toggleSprite(shiny)}
            src={src}
          />
        </Grid.Column>
      );
      i++;
    });

    return (
      <Grid stackable columns={columnCount}>
        {columns}
      </Grid>
    );
  }
}

ShinyGrid.propTypes = {
  newShinies: PropTypes.array.isRequired
};

export default ShinyGrid;
