import React from "react";
import PropTypes from "prop-types";
import { Divider, Grid, Image, Table } from "semantic-ui-react";

import styles from "./Event.module.css";
import Sprite from "../../Sprite";

export default class MetaCounters extends React.PureComponent {
  getColumnCount = arrayLength => {
    let columnCount = 1;

    if (arrayLength === 2) {
      columnCount = 2;
    } else {
      columnCount = 3;
    }

    return columnCount;
  };

  buildCounter = (counter, i) => {
    let columnCount = this.getColumnCount(counter.pokemon.length);

    return (
      <React.Fragment key={i}>
        <div className={styles["meta-counters-title"]}>
          <Image avatar src={counter.condition.image} />
          <span className={styles["meta-counters-type"]}>
            {counter.condition.text}
          </span>
          <Image avatar src={counter.condition.image} />
        </div>
        <Grid stackable columns={columnCount}>
          {this.buildPokemon(counter.pokemon)}
        </Grid>
      </React.Fragment>
    );
  };

  buildPokemon = pokemon => {
    let renderedPokes = [];
    let i = 0;

    pokemon.forEach(function(poke) {
      renderedPokes.push(
        <Grid.Column key={i}>
          <Sprite showShiny={true} src={poke.image} />
          <div className={styles["meta-counters-poke-moves"]}>
            <Table basic="very" celled inverted>
              <Table.Body>
                <Table.Row textAlign="center">
                  <Table.Cell>
                    <Image avatar src={poke.fastAttack.image} />{" "}
                    {poke.fastAttack.name}
                  </Table.Cell>
                </Table.Row>
                <Table.Row textAlign="center">
                  <Table.Cell>
                    <Image avatar src={poke.chargedAttack.image} />
                    {poke.chargedAttack.name}
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table>
          </div>
        </Grid.Column>
      );
      i++;
    });

    return renderedPokes;
  };

  render() {
    const { counters } = this.props;
    let conditions = [];
    let oThis = this;
    let i = 0;

    counters.forEach(function(counter) {
      conditions.push(oThis.buildCounter(counter, i));
      i++;
    });

    return (
      <React.Fragment>
        <Divider
          className={`${styles["event-center"]} ${styles["event-margin-top"]}`}
          horizontal
          inverted
        >
          Counters
        </Divider>

        {conditions}
      </React.Fragment>
    );
  }
}

MetaCounters.propTypes = {
  counters: PropTypes.array
};
