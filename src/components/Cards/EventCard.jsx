import React from "react";
import PropTypes from "prop-types";
import Countdown from "react-countdown-now";
import {
  Divider,
  Grid,
  Header,
  Icon,
  Image,
  Label,
  Responsive,
  Segment
} from "semantic-ui-react";

import styles from "./Cards.module.css";

class EventCard extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      expanded: false,
      mouseInside: false
    };
  }

  buildLabel = (startDate, endDate) => {
    if (
      new Date() < startDate &&
      new Date(new Date().getTime() + 60 * 60 * 24 * 1000) > startDate
    ) {
      return this.renderLabel("teal", "Starting Soon");
    } else if (new Date() > startDate) {
      return this.renderLabel("blue", "Active");
    } else if (
      new Date() < endDate &&
      new Date(new Date().getTime() + 60 * 60 * 24 * 1000) > endDate
    ) {
      return this.renderLabel("orange", "Ending Soon");
    }
  };

  renderLabel = (color, text) => {
    return (
      <Label
        className={styles["event-card-label"]}
        color={color}
        ribbon
        size="huge"
      >
        {text}
      </Label>
    );
  };

  renderContents = () => {
    const { link, summary } = this.props;

    return (
      <Segment className={styles["event-card-content"]} inverted>
        <div className={styles["event-card-link"]}>
          <a href={link} target="_blank" rel="noopener noreferrer">
            Pokémon Go Live Article
            <Icon name="external alternate" />
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
  };

  render() {
    const { endDate, eventImage, startDate, title } = this.props;
    const { expanded, mouseInside } = this.state;

    return (
      <Grid.Row
        className={styles["event-card-row"]}
        onClick={() => this.setState({ expanded: !expanded })}
        onMouseEnter={() => this.setState({ mouseInside: true })}
        onMouseLeave={() => this.setState({ mouseInside: false })}
      >
        <Grid.Column width={1}>
          {this.buildLabel(startDate, endDate)}
        </Grid.Column>
        <Grid.Column width={3}>
          <Image
            className={styles["event-card-event-image"]}
            src={eventImage}
          />
        </Grid.Column>
        <Grid.Column width={8}>
          <Segment className={styles["event-card-title"]} inverted>
            <Header as="h1" textAlign="center">
              <Header.Content>
                {title}
                <Responsive
                  as={Header.Subheader}
                  className={styles["event-card-range"]}
                  minWidth={768}
                >
                  {startDate.toDateString()} - {endDate.toDateString()}
                </Responsive>
                {new Date() > startDate ? (
                  <Responsive
                    as={Header.Subheader}
                    className={styles["event-card-range"]}
                    maxWidth={768}
                  >
                    Event Ends <Countdown date={endDate} />
                  </Responsive>
                ) : (
                  <Responsive
                    as={Header.Subheader}
                    className={styles["event-card-range"]}
                    maxWidth={768}
                  >
                    Event Starts <Countdown date={startDate} />
                  </Responsive>
                )}
              </Header.Content>
            </Header>
          </Segment>
        </Grid.Column>
        <Responsive as={Grid.Column} width={3} minWidth={768}>
          {new Date() > startDate ? (
            <Header
              className={styles["event-card-timer"]}
              inverted
              size="huge"
              textAlign="center"
            >
              Event Ends <Countdown date={endDate} />
            </Header>
          ) : (
            <Header
              className={styles["event-card-timer"]}
              inverted
              size="huge"
              textAlign="center"
            >
              Event Starts <Countdown date={startDate} />
            </Header>
          )}
        </Responsive>{" "}
        <Grid.Column width={1} />
        {mouseInside && !expanded ? (
          <React.Fragment>
            <Responsive
              as={Divider}
              className={styles["event-card-view-more"]}
              horizontal
              inverted
              minWidth={768}
            >
              View More
            </Responsive>
          </React.Fragment>
        ) : (
          <React.Fragment />
        )}
        {expanded ? (
          <React.Fragment>{this.renderContents()}</React.Fragment>
        ) : (
          <React.Fragment />
        )}
      </Grid.Row>
    );
  }
}

EventCard.propTypes = {
  backgroundImage: PropTypes.string,
  bonuses: PropTypes.object,
  endDate: PropTypes.object.isRequired,
  eventImage: PropTypes.string.isRequired,
  link: PropTypes.string,
  startDate: PropTypes.object.isRequired,
  summary: PropTypes.string,
  title: PropTypes.string.isRequired
};

export default EventCard;
