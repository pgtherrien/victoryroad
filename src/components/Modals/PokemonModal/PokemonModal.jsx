import React from "react";
import PropTypes from "prop-types";
import {
  Divider,
  Grid,
  Header,
  Icon,
  Label,
  Modal,
  Responsive,
  Statistic,
  Table
} from "semantic-ui-react";

import gamemaster from "../../../data/gamemaster";
import pokedex from "../../../data/pokedex";
import styles from "./PokemonModal.module.css";
import Sprite from "../../Sprite";
import utils from "../../utils";

const TYPE_COLORS = {
  normal: "#A8A77A",
  fire: "#EE8130",
  water: "#6390F0",
  electric: "#F7D02C",
  grass: "#7AC74C",
  ice: "#96D9D6",
  fighting: "#C22E28",
  poison: "#A33EA1",
  ground: "#E2BF65",
  flying: "#A98FF3",
  psychic: "#F95587",
  bug: "#A6B91A",
  rock: "#B6A136",
  ghost: "#735797",
  dragon: "#6F35FC",
  dark: "#705746",
  steel: "#B7B7CE",
  fairy: "#D685AD"
};

export default class PokemonModal extends React.PureComponent {
  constructor(props) {
    super(props);

    window.addEventListener("keyup", this.keyHandling);
    let dexData = pokedex[props.number];
    let gmData = this.getGMData(dexData);

    this.state = {
      dexData: dexData,
      gmData: gmData,
      number: props.number,
      shinyImg: props.shinyImg
    };
  }

  componentWillUnmount() {
    window.removeEventListener("keyup", this.keyHandling);
  }

  calculateMaxCP = stats => {
    let attack = stats.baseAttack + 15;
    let defense = Math.pow(stats.baseDefense + 15, 0.5);
    let stamina = Math.pow(stats.baseStamina + 15, 0.5);

    return Math.floor(
      (attack * defense * stamina * Math.pow(0.79030001, 2)) / 10
    );
  };

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

  handlePokemonChange = direction => {
    const { filteredDex } = this.props;
    const { number } = this.state;
    let newIndex;
    let i = 0;

    Object.keys(filteredDex).forEach(function(dexNumber) {
      if (dexNumber === number) {
        newIndex = direction === "next" ? i + 1 : i - 1;
      }
      i++;
    });

    if (newIndex > -1 && Object.keys(filteredDex).length >= newIndex + 1) {
      let newNumber = Object.keys(filteredDex)[newIndex];
      this.setState({
        dexData: pokedex[newNumber],
        gmData: this.getGMData(pokedex[newNumber]),
        number: newNumber
      });
    }
  };

  keyHandling = e => {
    if (e.keyCode === 37) {
      this.handlePokemonChange("previous");
    } else {
      this.handlePokemonChange("next");
    }
  };

  renderAttacks = () => {
    const { gmData } = this.state;
    let chargedAttacks = [];
    let fastAttacks = [];
    let oThis = this;
    let attackData;
    let attack;
    let type;
    let i = 0;

    gmData.pokemonSettings.quickMoves.sort();
    gmData.pokemonSettings.quickMoves.forEach(function(move) {
      attack = move.split("_FAST")[0];
      attack = attack.split("_").join(" ");
      attackData = gamemaster[move];
      type = attackData.moveSettings.pokemonType.split("POKEMON_TYPE_")[1];

      fastAttacks.push(
        <Table.Row className={styles["pokemon-table-row"]} key={i}>
          <Table.Cell>{utils.toTitleCase(attack)}</Table.Cell>
          <Table.Cell>{oThis.renderTypes([type.toLowerCase()])}</Table.Cell>
          <Table.Cell>{attackData.moveSettings.power}</Table.Cell>
        </Table.Row>
      );
      i++;
    });

    gmData.pokemonSettings.cinematicMoves.sort();
    gmData.pokemonSettings.cinematicMoves.forEach(function(move) {
      attack = move.split("_").join(" ");
      attackData = gamemaster[move];
      type = attackData.moveSettings.pokemonType.split("POKEMON_TYPE_")[1];

      chargedAttacks.push(
        <Table.Row className={styles["pokemon-table-row"]} key={i}>
          <Table.Cell>{utils.toTitleCase(attack)}</Table.Cell>
          <Table.Cell>{oThis.renderTypes([type.toLowerCase()])}</Table.Cell>
          <Table.Cell>{attackData.moveSettings.power}</Table.Cell>
        </Table.Row>
      );
      i++;
    });

    return (
      <Grid columns={2} inverted padded stackable>
        <Grid.Column textAlign="center">
          <Table inverted textAlign="center" unstackable>
            <Table.Header>
              <Table.Row className={styles["pokemon-table-header"]}>
                <Table.HeaderCell colSpan="3">Fast</Table.HeaderCell>
              </Table.Row>
              <Table.Row className={styles["pokemon-table-header"]}>
                <Table.HeaderCell>Name</Table.HeaderCell>
                <Table.HeaderCell>Type</Table.HeaderCell>
                <Table.HeaderCell>Power</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>{fastAttacks}</Table.Body>
          </Table>
        </Grid.Column>
        <Grid.Column textAlign="center">
          <Table inverted textAlign="center" unstackable>
            <Table.Header>
              <Table.Row className={styles["pokemon-table-header"]}>
                <Table.HeaderCell colSpan="3">Charged</Table.HeaderCell>
              </Table.Row>
              <Table.Row className={styles["pokemon-table-header"]}>
                <Table.HeaderCell>Name</Table.HeaderCell>
                <Table.HeaderCell>Type</Table.HeaderCell>
                <Table.HeaderCell>Power</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>{chargedAttacks}</Table.Body>
          </Table>
        </Grid.Column>
      </Grid>
    );
  };

