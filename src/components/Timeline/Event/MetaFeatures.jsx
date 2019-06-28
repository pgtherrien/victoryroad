import React from "react";
import PropTypes from "prop-types";
import { Divider, List } from "semantic-ui-react";

import styles from "./Event.module.css";

class MetaFeatures extends React.PureComponent {
  render() {
    const { features } = this.props;
    let items = [];
    let i = 0;

    Object.keys(features).forEach(function(index) {
      items.push(<List.Item key={i}>{features[index].feature}</List.Item>);
      i++;
    });

    return (
      <React.Fragment>
        <Divider
          className={`${styles["event-center"]} ${styles["event-margin-top"]}`}
          horizontal
          inverted
        >
          Features
        </Divider>
        <List bulleted inverted size="large">
          {items}
        </List>
      </React.Fragment>
    );
  }
}

MetaFeatures.propTypes = {
  features: PropTypes.array.isRequired
};

export default MetaFeatures;
