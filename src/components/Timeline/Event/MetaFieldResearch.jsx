import React from "react";
import PropTypes from "prop-types";
import { Divider, Image, Table } from "semantic-ui-react";

import styles from "./Event.module.css";
import Sprite from "../../Sprite";

class MetaFieldResearch extends React.PureComponent {
  render() {
    const { fieldResearch } = this.props;
    let rows = [];
    let rewards;
    let i = 0;
    let src;

    fieldResearch.forEach(function(obj) {
      rewards = [];

      obj.rewards.forEach(function(reward) {
        rewards.push(
          <div className={styles["meta-field-reward"]} key={i}>
            {reward.shiny && (
              <Image
                className={styles["meta-field-image-shiny"]}
                src="images/misc/shiny_white.png"
              />
            )}
            <Sprite showShiny={reward.shiny} src={src} />
          </div>
        );
        i++;
      });

      rows.push(
        <Table.Row key={i}>
          <Table.Cell textAlign="center" width="12">
            <span className={styles["event-font"]}>{obj.task}</span>
          </Table.Cell>
          <Table.Cell textAlign="center" width="4">
            {rewards}
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
          Field Research
        </Divider>
        <Table basic="very" celled inverted>
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

// [
//   {
//     rewards: [
//       { icon: "images/pokemon_icons/pokemon_icon_129_00.png", shiny: true },
//       { icon: "images/pokemon_icons/pokemon_icon_130_00.png", shiny: true }
//     ],
//     task: "Catch 10 Pokémon"
//   }
// ];
