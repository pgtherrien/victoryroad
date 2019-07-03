import React from "react";
import { db } from "../../firebase";
import { Dimmer, Grid, Loader } from "semantic-ui-react";

import pokedex from "../../data/pokedex";
import styles from "./Checklist.module.css";
import Entry from "./Entry";

export default class Checklist extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      listType: "normal",
      showEventAlts: false
    };
  }

  buildCards = () => {
    const { listType, showEventAlts } = this.state;
    const cards = [];
    let i = 0;
    console.log(pokedex);
    Object.keys(pokedex).forEach(function(entryNumber) {
      if (
        ((listType === "shiny" && pokedex[entryNumber].shiny) ||
          (listType === "lucky" || listType === "normal")) &&
        ((!showEventAlts && entryNumber.length === 6) || showEventAlts)
      ) {
        cards.push(
          <Entry
            entry={pokedex[entryNumber]}
            entryNumber={entryNumber}
            key={i}
            listType={listType}
          />
        );
      }
      i++;
    });

    return cards;
  };

  render() {
    let columnCount = (window.innerWidth - 100) / 250;
    let cards = this.buildCards();
    if (pokedex.length >= 0) {
      return (
        <Dimmer active>
          <Loader>Loading Checklists...</Loader>
        </Dimmer>
      );
    } else {
      return (
        <div className={styles["checklist-container"]}>
          <Grid columns={Math.round(columnCount)} stackable>
            {cards}
          </Grid>
        </div>
      );
    }
  }
}
