import React from "react";
import PropTypes from "prop-types";
import { Image } from "semantic-ui-react";

import styles from "./Sprite.module.css";

export default class Sprite extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      src: props.src
    };
  }

  toggleSprite = () => {
    let { src } = this.state;
    let strings;

    if (src.indexOf("shiny") > 0) {
      strings = src.split("_shiny.png");
      src = strings[0] + ".png";
    } else {
      strings = src.split(".png");
      src = strings[0] + "_shiny.png";
    }

    this.setState({ src: src });
  };

  render() {
    const { src } = this.state;

    return (
      <React.Fragment>
        {src.indexOf("_shiny.png") > -1 && (
          <Image
            className={styles["sprite-shiny"]}
            src="images/misc/shiny_white.png"
          />
        )}
        <Image
          id="sprite-image"
          className={styles["sprite"]}
          onMouseEnter={this.toggleSprite}
          onMouseLeave={this.toggleSprite}
          onClick={this.toggleSprite}
          src={src}
        />
      </React.Fragment>
    );
  }
}

Sprite.propTypes = {
  showShiny: PropTypes.bool,
  src: PropTypes.string.isRequired
};
