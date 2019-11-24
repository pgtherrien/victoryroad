import React from "react";
import PropTypes from "prop-types";
import { Label } from "semantic-ui-react";

import styles from "./Badges.module.css";
import utils from "../utils";
import { TYPE_COLORS } from "../../data/constants";

function Type(props) {
  const { type } = props;

  return (
    <Label
      className={styles["badge"]}
      style={{ background: TYPE_COLORS[type], color: "#ffffff" }}
    >
      {utils.toTitleCase(type)}
    </Label>
  );
}

Type.propTypes = {
  type: PropTypes.string.isRequired
};

export default Type;
