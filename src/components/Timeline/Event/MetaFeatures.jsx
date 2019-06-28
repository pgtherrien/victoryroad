import React from "react";
import PropTypes from "prop-types";
import { Divider, Image, Responsive, Table } from "semantic-ui-react";

import styles from "./Event.module.css";

class MetaFeatures extends React.PureComponent {
  render() {
    const { features } = this.props;
    let rows = [];
    let i = 0;

    Object.keys(features).forEach(function(index) {
      rows.push(
        <Table.Row key={i}>
          <Table.Cell
            className={
              window.innerWidth > Responsive.onlyTablet.minWidth
                ? styles["event-table-text"]
                : ""
            }
            textAlign="center"
          >
            {features[index].feature}
          </Table.Cell>
        </Table.Row>
      );
      i++;
    });

    return (
      <React.Fragment>
        <Divider className={styles["event-divider"]} horizontal inverted>
          Features
        </Divider>
        <Table basic="very" celled inverted size="large" stackable>
          <Table.Body>{rows}</Table.Body>
        </Table>
      </React.Fragment>
    );
  }
}

MetaFeatures.propTypes = {
  features: PropTypes.array.isRequired
};

export default MetaFeatures;
