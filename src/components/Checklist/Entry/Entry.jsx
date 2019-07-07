import React from "react";
import PropTypes from "prop-types";
import { Card, Grid, Icon, Image, Responsive } from "semantic-ui-react";

import styles from "../Checklist.module.css";

export default class Entry extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      checked: props.checked
    };
  }

  handleCheck = number => {
    this.props.handleCheck(number);
    this.setState({ checked: !this.state.checked });
  };

  componentDidUpdate(prevProps) {
    if (prevProps.checked !== this.props.checked) {
      this.setState({ checked: this.props.checked });
    }
  }

  // Build the sprite for the entry
  getImage = number => {
    const { listType } = this.props;
    let src;

    switch (listType) {
      case "shiny":
        src = "images/pokemon_icons/pokemon_icon_" + number + "_shiny.png";
        break;
      case "lucky":
      case "normal":
      default:
        src = "images/pokemon_icons/pokemon_icon_" + number + ".png";
        break;
    }

    return src;
  };

  render() {
    const { entry, number } = this.props;
    const { checked } = this.state;

    return (
      <Grid.Column key={entry.number} mobile={5} tablet={3} computer={2}>
        <Card
          className={
            window.innerWidth > Responsive.onlyMobile.minWidth
              ? `${styles["entry"]} ${styles["entry-hover"]}`
              : styles["entry"]
          }
        >
          <Image
            className={checked ? styles["entry-checked-image"] : ""}
            onClick={() => this.handleCheck(number)}
            src={this.getImage(number)}
          />
          {checked && (
            <Icon
              className={styles["entry-checked"]}
              color="green"
              inverted
              name="check"
              size="large"
            />
          )}
          <Card.Content className={styles["entry-content"]}>
            <Responsive
              as={Card.Header}
              className={styles["entry-font"]}
              minWidth={1400}
            >
              {entry.name}
            </Responsive>
            <Card.Meta className={styles["entry-font"]}>
              {window.innerWidth > 1400 ? `#${entry.number}` : `${entry.name}`}
            </Card.Meta>
          </Card.Content>
        </Card>
      </Grid.Column>
    );
  }
}

Entry.propTypes = {
  checked: PropTypes.bool.isRequired,
  entry: PropTypes.object.isRequired,
  handleCheck: PropTypes.func.isRequired,
  listType: PropTypes.string.isRequired,
  number: PropTypes.string.isRequired
};
