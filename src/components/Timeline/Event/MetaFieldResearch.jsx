import React from "react";
import PropTypes from "prop-types";
import { Divider, Image, Table } from "semantic-ui-react";

import styles from "./Event.module.css";

class MetaFieldResearch extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      toggled: []
    };
  }

  toggleSprite = reward => {
    if (reward.shiny) {
      let toggled = Object.assign([], this.state.toggled);
      let index = toggled.indexOf(reward.icon);

      if (index > -1) {
        toggled.splice(index, 1);
      } else {
        toggled.push(reward.icon);
      }
      this.setState({
        toggled
      });
    }
  };

  render() {
    const { fieldResearch } = this.props;
    const { toggled } = this.state;
    let i = 0;
    let oThis = this;
    let rewards;
    let rows = [];
    let src;

    fieldResearch.forEach(function(obj) {
      rewards = [];

      obj.rewards.forEach(function(reward) {
        src = reward.icon;
        if (toggled.includes(reward.icon)) {
          src = reward.icon.split(".png")[0];
          src += "_shiny.png";
        }

        rewards.push(
          <div className={styles["field-reward"]} key={i}>
            {reward.shiny && (
              <Image
                className={styles["field-image-shiny"]}
                src="images/misc/shiny_white.png"
              />
            )}
            <Image
              className={styles["field-image"]}
              id="content-sprite"
              onClick={() => oThis.toggleSprite(reward)}
              src={src}
            />
          </div>
        );
        i++;
      });

      rows.push(
        <Table.Row key={i}>
          <Table.Cell textAlign="center">{obj.task}</Table.Cell>
          <Table.Cell textAlign="center">{rewards}</Table.Cell>
        </Table.Row>
      );
      i++;
    });

    return (
      <React.Fragment>
        <Divider className={styles["event-divider"]} horizontal inverted>
          Field Research
        </Divider>
        <Table basic="very" celled inverted>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell textAlign="center">
                Research Task
              </Table.HeaderCell>
              <Table.HeaderCell textAlign="center">Reward</Table.HeaderCell>
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

// [
//   {
//     rewards: [
//       { icon: "images/pokemon_icons/pokemon_icon_129_00.png", shiny: true },
//       { icon: "images/pokemon_icons/pokemon_icon_130_00.png", shiny: true }
//     ],
//     task: "Catch 10 Pokémon"
//   }
// ];
