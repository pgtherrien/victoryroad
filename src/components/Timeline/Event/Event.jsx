import React from "react";
import PropTypes from "prop-types";
import {
  Button,
  Divider,
  Grid,
  Icon,
  Image,
  Responsive,
  Segment,
  Statistic
} from "semantic-ui-react";

import styles from "./Event.module.css";
import MetaBonuses from "./MetaBonuses";
import MetaChallenges from "./MetaChallenges";
import MetaCounters from "./MetaCounters";
import MetaFeatures from "./MetaFeatures";
import MetaFieldResearch from "./MetaFieldResearch";
import MetaShiny from "./MetaShinies";
import { SearchStringModal } from "../../Modals";

class Event extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      showSearchStringModal: false,
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
      counters,
      features,
      fieldResearch,
      ivSearchStrings,
      link,
      newShinies,
      perfectIV,
      startDate,
      summary
    } = this.props.event;
    const { showSearchStringModal, submitted } = this.state;
    const { user } = this.props;

    return (
      <Segment
        className={
          window.innerWidth > Responsive.onlyComputer.minWidth
            ? styles["event"]
            : styles["event-mobile"]
        }
        inverted
      >
        {summary && (
          <React.Fragment>
            <Divider
              className={`${styles["event-center"]} ${
                styles["event-margin-top"]
              }`}
              horizontal
              inverted
            >
              Summary
            </Divider>
            <div className={styles["event-center"]}>
              <span className={styles["event-summary"]}>{summary}</span>
            </div>
          </React.Fragment>
        )}
        {perfectIV && (
          <React.Fragment>
            <Divider
              className={`${styles["event-center"]} ${
                styles["event-margin-top"]
              }`}
              horizontal
              inverted
            >
              Perfect CP's
            </Divider>
            <Grid>
              <Grid.Column textAlign="center" width="8">
                <Statistic inverted>
                  <Statistic.Label>Level 20</Statistic.Label>
                  <Statistic.Value>{perfectIV[0]}</Statistic.Value>
                </Statistic>
              </Grid.Column>
              <Grid.Column textAlign="center" width="8">
                <Statistic inverted>
                  <Statistic.Label>Level 25</Statistic.Label>
                  <Statistic.Value>{perfectIV[1]}</Statistic.Value>
                </Statistic>
              </Grid.Column>
            </Grid>
          </React.Fragment>
        )}
        {features && <MetaFeatures features={features} />}
        {newShinies && newShinies.length > 0 && (
          <MetaShiny newShinies={newShinies} />
        )}
        {bonuses && <MetaBonuses bonuses={bonuses} />}
        {fieldResearch && fieldResearch.length > 0 && (
          <MetaFieldResearch fieldResearch={fieldResearch} />
        )}
        {counters && <MetaCounters counters={counters} />}
        {challenges && <MetaChallenges challenges={challenges} />}
        <div className={styles["event-action-wrapper"]}>
          {new Date() < startDate &&
            user.uid &&
            (submitted === "success" ? (
              <Button
                className={`${styles["event-action-button-right"]} ${
                  styles["event-action-button"]
                }`}
                color="teal"
                icon
                inverted
              >
                <Icon name="calendar check outline" />{" "}
                <span
                  className={
                    window.innerWidth < Responsive.onlyComputer.minWidth
                      ? `${styles["event-hide"]}  ${
                          styles["event-action-text"]
                        }`
                      : styles["event-action-text"]
                  }
                >
                  Added the Event!
                </span>
              </Button>
            ) : (
              <Button
                className={`${styles["event-action-button-right"]} ${
                  styles["event-action-button"]
                }`}
                color="teal"
                icon
                onClick={this.addToCalendar}
              >
                <Icon name="calendar plus" title="Add to Google Calendar" />
                <span
                  className={
                    window.innerWidth < Responsive.onlyComputer.minWidth
                      ? `${styles["event-hide"]}  ${
                          styles["event-action-text"]
                        }`
                      : styles["event-action-text"]
                  }
                >
                  Add to Google Calendar
                </span>
              </Button>
            ))}
          <Button
            className={`${styles["event-action-button-right"]} ${
              styles["event-action-button"]
            }`}
            color="blue"
            onClick={() => window.open(link)}
          >
            <Image
              avatar
              className={styles["event-action-button-poke"]}
              src="images/misc/pokeball_white.png"
            />
            <span
              className={
                window.innerWidth < Responsive.onlyComputer.minWidth
                  ? `${styles["event-hide"]}  ${styles["event-action-text"]}`
                  : styles["event-action-text"]
              }
            >
              Pokémon Go Live Post
            </span>
          </Button>
          {ivSearchStrings && (
            <Button
              className={styles["event-action-button"]}
              color="purple"
              icon
              onClick={() => this.setState({ showSearchStringModal: true })}
            >
              <Icon name="copy" inverted />
              <span
                className={
                  window.innerWidth < Responsive.onlyComputer.minWidth
                    ? `${styles["event-hide"]}  ${styles["event-action-text"]}`
                    : styles["event-action-text"]
                }
              >
                IV Search Strings
              </span>
            </Button>
          )}
        </div>
        {showSearchStringModal && (
          <SearchStringModal
            ivSearchStrings={ivSearchStrings}
            onClose={() => this.setState({ showSearchStringModal: false })}
          />
        )}
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
