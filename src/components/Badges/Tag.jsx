import React from "react";
import PropTypes from "prop-types";
import { Label } from "semantic-ui-react";

import styles from "./Badges.module.css";
import utils from "../utils";
const TAG_COLORS = {
  alolan: "yellow",
  baby: "teal",
  legendary: "red",
  mythical: "purple",
  regional: "green",
  starter: "blue"
};

export default class Tag extends React.PureComponent {
  render() {
    const { key, onClick, tag } = this.props;
    let displayTag = tag.split("_").join(" ");

    return (
      <Label
        className={styles["badge"]}
        key={key}
        onClick={onClick}
        color={TAG_COLORS[tag]}
      >
        {utils.toTitleCase(displayTag)}
      </Label>
    );
  }
}

Tag.propTypes = {
  key: PropTypes.number.isRequired,
  onClick: PropTypes.func,
  tag: PropTypes.string.isRequired
};
