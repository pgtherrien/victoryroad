import React from "react";
import PropTypes from "prop-types";
import clsx from "clsx";

import styles from "./Sprite.module.css";

export default class Sprite extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      src: props.src
    };
  }

  componentDidUpdate = prevProps => {
    if (prevProps.src !== this.props.src) {
      this.setState({
        src: this.props.src
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
    const { showShiny, size } = this.props;
    const { src } = this.state;

    return (
      <img
        alt={src}
        className={clsx(styles["sprite"], {
          [styles.small]: size === "small",
          [styles.full]: size === "full"
        })}
        onMouseEnter={this.toggleSprite}
        onMouseLeave={this.toggleSprite}
        onClick={showShiny ? this.toggleSprite : () => null}
        src={src}
      />
    );
  }
}

Sprite.propTypes = {
  showShiny: PropTypes.bool,
  src: PropTypes.string.isRequired
};
