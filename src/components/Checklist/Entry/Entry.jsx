import React from "react";
import PropTypes from "prop-types";
import { Card, Grid, Image } from "semantic-ui-react";

import styles from "../Checklist.module.css";

export default class Entry extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { entry, entryNumber, listType } = this.props;
    let src;

    switch (listType) {
      case "shiny":
        src = "images/pokemon_icons/pokemon_icon_" + entryNumber + "_shiny.png";
        break;
      case "lucky":
      case "normal":
      default:
        src = "images/pokemon_icons/pokemon_icon_" + entryNumber + ".png";
        break;
    }

    return (
      <Grid.Column>
        <Card className={styles["card"]}>
          {/* <Image src={src} /> */}
          <Image src="images/pokemon_icons/pokemon_icon_000.png" />
          <Card.Content className={styles["card-content"]}>
            <Card.Header className={styles["card-font"]}>
              {entry.name}
            </Card.Header>
            <Card.Meta className={styles["card-font"]}>
              #{entry.number}
            </Card.Meta>
          </Card.Content>
        </Card>
      </Grid.Column>
    );
  }
}

Entry.propTypes = {
  entry: PropTypes.object.isRequired,
  entryNumber: PropTypes.string.isRequired,
  listType: PropTypes.string.isRequired
};
