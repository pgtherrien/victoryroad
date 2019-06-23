import React from "react";
import PropTypes from "prop-types";
import { Divider, Icon, Segment } from "semantic-ui-react";

import styles from "./Timeline.module.css";

class Content extends React.PureComponent {
  render() {
    const { link, summary } = this.props;

    return (
      <Segment className={styles["content"]} inverted>
        <div className={styles["content-link"]}>
          <a href={link} target="_blank" rel="noopener noreferrer">
            Pokémon Go Live Article <Icon name="external alternate" />
          </a>
        </div>
        {summary ? (
          <React.Fragment>
            <Divider horizontal inverted>
              Summary
            </Divider>
            {summary}
          </React.Fragment>
        ) : (
          <React.Fragment />
        )}
      </Segment>
    );
  }
}

Content.propTypes = {
  link: PropTypes.string,
  summary: PropTypes.string
};

export default Content;
