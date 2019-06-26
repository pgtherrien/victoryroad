import React from "react";
import PropTypes from "prop-types";
import { Divider, Image, Responsive, Table } from "semantic-ui-react";

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
          </Table.Cell>
          <Table.Cell
            className={
              window.innerWidth > Responsive.onlyTablet.minWidth
                ? styles["event-table-text"]
                : ""
            }
            textAlign="center"
          >
            {bonus.text}
          </Table.Cell>
        </Table.Row>
      );
      i++;
    });

    return (
      <React.Fragment>
        <Divider className={styles["event-divider"]} horizontal inverted>
          Bonuses
        </Divider>
        <Table basic="very" celled inverted size="large" stackable>
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
