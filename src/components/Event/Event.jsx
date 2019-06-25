import React from "react";
import PropTypes from "prop-types";
import { Button, Divider, Icon, Image, Segment } from "semantic-ui-react";

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
        {summary ? (
          <React.Fragment>
            <Divider className={styles["event-divider"]} horizontal inverted>
              Summary
            </Divider>
            <span className={styles["event-summary"]}>{summary}</span>
          </React.Fragment>
        ) : (
          <React.Fragment />
        )}
        {newShinies ? (
          <MetaShiny newShinies={newShinies} />
        ) : (
          <React.Fragment />
        )}
        {bonuses ? (
          <MetaBonuses bonuses={JSON.parse(bonuses)} />
        ) : (
          <React.Fragment />
        )}
        {features ? (
          <MetaFeatures features={JSON.parse(features)} />
        ) : (
          <React.Fragment />
        )}
        {challenges ? (
          <MetaChallenges challenges={JSON.parse(challenges)} />
        ) : (
          <React.Fragment />
        )}
        <div className={styles["event-actions-wrapper"]}>
          {new Date() < startDate && user.uid ? (
            submitted === "success" ? (
              <Button color="green" icon id="event-action-button" inverted>
                <Icon name="calendar check outline" /> Added the Event!
              </Button>
            ) : (
              <Button
                color="teal"
                icon
                id="event-action-button"
                onClick={this.addToCalendar}
              >
                <Icon name="calendar plus" /> Add to Google Calendar
              </Button>
            )
          ) : (
            <React.Fragment />
          )}
          <Button
            className={styles["event-link"]}
            color="blue"
            id="event-action-button"
            onClick={() => window.open(link)}
          >
            <Image
              avatar
              className={styles["event-action-button-poke"]}
              src="images/misc/pokeball_white.png"
            />
            Pokémon Go Live Post
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
