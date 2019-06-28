import React from "react";
import PropTypes from "prop-types";
import { Divider, Image, Responsive, Table } from "semantic-ui-react";

import styles from "./Event.module.css";

class MetaChallenges extends React.PureComponent {
  render() {
    const { challenges } = this.props;
    let rows = [];
    let i = 0;

    challenges.forEach(function(challenge) {
      rows.push(
        <Table.Row key={i}>
          <Table.Cell
            className={
              window.innerWidth > Responsive.onlyTablet.minWidth
                ? styles["event-table-text"]
                : ""
            }
          >
            <span className={styles["event-font"]}>{challenge.challenge}</span>
          </Table.Cell>
          <Table.Cell className={styles["event-table-text-reward"]}>
            <Image avatar src={challenge.image} />
            <span className={styles["event-font"]}>{challenge.reward}</span>
          </Table.Cell>
        </Table.Row>
      );
      i++;
    });

    return (
      <React.Fragment>
        <Divider
          className={`${styles["event-center"]} ${styles["event-margin-top"]}`}
          horizontal
          inverted
        >
          Challenges
        </Divider>
        <Table basic="very" celled inverted>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Challenge</Table.HeaderCell>
              <Table.HeaderCell className={styles["event-table-text-reward"]}>
                Reward
              </Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>{rows}</Table.Body>
        </Table>
      </React.Fragment>
    );
  }
}

MetaChallenges.propTypes = {
  challenges: PropTypes.array.isRequired
};

export default MetaChallenges;
