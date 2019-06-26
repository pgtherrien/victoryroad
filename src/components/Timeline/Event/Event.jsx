import React from "react";
import PropTypes from "prop-types";
import {
  Button,
  Divider,
  Icon,
  Image,
  Responsive,
  Segment
} from "semantic-ui-react";

import styles from "./Event.module.css";
import MetaBonuses from "./MetaBonuses";
import MetaChallenges from "./MetaChallenges";
import MetaFeatures from "./MetaFeatures";
import MetaShiny from "./MetaShinies";

class Event extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      submitted: ""
    };
  }

  // Adds the event to the user's Google Calendar
  addToCalendar = () => {
    const { endDate, startDate, summary, title } = this.props.event;
    this.props
      .insertEvent(title, summary, startDate, endDate)
      .then(response => {
        if (response.status === 200) {
          this.setState({ submitted: "success" });
        }
      });
  };

  render() {
    const {
      bonuses,
      challenges,
      features,
      link,
      newShinies,
      startDate,
      summary
    } = this.props.event;
    const { submitted } = this.state;
    const { user } = this.props;

    return (
      <Segment className={styles["event"]} inverted>
        {summary && (
          <React.Fragment>
            <Divider className={styles["event-divider"]} horizontal inverted>
              Summary
            </Divider>
            <span className={styles["event-summary"]}>{summary}</span>
          </React.Fragment>
        )}
        {newShinies && <MetaShiny newShinies={newShinies} />}
        {bonuses && <MetaBonuses bonuses={JSON.parse(bonuses)} />}
        {features && <MetaFeatures features={JSON.parse(features)} />}
        {challenges && <MetaChallenges challenges={JSON.parse(challenges)} />}
        <div className={styles["event-actions-wrapper"]}>
          {new Date() < startDate &&
            user.uid &&
            (submitted === "success" ? (
              <Button
                className={styles["event-action-button"]}
                color="green"
                icon
                id="event-action-button"
                inverted
              >
                <Icon name="calendar check outline" /> Added the Event!
              </Button>
            ) : (
              <Button
                className={styles["event-action-button"]}
                color="teal"
                icon
                id="event-action-button"
                onClick={this.addToCalendar}
              >
                <Icon name="calendar plus" title="Add to Google Calendar" />
                <span
                  className={
                    window.innerWidth < Responsive.onlyComputer.minWidth &&
                    styles["event-hide"]
                  }
                >
                  {" "}
                  Add to Google Calendar
                </span>
              </Button>
            ))}
          <Button
            className={`${styles["event-link"]} ${
              styles["event-action-button"]
            }`}
            color="blue"
            id="event-action-button"
            onClick={() => window.open(link)}
          >
            <Image
              avatar
              className={styles["event-action-button-poke"]}
              src="images/misc/pokeball_white.png"
              title="Pokémon Go Live Post"
            />
            <span
              className={
                window.innerWidth < Responsive.onlyComputer.minWidth &&
                styles["event-hide"]
              }
            >
              {" "}
              Pokémon Go Live Post
            </span>
          </Button>
        </div>
      </Segment>
    );
  }
}

Event.propTypes = {
  admins: PropTypes.array.isRequired,
  event: PropTypes.object.isRequired,
  insertEvent: PropTypes.func.isRequired,
  user: PropTypes.object
};

export default Event;
