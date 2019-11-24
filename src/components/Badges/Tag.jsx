import React from "react";
import PropTypes from "prop-types";
import { Label } from "semantic-ui-react";

import styles from "./Badges.module.css";
import utils from "../utils";
import { TAG_COLORS } from "../../data/constants";

function Tag(props) {
  const { key, onClick, tag } = props;
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

Tag.propTypes = {
  key: PropTypes.number.isRequired,
  onClick: PropTypes.func,
  tag: PropTypes.string.isRequired
};

export default Tag;
