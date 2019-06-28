import React from "react";
import PropTypes from "prop-types";
import { Divider, Image, Table } from "semantic-ui-react";

import styles from "./Event.module.css";

class MetaBonuses extends React.PureComponent {
  render() {
    const { bonuses } = this.props;
    let rows = [];
    let i = 0;

    bonuses.forEach(function(bonus) {
      rows.push(
        <Table.Row key={i}>
          <Table.Cell textAlign="center">
            <Image avatar src={bonus.image} />
            {bonus.text}
          </Table.Cell>
        </Table.Row>
      );
      i++;
    });

    return (
      <React.Fragment>
        <Divider
          className={`${styles["event-center"]}
          ${styles["meta-bonuses-divider"]}`}
          horizontal
          inverted
        >
          Bonuses
        </Divider>
        <Table
          basic="very"
          celled
          className={styles["event-center"]}
          collapsing
          inverted
          size="large"
          stackable
        >
          <Table.Body>{rows}</Table.Body>
        </Table>
      </React.Fragment>
    );
  }
}

MetaBonuses.propTypes = {
  bonuses: PropTypes.array.isRequired
};

export default MetaBonuses;
