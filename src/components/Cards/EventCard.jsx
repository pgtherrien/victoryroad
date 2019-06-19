import React from "react";
import PropTypes from "prop-types";
import Countdown from "react-countdown-now";
import {
  Divider,
  Grid,
  Header,
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

  render() {
    const {
      backgroundImage,
      endDate,
      eventImage,
      startDate,
      title
    } = this.props;
    const { expanded, mouseInside } = this.state;

    return (
      <Grid.Row
        className={styles["event-card-row"]}
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
                <Header.Subheader className={styles["event-card-timer-mobile"]}>
                  {startDate.toDateString()} - {endDate.toDateString()}
                </Header.Subheader>
                {new Date() > startDate ? (
                  <Responsive
                    as={Header.Subheader}
                    className={styles["event-card-timer-mobile"]}
                    inverted
                    maxWidth={768}
                    size="huge"
                    textAlign="center"
                  >
                    Event Ends <Countdown date={endDate} />
                  </Responsive>
                ) : (
                  <Responsive
                    as={Header.Subheader}
                    className={styles["event-card-timer-mobile"]}
                    inverted
                    maxWidth={768}
                    size="huge"
                    textAlign="center"
                  >
                    Event Starts <Countdown date={startDate} />
                  </Responsive>
                )}
              </Header.Content>
            </Header>
          </Segment>
        </Grid.Column>
        <Grid.Column width={4}>
          {new Date() > startDate ? (
            <Responsive
              as={Header}
              className={styles["event-card-timer"]}
              inverted
              minWidth={768}
              size="huge"
              textAlign="center"
            >
              Event Ends <Countdown date={endDate} />
            </Responsive>
          ) : (
            <Responsive
              as={Header}
              className={styles["event-card-timer"]}
              inverted
              minWidth={768}
              size="huge"
              textAlign="center"
            >
              Event Starts <Countdown date={startDate} />
            </Responsive>
          )}
        </Grid.Column>
        {mouseInside ? (
          <Responsive
            as={Divider}
            className={styles["event-card-view"]}
            horizontal
            inverted
            minWidth={768}
          >
            View More
          </Responsive>
        ) : (
          <React.Fragment />
        )}
      </Grid.Row>
    );
  }
}

EventCard.propTypes = {
  backgroundImage: PropTypes.string,
  endDate: PropTypes.object.isRequired,
  eventImage: PropTypes.string.isRequired,
  link: PropTypes.string,
  startDate: PropTypes.object.isRequired,
  summary: PropTypes.string,
  title: PropTypes.string.isRequired
};

export default EventCard;
