import React from "react";
import PropTypes from "prop-types";
import { Tooltip } from "shards-react";

import styles from "./Buttons.module.css";

class FilterButton extends React.PureComponent {
  render() {
    const { isOpen, text, toggle } = this.props;

    return (
      <div className={styles["filter-button-container"]}>
        <div className={styles["filter-button"]} id="FilterButton">
          <span className="material-icons" id={styles["FilterIcon"]}>
            filter_list
          </span>
        </div>
        {/*
        <Tooltip
          open={isOpen}
          placement="left"
          target="#FilterButton"
          toggle={toggle}
        >
          {text}
        </Tooltip>
        */}
      </div>
    );
  }
}

FilterButton.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  text: PropTypes.string.isRequired,
  toggle: PropTypes.func.isRequired
};

export default FilterButton;
