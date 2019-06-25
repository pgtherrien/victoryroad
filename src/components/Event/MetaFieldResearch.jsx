import React from "react";
import PropTypes from "prop-types";

import styles from "./Event.module.css";

class MetaFieldResearch extends React.PureComponent {
  render() {
    let rows = [];

    return (
      <React.Fragment>
        <Divider className={styles["event-divider"]} horizontal inverted>
          Field Research
        </Divider>
        <Table basic="very" celled inverted>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Research Task</Table.HeaderCell>
              <Table.HeaderCell>Reward</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>{rows}</Table.Body>
        </Table>
      </React.Fragment>
    );
  }
}

MetaFieldResearch.propTypes = {
  fieldResearch: PropTypes.array.isRequired
};

export default MetaFieldResearch;