  renderMetadata = () => {
    const { dexData, gmData } = this.state;
    const { stats } = gmData.pokemonSettings;
    let maxCP = this.calculateMaxCP(stats);

    return (
      <Grid className={styles["pokemon-stats"]} columns={3} inverted>
        <Grid.Column textAlign="center">
          <Statistic inverted size="tiny">
            <Statistic.Value>
              {gmData.pokemonSettings.kmBuddyDistance}km
            </Statistic.Value>
            <Statistic.Label>Buddy Distance</Statistic.Label>
          </Statistic>
        </Grid.Column>
        <Grid.Column textAlign="center">
          <Statistic inverted size="tiny">
            <Statistic.Value>{maxCP}</Statistic.Value>
            <Statistic.Label>Max CP</Statistic.Label>
          </Statistic>
        </Grid.Column>
        <Grid.Column textAlign="center">
          <Statistic inverted size="tiny">
            <Statistic.Value>
              <Icon
                name={
                  dexData.genders.length === 2
                    ? "venus mars"
                    : dexData.genders.length === 0
                    ? "genderless"
                    : dexData.genders.indexOf("male") > -1
                    ? "mars"
                    : "venus"
                }
              />
            </Statistic.Value>
            <Statistic.Label>Genders</Statistic.Label>
          </Statistic>
        </Grid.Column>
        <Grid.Column textAlign="center">
          <Statistic inverted size="tiny">
            <Statistic.Value>
              <Icon className={styles["pokemon-stat"]} inverted name="heart" />
              {stats.baseStamina}
            </Statistic.Value>
            <Statistic.Label>Base HP</Statistic.Label>
          </Statistic>
        </Grid.Column>
        <Grid.Column textAlign="center">
          <Statistic inverted size="tiny">
            <Statistic.Value>
              <Icon
                className={styles["pokemon-stat"]}
                inverted
                name="hand rock"
              />
              {stats.baseAttack}
            </Statistic.Value>
            <Statistic.Label>Base Attack</Statistic.Label>
          </Statistic>
        </Grid.Column>
        <Grid.Column textAlign="center">
          <Statistic inverted size="tiny">
            <Statistic.Value>
              <Icon className={styles["pokemon-stat"]} inverted name="shield" />
              {stats.baseDefense}
            </Statistic.Value>
            <Statistic.Label>Base Defense</Statistic.Label>
          </Statistic>
        </Grid.Column>
      </Grid>
    );
  };

  renderTypes = types => {
    let retval = [];
    let i = 0;

    types.forEach(function(type) {
      retval.push(
        <Label
          key={i}
          style={{ background: TYPE_COLORS[type], color: "#ffffff" }}
        >
          {utils.toTitleCase(type)}
        </Label>
      );
      i++;
    });

    return retval;
  };

  render() {
    const { dexData, gmData, number, shinyImg } = this.state;
    const { onClose } = this.props;
    let image = shinyImg
      ? `images/pokemon_icons/pokemon_icon_${number}_shiny.png`
      : `images/pokemon_icons/pokemon_icon_${number}.png`;
    let types = this.renderTypes(dexData.types.sort());

    return (
      <Modal basic onClose={onClose} open={true} size="small">
        <div className={styles["pokemon-sprite"]}>
          <Icon
            className={
              window.innerWidth > Responsive.onlyMobile.maxWidth
                ? styles["pokemon-sprite-previous"]
                : ""
            }
            inverted
            name="angle left"
            size="huge"
            onClick={() => this.handlePokemonChange("previous")}
          />
          <Sprite showShiny={true} src={image} />
          <Icon
            className={
              window.innerWidth > Responsive.onlyMobile.maxWidth
                ? styles["pokemon-sprite-next"]
                : ""
            }
            inverted
            name="angle right"
            size="huge"
            onClick={() => this.handlePokemonChange("next")}
          />
        </div>
        <div className={styles["pokemon-content"]}>
          <Header as="h2" className={styles["pokemon-title"]} inverted>
            <span className={styles["pokemon-title-number"]}>
              #{dexData.number}
            </span>
            <span className={styles["pokemon-title-name"]}>{dexData.name}</span>
          </Header>
          <div className={styles["pokemon-centered"]}>{types}</div>
          {this.renderMetadata()}

          {gmData.pokemonSettings.quickMoves &&
            gmData.pokemonSettings.cinematicMoves && (
              <React.Fragment>
                <Divider
                  className={styles["pokemon-divider"]}
                  horizontal
                  inverted
                >
                  Attacks
                </Divider>
                {this.renderAttacks()}
              </React.Fragment>
            )}
        </div>
      </Modal>
    );
  }
}

PokemonModal.propTypes = {
  filteredDex: PropTypes.object.isRequired,
  number: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  shinyImg: PropTypes.bool.isRequired
};
