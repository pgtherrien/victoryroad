import React from "react";
import PropTypes from "prop-types";
import { Image, Responsive } from "semantic-ui-react";

import styles from "./Sprite.module.css";

export default class Sprite extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      src: props.src
    };
  }

  componentDidUpdate = prevProps => {
    let currentNumber = this.props.src.split("_")[3];
    let previousNumber = prevProps.src.split("_")[3];
    const { src } = this.props;

    if (previousNumber !== currentNumber) {
      this.setState({
        src: src
      });
    }
  };

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
    const { showShiny } = this.props;
    const { src } = this.state;

    return (
      <React.Fragment>
        <Image
          className={styles["sprite"]}
          onMouseEnter={
            window.innerWidth > Responsive.onlyComputer.minWidth && showShiny
              ? this.toggleSprite
              : () => null
          }
          onMouseLeave={
            window.innerWidth > Responsive.onlyComputer.minWidth && showShiny
              ? this.toggleSprite
              : () => null
          }
          onClick={showShiny ? this.toggleSprite : () => null}
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
