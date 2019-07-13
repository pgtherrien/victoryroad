import React from "react";
import PropTypes from "prop-types";
import { Grid, Header, Icon, Image, Modal, Statistic } from "semantic-ui-react";

import gamemaster from "../../../data/gamemaster";
import pokedex from "../../../data/pokedex";
import styles from "./PokemonModal.module.css";
import Sprite from "../../Sprite";

export default class PokemonModal extends React.PureComponent {
  constructor(props) {
    super(props);

    let dexData = pokedex[props.number];
    let gmData = this.getGMData(dexData);

    this.state = {
      dexData: dexData,
      gmData: gmData,
      number: props.number,
      shinyImg: props.shinyImg
    };
  }

  getGMData = dexData => {
    let array = gamemaster[dexData.number];
    let retval;

    if (array.length === 1) {
      retval = array[0];
    } else {
      array.forEach(function(obj) {
        if (obj.templateId === dexData.templateId) {
          retval = obj;
        }
      });
    }

    return retval;
  };

  renderDataGrid = () => {
    const { dexData, gmData } = this.state;
    let hasCaptureRate =
      gmData.pokemonSettings.encounter.baseCaptureRate !== undefined;

    return (
      <Grid
        className={styles["pokemon-data-grid"]}
        columns={hasCaptureRate ? 3 : 2}
        divided
        inverted
      >
        <Grid.Column textAlign="center">
          <Statistic inverted size="tiny">
            <Statistic.Value>
              <Icon
                name={
                  dexData.genders.length === 2
                    ? "venus mars"
                    : dexData.genders.indexOf("male") > -1
                    ? "mars"
                    : "venus"
                }
              />
            </Statistic.Value>
            <Statistic.Label>Gender</Statistic.Label>
          </Statistic>
        </Grid.Column>
        {hasCaptureRate && (
          <Grid.Column textAlign="center">
            <Statistic inverted size="tiny">
              <Statistic.Value>
                {gmData.pokemonSettings.encounter.baseCaptureRate * 100}%
              </Statistic.Value>
              <Statistic.Label>Base Capture Rate</Statistic.Label>
            </Statistic>
          </Grid.Column>
        )}
        <Grid.Column textAlign="center">
          <Statistic inverted size="tiny">
            <Statistic.Value>
              {gmData.pokemonSettings.kmBuddyDistance}km
            </Statistic.Value>
            <Statistic.Label>Buddy Distance</Statistic.Label>
          </Statistic>
        </Grid.Column>
      </Grid>
    );
  };

  renderTypes = dexData => {
    dexData.types.sort();
    let retval = [];
    let i = 0;

    dexData.types.forEach(function(type) {
      retval.push(
        <Image
          avatar
          className={styles["pokemon-type"]}
          key={i}
          src={`images/types/${type}.png`}
        />
      );
      i++;
    });

    return retval;
  };

  render() {
    const { dexData, gmData, shinyImg } = this.state;
    const { number, onClose } = this.props;
    let image = shinyImg
      ? `images/pokemon_icons/pokemon_icon_${number}_shiny.png`
      : `images/pokemon_icons/pokemon_icon_${number}.png`;
    let types = this.renderTypes(dexData);
    console.log(gmData);
    return (
      <Modal basic onClose={onClose} open={true} size="small">
        <div>
          <Sprite showShiny={true} src={image} />
        </div>
        <div className={styles["pokemon-content"]}>
          <Icon
            className={styles["pokemon-close"]}
            name="window close"
            onClick={onClose}
          />
          <Header as="h2" className={styles["pokemon-title"]} inverted>
            <span className={styles["pokemon-title-number"]}>
              #{dexData.number}
            </span>
            <span className={styles["pokemon-title-name"]}>{dexData.name}</span>
            {types}
          </Header>
          {this.renderDataGrid()}
        </div>
      </Modal>
    );
  }
}

PokemonModal.propTypes = {
  number: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  shinyImg: PropTypes.bool.isRequired
};
